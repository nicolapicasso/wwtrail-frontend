// types/event.ts - Event types for API v2

/**
 * Event Status
 */
export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Competition Type
 */
export enum CompetitionType {
  TRAIL = 'TRAIL',
  ULTRA = 'ULTRA',
  VERTICAL = 'VERTICAL',
  SKYRUNNING = 'SKYRUNNING',
  CANICROSS = 'CANICROSS',
  OTHER = 'OTHER',
}

/**
 * Language
 */
export enum Language {
  ES = 'ES',
  EN = 'EN',
  IT = 'IT',
  CA = 'CA',
  FR = 'FR',
  DE = 'DE',
}

/**
 * Event - Permanent event entity
 * Example: "UTMB Mont Blanc"
 */
export interface Event {
  id: string;
  slug: string;
  name: string;
  description?: string;
  country: string;
  city: string;
  location?: {
    latitude: number;
    longitude: number;
  };

    // Imágenes del evento
  imageUrl?: string;       // Imagen principal del evento (800x600 recomendado)
  logoUrl?: string;        // Logo del evento (400x400 recomendado)
  coverImage?: string;     // Imagen hero/banner (1920x600 recomendado)
  coverImageUrl?: string;  // ✅ URL del cover (nuevo campo)
  thumbnailUrl?: string;   // Miniatura para listados (200x200 recomendado)
  
  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  email?: string;
  phone?: string;
  status: EventStatus;
  isActive: boolean;
  isHighlighted: boolean;
  viewCount: number;
  firstEditionYear?: number;
  originalLanguage: Language;
  organizerId: string;
  createdAt: string;
  updatedAt: string;

  _count?: {
    competitions?: number;
    editions?: number;
    reviews?: number;
  };
}

/**
 * Event with organizer info
 */
export interface EventWithOrganizer extends Event {
  organizer: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

/**
 * Event with counts
 */
export interface EventWithCounts extends Event {
  _count: {
    competitions: number;
    translations: number;
  };
}

/**
 * Event with full details (for detail page)
 */
export interface EventDetail extends EventWithOrganizer {
  competitions: Array<{
    id: string;
    slug: string;
    name: string;
    type: CompetitionType;
    baseDistance?: number;
    baseElevation?: number;
    isActive: boolean;
    displayOrder: number;
  }>;
  translations: Array<{
    id: string;
    language: Language;
    name: string;
    description?: string;
  }>;
  _count: {
    competitions: number;
    translations: number;
  };
}

/**
 * Event Translation
 */
export interface EventTranslation {
  id: string;
  eventId: string;
  language: Language;
  name: string;
  description?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW';
  createdAt: string;
  updatedAt: string;
}

/**
 * Event for search results
 */
export interface EventSearchResult {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  relevance?: number;
}

/**
 * Event for nearby search (geospatial)
 */
export interface EventNearby extends EventSearchResult {
  distance_km: number;
  firstEditionYear?: number;
}

/**
 * Event Statistics
 */
export interface EventStats {
  id: string;
  name: string;
  totalCompetitions: number;
  totalEditions: number;
  totalParticipations: number;
  viewCount: number;
}

/**
 * Create Event Input
 */
export interface CreateEventInput {
  name: string;
  description?: string;
  country: string;
  city: string;
  latitude?: number;
  longitude?: number;

// Imágenes
  imageUrl?: string;
  logoUrl?: string;
  coverImage?: string;
  thumbnailUrl?: string;
  coverImageUrl?: string;  // ✅ Nuevo campo

  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  email?: string;
  phone?: string;
  firstEditionYear?: number;
  isHighlighted?: boolean;
  originalLanguage?: Language;
}

/**
 * Update Event Input
 */
export interface UpdateEventInput {
  name?: string;
  description?: string;
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  
  // Imágenes
  imageUrl?: string;
  logoUrl?: string;
  coverImage?: string;
  thumbnailUrl?: string;
  coverImageUrl?: string;  // ✅ Nuevo campo

  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  email?: string;
  phone?: string;
  status?: EventStatus;
  isActive?: boolean;
  isHighlighted?: boolean;
}

/**
 * Event Filters (for list page)
 */
export interface EventFilters {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  status?: EventStatus;
  isHighlighted?: boolean;
  language?: Language;
  sortBy?: 'name' | 'createdAt' | 'viewCount' | 'firstEditionYear';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Event List Response (paginated)
 */
export interface EventListResponse {
  data: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Nearby Events Query
 */
export interface NearbyEventsQuery {
  lat: number;
  lon: number;
  radius?: number; // km
  limit?: number;
}

/**
 * Search Events Query
 */
export interface SearchEventsQuery {
  q: string;
  limit?: number;
}