// hooks/useRatings.ts - Hook para gestionar ratings

'use client';

import { useState, useEffect, useCallback } from 'react';
import ratingsService from '@/lib/api/ratings.service';
import type { EditionRating, RatingsResponse } from '@/types/rating';
import { toast } from 'sonner';

export function useRatings(editionId: string) {
  const [ratings, setRatings] = useState<EditionRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<RatingsResponse['pagination'] | null>(null);

  const fetchRatings = useCallback(
    async (page: number = 1, limit: number = 20) => {
      setLoading(true);
      setError(null);

      try {
        const response = await ratingsService.getByEdition(editionId, {
          page,
          limit,
        });
        setRatings(response.data);
        setPagination(response.pagination || null);
      } catch (err: any) {
        console.error('Error fetching ratings:', err);
        setError(err.message || 'Error al cargar valoraciones');
      } finally {
        setLoading(false);
      }
    },
    [editionId]
  );

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const createRating = useCallback(
    async (data: Parameters<typeof ratingsService.create>[1]) => {
      try {
        const newRating = await ratingsService.create(editionId, data);
        setRatings((prev) => [newRating, ...prev]);
        toast.success('Valoración creada correctamente');
        return newRating;
      } catch (err: any) {
        console.error('Error creating rating:', err);
        toast.error(err.response?.data?.message || 'Error al crear valoración');
        throw err;
      }
    },
    [editionId]
  );

  const updateRating = useCallback(
    async (
      ratingId: string,
      data: Parameters<typeof ratingsService.update>[1]
    ) => {
      try {
        const updated = await ratingsService.update(ratingId, data);
        setRatings((prev) =>
          prev.map((r) => (r.id === ratingId ? updated : r))
        );
        toast.success('Valoración actualizada correctamente');
        return updated;
      } catch (err: any) {
        console.error('Error updating rating:', err);
        toast.error(err.response?.data?.message || 'Error al actualizar valoración');
        throw err;
      }
    },
    []
  );

  const deleteRating = useCallback(async (ratingId: string) => {
    try {
      await ratingsService.delete(ratingId);
      setRatings((prev) => prev.filter((r) => r.id !== ratingId));
      toast.success('Valoración eliminada correctamente');
    } catch (err: any) {
      console.error('Error deleting rating:', err);
      toast.error(err.response?.data?.message || 'Error al eliminar valoración');
      throw err;
    }
  }, []);

  return {
    ratings,
    loading,
    error,
    pagination,
    refetch: fetchRatings,
    createRating,
    updateRating,
    deleteRating,
  };
}

/**
 * Hook para obtener ratings recientes (homepage)
 */
export function useRecentRatings(limit: number = 10) {
  const [ratings, setRatings] = useState<EditionRating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await ratingsService.getRecent(limit);
        setRatings(data);
      } catch (error) {
        console.error('Error fetching recent ratings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, [limit]);

  return { ratings, loading };
}
