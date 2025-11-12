// lib/api/catalogs.service.ts - Servicio para catálogos (CompetitionType, TerrainType, SpecialSeries)

import { apiClientV2 } from './client';
import type {
  CompetitionType,
  TerrainType,
  SpecialSeries,
  CreateCatalogDTO,
  CreateSpecialSeriesDTO,
  UpdateCatalogDTO,
  UpdateSpecialSeriesDTO,
  CatalogType,
} from '@/types/catalog';

/**
 * Servicio genérico para catálogos
 */
class CatalogService<T> {
  constructor(private endpoint: string) {}

  /**
   * Obtener todos los elementos
   * GET /api/v2/{endpoint}
   */
  async getAll(activeOnly: boolean = false): Promise<T[]> {
    const response = await apiClientV2.get(`/${this.endpoint}`, {
      params: { isActive: activeOnly ? 'true' : undefined },
    });
    return response.data.data;
  },

  /**
   * Obtener por ID
   * GET /api/v2/{endpoint}/:id
   */
  async getById(id: string): Promise<T> {
    const response = await apiClientV2.get(`/${this.endpoint}/${id}`);
    return response.data.data;
  },

  /**
   * Crear (admin)
   * POST /api/v2/admin/{endpoint}
   */
  async create(data: CreateCatalogDTO | CreateSpecialSeriesDTO): Promise<T> {
    const response = await apiClientV2.post(`/admin/${this.endpoint}`, data);
    return response.data.data;
  },

  /**
   * Actualizar (admin)
   * PUT /api/v2/admin/{endpoint}/:id
   */
  async update(id: string, data: UpdateCatalogDTO | UpdateSpecialSeriesDTO): Promise<T> {
    const response = await apiClientV2.put(`/admin/${this.endpoint}/${id}`, data);
    return response.data.data;
  },

  /**
   * Eliminar (admin)
   * DELETE /api/v2/admin/{endpoint}/:id
   */
  async delete(id: string): Promise<void> {
    await apiClientV2.delete(`/admin/${this.endpoint}/${id}`);
  },

  /**
   * Obtener todos (admin)
   * GET /api/v2/admin/{endpoint}
   */
  async getAllAdmin(): Promise<T[]> {
    const response = await apiClientV2.get(`/admin/${this.endpoint}`);
    return response.data.data;
  },
}

/**
 * Servicio de Tipos de Competición
 */
export const competitionTypesService = new CatalogService<CompetitionType>('competition-types');

/**
 * Servicio de Tipos de Terreno
 */
export const terrainTypesService = new CatalogService<TerrainType>('terrain-types');

/**
 * Servicio de Series Especiales
 */
export const specialSeriesService = new CatalogService<SpecialSeries>('special-series');

/**
 * Exportar servicios por nombre
 */
export const catalogsService = {
  competitionTypes: competitionTypesService,
  terrainTypes: terrainTypesService,
  specialSeries: specialSeriesService,
};

export default catalogsService;
