// hooks/useCompetitions.ts
'use client';

import { useState, useEffect } from 'react';
import { competitionsService } from '@/lib/api';
import { Competition, CompetitionFilters, PaginatedResponse } from '@/types/competition';
import { getErrorMessage } from '@/lib/api/error-handler';

export function useCompetitions(filters?: CompetitionFilters) {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompetitions();
  }, [JSON.stringify(filters)]);

  const fetchCompetitions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await competitionsService.getAll(filters);
      setCompetitions(response.data);
      setPagination(response.meta);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    competitions,
    pagination,
    isLoading,
    error,
    refetch: fetchCompetitions,
  };
}

export function useCompetition(id?: number, slug?: string) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id || slug) {
      fetchCompetition();
    }
  }, [id, slug]);

  const fetchCompetition = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let data: Competition;
      if (id) {
        data = await competitionsService.getById(id);
      } else if (slug) {
        data = await competitionsService.getBySlug(slug);
      } else {
        throw new Error('ID or slug required');
      }
      
      setCompetition(data);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    competition,
    isLoading,
    error,
    refetch: fetchCompetition,
  };
}
