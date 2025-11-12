// hooks/usePhotos.ts - Hook para gestionar fotos

'use client';

import { useState, useEffect, useCallback } from 'react';
import photosService from '@/lib/api/photos.service';
import type { EditionPhoto, UploadPhotoDTO } from '@/types/photo';
import { toast } from 'sonner';

export function usePhotos(editionId: string) {
  const [photos, setPhotos] = useState<EditionPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = useCallback(
    async (featuredOnly: boolean = false) => {
      setLoading(true);
      setError(null);

      try {
        const data = await photosService.getByEdition(editionId, featuredOnly);
        setPhotos(data);
      } catch (err: any) {
        console.error('Error fetching photos:', err);
        setError(err.message || 'Error al cargar fotos');
      } finally {
        setLoading(false);
      }
    },
    [editionId]
  );

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const uploadPhotos = useCallback(
    async (files: File[], metadata: UploadPhotoDTO = {}) => {
      setUploading(true);

      try {
        const newPhotos = await photosService.upload(editionId, files, metadata);
        setPhotos((prev) => [...prev, ...newPhotos]);
        toast.success(`${newPhotos.length} fotos subidas correctamente`);
        return newPhotos;
      } catch (err: any) {
        console.error('Error uploading photos:', err);
        toast.error(err.response?.data?.message || 'Error al subir fotos');
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [editionId]
  );

  const updatePhoto = useCallback(
    async (photoId: string, data: Parameters<typeof photosService.update>[1]) => {
      try {
        const updated = await photosService.update(photoId, data);
        setPhotos((prev) => prev.map((p) => (p.id === photoId ? updated : p)));
        toast.success('Foto actualizada correctamente');
        return updated;
      } catch (err: any) {
        console.error('Error updating photo:', err);
        toast.error(err.response?.data?.message || 'Error al actualizar foto');
        throw err;
      }
    },
    []
  );

  const deletePhoto = useCallback(async (photoId: string) => {
    try {
      await photosService.delete(photoId);
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      toast.success('Foto eliminada correctamente');
    } catch (err: any) {
      console.error('Error deleting photo:', err);
      toast.error(err.response?.data?.message || 'Error al eliminar foto');
      throw err;
    }
  }, []);

  const reorderPhotos = useCallback(
    async (photoIds: string[]) => {
      try {
        await photosService.reorder(editionId, { photoIds });
        // Reordenar localmente
        const ordered = photoIds.map((id) => photos.find((p) => p.id === id)!);
        setPhotos(ordered);
        toast.success('Orden actualizado correctamente');
      } catch (err: any) {
        console.error('Error reordering photos:', err);
        toast.error(err.response?.data?.message || 'Error al reordenar fotos');
        throw err;
      }
    },
    [editionId, photos]
  );

  const featuredPhoto = photos.find((p) => p.isFeatured);

  return {
    photos,
    featuredPhoto,
    loading,
    uploading,
    error,
    refetch: fetchPhotos,
    uploadPhotos,
    updatePhoto,
    deletePhoto,
    reorderPhotos,
  };
}
