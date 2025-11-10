import apiClientV2 from '../client-v2';
import {
  Event,
  EventsResponse,
  EventResponse,
  EventStatsResponse,
  CreateEventData,
  UpdateEventData,
  RejectEventData,
  EventFilters,
} from '@/lib/types/event';

class EventsService {
  /**
   * Get all events (public)
   */
  async getAll(filters?: EventFilters): Promise<EventsResponse> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.country) params.append('country', filters.country);
    if (filters?.isFeatured !== undefined) params.append('isFeatured', filters.isFeatured.toString());

    const response = await apiClientV2.get<EventsResponse>(`/events?${params.toString()}`);
    return response.data;
  }

  /**
   * Get my events (authenticated user)
   */
  async getMyEvents(filters?: EventFilters): Promise<EventsResponse> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.country) params.append('country', filters.country);

    const response = await apiClientV2.get<EventsResponse>(`/events/my-events?${params.toString()}`);
    return response.data;
  }

  /**
   * Get pending events (admin only)
   */
  async getPendingEvents(filters?: EventFilters): Promise<EventsResponse> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.country) params.append('country', filters.country);
    if (filters?.organizerId) params.append('organizerId', filters.organizerId);

    const response = await apiClientV2.get<EventsResponse>(`/events/pending?${params.toString()}`);
    return response.data;
  }

  /**
   * Get event statistics
   */
  async getStats(): Promise<EventStatsResponse> {
    const response = await apiClientV2.get<EventStatsResponse>('/events/stats');
    return response.data;
  }

  /**
   * Get event by ID
   */
  async getById(id: string): Promise<EventResponse> {
    const response = await apiClientV2.get<EventResponse>(`/events/${id}`);
    return response.data;
  }

  /**
   * Get event by slug
   */
  async getBySlug(slug: string): Promise<EventResponse> {
    const response = await apiClientV2.get<EventResponse>(`/events/slug/${slug}`);
    return response.data;
  }

  /**
   * Check if slug is available
   */
  async checkSlug(slug: string, excludeId?: string): Promise<{ available: boolean }> {
    const params = new URLSearchParams();
    if (excludeId) params.append('excludeId', excludeId);
    
    const response = await apiClientV2.get<{ status: string; data: { available: boolean } }>(
      `/events/check-slug/${slug}?${params.toString()}`
    );
    return response.data.data;
  }

  /**
   * Create event
   */
  async create(data: CreateEventData): Promise<EventResponse> {
    const response = await apiClientV2.post<EventResponse>('/events', data);
    return response.data;
  }

  /**
   * Update event
   */
  async update(id: string, data: UpdateEventData): Promise<EventResponse> {
    const response = await apiClientV2.put<EventResponse>(`/events/${id}`, data);
    return response.data;
  }

  /**
   * Delete event
   */
  async delete(id: string): Promise<{ status: string; message: string }> {
    const response = await apiClientV2.delete<{ status: string; message: string }>(`/events/${id}`);
    return response.data;
  }

  /**
   * Approve event (admin only)
   */
  async approve(id: string): Promise<EventResponse> {
    const response = await apiClientV2.post<EventResponse>(`/events/${id}/approve`);
    return response.data;
  }

  /**
   * Reject event (admin only)
   */
  async reject(id: string, data?: RejectEventData): Promise<EventResponse> {
    const response = await apiClientV2.post<EventResponse>(`/events/${id}/reject`, data || {});
    return response.data;
  }

  /**
   * Toggle featured status (admin only)
   */
  async toggleFeatured(id: string): Promise<EventResponse> {
    const response = await apiClientV2.patch<EventResponse>(`/events/${id}/featured`);
    return response.data;
  }
}

export default new EventsService();
