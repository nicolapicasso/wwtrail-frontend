'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2 } from 'lucide-react';
import EventStats from '@/components/EventStats';
import EventFilters from '@/components/EventFilters';
import EventCard from '@/components/EventCard';
import ConfirmDialog from '@/components/ConfirmDialog';
import eventsService from '@/lib/api/v2/events.service';
import { Event, EventStatus, EventStats as EventStatsType } from '@/lib/types/event';
import { useAuth } from '@/hooks/useAuth';

export default function MyEventsPage() {
  const router = useRouter();
  const { user } = useAuth();

  // State
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<EventStatsType>({
    total: 0,
    published: 0,
    draft: 0,
    rejected: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'ALL'>('ALL');
  const [countryFilter, setCountryFilter] = useState('');
  const [organizerFilter, setOrganizerFilter] = useState('');
  const [page, setPage] = useState(1);

  // Pagination
  const [totalPages, setTotalPages] = useState(1);

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

  // Check if user is admin
  const isAdmin = user?.role === 'ADMIN';

  /**
   * Fetch events
   */
  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const filters = {
        page,
        limit: 10,
        search: searchQuery || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        country: countryFilter || undefined,
        organizerId: isAdmin && organizerFilter ? organizerFilter : undefined,
      };

      const response = isAdmin && organizerFilter
        ? await eventsService.getAll(filters) // Admin can filter by organizer
        : await eventsService.getMyEvents(filters);

      setEvents(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error: any) {
      console.error('Error fetching events:', error);
      alert(error.response?.data?.message || 'Error al cargar eventos');
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, statusFilter, countryFilter, organizerFilter, isAdmin]);

  /**
   * Fetch stats
   */
  const fetchStats = useCallback(async () => {
    try {
      const response = await eventsService.getStats();
      setStats(response.data);
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  /**
   * Initial load
   */
  useEffect(() => {
    fetchEvents();
    fetchStats();
  }, [fetchEvents, fetchStats]);

  /**
   * Handle search
   */
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page
  };

  /**
   * Handle status filter
   */
  const handleFilterStatus = (status: EventStatus | 'ALL') => {
    setStatusFilter(status);
    setPage(1);
  };

  /**
   * Handle country filter
   */
  const handleFilterCountry = (country: string) => {
    setCountryFilter(country);
    setPage(1);
  };

  /**
   * Handle organizer filter (admin only)
   */
  const handleFilterOrganizer = (organizerId: string) => {
    setOrganizerFilter(organizerId);
    setPage(1);
  };

  /**
   * Handle edit
   */
  const handleEdit = (eventId: string) => {
    router.push(`/organizer/events/${eventId}/edit`);
  };

  /**
   * Handle delete
   */
  const handleDelete = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Evento',
      message: `¿Estás seguro de que quieres eliminar "${event.name}"? Esta acción no se puede deshacer.`,
      variant: 'danger',
      action: async () => {
        try {
          setIsLoadingAction(true);
          await eventsService.delete(eventId);
          await fetchEvents();
          await fetchStats();
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        } catch (error: any) {
          console.error('Error deleting event:', error);
          alert(error.response?.data?.message || 'Error al eliminar evento');
        } finally {
          setIsLoadingAction(false);
        }
      },
    });
  };

  /**
   * Handle add competition
   */
  const handleAddCompetition = (eventId: string) => {
    router.push(`/organizer/events/${eventId}/competitions/new`);
  };

  /**
   * Handle approve (admin only)
   */
  const handleApprove = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Aprobar Evento',
      message: `¿Aprobar "${event.name}"? El evento será visible públicamente.`,
      variant: 'success',
      action: async () => {
        try {
          setIsLoadingAction(true);
          await eventsService.approve(eventId);
          await fetchEvents();
          await fetchStats();
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        } catch (error: any) {
          console.error('Error approving event:', error);
          alert(error.response?.data?.message || 'Error al aprobar evento');
        } finally {
          setIsLoadingAction(false);
        }
      },
    });
  };

  /**
   * Handle reject (admin only)
   */
  const handleReject = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    const reason = prompt(`Motivo del rechazo de "${event.name}":`);
    if (reason === null) return; // User cancelled

    setConfirmDialog({
      isOpen: true,
      title: 'Rechazar Evento',
      message: `¿Rechazar "${event.name}"?`,
      variant: 'danger',
      action: async () => {
        try {
          setIsLoadingAction(true);
          await eventsService.reject(eventId, { reason: reason || undefined });
          await fetchEvents();
          await fetchStats();
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        } catch (error: any) {
          console.error('Error rejecting event:', error);
          alert(error.response?.data?.message || 'Error al rechazar evento');
        } finally {
          setIsLoadingAction(false);
        }
      },
    });
  };

  /**
   * Handle toggle featured (admin only)
   */
  const handleToggleFeatured = async (eventId: string) => {
    try {
      await eventsService.toggleFeatured(eventId);
      await fetchEvents();
    } catch (error: any) {
      console.error('Error toggling featured:', error);
      alert(error.response?.data?.message || 'Error al destacar evento');
    }
  };

  /**
   * Close confirm dialog
   */
  const closeConfirmDialog = () => {
    if (!isLoadingAction) {
      setConfirmDialog({ ...confirmDialog, isOpen: false });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isAdmin ? 'Gestión de Eventos (Admin)' : 'Mis Eventos'}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {isAdmin
                ? 'Gestiona todos los eventos de la plataforma'
                : 'Gestiona tus eventos y competiciones'}
            </p>
          </div>
          <button
            onClick={() => router.push('/organizer/events/new')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Nuevo Evento
          </button>
        </div>

        {/* Stats */}
        <EventStats stats={stats} isLoading={isLoading && events.length === 0} />

        {/* Filters */}
        <EventFilters
          onSearch={handleSearch}
          onFilterStatus={handleFilterStatus}
          onFilterCountry={handleFilterCountry}
          onFilterOrganizer={isAdmin ? handleFilterOrganizer : undefined}
          showCountryFilter={false} // Can be enabled if needed
          showOrganizerFilter={isAdmin}
          isLoading={isLoading}
        />

        {/* Events List */}
        {isLoading && events.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        ) : !events || events.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600">No se encontraron eventos</p>
            <button
              onClick={() => router.push('/organizer/events/new')}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Crear tu primer evento
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                userRole={user?.role || 'ATHLETE'}
                onEdit={handleEdit}
                onDelete={isAdmin ? handleDelete : undefined}
                onAddCompetition={handleAddCompetition}
                onApprove={isAdmin ? handleApprove : undefined}
                onReject={isAdmin ? handleReject : undefined}
                onToggleFeatured={isAdmin ? handleToggleFeatured : undefined}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
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
