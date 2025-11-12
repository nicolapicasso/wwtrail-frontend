// types/edition.ts - Edition types for API v2

import { EditionStatus, RegistrationStatus, Language } from './competition';
import { EditionRating, RatingSummary } from './rating';
import { EditionPodium } from './podium';
import { EditionPhoto } from './photo';
import { EditionWeather } from './weather';

/**
 * Edition - Annual edition of a competition
 * Example: "UTMB 171K 2025"
 */
export interface Edition {
  id: string;
  competitionId: string;
  slug: string;
  year: number;

  // NUEVOS CAMPOS: Fechas específicas
  specificDate?: string; // Fecha específica de inicio (si se conoce)
  endDate?: string; // Fecha de finalización

  // Backwards compatibility
  startDate?: string; // Deprecated: usar specificDate

  // Fields that can be inherited from Competition
  distance?: number; // If NULL, inherits from competition.baseDistance
  elevation?: number; // If NULL, inherits from competition.baseElevation
  maxParticipants?: number; // If NULL, inherits from competition.baseMaxParticipants
  currentParticipants: number;
  city?: string; // If NULL, inherits from event.city

  // Edition-specific fields
  registrationUrl?: string;
  registrationOpenDate?: string;
  registrationCloseDate?: string;
  resultsUrl?: string;

  // NUEVO: Crónica
  chronicle?: string;

  // NUEVO: Datos meteorológicos
  weather?: EditionWeather;
  weatherFetched?: boolean;

  // NUEVO: Ratings
  avgRating?: number;
  totalRatings?: number;

  status: EditionStatus;
  registrationStatus: RegistrationStatus;

  // NUEVAS RELACIONES (opcionales en listados)
  ratings?: EditionRating[];
  podiums?: EditionPodium[];
  photos?: EditionPhoto[];

  createdAt: string;
  updatedAt: string;
}

/**
 * Edition with Competition info
 */
export interface EditionWithCompetition extends Edition {
  competition: {
    id: string;
    slug: string;
    name: string;
    type: string;
    baseDistance?: number;
    baseElevation?: number;
    baseMaxParticipants?: number;
    eventId: string;
  };
}

/**
 * Edition with Event and Competition info
 */
export interface EditionWithDetails extends EditionWithCompetition {
  event: {
    id: string;
    slug: string;
    name: string;
    country: string;
    city: string;
    organizerId: string;
    
  };
}

/**
 * Edition with inherited data (resolved)
 * This is what the backend returns from /editions/:id/full
 */
export interface EditionFull extends Edition {
  // Resolved fields (with inheritance applied)
  resolvedDistance: number; // edition.distance ?? competition.baseDistance
  resolvedElevation: number; // edition.elevation ?? competition.baseElevation
  resolvedMaxParticipants: number; // edition.maxParticipants ?? competition.baseMaxParticipants
  resolvedCity: string; // edition.city ?? event.city
  
  // Related entities
  competition: {
    id: string;
    slug: string;
    name: string;
    type: string;
    baseDistance?: number;
    baseElevation?: number;
    baseMaxParticipants?: number;
  };
  event: {
    id: string;
    slug: string;
    name: string;
    country: string;
    city: string;
  };
}

/**
 * Edition with counts
 */
export interface EditionWithCounts extends Edition {
  _count: {
    participants: number;
    results: number;
    reviews: number;
    userEditions: number;
  };
}

/**
 * Edition Detail (for detail page)
 */
export interface EditionDetail extends EditionFull {
  translations: Array<{
    id: string;
    language: Language;
    name?: string;
    description?: string;
  }>;
  _count: {
    participants: number;
    results: number;
    reviews: number;
    userEditions: number;
  };
}

/**
 * Edition Translation
 */
export interface EditionTranslation {
  id: string;
  editionId: string;
  language: Language;
  name?: string;
  description?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW';
  createdAt: string;
  updatedAt: string;
}

/**
 * Edition Statistics
 */
export interface EditionStats {
  id: string;
  year: number;
  competitionName: string;
  eventName: string;
  totalParticipants: number;
  totalFinishers?: number;
  totalResults: number;
  totalReviews: number;
  averageRating?: number;
  totalUserTracking: number;
  totalCategories: number;
  viewCount: number;
  currentParticipants?: number;
  maxParticipants?: number;
  registrationStatus?: 'OPEN' | 'CLOSED' | 'FULL' | 'COMING_SOON';
  status?: 'UPCOMING' | 'ONGOING' | 'FINISHED';

}

/**
 * Create Edition Input
 */
export interface CreateEditionInput {
  year: number;
  startDate: string;
  endDate?: string;
  distance?: number;
  elevation?: number;
  maxParticipants?: number;
  currentParticipants?: number;
  city?: string;
  registrationUrl?: string;
  registrationOpenDate?: string;
  registrationCloseDate?: string;
  resultsUrl?: string;
  status?: EditionStatus;
  registrationStatus?: RegistrationStatus;
}

/**
 * Update Edition Input
 */
export interface UpdateEditionInput {
  year?: number;
  startDate?: string;
  endDate?: string;
  distance?: number;
  elevation?: number;
  maxParticipants?: number;
  currentParticipants?: number;
  city?: string;
  registrationUrl?: string;
  registrationOpenDate?: string;
  registrationCloseDate?: string;
  resultsUrl?: string;
  status?: EditionStatus;
  registrationStatus?: RegistrationStatus;
}

/**
 * Bulk Create Editions Input
 */
export interface BulkCreateEditionsInput {
  years: number[]; // Array of years to create editions for
  baseData?: Partial<CreateEditionInput>; // Common data for all editions
}

/**
 * Edition Filters
 */
export interface EditionFilters {
  competitionId?: string;
  year?: number;
  status?: EditionStatus;
  registrationStatus?: RegistrationStatus;
  page?: number;
  limit?: number;
  sortBy?: 'year' | 'startDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Edition List Response
 */
export interface EditionListResponse {
  data: Edition[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
