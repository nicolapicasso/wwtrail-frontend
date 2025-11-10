'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { EventStatus } from '@/lib/types/event';

interface EventFiltersProps {
  onSearch: (query: string) => void;
  onFilterStatus: (status: EventStatus | 'ALL') => void;
  onFilterCountry?: (country: string) => void;
  onFilterOrganizer?: (organizerId: string) => void;
  showCountryFilter?: boolean;
  showOrganizerFilter?: boolean;
  isLoading?: boolean;
}

export default function EventFilters({
  onSearch,
  onFilterStatus,
  onFilterCountry,
  onFilterOrganizer,
  showCountryFilter = true,
  showOrganizerFilter = false,
  isLoading = false,
}: EventFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | 'ALL'>('ALL');
  const [country, setCountry] = useState('');
  const [organizerId, setOrganizerId] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  const handleStatusChange = (status: EventStatus | 'ALL') => {
    setSelectedStatus(status);
    onFilterStatus(status);
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
    onFilterCountry?.(value);
  };

  const handleOrganizerChange = (value: string) => {
    setOrganizerId(value);
    onFilterOrganizer?.(value);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar eventos por nombre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isLoading}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-4">
        {/* Status Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value as EventStatus | 'ALL')}
            disabled={isLoading}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="ALL">Todos</option>
            <option value="PUBLISHED">Publicados</option>
            <option value="DRAFT">Pendientes</option>
            <option value="REJECTED">Rechazados</option>
          </select>
        </div>

        {/* Country Filter */}
        {showCountryFilter && (
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              País
            </label>
            <input
              type="text"
              placeholder="Filtrar por país..."
              value={country}
              onChange={(e) => handleCountryChange(e.target.value)}
              disabled={isLoading}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        )}

        {/* Organizer Filter (Admin only) */}
        {showOrganizerFilter && (
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organizador (ID)
            </label>
            <input
              type="text"
              placeholder="ID del organizador..."
              value={organizerId}
              onChange={(e) => handleOrganizerChange(e.target.value)}
              disabled={isLoading}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {(searchQuery || selectedStatus !== 'ALL' || country || organizerId) && (
        <div className="flex items-center gap-2 pt-2 border-t">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">Filtros activos:</span>
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Búsqueda: {searchQuery}
              </span>
            )}
            {selectedStatus !== 'ALL' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Estado: {selectedStatus}
              </span>
            )}
            {country && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                País: {country}
              </span>
            )}
            {organizerId && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Organizador: {organizerId}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
