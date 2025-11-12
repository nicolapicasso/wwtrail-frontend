// lib/api/ratings.service.ts - Servicio para el sistema de ratings

import { apiClientV2 } from './client';
import type {
  EditionRating,
  CreateRatingDTO,
  UpdateRatingDTO,
  RatingsResponse,
} from '@/types/rating';

export const ratingsService = {
  /**
   * Crear un rating para una edición
   * POST /api/v2/editions/:editionId/ratings
   */
  async create(editionId: string, data: CreateRatingDTO): Promise<EditionRating> {
    const response = await apiClientV2.post(`/editions/${editionId}/ratings`, data);
    return response.data.data;
  },

  /**
   * Obtener ratings de una edición (paginado)
   * GET /api/v2/editions/:editionId/ratings
   */
  async getByEdition(
    editionId: string,
    params?: {
      page?: number;
      limit?: number;
      sortBy?: 'createdAt' | 'avgRating';
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<RatingsResponse> {
    const response = await apiClientV2.get(`/editions/${editionId}/ratings`, { params });
    return response.data;
  },

  /**
   * Obtener un rating específico
   * GET /api/v2/ratings/:id
   */
  async getById(id: string): Promise<EditionRating> {
    const response = await apiClientV2.get(`/ratings/${id}`);
    return response.data.data;
  },

  /**
   * Actualizar mi rating
   * PUT /api/v2/ratings/:id
   */
  async update(id: string, data: UpdateRatingDTO): Promise<EditionRating> {
    const response = await apiClientV2.put(`/ratings/${id}`, data);
    return response.data.data;
  },

  /**
   * Eliminar mi rating
   * DELETE /api/v2/ratings/:id
   */
  async delete(id: string): Promise<void> {
    await apiClientV2.delete(`/ratings/${id}`);
  },

  /**
   * Obtener mis ratings
   * GET /api/v2/me/ratings
   */
  async getMyRatings(params?: {
    page?: number;
    limit?: number;
  }): Promise<RatingsResponse> {
    const response = await apiClientV2.get('/me/ratings', { params });
    return response.data;
  },

  /**
   * Obtener últimos comentarios (homepage)
   * GET /api/v2/ratings/recent
   */
  async getRecent(limit: number = 10): Promise<EditionRating[]> {
    const response = await apiClientV2.get('/ratings/recent', {
      params: { limit },
    });
    return response.data.data;
  },

  /**
   * Obtener resumen de ratings de una edición
   */
  async getSummary(editionId: string) {
    const response = await apiClientV2.get(`/editions/${editionId}/ratings/summary`);
    return response.data.data;
  },
};

export default ratingsService;
