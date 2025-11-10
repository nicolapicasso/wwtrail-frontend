// lib/api/admin.service.ts

import { apiClientV1 } from './client';

export interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  totalCompetitions: number;
  totalEditions: number;
  pendingApprovals: number;
  newUsersThisMonth: number;
  newEventsThisMonth: number;
  activeUsers: number;
  usersByRole: Array<{
    role: string;
    count: number;
  }>;
  recentActivity: Array<{
    type: string;
    count: number;
    date: string;
  }>;
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: 'ADMIN' | 'ORGANIZER' | 'ATHLETE' | 'VIEWER';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  stats: {
    competitions: number;
    reviews: number;
  };
}

export interface UsersPagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Interface para evento pendiente (simplificada)
 * @deprecated - Usar PendingCompetition en su lugar
 */
export interface PendingEvent {
  id: string;
  name: string;
  slug: string;
  city: string;
  country: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  organizer: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

/**
 * Interface completa para competición pendiente
 * Usada en /admin/competitions/pending
 */
export interface PendingCompetition {
  id: string;
  name: string;
  slug: string;
  type: string;
  baseDistance: number | null;
  baseElevation: number | null;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  event: {
    id: string;
    name: string;
    slug: string;
    country: string;
    city: string;
    organizer: {
      id: string;
      email: string;
      username: string;
      fullName: string;
    };
  };
  totalEditions: number;
}

export interface CompetitionsPagination {
  currentPage: number;
  totalPages: number;
  totalCompetitions: number;
  hasNext: boolean;
  hasPrev: boolean;
}

class AdminService {
  // Dashboard stats
  async getStats(): Promise<AdminStats> {
    const { data } = await apiClientV1.get('/admin/stats');
    return data.data;
  }

  // Users management
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ data: User[]; pagination: UsersPagination }> {
    const { data } = await apiClientV1.get('/admin/users', { params });
    return {
      data: data.data,
      pagination: data.pagination,
    };
  }

  async getUserById(userId: string): Promise<User> {
    const { data } = await apiClientV1.get(`/admin/users/${userId}`);
    return data.data;
  }

  async getUserStats(userId: string) {
    const { data } = await apiClientV1.get(`/admin/users/${userId}/stats`);
    return data.data;
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    const { data } = await apiClientV1.patch(`/admin/users/${userId}/role`, { role });
    return data.data;
  }

  async toggleUserStatus(userId: string): Promise<User> {
    const { data } = await apiClientV1.patch(`/admin/users/${userId}/toggle-status`);
    return data.data;
  }

  async deleteUser(userId: string) {
    const { data } = await apiClientV1.delete(`/admin/users/${userId}`);
    return data;
  }

  // ============================================
  // COMPETITIONS MANAGEMENT
  // ============================================

  /**
   * Obtener competiciones pendientes de aprobación
   * Devuelve todas las competiciones con status DRAFT
   */
  async getPendingEvents(params?: {
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'name' | 'startDate';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ data: PendingCompetition[]; pagination: CompetitionsPagination }> {
    const { data } = await apiClientV1.get('/admin/competitions/pending', { params });
    return {
      data: data.data,
      pagination: data.pagination,
    };
  }

  /**
   * Aprobar una competición
   * NUEVO: Acepta adminNotes opcional
   */
  async approveEvent(competitionId: string, adminNotes?: string) {
    const body = adminNotes ? { adminNotes } : {};
    const { data } = await apiClientV1.post(
      `/admin/competitions/${competitionId}/approve`,
      body
    );
    return data.data;
  }

  /**
   * Rechazar una competición
   * Acepta razón opcional
   */
  async rejectEvent(competitionId: string, reason?: string) {
    const body = reason ? { reason } : {};
    const { data } = await apiClientV1.post(
      `/admin/competitions/${competitionId}/reject`,
      body
    );
    return data.data;
  }

  /**
   * Obtener estadísticas de competiciones
   */
  async getCompetitionStats() {
    const { data } = await apiClientV1.get('/admin/competitions/stats');
    return data.data;
  }

  // Activity logs (no implementado en backend aún, devuelve array vacío)
  async getActivityLogs(params?: {
    page?: number;
    limit?: number;
    type?: string;
  }) {
    try {
      const { data } = await apiClientV1.get('/admin/logs', { params });
      return data;
    } catch (error) {
      // Endpoint no implementado aún, devolver estructura vacía
      return {
        success: true,
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          total: 0,
        },
      };
    }
  }
}

export const adminService = new AdminService();
