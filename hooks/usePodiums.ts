// hooks/usePodiums.ts - Hook para gestionar podios

'use client';

import { useState, useEffect, useCallback } from 'react';
import podiumsService from '@/lib/api/podiums.service';
import type { EditionPodium, CreatePodiumDTO, PodiumType } from '@/types/podium';
import { toast } from 'sonner';

export function usePodiums(editionId: string) {
  const [podiums, setPodiums] = useState<EditionPodium[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPodiums = useCallback(
    async (type?: PodiumType) => {
      setLoading(true);
      setError(null);

      try {
        const data = await podiumsService.getByEdition(editionId, type);
        setPodiums(data);
      } catch (err: any) {
        console.error('Error fetching podiums:', err);
        setError(err.message || 'Error al cargar podios');
      } finally {
        setLoading(false);
      }
    },
    [editionId]
  );

  useEffect(() => {
    fetchPodiums();
  }, [fetchPodiums]);

  const createPodium = useCallback(
    async (data: CreatePodiumDTO) => {
      try {
        const newPodium = await podiumsService.create(editionId, data);
        setPodiums((prev) => [...prev, newPodium]);
        toast.success('Podio creado correctamente');
        return newPodium;
      } catch (err: any) {
        console.error('Error creating podium:', err);
        toast.error(err.response?.data?.message || 'Error al crear podio');
        throw err;
      }
    },
    [editionId]
  );

  const updatePodium = useCallback(
    async (
      podiumId: string,
      data: Parameters<typeof podiumsService.update>[1]
    ) => {
      try {
        const updated = await podiumsService.update(podiumId, data);
        setPodiums((prev) => prev.map((p) => (p.id === podiumId ? updated : p)));
        toast.success('Podio actualizado correctamente');
        return updated;
      } catch (err: any) {
        console.error('Error updating podium:', err);
        toast.error(err.response?.data?.message || 'Error al actualizar podio');
        throw err;
      }
    },
    []
  );

  const deletePodium = useCallback(async (podiumId: string) => {
    try {
      await podiumsService.delete(podiumId);
      setPodiums((prev) => prev.filter((p) => p.id !== podiumId));
      toast.success('Podio eliminado correctamente');
    } catch (err: any) {
      console.error('Error deleting podium:', err);
      toast.error(err.response?.data?.message || 'Error al eliminar podio');
      throw err;
    }
  }, []);

  // Agrupar podios por tipo
  const podiumsByType = {
    general: podiums.find((p) => p.type === 'GENERAL'),
    male: podiums.find((p) => p.type === 'MALE'),
    female: podiums.find((p) => p.type === 'FEMALE'),
    categories: podiums.filter((p) => p.type === 'CATEGORY'),
  };

  return {
    podiums,
    podiumsByType,
    loading,
    error,
    refetch: fetchPodiums,
    createPodium,
    updatePodium,
    deletePodium,
  };
}
