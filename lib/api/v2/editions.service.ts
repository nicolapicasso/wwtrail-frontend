// lib/api/v2/editions.service.ts - VERSIÓN CORREGIDA

import { apiClientV2 } from '../client';
import { Edition, EditionFull, EditionStats } from '@/types/edition';

/**
 * Editions Service - USA V2
 * CORREGIDO: Obtiene editions desde competition.editions
 */

// Backend response structure (flat fields)
interface EditionWithInheritanceResponse extends Edition {
  // Resolved fields
  distance: number;
  elevation: number;
  maxParticipants: number;
  city: string;

  // Flat fields from backend
  eventName: string;
  eventSlug: string;
  eventCountry: string;
  eventId: string;
  competitionName: string;
  competitionSlug: string;
  competitionType: string;
  baseDistance?: number;
  baseElevation?: number;
  baseMaxParticipants?: number;
}

// Transform backend response to EditionFull format
function transformToEditionFull(response: EditionWithInheritanceResponse): EditionFull {
  return {
    ...response,
    resolvedDistance: response.distance,
    resolvedElevation: response.elevation,
    resolvedMaxParticipants: response.maxParticipants,
    resolvedCity: response.city,
    competition: {
      id: response.competitionId,
      slug: response.competitionSlug,
      name: response.competitionName,
      type: response.competitionType,
      baseDistance: response.baseDistance,
      baseElevation: response.baseElevation,
      baseMaxParticipants: response.baseMaxParticipants,
    },
    event: {
      id: response.eventId,
      slug: response.eventSlug,
      name: response.eventName,
      country: response.eventCountry,
      city: response.city,
    },
  };
}

export const editionsService = {
  /**
   * Get editions by competition ID
   * GET /competitions/:competitionId/editions
   */
  async getByCompetition(
    competitionId: string,
    options?: {
      includeInactive?: boolean;
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<Edition[]> {
    try {
      // Usar el endpoint dedicado para obtener ediciones
      const response = await apiClientV2.get<{
        status: string;
        data: Edition[];
      }>(`/competitions/${competitionId}/editions`);

      let editions = response.data.data || [];

      // Ordenar por año
      const sortOrder = options?.sortOrder || 'desc';
      editions = editions.sort((a, b) =>
        sortOrder === 'desc' ? b.year - a.year : a.year - b.year
      );

      return editions;
    } catch (error) {
      console.error('Error getting editions:', error);
      return [];
    }
  },

  /**
   * Get edition by ID
   * GET /editions/:id
   */
  async getById(id: string): Promise<Edition> {
    const response = await apiClientV2.get<{
      status: string;
      data: Edition;
    }>(`/editions/${id}`);
    return response.data.data;
  },

  /**
   * Get edition by slug
   * GET /editions/slug/:slug
   */
  async getBySlug(slug: string): Promise<Edition> {
    const response = await apiClientV2.get<{
      status: string;
      data: Edition;
    }>(`/editions/slug/${slug}`);
    return response.data.data;
  },

  /**
   * Get edition by slug with inheritance (resolved fields)
   * GET /editions/slug/:slug/with-inheritance
   */
  async getBySlugWithInheritance(slug: string): Promise<EditionFull> {
    const response = await apiClientV2.get<{
      status: string;
      data: EditionWithInheritanceResponse;
    }>(`/editions/slug/${slug}/with-inheritance`);
    return transformToEditionFull(response.data.data);
  },

  /**
   * Get edition by year
   * Usa getByCompetition y filtra por año
   */
  async getByYear(competitionId: string, year: number): Promise<Edition | null> {
    const editions = await this.getByCompetition(competitionId);
    const edition = editions.find(e => e.year === year);
    return edition || null;
  },

  /**
   * Get edition with inheritance (resolved fields)
   * GET /editions/:id/with-inheritance
   */
  async getWithInheritance(id: string): Promise<EditionFull> {
    const response = await apiClientV2.get<{
      status: string;
      data: EditionWithInheritanceResponse;
    }>(`/editions/${id}/with-inheritance`);
    return transformToEditionFull(response.data.data);
  },

  /**
   * Get edition statistics
   * GET /editions/:id/stats
   */
  async getStats(id: string): Promise<EditionStats> {
    const response = await apiClientV2.get<{
      status: string;
      data: EditionStats;
    }>(`/editions/${id}/stats`);
    return response.data.data;
  },

  /**
   * Create edition (requires auth)
   * POST /competitions/:competitionId/editions
   */
  async create(competitionId: string, data: Partial<Edition>): Promise<Edition> {
    const response = await apiClientV2.post<{
      status: string;
      data: Edition;
    }>(`/competitions/${competitionId}/editions`, data);
    return response.data.data;
  },

  /**
   * Create bulk editions (requires auth)
   * POST /competitions/:competitionId/editions/bulk
   */
  async createBulk(competitionId: string, years: number[]): Promise<Edition[]> {
    const response = await apiClientV2.post<{
      status: string;
      data: Edition[];
    }>(`/competitions/${competitionId}/editions/bulk`, { years });
    return response.data.data;
  },

  /**
   * Update edition (requires auth)
   * PUT /editions/:id
   */
  async update(id: string, data: Partial<Edition>): Promise<Edition> {
    const response = await apiClientV2.put<{
      status: string;
      data: Edition;
    }>(`/editions/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete edition (requires auth)
   * DELETE /editions/:id
   */
  async delete(id: string): Promise<void> {
    await apiClientV2.delete(`/editions/${id}`);
  },

  /**
   * Toggle edition active status (requires auth)
   * POST /editions/:id/toggle-active
   */
  async toggleActive(id: string): Promise<Edition> {
    const response = await apiClientV2.post<{
      status: string;
      data: Edition;
    }>(`/editions/${id}/toggle-active`);
    return response.data.data;
  },

  /**
   * Get available years for a competition
   * CORREGIDO: Extrae años de las ediciones
   */
  async getAvailableYears(competitionId: string): Promise<number[]> {
    const editions = await this.getByCompetition(competitionId);
    return editions.map(e => e.year).sort((a, b) => b - a);
  },

  /**
   * Get latest edition for a competition
   * CORREGIDO: Obtiene la más reciente de las ediciones
   */
  async getLatestEdition(competitionId: string): Promise<Edition | null> {
    const editions = await this.getByCompetition(competitionId, { sortOrder: 'desc' });
    return editions.length > 0 ? editions[0] : null;
  },
};

export default editionsService;