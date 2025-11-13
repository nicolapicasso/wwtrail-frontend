// lib/api/weather.service.ts - Servicio para el sistema de meteo

import { apiClientV2 } from './client';
import type { EditionWeather } from '@/types/weather';

/**
 * Respuesta del GET /weather que incluye si fue fetched o no
 */
export interface WeatherResponse {
  weather: EditionWeather | null;
  weatherFetched: boolean;
}

export const weatherService = {
  /**
   * Obtener datos meteorológicos de una edición
   * GET /api/v2/editions/:editionId/weather
   * Returns: { weather: EditionWeather | null, weatherFetched: boolean }
   */
  async getByEdition(editionId: string): Promise<WeatherResponse> {
    try {
      const response = await apiClientV2.get(`/editions/${editionId}/weather`);
      return response.data.data;
    } catch (error) {
      // Si no hay datos de meteo, retornar null
      return { weather: null, weatherFetched: false };
    }
  },

  /**
   * Fetch de datos meteorológicos desde Open-Meteo (admin only)
   * POST /api/v2/editions/:editionId/weather/fetch
   * @param force - Si true, refetch aunque ya existan datos
   */
  async fetch(editionId: string, force: boolean = false): Promise<EditionWeather> {
    const url = `/editions/${editionId}/weather/fetch${force ? '?force=true' : ''}`;
    const response = await apiClientV2.post(url);
    return response.data.data;
  },
};

export default weatherService;
