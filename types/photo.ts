// types/photo.ts - Tipos para el sistema de galería de fotos

/**
 * Foto de una edición
 */
export interface EditionPhoto {
  id: string;
  editionId: string;

  url: string;
  thumbnail?: string;
  caption?: string;
  photographer?: string;

  // Metadata
  width?: number;
  height?: number;
  fileSize?: number;
  mimeType?: string;

  sortOrder: number;
  isFeatured: boolean;

  createdAt: string;
  updatedAt: string;
}

/**
 * DTO para upload de foto
 */
export interface UploadPhotoDTO {
  caption?: string;
  photographer?: string;
  isFeatured?: boolean;
}

/**
 * DTO para actualizar foto
 */
export interface UpdatePhotoDTO {
  caption?: string;
  photographer?: string;
  isFeatured?: boolean;
  sortOrder?: number;
}

/**
 * DTO para reordenar fotos
 */
export interface ReorderPhotosDTO {
  photoIds: string[];
}

/**
 * Configuración de upload
 */
export const PHOTO_UPLOAD_CONFIG = {
  maxFiles: 10,
  maxSize: 10 * 1024 * 1024, // 10 MB
  acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  maxPhotosPerEdition: 50,
} as const;
