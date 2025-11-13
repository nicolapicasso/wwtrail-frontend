// hooks/useWeather.ts - Hook para gestionar datos meteorológicos

'use client';

import { useState, useEffect, useCallback } from 'react';
import weatherService from '@/lib/api/weather.service';
import type { EditionWeather } from '@/types/weather';
import { toast } from 'sonner';

export function useWeather(editionId: string) {
  const [weather, setWeather] = useState<EditionWeather | null>(null);
  const [weatherFetched, setWeatherFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await weatherService.getByEdition(editionId);
      setWeather(data.weather);
      setWeatherFetched(data.weatherFetched);
    } catch (err: any) {
      console.error('Error loading weather:', err);
      setError(err.message || 'Error al cargar datos meteorológicos');
    } finally {
      setLoading(false);
    }
  }, [editionId]);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  const fetchWeather = useCallback(async (force: boolean = false) => {
    setFetching(true);

    try {
      const data = await weatherService.fetch(editionId, force);
      setWeather(data);
      setWeatherFetched(true);
      toast.success('Datos meteorológicos obtenidos correctamente');
      return data;
    } catch (err: any) {
      console.error('Error fetching weather:', err);
      const errorMessage = err.response?.data?.message || 'Error al obtener datos meteorológicos';
      toast.error(errorMessage);
      throw err;
    } finally {
      setFetching(false);
    }
  }, [editionId]);

  return {
    weather,
    weatherFetched,
    loading,
    fetching,
    error,
    fetchWeather,
    reload: loadWeather,
  };
}
