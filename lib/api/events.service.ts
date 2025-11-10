/**
 * 🔧 EVENTS SERVICE V1 - Para páginas públicas
 * ============================================
 * ✅ FIX: Agregado soporte para parámetro featured
 */

import { apiClientV1 } from './client';
import { Event } from '@/types/api';

// ============================================================================
// 📦 TIPOS - V1 específicos
// ============================================================================

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface EventsResponseV1 {
  data: {
    events: Event[];
  };
  pagination: PaginationData;
}

export interface EventResponseV1 {
  data: {
    event: Event;
  };
}

export interface EventFilters {
  country?: string;
  type?: 'TRAIL' | 'ULTRA' | 'SKYRUNNING' | 'VERTICAL' | 'OTHERS';
  search?: string;
  page?: number;
  limit?: number;
  featured?: boolean | string;  // ✅ AGREGADO
}

// ============================================================================
// 📡 SERVICE
// ============================================================================

export const eventsService = {
  /**
   * Obtener lista de eventos con paginación (V1)
   * GET /api/v1/events
   */
  async getAll(filters: EventFilters = {}): Promise<EventsResponseV1> {
    const params = new URLSearchParams();
    
    if (filters.country) params.append('country', filters.country);
    if (filters.type) params.append('type', filters.type);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    // ✅ FIX CRÍTICO: Agregar featured
    if (filters.featured !== undefined && filters.featured !== null) {
      params.append('featured', filters.featured.toString());
    }

    const { data } = await apiClientV1.get('/events', { params });
    
    // ✅ ADAPTACIÓN: Backend devuelve { data: [...] }, adaptamos a { data: { events: [...] } }
    return {
      data: {
        events: Array.isArray(data.data) ? data.data : []
      },
      pagination: data.pagination || {
        page: 1,
        limit: 12,
        total: 0,
        pages: 0
      }
    };
  },

  async getById(id: string): Promise<Event> {
    const { data } = await apiClientV1.get<EventResponseV1>(`/events/${id}`);
    return data.data;
  },

  async getBySlug(slug: string): Promise<Event> {
    const { data } = await apiClientV1.get<EventResponseV1>(`/events/slug/${slug}`);
    return data.data;
  },

  async getNearby(lat: number, lon: number, radius: number = 50): Promise<Event[]> {
    const { data } = await apiClientV1.get<{ data: { events: Event[] } }>(
      '/events/nearby',
      {
        params: { lat, lon, radius }
      }
    );
    return data.data.events;
  },

  async search(query: string): Promise<Event[]> {
    const { data } = await apiClientV1.get<{ data: { events: Event[] } }>(
      '/events/search',
      {
        params: { q: query }
      }
    );
    return data.data.events;
  },

  async getFeatured(): Promise<Event[]> {
    const { data } = await apiClientV1.get<{ data: { events: Event[] } }>('/events/featured');
    return data.data.events;
  },

  async getUpcoming(): Promise<Event[]> {
    const { data } = await apiClientV1.get<{ data: { events: Event[] } }>('/events/upcoming');
    return data.data.events;
  }
};

export type { EventsResponseV1, EventResponseV1, EventFilters };

/*
✅ CAMBIO APLICADO:
- Agregado featured?: boolean | string en EventFilters
- Agregado if (filters.featured) params.append('featured', ...)
- Ahora getAll() pasa el parámetro featured al backend

RESULTADO:
- Featured events section funcionará correctamente
- Backend recibirá: /api/v1/events?featured=true&limit=6
- Devolverá solo 2 eventos featured
*/