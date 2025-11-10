// Event Status Types
export type EventStatus = 'PUBLISHED' | 'DRAFT' | 'REJECTED' | 'CANCELLED';

// User Role Types
export type UserRole = 'ADMIN' | 'ORGANIZER' | 'ATHLETE';

// Event Interface
export interface Event {
  id: string;
  name: string;
  slug: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  country: string;
  city: string;
  region?: string;
  coordinates?: {
    type: string;
    coordinates: [number, number];
  };
  firstEditionYear?: number;
  logo?: string;
  bannerImage?: string;
  isFeatured: boolean;
  status: EventStatus;
  organizerId: string;
  organizer?: {
    id: string;
    name?: string;
    email: string;
  };
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    competitions: number;
  };
}

// Event Stats Interface
export interface EventStats {
  total: number;
  published: number;
  draft: number;
  rejected: number;
  approvalRate?: number;
}

// Event Filters Interface
export interface EventFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: EventStatus;
  country?: string;
  organizerId?: string;
  isFeatured?: boolean;
}

// API Response Interfaces
export interface EventsResponse {
  status: string;
  data: Event[];  // ✅ Array directo
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;  // ✅ "pages", no "totalPages"
  };
}

export interface EventResponse {
  status: string;
  data: Event;
  message?: string;
}

export interface EventStatsResponse {
  status: string;
  data: EventStats;
}

// Create/Update Event Data
export interface CreateEventData {
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  country: string;
  city: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  firstEditionYear?: number;
  logo?: string;
  bannerImage?: string;
  isFeatured?: boolean;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  status?: EventStatus;
  rejectionReason?: string;
  adminNotes?: string;
}

// Approve/Reject Interfaces
export interface RejectEventData {
  reason?: string;
}
