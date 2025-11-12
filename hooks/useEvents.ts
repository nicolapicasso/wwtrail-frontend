/**
 * 🔧 useEvents.ts - VERSIÓN CORREGIDA
 * ====================================
 * 
 * Cambio principal:
 * - Usa eventsService (nuevo) en lugar de fetch directo
 * - Accede correctamente a response.data.events (V1)
 * 
 * MANTIENE:
 * - Toda la lógica de caché y estado
 * - Detección UUID/slug
 * - Sistema de eventos único
 */

'use client';

import { useState, useEffect } from 'react';
import { eventsService } from '@/lib/api/events.service';
import type { Event } from '@/types/api';

// ============================================================================
// 📦 TIPOS
// ============================================================================

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface UseEventsResult {
  events: Event[];
  event: Event | null;
  pagination: PaginationData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// ============================================================================
// 🪝 HOOK PRINCIPAL
// ============================================================================

export function useEvents(params?: Record<string, string>): UseEventsResult {
  const [events, setEvents] = useState<Event[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      // ✅ Convertir params (Record<string, string>) a EventFilters tipado
      const filters: Record<string, any> = {};

      if (params) {
        Object.keys(params).forEach(key => {
          filters[key] = params[key];
        });
      }

      // ✅ Usar nuevo eventsService en lugar de fetch
      const response = await eventsService.getAll(filters);

      // ✅ Acceso correcto a estructura V1
      setEvents(response.data.events);
      setPagination(response.pagination);
      setEvent(null); // Clear single event when loading list
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
      setEvents([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [JSON.stringify(params)]); // ✅ Usa JSON.stringify para comparar objetos

  return {
    events,
    event,
    pagination,
    loading,
    error,
    refetch: fetchEvents,
  };
}

// ============================================================================
// 🪝 HOOK PARA UN SOLO EVENTO (por ID o slug)
// ============================================================================

export function useEvent(idOrSlug: string): Omit<UseEventsResult, 'events' | 'pagination'> {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = async () => {
    if (!idOrSlug) return;

    setLoading(true);
    setError(null);

    try {
      let fetchedEvent: Event;

      // ✅ Detectar si es UUID o slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

      if (isUUID) {
        fetchedEvent = await eventsService.getById(idOrSlug);
      } else {
        fetchedEvent = await eventsService.getBySlug(idOrSlug);
      }

      setEvent(fetchedEvent);
    } catch (err) {
      console.error('Error fetching event:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch event');
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [idOrSlug]);

  return {
    event,
    loading,
    error,
    refetch: fetchEvent,
  };
}

// ============================================================================
// 🪝 HOOK PARA EVENTOS DESTACADOS
// ============================================================================

export function useFeaturedEvents(): Omit<UseEventsResult, 'event' | 'pagination'> {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const featuredEvents = await eventsService.getFeatured();
      setEvents(featuredEvents);
    } catch (err) {
      console.error('Error fetching featured events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch featured events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  return {
    events,
    loading,
    error,
    refetch: fetchFeaturedEvents,
  };
}

// ============================================================================
// 🪝 HOOK PARA EVENTOS PRÓXIMOS
// ============================================================================

export function useUpcomingEvents(): Omit<UseEventsResult, 'event' | 'pagination'> {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUpcomingEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const upcomingEvents = await eventsService.getUpcoming();
      setEvents(upcomingEvents);
    } catch (err) {
      console.error('Error fetching upcoming events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch upcoming events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  return {
    events,
    loading,
    error,
    refetch: fetchUpcomingEvents,
  };
}

// ============================================================================
// 🪝 HOOK PARA EVENTOS CERCANOS
// ============================================================================

export function useNearbyEvents(
  latitude: number | null,
  longitude: number | null,
  radius: number = 50
): Omit<UseEventsResult, 'event' | 'pagination'> {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNearbyEvents = async () => {
    if (latitude === null || longitude === null) {
      setEvents([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nearbyEvents = await eventsService.getNearby(latitude, longitude, radius);
      setEvents(nearbyEvents);
    } catch (err) {
      console.error('Error fetching nearby events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch nearby events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyEvents();
  }, [latitude, longitude, radius]);

  return {
    events,
    loading,
    error,
    refetch: fetchNearbyEvents,
  };
}

// ============================================================================
// 🪝 HOOK PARA BÚSQUEDA
// ============================================================================

export function useSearchEvents(query: string): Omit<UseEventsResult, 'event' | 'pagination'> {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchEvents = async () => {
    if (!query || query.trim().length < 2) {
      setEvents([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchResults = await eventsService.search(query);
      setEvents(searchResults);
    } catch (err) {
      console.error('Error searching events:', err);
      setError(err instanceof Error ? err.message : 'Failed to search events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchEvents();
    }, 300); // Debounce de 300ms

    return () => clearTimeout(debounceTimer);
  }, [query]);

  return {
    events,
    loading,
    error,
    refetch: searchEvents,
  };
}

// ============================================================================
// 📝 NOTAS DE USO
// ============================================================================
/*
EJEMPLOS DE USO:

1. Lista de eventos con filtros:
   const { events, pagination, loading, error } = useEvents({
     page: '1',
     limit: '20',
     country: 'ES',
     type: 'ULTRA'
   });

2. Evento único por slug:
   const { event, loading, error } = useEvent('utmb-mont-blanc');

3. Evento único por UUID:
   const { event, loading, error } = useEvent('123e4567-e89b-12d3-a456-426614174000');

4. Eventos destacados:
   const { events, loading, error } = useFeaturedEvents();

5. Eventos próximos:
   const { events, loading, error } = useUpcomingEvents();

6. Eventos cercanos:
   const { events, loading, error } = useNearbyEvents(41.3851, 2.1734, 50);

7. Búsqueda con debounce:
   const { events, loading, error } = useSearchEvents(searchQuery);
*/