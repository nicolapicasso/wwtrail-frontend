'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2, Calendar, Mountain, TrendingUp, Users, Edit, Trash2, Eye, MapPin } from 'lucide-react';
import Link from 'next/link';
import ConfirmDialog from '@/components/ConfirmDialog';
import editionsService from '@/lib/api/v2/editions.service';
import competitionsService from '@/lib/api/v2/competitions.service';
import eventsService from '@/lib/api/v2/events.service';
import type { Edition } from '@/types/edition';
import type { Competition } from '@/types/competition';
import type { Event } from '@/types/event';
import { useAuth } from '@/hooks/useAuth';

export default function OrganizerEditionsPage() {
  const router = useRouter();
  const { user } = useAuth();

  // State
  const [editions, setEditions] = useState<Edition[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCompetitions, setIsLoadingCompetitions] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // Filters
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Confirm Dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'danger' | 'warning' | 'info' | 'success';
    action: (() => Promise<void>) | null;
  }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'danger',
    action: null,
  });

  /**
   * Fetch events for filter
   */
  const fetchEvents = useCallback(async () => {
    try {
      const response = await eventsService.getMyEvents({ limit: 100 });
      setEvents(response.data);
    } catch (error: any) {
      console.error('Error fetching events:', error);
    }
  }, []);

  /**
   * Fetch competitions when event changes
   */
  const fetchCompetitions = useCallback(async (eventId: string) => {
    if (!eventId) {
      setCompetitions([]);
      return;
    }

    try {
      setIsLoadingCompetitions(true);
      const comps = await competitionsService.getByEvent(eventId);
      setCompetitions(comps);
    } catch (error: any) {
      console.error('Error fetching competitions:', error);
      setCompetitions([]);
    } finally {
      setIsLoadingCompetitions(false);
    }
  }, []);

  /**
   * Fetch editions
   */
  const fetchEditions = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!selectedCompetitionId) {
        // Si no hay competición seleccionada, cargar todas las ediciones de todas mis competiciones
        const allEditions: Edition[] = [];

        // Determinar qué competiciones buscar
        const compsToFetch = selectedEventId
          ? competitions
          : await (async () => {
              const allComps: Competition[] = [];
              for (const event of events) {
                const comps = await competitionsService.getByEvent(event.id);
                allComps.push(...comps);
              }
              return allComps;
            })();

        for (const comp of compsToFetch) {
          const eds = await editionsService.getByCompetition(comp.id);
          allEditions.push(...eds);
        }

        setEditions(allEditions);
      } else {
        // Cargar solo de la competición seleccionada
        const eds = await editionsService.getByCompetition(selectedCompetitionId);
        setEditions(eds);
      }
    } catch (error: any) {
      console.error('Error fetching editions:', error);
      setEditions([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCompetitionId, selectedEventId, competitions, events]);

  /**
   * Initial load
   */
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  /**
   * Load competitions when event changes
   */
  useEffect(() => {
    if (selectedEventId) {
      fetchCompetitions(selectedEventId);
      setSelectedCompetitionId(''); // Reset competition filter
    } else {
      setCompetitions([]);
      setSelectedCompetitionId('');
    }
  }, [selectedEventId, fetchCompetitions]);

  /**
   * Load editions
   */
  useEffect(() => {
    if (events.length > 0) {
      fetchEditions();
    }
  }, [fetchEditions, events, selectedCompetitionId]);

  /**
   * Handle delete
   */
  const handleDelete = (editionId: string) => {
    const edition = editions.find((e) => e.id === editionId);
    if (!edition) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Edición',
      message: `¿Estás seguro de que quieres eliminar la edición ${edition.year}? Esta acción no se puede deshacer.`,
      variant: 'danger',
      action: async () => {
        try {
          setIsLoadingAction(true);
          await editionsService.delete(editionId);
          await fetchEditions();
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        } catch (error: any) {
          console.error('Error deleting edition:', error);
          alert(error.response?.data?.message || 'Error al eliminar edición');
        } finally {
          setIsLoadingAction(false);
        }
      },
    });
  };

  /**
   * Close confirm dialog
   */
  const closeConfirmDialog = () => {
    if (!isLoadingAction) {
      setConfirmDialog({ ...confirmDialog, isOpen: false });
    }
  };

  /**
   * Filter editions
   */
  const filteredEditions = editions.filter((edition) => {
    if (searchQuery) {
      return edition.year.toString().includes(searchQuery);
    }
    return true;
  });

  // Sort by year descending
  const sortedEditions = [...filteredEditions].sort((a, b) => b.year - a.year);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Ediciones</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestiona las ediciones de tus competiciones
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Event Filter */}
            <div>
              <label htmlFor="event-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Evento
              </label>
              <select
                id="event-filter"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Todos los eventos</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Competition Filter */}
            <div>
              <label htmlFor="competition-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Competición
              </label>
              <select
                id="competition-filter"
                value={selectedCompetitionId}
                onChange={(e) => setSelectedCompetitionId(e.target.value)}
                disabled={!selectedEventId || isLoadingCompetitions}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {selectedEventId
                    ? 'Todas las competiciones'
                    : 'Selecciona un evento primero'}
                </option>
                {competitions.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por Año
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="2024..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Ediciones</p>
                <p className="text-2xl font-bold text-gray-900">{sortedEditions.length}</p>
              </div>
              <Calendar className="h-12 w-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Próximas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sortedEditions.filter((e) => e.status === 'UPCOMING').length}
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Finalizadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sortedEditions.filter((e) => e.status === 'FINISHED').length}
                </p>
              </div>
              <Mountain className="h-12 w-12 text-gray-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Curso</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sortedEditions.filter((e) => e.status === 'ONGOING').length}
                </p>
              </div>
              <Users className="h-12 w-12 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Editions List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        ) : sortedEditions.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {selectedCompetitionId
                ? 'Esta competición no tiene ediciones aún'
                : selectedEventId
                ? 'Este evento no tiene ediciones aún'
                : 'No se encontraron ediciones'}
            </p>
            {selectedCompetitionId && (
              <button
                onClick={() =>
                  router.push(`/organizer/editions/new?competitionId=${selectedCompetitionId}`)
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Crear Edición
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedEditions.map((edition) => (
              <div
                key={edition.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl font-bold text-blue-600">{edition.year}</span>

                        {edition.status && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              edition.status === 'FINISHED'
                                ? 'bg-gray-100 text-gray-700'
                                : edition.status === 'UPCOMING'
                                ? 'bg-blue-100 text-blue-700'
                                : edition.status === 'ONGOING'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {edition.status === 'FINISHED'
                              ? 'Finalizada'
                              : edition.status === 'UPCOMING'
                              ? 'Próxima'
                              : edition.status === 'ONGOING'
                              ? 'En curso'
                              : 'Cancelada'}
                          </span>
                        )}

                        {edition.registrationStatus && (
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                            Inscripción:{' '}
                            {edition.registrationStatus === 'OPEN'
                              ? 'Abierta'
                              : edition.registrationStatus === 'CLOSED'
                              ? 'Cerrada'
                              : edition.registrationStatus === 'FULL'
                              ? 'Completa'
                              : 'No abierta'}
                          </span>
                        )}
                      </div>

                      {/* Dates */}
                      {edition.specificDate && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(edition.specificDate).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                          {edition.endDate &&
                            ` - ${new Date(edition.endDate).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                            })}`}
                        </div>
                      )}

                      {/* City */}
                      {edition.city && (
                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                          <MapPin className="h-4 w-4" />
                          {edition.city}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        {edition.distance && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>{edition.distance} km</span>
                          </div>
                        )}
                        {edition.elevation && (
                          <div className="flex items-center gap-1">
                            <Mountain className="h-4 w-4" />
                            <span>{edition.elevation} m D+</span>
                          </div>
                        )}
                        {edition.currentParticipants !== undefined && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>
                              {edition.currentParticipants}
                              {edition.maxParticipants && `/${edition.maxParticipants}`} participantes
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-3 bg-gray-50 border-t flex flex-wrap gap-2">
                  <Link
                    href={`/editions/${edition.slug}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    Ver
                  </Link>

                  <button
                    onClick={() => router.push(`/organizer/editions/edit/${edition.id}`)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(edition.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors ml-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDialog.action || (() => Promise.resolve())}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
        isLoading={isLoadingAction}
      />
    </div>
  );
}
