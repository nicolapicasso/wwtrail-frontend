// types/rating.ts - Tipos para el sistema de ratings

/**
 * Rating de una edición por un usuario
 */
export interface EditionRating {
  id: string;
  editionId: string;
  userId: string;

  // 7 criterios (1-4 estrellas cada uno)
  ratingInfoBriefing: number;
  ratingRacePack: number;
  ratingVillage: number;
  ratingMarking: number;
  ratingAid: number;
  ratingFinisher: number;
  ratingEco: number;

  comment?: string;

  // Relaciones
  user?: {
    id: string;
    username: string;
    avatar?: string;
  };

  edition?: {
    id: string;
    year: number;
    slug: string;
    competition: {
      id: string;
      name: string;
      slug: string;
      event: {
        id: string;
        name: string;
        slug: string;
      };
    };
  };

  // Calculado
  avgRating?: number;

  createdAt: string;
  updatedAt: string;
}

/**
 * DTO para crear un rating
 */
export interface CreateRatingDTO {
  ratingInfoBriefing: number;
  ratingRacePack: number;
  ratingVillage: number;
  ratingMarking: number;
  ratingAid: number;
  ratingFinisher: number;
  ratingEco: number;
  comment?: string;
}

/**
 * DTO para actualizar un rating
 */
export interface UpdateRatingDTO {
  ratingInfoBriefing?: number;
  ratingRacePack?: number;
  ratingVillage?: number;
  ratingMarking?: number;
  ratingAid?: number;
  ratingFinisher?: number;
  ratingEco?: number;
  comment?: string;
}

/**
 * Resumen de ratings de una edición
 */
export interface RatingSummary {
  avgRating: number;
  totalRatings: number;
  breakdown: {
    infoBriefing: number;
    racePack: number;
    village: number;
    marking: number;
    aid: number;
    finisher: number;
    eco: number;
  };
}

/**
 * Respuesta paginada de ratings
 */
export interface RatingsResponse {
  data: EditionRating[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Criterios de rating con labels
 */
export const RATING_CRITERIA = {
  infoBriefing: {
    key: 'ratingInfoBriefing',
    label: 'Info & Briefing',
    description: 'Calidad de la información previa y briefing',
  },
  racePack: {
    key: 'ratingRacePack',
    label: 'Race Pack',
    description: 'Calidad del pack del corredor',
  },
  village: {
    key: 'ratingVillage',
    label: 'Village/Instalaciones',
    description: 'Calidad de las instalaciones del evento',
  },
  marking: {
    key: 'ratingMarking',
    label: 'Race Marking',
    description: 'Calidad del marcaje del recorrido',
  },
  aid: {
    key: 'ratingAid',
    label: 'Avituallamientos',
    description: 'Calidad y cantidad de avituallamientos',
  },
  finisher: {
    key: 'ratingFinisher',
    label: 'Premio Finisher',
    description: 'Calidad del premio/medalla finisher',
  },
  eco: {
    key: 'ratingEco',
    label: 'ECO Friendly',
    description: 'Compromiso medioambiental del evento',
  },
} as const;

export type RatingCriterion = keyof typeof RATING_CRITERIA;
