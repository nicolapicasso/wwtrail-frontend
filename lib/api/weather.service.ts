// lib/api/weather.service.ts - Servicio para el sistema de meteo

import { apiClientV2 } from './client';
import type { EditionWeather } from '@/types/weather';

export const weatherService = {
  /**
   * Obtener datos meteorológicos de una edición
   * GET /api/v2/editions/:editionId/weather
   */
  async getByEdition(editionId: string): Promise<EditionWeather | null> {
    try {
      const response = await apiClientV2.get(`/editions/${editionId}/weather`);
      return response.data.data;
    } catch (error) {
      // Si no hay datos de meteo, retornar null
      return null;
    }
  },

  /**
   * Refetch de datos meteorológicos (admin)
   * POST /api/v2/editions/:editionId/weather/refetch
   */
  async refetch(editionId: string): Promise<EditionWeather> {
    const response = await apiClientV2.post(`/editions/${editionId}/weather/refetch`);
    return response.data.data;
  },
};

export default weatherService;
