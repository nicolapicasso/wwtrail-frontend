// hooks/useWeather.ts - Hook para gestionar datos meteorológicos

'use client';

import { useState, useEffect, useCallback } from 'react';
import weatherService from '@/lib/api/weather.service';
import type { EditionWeather } from '@/types/weather';
import { toast } from 'sonner';

export function useWeather(editionId: string) {
  const [weather, setWeather] = useState<EditionWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await weatherService.getByEdition(editionId);
      setWeather(data);
    } catch (err: any) {
      console.error('Error fetching weather:', err);
      setError(err.message || 'Error al cargar datos meteorológicos');
    } finally {
      setLoading(false);
    }
  }, [editionId]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const refetch = useCallback(async () => {
    setRefetching(true);

    try {
      const data = await weatherService.refetch(editionId);
      setWeather(data);
      toast.success('Datos meteorológicos actualizados correctamente');
      return data;
    } catch (err: any) {
      console.error('Error refetching weather:', err);
      toast.error(
        err.response?.data?.message ||
          'Error al actualizar datos meteorológicos'
      );
      throw err;
    } finally {
      setRefetching(false);
    }
  }, [editionId]);

  return {
    weather,
    loading,
    refetching,
    error,
    refetch,
  };
}
