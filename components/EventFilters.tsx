// components/EventFilters.tsx - VERSIÓN CORREGIDA
// ✅ FIX #1: Usar CountrySelect en lugar de select normal
// ✅ FIX #2: Agregar soporte para featured filter

'use client';

import { useState, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
import CountrySelect from './CountrySelect';

interface EventFiltersProps {
  onSearch: (query: string) => void;
  onFilterStatus: (status: string) => void;
  onFilterCountry: (country: string) => void;
  onFilterHighlighted?: (highlighted: boolean | null) => void;  // ✅ NUEVO
  showCountryFilter?: boolean;
  showOrganizerFilter?: boolean;
  showHighlightedFilter?: boolean;  // ✅ NUEVO
  isLoading?: boolean;
}

export default function EventFilters({
  onSearch,
  onFilterStatus,
  onFilterCountry,
  onFilterHighlighted,  // ✅ NUEVO
  showCountryFilter = true,
  showOrganizerFilter = false,
  showHighlightedFilter = false,  // ✅ NUEVO
  isLoading = false,
}: EventFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedHighlighted, setSelectedHighlighted] = useState<string>('all');  // ✅ NUEVO

  // Handler para búsqueda con debounce
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    
    // Debounce de 500ms
    const timer = setTimeout(() => {
      onSearch(value);
    }, 500);

    return () => clearTimeout(timer);
  }, [onSearch]);

  // Handler para país
  const handleCountryChange = useCallback((countryCode: string) => {
    setSelectedCountry(countryCode);
    onFilterCountry(countryCode);
  }, [onFilterCountry]);

  // Handler para estado
  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status);
    onFilterStatus(status);
  }, [onFilterStatus]);

  // ✅ NUEVO: Handler para highlighted
  const handleHighlightedChange = useCallback((value: string) => {
    setSelectedHighlighted(value);
    
    if (onFilterHighlighted) {
      if (value === 'all') {
        onFilterHighlighted(null);
      } else {
        onFilterHighlighted(value === 'true');
      }
    }
  }, [onFilterHighlighted]);

  // Limpiar búsqueda
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    onSearch('');
  }, [onSearch]);

  // Limpiar todos los filtros
  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCountry('');
    setSelectedStatus('ALL');
    setSelectedHighlighted('all');
    onSearch('');
    onFilterCountry('');
    onFilterStatus('ALL');
    if (onFilterHighlighted) {
      onFilterHighlighted(null);
    }
  }, [onSearch, onFilterCountry, onFilterStatus, onFilterHighlighted]);

  const hasActiveFilters = searchTerm || selectedCountry || selectedStatus !== 'ALL' || selectedHighlighted !== 'all';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events by name or location..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            disabled={isLoading}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters Toggle Button (Mobile) */}
        <button
          onClick={() => setShowFiltersPanel(!showFiltersPanel)}
          className="md:hidden flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter className="h-5 w-5" />
          Filters
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {[searchTerm, selectedCountry, selectedStatus !== 'ALL', selectedHighlighted !== 'all'].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filter Controls */}
      <div className={`${showFiltersPanel ? 'block' : 'hidden'} md:block mt-4`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* ✅ FIX: Country Filter con CountrySelect */}
          {showCountryFilter && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <CountrySelect
                value={selectedCountry}
                onChange={handleCountryChange}
                showAllOption={true}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="ALL">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* ✅ NUEVO: Highlighted Filter */}
          {showHighlightedFilter && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Featured
              </label>
              <select
                value={selectedHighlighted}
                onChange={(e) => handleHighlightedChange(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="all">All Events</option>
                <option value="true">Featured Only</option>
                <option value="false">Not Featured</option>
              </select>
            </div>
          )}

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={clearAllFilters}
                disabled={isLoading}
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
