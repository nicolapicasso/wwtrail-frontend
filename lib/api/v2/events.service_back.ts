// lib/api/v2/events.service.ts
import { apiClientV2 } from '../client';  // ✅ CORREGIDO

export interface Event {
  id: string;
  name: string;
  slug: string;
  city: string;
  country: string;
  description?: string;
  website?: string;
  firstEditionYear: number;
  featured: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  organizerId: string;
}

export interface CreateEventData {
  name: string;
  slug: string;
  city: string;
  country: string;
  description?: string;
  website?: string;
  firstEditionYear: number;
  featured?: boolean;
  latitude?: number;
  longitude?: number;
}

export const eventsService = {
  /**
   * Crear nuevo evento
   */
  async create(data: CreateEventData): Promise<Event> {
    const response = await apiClientV2.post('/events', data);
    return response.data.data;
  },

  /**
   * Verificar disponibilidad de slug
   */
  async checkSlug(slug: string, excludeId?: string): Promise<{ slug: string; available: boolean }> {
    const params = excludeId ? { excludeId } : {};
    const response = await apiClientV2.get(`/events/check-slug/${slug}`, { params });
    return response.data.data;
  },

  /**
   * Listar eventos
   */
  async getAll(params?: any): Promise<{ data: Event[]; pagination: any }> {
    const response = await apiClientV2.get('/events', { params });
    return response.data;
  },

  /**
   * Obtener evento por ID
   */
  async getById(id: string): Promise<Event> {
    const response = await apiClientV2.get(`/events/${id}`);
    return response.data.data;
  },

  /**
   * Obtener evento por slug
   */
  async getBySlug(slug: string): Promise<Event> {
    const response = await apiClientV2.get(`/events/slug/${slug}`);
    return response.data.data;
  },

  /**
   * Actualizar evento
   */
  async update(id: string, data: Partial<CreateEventData>): Promise<Event> {
    const response = await apiClientV2.put(`/events/${id}`, data);
    return response.data.data;
  },

  /**
   * Eliminar evento
   */
  async delete(id: string): Promise<void> {
    await apiClientV2.delete(`/events/${id}`);
  },
};