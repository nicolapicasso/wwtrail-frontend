'use client';

import { useEffect, useState } from 'react';
import { Users, Calendar, MapPin, Clock, TrendingUp, UserPlus, Award } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import { adminService, AdminStats } from '@/lib/api/admin.service';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Verificar que sea ADMIN
    if (!authLoading && user?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    if (user?.role === 'ADMIN') {
      loadStats();
    }
  }, [user, authLoading, router]);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getStats();
      setStats(data);
    } catch (err: any) {
      console.error('Error loading stats:', err);
      setError(err.response?.data?.message || 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4">
        <p className="text-red-800 font-medium">Error al cargar estadísticas</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <button
          onClick={loadStats}
          className="mt-3 text-sm text-red-600 hover:text-red-700 underline"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // Calcular el % de nuevos usuarios
  const newUsersPercent = stats.totalUsers > 0 
    ? Math.round((stats.newUsersThisMonth / stats.totalUsers) * 100) 
    : 0;

  // Calcular el % de nuevos eventos
  const newEventsPercent = stats.totalEvents > 0 
    ? Math.round((stats.newEventsThisMonth / stats.totalEvents) * 100) 
    : 0;

  // Calcular el % de usuarios activos
  const activeUsersPercent = stats.totalUsers > 0 
    ? Math.round((stats.activeUsers / stats.totalUsers) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">
          Resumen general de la plataforma
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Usuarios"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          trend={{
            value: newUsersPercent,
            isPositive: true,
          }}
          description={`${stats.newUsersThisMonth} nuevos este mes`}
        />

        <StatsCard
          title="Total Eventos"
          value={stats.totalEvents.toLocaleString()}
          icon={Calendar}
          trend={{
            value: newEventsPercent,
            isPositive: true,
          }}
          description={`${stats.newEventsThisMonth} nuevos este mes`}
        />

        <StatsCard
          title="Total Competiciones"
          value={stats.totalCompetitions.toLocaleString()}
          icon={MapPin}
          description="Distancias activas"
        />

        <StatsCard
          title="Total Ediciones"
          value={stats.totalEditions.toLocaleString()}
          icon={Award}
          description="Ediciones anuales"
        />

        <StatsCard
          title="Pendientes Aprobación"
          value={stats.pendingApprovals}
          icon={Clock}
          description="Eventos esperando revisión"
        />

        <StatsCard
          title="Usuarios Activos"
          value={`${activeUsersPercent}%`}
          icon={TrendingUp}
          trend={{
            value: activeUsersPercent >= 80 ? 5 : -2,
            isPositive: activeUsersPercent >= 80,
          }}
          description={`${stats.activeUsers} de ${stats.totalUsers}`}
        />
      </div>

      {/* Users by Role */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Usuarios por Rol
        </h3>
        <div className="grid gap-4 md:grid-cols-4">
          {stats.usersByRole.map((item) => (
            <div key={item.role} className="text-center">
              <p className="text-2xl font-bold text-gray-900">{item.count}</p>
              <p className="text-sm text-gray-500 capitalize">
                {item.role.toLowerCase()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Actividad Reciente (últimos 7 días)
        </h3>
        <div className="space-y-3">
          {stats.recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  {activity.type === 'users' && <Users className="h-5 w-5 text-purple-600" />}
                  {activity.type === 'events' && <Calendar className="h-5 w-5 text-purple-600" />}
                  {activity.type === 'reviews' && <TrendingUp className="h-5 w-5 text-purple-600" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {activity.type === 'users' && 'Nuevos usuarios'}
                    {activity.type === 'events' && 'Nuevos eventos'}
                    {activity.type === 'reviews' && 'Nuevas reseñas'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.date).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {activity.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => router.push('/admin/events')}
            className="rounded-lg border border-gray-200 bg-white p-4 text-left transition-all hover:border-purple-300 hover:shadow-md"
          >
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Revisar Eventos
                </p>
                <p className="text-xs text-gray-500">
                  {stats.pendingApprovals} pendientes
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/admin/users')}
            className="rounded-lg border border-gray-200 bg-white p-4 text-left transition-all hover:border-purple-300 hover:shadow-md"
          >
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Gestionar Usuarios
                </p>
                <p className="text-xs text-gray-500">
                  {stats.totalUsers} usuarios
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/admin/stats')}
            className="rounded-lg border border-gray-200 bg-white p-4 text-left transition-all hover:border-purple-300 hover:shadow-md"
          >
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Ver Estadísticas
                </p>
                <p className="text-xs text-gray-500">
                  Análisis detallado
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/events')}
            className="rounded-lg border border-gray-200 bg-white p-4 text-left transition-all hover:border-purple-300 hover:shadow-md"
          >
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Ver Eventos
                </p>
                <p className="text-xs text-gray-500">
                  Vista pública
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
