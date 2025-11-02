// types/competition.ts
export interface Competition {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  location: string;
  country: string;
  startDate: string;
  endDate: string;
  registrationOpen: boolean;
  registrationDeadline: string | null;
  maxParticipants: number | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  elevation: number | null;
  terrainType: string | null;
  difficulty: 'EASY' | 'MODERATE' | 'HARD' | 'EXTREME' | null;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  featured: boolean;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  distances?: Distance[];
  translations?: CompetitionTranslation[];
}

export interface Distance {
  id: number;
  competitionId: number;
  name: string;
  distance: number;
  elevationGain: number | null;
  elevationLoss: number | null;
  cutoffTime: number | null;
  price: number | null;
  currency: string;
  maxParticipants: number | null;
  aidStations: number | null;
  startTime: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompetitionTranslation {
  id: number;
  competitionId: number;
  language: 'ES' | 'EN' | 'FR' | 'IT' | 'DE' | 'CA';
  name: string;
  description: string | null;
  location: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompetitionFilters {
  country?: string;
  difficulty?: string;
  status?: string;
  featured?: boolean;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
