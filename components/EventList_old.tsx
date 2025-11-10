// components/EventList.tsx - List events with filters and pagination

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ============================================================================
// ✅ IMPORTS CORREGIDOS - Usando default exports
// ============================================================================
import EventCard from './EventCard';  // ✅ Default export
import EventFilters from './EventFilters';  // ✅ Default export

// ============================================================================
// 📦 TIPOS
// ============================================================================

export interface EventFilters {
  search: string;
  country: string;
  type: string;
  status: string;
  isHighlighted: boolean | null;
}

interface EventListProps {
  initialPage?: number;
  initialLimit?: number;
  showFilters?: boolean;
}

// ============================================================================
// 🎨 COMPONENTE PRINCIPAL
// ============================================================================

export function EventList({ 
  initialPage = 1, 
  initialLimit = 12,
  showFilters = true 
}: EventListProps) {
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [filters, setFilters] = useState<EventFilters>({
    search: '',
    country: '',
    type: '',
    status: '',
    isHighlighted: null,
  });

  // Build query params from filters - MEMOIZADO para evitar re-renders
  const queryParams = useMemo(() => {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };

    if (filters.search) params.search = filters.search;
    if (filters.country) params.country = filters.country;
    if (filters.type) params.type = filters.type;
    if (filters.status) params.status = filters.status;
    if (filters.isHighlighted !== null) {
      params.isHighlighted = filters.isHighlighted.toString();
    }

    return params;
  }, [page, limit, filters]);

  const { events, pagination, loading, error } = useEvents(queryParams);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  // ============================================================================
  // 🎛️ HANDLERS - Adaptados a la interfaz de EventFilters
  // ============================================================================

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleFilterStatus = (status: string) => {
    setFilters(prev => ({ ...prev, status: status === 'ALL' ? '' : status }));
  };

  const handleFilterCountry = (country: string) => {
    setFilters(prev => ({ ...prev, country }));
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (pagination && page < pagination.pages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (pageNum: number) => {
    setPage(pageNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    if (!pagination) return [];
    
    const { pages } = pagination;
    const pageNumbers: (number | string)[] = [];
    const maxVisible = 7;

    if (pages <= maxVisible) {
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (page <= 4) {
        for (let i = 1; i <= 5; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(pages);
      } else if (page >= pages - 3) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = pages - 4; i <= pages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = page - 1; i <= page + 1; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(pages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* 🔍 FILTROS - Usando EventFilters con su interfaz real */}
      {/* ============================================================ */}
      {showFilters && (
        <EventFilters
          onSearch={handleSearch}
          onFilterStatus={handleFilterStatus}
          onFilterCountry={handleFilterCountry}
          showCountryFilter={true}
          showOrganizerFilter={false}
          isLoading={loading}
        />
      )}

      {/* ============================================================ */}
      {/* 📊 CONTADOR DE RESULTADOS */}
      {/* ============================================================ */}
      {pagination && !loading && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{events?.length || 0}</span> of{' '}
            <span className="font-medium">{pagination.total}</span> events
          </p>
          {pagination.pages > 1 && (
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.pages}
            </p>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* ❌ ERROR STATE */}
      {/* ============================================================ */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">Error loading events: {error}</p>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🎴 GRID DE EVENTOS - Usando EventCard */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && events.length === 0 ? (
          // Loading skeleton
          Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-t-lg"></div>
              <div className="bg-white p-4 rounded-b-lg">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))
) : events && events.length > 0 ? (
  events.map((event) => (
            <EventCard 
              key={event.id} 
              event={event}
              showStats={true}
              managementMode={false}
            />
          ))
        ) : (
          // Empty state
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">
              {filters.search || filters.country || filters.type
                ? 'No events match your filters'
                : 'No events found'}
            </p>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 📄 PAGINACIÓN */}
      {/* ============================================================ */}
      {pagination && pagination.pages > 1 && !loading && (
        <div className="flex items-center justify-center gap-2">
          {/* Previous button */}
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page numbers */}
          {getPageNumbers().map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                  ...
                </span>
              );
            }

            const isActive = pageNum === page;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageClick(pageNum as number)}
                className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
                }`}
                aria-label={`Go to page ${pageNum}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Next button */}
          <button
            onClick={handleNextPage}
            disabled={page === pagination.pages}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 🎨 COMPONENTE SIMPLE (sin paginación)
// ============================================================================

interface EventListSimpleProps {
  limit?: number;
  type?: string;
  country?: string;
  featured?: boolean;
}

export function EventListSimple({ 
  limit = 6, 
  type, 
  country, 
  featured 
}: EventListSimpleProps) {
  const params: Record<string, string> = {
    limit: limit.toString(),
  };

  if (type) params.type = type;
  if (country) params.country = country;
  if (featured) params.isHighlighted = 'true';

  const { events, loading, error } = useEvents(params);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-800">Error loading events: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-t-lg"></div>
            <div className="bg-white p-4 rounded-b-lg">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))
) : events && events.length > 0 ? (
  events.map((event) => (
    <EventCard 
      key={event.id} 
      event={event}
      showStats={true}
      managementMode={false}
    />
  ))
) : (
  <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
    <p className="text-gray-500 text-lg">No events found</p>
  </div>
)}
          <EventCard 
            key={event.id} 
            event={event}
            showStats={true}
            managementMode={false}
          />
        ))
      )}
    </div>
  );
}

// ============================================================================
// 📝 NOTAS DE CAMBIOS
// ============================================================================
/*
CAMBIOS REALIZADOS:

1. ✅ Imports corregidos:
   - import EventCard from './EventCard' (default export)
   - import EventFilters from './EventFilters' (default export)

2. ✅ Interfaz EventFilters adaptada:
   - onSearch(query: string)
   - onFilterStatus(status: string)
   - onFilterCountry(country: string)
   - showCountryFilter={true}
   - showOrganizerFilter={false}
   - isLoading={loading}

3. ✅ Props de EventCard adaptadas:
   - event={event}
   - showStats={true}
   - managementMode={false}

4. ✅ Mantiene toda la lógica original:
   - useMemo para queryParams
   - Paginación con ellipsis
   - EventListSimple
*/
