// types/podium.ts - Tipos para el sistema de podios

/**
 * Tipos de podio
 */
export enum PodiumType {
  GENERAL = 'GENERAL',
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  CATEGORY = 'CATEGORY',
}

/**
 * Podio de una edición
 */
export interface EditionPodium {
  id: string;
  editionId: string;
  type: PodiumType;
  categoryName?: string;

  // Top 3
  firstPlace: string;
  firstTime?: string;

  secondPlace?: string;
  secondTime?: string;

  thirdPlace?: string;
  thirdTime?: string;

  sortOrder: number;

  createdAt: string;
  updatedAt: string;
}

/**
 * DTO para crear podio
 */
export interface CreatePodiumDTO {
  type: PodiumType;
  categoryName?: string;

  firstPlace: string;
  firstTime?: string;

  secondPlace?: string;
  secondTime?: string;

  thirdPlace?: string;
  thirdTime?: string;

  sortOrder?: number;
}

/**
 * DTO para actualizar podio
 */
export interface UpdatePodiumDTO {
  categoryName?: string;

  firstPlace?: string;
  firstTime?: string;

  secondPlace?: string;
  secondTime?: string;

  thirdPlace?: string;
  thirdTime?: string;

  sortOrder?: number;
}

/**
 * Posición del podio
 */
export interface PodiumPosition {
  rank: 1 | 2 | 3;
  runner?: string;
  time?: string;
}

/**
 * Labels para los tipos de podio
 */
export const PODIUM_TYPE_LABELS: Record<PodiumType, string> = {
  [PodiumType.GENERAL]: 'Clasificación General',
  [PodiumType.MALE]: 'Clasificación Masculina',
  [PodiumType.FEMALE]: 'Clasificación Femenina',
  [PodiumType.CATEGORY]: 'Categoría',
};

/**
 * Emojis para medallas
 */
export const MEDAL_EMOJIS = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
} as const;
