'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminService, PendingEvent } from '@/lib/api/admin.service';
import EventApprovalQueue from '@/components/admin/EventApprovalQueue';
import { Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<PendingEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<PendingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('DRAFT');
  const [stats, setStats] = useState({
    draft: 0,
    published: 0,
    rejected: 0,
  });
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && currentUser?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    if (currentUser?.role === 'ADMIN') {
      loadEvents();
    }
  }, [currentUser, authLoading, router]);

  useEffect(() => {
    filterEvents();
    calculateStats();
  }, [events, statusFilter]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      
      // Mock data temporal
      const mockEvents: PendingEvent[] = [
        {
          id: '1',
          name: 'Trail del Montseny 2025',
          slug: 'trail-montseny-2025',
          city: 'Barcelona',
          country: 'España',
          status: 'DRAFT',
          organizer: {
            id: 'org1',
            name: 'Club Montaña Barcelona',
            email: 'info@clubmontana.com',
          },
          createdAt: '2025-11-06T10:30:00Z',
        },
        {
          id: '2',
          name: 'Ultra Trail Picos de Europa',
          slug: 'ultra-picos-europa',
          city: 'Potes',
          country: 'España',
          status: 'DRAFT',
          organizer: {
            id: 'org2',
            name: 'María García',
            email: 'maria@trail.es',
          },
          createdAt: '2025-11-05T14:20:00Z',
        },
        {
          id: '3',
          name: 'Maratón de los Pirineos',
          slug: 'maraton-pirineos',
          city: 'Jaca',
          country: 'España',
          status: 'PUBLISHED',
          organizer: {
            id: 'org3',
            name: 'Carlos Ruiz',
            email: 'carlos@pirineos.com',
          },
          createdAt: '2025-11-03T09:15:00Z',
        },
        {
          id: '4',
          name: 'Trail Costa Brava',
          slug: 'trail-costa-brava',
          city: 'Girona',
          country: 'España',
          status: 'REJECTED',
          organizer: {
            id: 'org4',
            name: 'Ana López',
            email: 'ana@costabrava.es',
          },
          createdAt: '2025-11-01T16:45:00Z',
        },
        {
          id: '5',
          name: 'Desafío Sierra Nevada',
          slug: 'desafio-sierra-nevada',
          city: 'Granada',
          country: 'España',
          status: 'DRAFT',
          organizer: {
            id: 'org5',
            name: 'Pedro Martínez',
            email: 'pedro@sierranevada.com',
          },
          createdAt: '2025-11-07T08:00:00Z',
        },
      ];

      setEvents(mockEvents);
      
      // Real API call (comentado por ahora)
      // const data = await adminService.getPendingEvents();
      // setEvents(data.data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    const filtered = events.filter((event) => event.status === statusFilter);
    setFilteredEvents(filtered);
  };

  const calculateStats = () => {
    setStats({
      draft: events.filter((e) => e.status === 'DRAFT').length,
      published: events.filter((e) => e.status === 'PUBLISHED').length,
      rejected: events.filter((e) => e.status === 'REJECTED').length,
    });
  };

  const handleApprove = async (eventId: string) => {
    try {
      // await adminService.approveEvent(eventId);
      
      // Mock approve
      setEvents(events.map(e => 
        e.id === eventId ? { ...e, status: 'PUBLISHED' as const } : e
      ));
      
      alert('Evento aprobado correctamente');
    } catch (error) {
      console.error('Error approving event:', error);
      alert('Error al aprobar el evento');
    }
  };

  const handleReject = async (eventId: string) => {
    try {
      // await adminService.rejectEvent(eventId, reason);
      
      // Mock reject
      setEvents(events.map(e => 
        e.id === eventId ? { ...e, status: 'REJECTED' as const } : e
      ));
      
      alert('Evento rechazado correctamente');
    } catch (error) {
      console.error('Error rejecting event:', error);
      alert('Error al rechazar el evento');
    }
  };

  const handleView = (eventId: string) => {
    // Navigate to event detail or open modal
    router.push(`/events/${eventId}`);
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Eventos</h2>
          <p className="mt-1 text-sm text-gray-500">
            Revisa y aprueba eventos pendientes
          </p>
        </div>
        <button
          onClick={loadEvents}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          Recargar
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <button
          onClick={() => setStatusFilter('DRAFT')}
          className={`rounded-lg border-2 p-4 text-left transition-all ${
            statusFilter === 'DRAFT'
              ? 'border-yellow-500 bg-yellow-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.draft}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </button>

        <button
          onClick={() => setStatusFilter('PUBLISHED')}
          className={`rounded-lg border-2 p-4 text-left transition-all ${
            statusFilter === 'PUBLISHED'
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aprobados</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.published}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </button>

        <button
          onClick={() => setStatusFilter('REJECTED')}
          className={`rounded-lg border-2 p-4 text-left transition-all ${
            statusFilter === 'REJECTED'
              ? 'border-red-500 bg-red-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rechazados</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </button>
      </div>

      {/* Events Queue */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Eventos {statusFilter === 'DRAFT' ? 'Pendientes' : statusFilter === 'PUBLISHED' ? 'Aprobados' : 'Rechazados'}
        </h3>
        <EventApprovalQueue
          events={filteredEvents}
          onApprove={handleApprove}
          onReject={handleReject}
          onView={handleView}
        />
      </div>
    </div>
  );
}
