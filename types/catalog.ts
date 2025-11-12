// types/catalog.ts - Tipos para catálogos (CompetitionType, TerrainType, SpecialSeries)

/**
 * Tipo de Competición
 */
export interface CompetitionType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Tipo de Terreno
 */
export interface TerrainType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Serie Especial
 */
export interface SpecialSeries {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO genérico para crear catálogo
 */
export interface CreateCatalogDTO {
  name: string;
  description?: string;
  sortOrder?: number;
}

/**
 * DTO específico para crear Serie Especial
 */
export interface CreateSpecialSeriesDTO extends CreateCatalogDTO {
  logoUrl?: string;
  websiteUrl?: string;
}

/**
 * DTO genérico para actualizar catálogo
 */
export interface UpdateCatalogDTO {
  name?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

/**
 * DTO específico para actualizar Serie Especial
 */
export interface UpdateSpecialSeriesDTO extends UpdateCatalogDTO {
  logoUrl?: string;
  websiteUrl?: string;
}

/**
 * Tipos de catálogo disponibles
 */
export type CatalogType = 'competition-types' | 'terrain-types' | 'special-series';
