// lib/api/competitions.service.ts
import apiClient from './client';
import { Competition, CompetitionFilters, PaginatedResponse } from '@/types/competition';

export const competitionsService = {
  // Obtener todas las competiciones (con filtros y paginación)
  async getAll(filters?: CompetitionFilters): Promise<PaginatedResponse<Competition>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get<PaginatedResponse<Competition>>(
      `/competitions?${params.toString()}`
    );
    return response.data;
  },

  // Obtener competición por ID
  async getById(id: number): Promise<Competition> {
    const response = await apiClient.get<Competition>(`/competitions/${id}`);
    return response.data;
  },

  // Obtener competición por slug
  async getBySlug(slug: string): Promise<Competition> {
    const response = await apiClient.get<Competition>(`/competitions/slug/${slug}`);
    return response.data;
  },

  // Obtener competiciones destacadas
  async getFeatured(): Promise<Competition[]> {
    const response = await apiClient.get<Competition[]>('/competitions/featured');
    return response.data;
  },

  // Crear competición (requiere autenticación ADMIN)
  async create(data: Partial<Competition>): Promise<Competition> {
    const response = await apiClient.post<Competition>('/competitions', data);
    return response.data;
  },

  // Actualizar competición (requiere autenticación ADMIN)
  async update(id: number, data: Partial<Competition>): Promise<Competition> {
    const response = await apiClient.put<Competition>(`/competitions/${id}`, data);
    return response.data;
  },

  // Eliminar competición (requiere autenticación ADMIN)
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/competitions/${id}`);
  },
};
