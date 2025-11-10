// hooks/useEvents.ts - Hook for managing events

import { useState, useEffect, useCallback } from 'react';
import { eventsService } from '@/lib/api/v2';
import {
  Event,
  EventDetail,
  EventFilters,
  EventListResponse,
  EventSearchResult,
  EventNearby,
} from '@/types/v2';

/**
 * Hook para obtener lista de eventos con filtros
 */
export function useEvents(filters?: EventFilters) {
  const [data, setData] = useState<EventListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsService.getAll(filters);
      setData(response);
    } catch (err: any) {
      setError(err.message || 'Error loading events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [JSON.stringify(filters)]); // ← MODIFICADO: Usar JSON.stringify para evitar renders innecesarios

  return {
    events: data?.data || [],
    pagination: data?.pagination,
    loading,
    error,
    refetch: fetchEvents,
  };
}

/**
 * Hook para obtener un evento por ID o slug
 * Detecta automáticamente si es UUID o slug
 */
export function useEvent(idOrSlug: string | null) {
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    if (!idOrSlug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Detectar si es UUID (formato: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      
      // Usar método apropiado
      const data = isUUID 
        ? await eventsService.getById(idOrSlug)
        : await eventsService.getBySlug(idOrSlug);
      
      setEvent(data);
    } catch (err: any) {
      setError(err.message || 'Error loading event');
      console.error('Error fetching event:', err);
    } finally {
      setLoading(false);
    }
  }, [idOrSlug]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return {
    event,
    loading,
    error,
    refetch: fetchEvent,
  };
}

/**
 * Hook para obtener un evento por slug
 */
export function useEventBySlug(slug: string | null) {
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await eventsService.getBySlug(slug);
      setEvent(data);
    } catch (err: any) {
      setError(err.message || 'Error loading event');
      console.error('Error fetching event by slug:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return {
    event,
    loading,
    error,
    refetch: fetchEvent,
  };
}

/**
 * Hook para buscar eventos (full-text search)
 */
export function useEventSearch(query: string, limit?: number) {
  const [results, setResults] = useState<EventSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async () => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await eventsService.search({ q: query, limit });
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Error searching events');
      console.error('Error searching events:', err);
    } finally {
      setLoading(false);
    }
  }, [query, limit]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      search();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return {
    results,
    loading,
    error,
  };
}

/**
 * Hook para eventos cercanos (geospatial)
 */
export function useNearbyEvents(lat: number | null, lon: number | null, radius?: number) {
  const [events, setEvents] = useState<EventNearby[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNearby = useCallback(async () => {
    if (lat === null || lon === null) {
      setEvents([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await eventsService.findNearby({ lat, lon, radius });
      setEvents(data);
    } catch (err: any) {
      setError(err.message || 'Error loading nearby events');
      console.error('Error fetching nearby events:', err);
    } finally {
      setLoading(false);
    }
  }, [lat, lon, radius]);

  useEffect(() => {
    fetchNearby();
  }, [fetchNearby]);

  return {
    events,
    loading,
    error,
    refetch: fetchNearby,
  };
}

/**
 * Hook para eventos destacados
 */
export function useFeaturedEvents(limit?: number) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatured = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventsService.getFeatured(limit);
      setEvents(data);
    } catch (err: any) {
      setError(err.message || 'Error loading featured events');
      console.error('Error fetching featured events:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return {
    events,
    loading,
    error,
    refetch: fetchFeatured,
  };
}

/**
 * Hook para eventos por país
 */
export function useEventsByCountry(country: string | null, options?: { page?: number; limit?: number }) {
  const [data, setData] = useState<EventListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!country) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await eventsService.getByCountry(country, options);
      setData(response);
    } catch (err: any) {
      setError(err.message || 'Error loading events by country');
      console.error('Error fetching events by country:', err);
    } finally {
      setLoading(false);
    }
  }, [country, options]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events: data?.data || [],
    pagination: data?.pagination,
    loading,
    error,
    refetch: fetchEvents,
  };
}
