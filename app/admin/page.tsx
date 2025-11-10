'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminService, PendingCompetition } from '@/lib/api/admin.service';
import EventApprovalQueue from '@/components/admin/EventApprovalQueue';
import { Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function AdminEventsPage() {
  const [competitions, setCompetitions] = useState<PendingCompetition[]>([]);
  const [filteredCompetitions, setFilteredCompetitions] = useState<PendingCompetition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('DRAFT');
  const [stats, setStats] = useState({
    draft: 0,
    published: 0,
    cancelled: 0,
  });
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && currentUser?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    if (currentUser?.role === 'ADMIN') {
      loadCompetitions();
    }
  }, [currentUser, authLoading, router]);

  useEffect(() => {
    filterCompetitions();
    calculateStats();
  }, [competitions, statusFilter]);

  const loadCompetitions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminService.getPendingEvents({
        page: 1,
        limit: 100, // Cargar todas para filtrar en cliente
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      
      setCompetitions(response.data || []);
    } catch (err: any) {
      console.error('Error loading competitions:', err);
      setError(err.response?.data?.message || 'Error al cargar competiciones');
    } finally {
      setLoading(false);
    }
  };

  const filterCompetitions = () => {
    const filtered = competitions.filter((comp) => comp.status === statusFilter);
    setFilteredCompetitions(filtered);
  };

  const calculateStats = () => {
    setStats({
      draft: competitions.filter((e) => e.status === 'DRAFT').length,
      published: competitions.filter((e) => e.status === 'PUBLISHED').length,
      cancelled: competitions.filter((e) => e.status === 'CANCELLED').length,
    });
  };

  const handleApprove = async (competitionId: string) => {
    // Solicitar notas del admin (opcional)
    const adminNotes = prompt('Notas del administrador (opcional):');
    
    try {
      await adminService.approveEvent(
        competitionId,
        adminNotes || undefined
      );
      
      // Actualizar competición en la lista
      setCompetitions(competitions.map(c => 
        c.id === competitionId ? { ...c, status: 'PUBLISHED' as const } : c
      ));
    } catch (error: any) {
      console.error('Error approving competition:', error);
      alert(error.response?.data?.message || 'Error al aprobar la competición');
    }
  };

  const handleReject = async (competitionId: string) => {
    // Solicitar razón del rechazo (opcional pero recomendado)
    const reason = prompt('¿Por qué rechazas esta competición? (opcional)');
    
    try {
      await adminService.rejectEvent(
        competitionId,
        reason || undefined
      );
      
      // Actualizar competición en la lista
      setCompetitions(competitions.map(c => 
        c.id === competitionId ? { ...c, status: 'CANCELLED' as const } : c
      ));
    } catch (error: any) {
      console.error('Error rejecting competition:', error);
      alert(error.response?.data?.message || 'Error al rechazar la competición');
    }
  };

  const handleView = (competitionId: string) => {
    // Buscar la competición para obtener su slug
    const comp = competitions.find(c => c.id === competitionId);
    if (comp) {
      // Navegar al evento padre
      router.push(`/events/${comp.event.slug}`);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando competiciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4">
        <p className="text-red-800 font-medium">Error al cargar competiciones</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <button
          onClick={loadCompetitions}
          className="mt-3 text-sm text-red-600 hover:text-red-700 underline"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  // Transformar datos para EventApprovalQueue
  const transformedEvents = filteredCompetitions.map(comp => ({
    id: comp.id,
    name: `${comp.event.name} - ${comp.name}`,
    slug: comp.slug,
    city: comp.event.city,
    country: comp.event.country,
    status: comp.status,
    organizer: {
      id: comp.event.organizer.id,
      name: comp.event.organizer.fullName,
      email: comp.event.organizer.email,
    },
    createdAt: comp.createdAt,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Competiciones</h2>
          <p className="mt-1 text-sm text-gray-500">
            Revisa y aprueba competiciones pendientes
          </p>
        </div>
        <button
          onClick={loadCompetitions}
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
              <p className="text-sm font-medium text-gray-600">Aprobadas</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.published}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </button>

        <button
          onClick={() => setStatusFilter('CANCELLED')}
          className={`rounded-lg border-2 p-4 text-left transition-all ${
            statusFilter === 'CANCELLED'
              ? 'border-red-500 bg-red-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rechazadas</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.cancelled}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </button>
      </div>

      {/* Events Queue */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Competiciones {statusFilter === 'DRAFT' ? 'Pendientes' : statusFilter === 'PUBLISHED' ? 'Aprobadas' : 'Rechazadas'}
        </h3>
        {filteredCompetitions.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">
              No hay competiciones en estado {statusFilter.toLowerCase()}
            </p>
          </div>
        ) : (
          <EventApprovalQueue
            events={transformedEvents}
            onApprove={handleApprove}
            onReject={handleReject}
            onView={handleView}
          />
        )}
      </div>
    </div>
  );
}
