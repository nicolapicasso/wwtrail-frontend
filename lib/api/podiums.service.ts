// lib/api/podiums.service.ts - Servicio para el sistema de podios

import { apiClientV2 } from './client';
import type {
  EditionPodium,
  CreatePodiumDTO,
  UpdatePodiumDTO,
  PodiumType,
} from '@/types/podium';

export const podiumsService = {
  /**
   * Crear un podio para una edición
   * POST /api/v2/editions/:editionId/podiums
   */
  async create(editionId: string, data: CreatePodiumDTO): Promise<EditionPodium> {
    const response = await apiClientV2.post(`/editions/${editionId}/podiums`, data);
    return response.data.data;
  },

  /**
   * Obtener podios de una edición
   * GET /api/v2/editions/:editionId/podiums
   */
  async getByEdition(
    editionId: string,
    type?: PodiumType
  ): Promise<EditionPodium[]> {
    const response = await apiClientV2.get(`/editions/${editionId}/podiums`, {
      params: type ? { type } : undefined,
    });
    return response.data.data;
  },

  /**
   * Obtener un podio específico
   * GET /api/v2/podiums/:id
   */
  async getById(id: string): Promise<EditionPodium> {
    const response = await apiClientV2.get(`/podiums/${id}`);
    return response.data.data;
  },

  /**
   * Actualizar un podio
   * PUT /api/v2/podiums/:id
   */
  async update(id: string, data: UpdatePodiumDTO): Promise<EditionPodium> {
    const response = await apiClientV2.put(`/podiums/${id}`, data);
    return response.data.data;
  },

  /**
   * Eliminar un podio
   * DELETE /api/v2/podiums/:id
   */
  async delete(id: string): Promise<void> {
    await apiClientV2.delete(`/podiums/${id}`);
  },
};

export default podiumsService;
