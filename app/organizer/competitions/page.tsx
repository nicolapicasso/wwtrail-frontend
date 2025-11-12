'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2, Mountain, TrendingUp, Users, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import Link from 'next/link';
import ConfirmDialog from '@/components/ConfirmDialog';
import competitionsService from '@/lib/api/v2/competitions.service';
import eventsService from '@/lib/api/v2/events.service';
import type { Competition } from '@/types/competition';
import type { Event } from '@/types/event';
import { useAuth } from '@/hooks/useAuth';

export default function OrganizerCompetitionsPage() {
  const router = useRouter();
  const { user } = useAuth();

  // State
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // Filters
  const [selectedEventId, setSelectedEventId] = useState<string>('');
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
   * Fetch competitions
   */
  const fetchCompetitions = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!selectedEventId) {
        // Si no hay evento seleccionado, cargar todas las competiciones de todos mis eventos
        const allCompetitions: Competition[] = [];
        for (const event of events) {
          const comps = await competitionsService.getByEvent(event.id);
          allCompetitions.push(...comps);
        }
        setCompetitions(allCompetitions);
      } else {
        // Cargar solo del evento seleccionado
        const comps = await competitionsService.getByEvent(selectedEventId);
        setCompetitions(comps);
      }
    } catch (error: any) {
      console.error('Error fetching competitions:', error);
      setCompetitions([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedEventId, events]);

  /**
   * Initial load
   */
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (events.length > 0) {
      fetchCompetitions();
    }
  }, [fetchCompetitions, events]);

  /**
   * Handle delete
   */
  const handleDelete = (competitionId: string) => {
    const competition = competitions.find((c) => c.id === competitionId);
    if (!competition) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Competición',
      message: `¿Estás seguro de que quieres eliminar "${competition.name}"? Esta acción eliminará también todas sus ediciones.`,
      variant: 'danger',
      action: async () => {
        try {
          setIsLoadingAction(true);
          await competitionsService.delete(competitionId);
          await fetchCompetitions();
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        } catch (error: any) {
          console.error('Error deleting competition:', error);
          alert(error.response?.data?.message || 'Error al eliminar competición');
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
   * Filter competitions
   */
  const filteredCompetitions = competitions.filter((comp) => {
    if (searchQuery) {
      return comp.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Competiciones</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestiona las competiciones de tus eventos
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Competiciones</p>
                <p className="text-2xl font-bold text-gray-900">{filteredCompetitions.length}</p>
              </div>
              <Mountain className="h-12 w-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Eventos</p>
                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
              </div>
              <Calendar className="h-12 w-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Activas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredCompetitions.filter((c) => c.isActive).length}
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Competitions List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        ) : filteredCompetitions.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Mountain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {selectedEventId
                ? 'Este evento no tiene competiciones aún'
                : 'No se encontraron competiciones'}
            </p>
            {selectedEventId && (
              <button
                onClick={() => router.push(`/organizer/competitions/new?eventId=${selectedEventId}`)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Crear Competición
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCompetitions.map((competition) => (
              <div
                key={competition.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{competition.name}</h3>
                        {!competition.isActive && (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                            Inactiva
                          </span>
                        )}
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {competition.type}
                        </span>
                      </div>

                      {competition.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {competition.description}
                        </p>
                      )}

                      {/* Event Info */}
                      {competition.event && (
                        <div className="text-sm text-gray-500 mb-3">
                          <span className="font-medium">Evento:</span> {competition.event.name}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        {competition.baseDistance && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>{competition.baseDistance} km</span>
                          </div>
                        )}
                        {competition.baseElevation && (
                          <div className="flex items-center gap-1">
                            <Mountain className="h-4 w-4" />
                            <span>{competition.baseElevation} m D+</span>
                          </div>
                        )}
                        {competition.baseMaxParticipants && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{competition.baseMaxParticipants} max</span>
                          </div>
                        )}
                        {competition._count?.editions !== undefined && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{competition._count.editions} ediciones</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-3 bg-gray-50 border-t flex flex-wrap gap-2">
                  <Link
                    href={`/events/${competition.event?.slug}/${competition.slug}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    Ver
                  </Link>

                  <button
                    onClick={() => router.push(`/organizer/competitions/edit/${competition.id}`)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      router.push(`/organizer/editions/new?competitionId=${competition.id}`)
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Nueva Edición
                  </button>

                  <button
                    onClick={() => handleDelete(competition.id)}
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
