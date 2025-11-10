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

export interface PendingEvent {
  id: string;
  name: string;
  slug: string;
  city: string;
  country: string;
  status: 'DRAFT' | 'PUBLISHED' | 'REJECTED';
  organizer: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
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

  // Events management (endpoints de competitions admin que ya existen)
  async getPendingEvents(params?: {
    page?: number;
    limit?: number;
  }) {
    const { data } = await apiClientV1.get('/admin/competitions/pending', { params });
    return data;
  }

  async approveEvent(eventId: string) {
    const { data } = await apiClientV1.post(`/admin/competitions/${eventId}/approve`);
    return data.data;
  }

  async rejectEvent(eventId: string, reason?: string) {
    const { data } = await apiClientV1.post(`/admin/competitions/${eventId}/reject`, { reason });
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