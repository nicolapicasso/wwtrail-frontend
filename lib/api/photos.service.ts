// lib/api/photos.service.ts - Servicio para el sistema de galería de fotos

import { apiClientV2 } from './client';
import type {
  EditionPhoto,
  UploadPhotoDTO,
  UpdatePhotoDTO,
  ReorderPhotosDTO,
} from '@/types/photo';

export const photosService = {
  /**
   * Upload de fotos para una edición
   * POST /api/v2/editions/:editionId/photos
   */
  async upload(
    editionId: string,
    files: File[],
    metadata: UploadPhotoDTO
  ): Promise<EditionPhoto[]> {
    const formData = new FormData();

    // Añadir archivos
    files.forEach((file) => {
      formData.append('photos', file);
    });

    // Añadir metadata
    if (metadata.caption) formData.append('caption', metadata.caption);
    if (metadata.photographer) formData.append('photographer', metadata.photographer);
    if (metadata.isFeatured !== undefined)
      formData.append('isFeatured', String(metadata.isFeatured));

    const response = await apiClientV2.post(
      `/editions/${editionId}/photos`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data;
  },

  /**
   * Obtener fotos de una edición
   * GET /api/v2/editions/:editionId/photos
   */
  async getByEdition(
    editionId: string,
    featuredOnly: boolean = false
  ): Promise<EditionPhoto[]> {
    const response = await apiClientV2.get(`/editions/${editionId}/photos`, {
      params: featuredOnly ? { featured: 'true' } : undefined,
    });
    return response.data.data;
  },

  /**
   * Obtener una foto específica
   * GET /api/v2/photos/:id
   */
  async getById(id: string): Promise<EditionPhoto> {
    const response = await apiClientV2.get(`/photos/${id}`);
    return response.data.data;
  },

  /**
   * Actualizar una foto
   * PUT /api/v2/photos/:id
   */
  async update(id: string, data: UpdatePhotoDTO): Promise<EditionPhoto> {
    const response = await apiClientV2.put(`/photos/${id}`, data);
    return response.data.data;
  },

  /**
   * Eliminar una foto
   * DELETE /api/v2/photos/:id
   */
  async delete(id: string): Promise<void> {
    await apiClientV2.delete(`/photos/${id}`);
  },

  /**
   * Reordenar fotos
   * POST /api/v2/editions/:editionId/photos/reorder
   */
  async reorder(editionId: string, data: ReorderPhotosDTO): Promise<void> {
    await apiClientV2.post(`/editions/${editionId}/photos/reorder`, data);
  },
};

export default photosService;
