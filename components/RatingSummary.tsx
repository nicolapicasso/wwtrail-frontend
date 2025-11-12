// components/RatingSummary.tsx - Resumen visual de ratings

'use client';

import { Star } from 'lucide-react';
import StarRating from './StarRating';
import { RATING_CRITERIA } from '@/types/rating';
import type { RatingSummary as RatingSummaryType } from '@/types/rating';

interface RatingSummaryProps {
  summary: RatingSummaryType;
}

export default function RatingSummary({ summary }: RatingSummaryProps) {
  const { avgRating, totalRatings, breakdown } = summary;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      {/* Rating General */}
      <div className="flex items-center gap-6 pb-6 border-b">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900">
            {avgRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center mt-2">
            <StarRating value={Math.round(avgRating)} readonly size="sm" />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {totalRatings} {totalRatings === 1 ? 'valoración' : 'valoraciones'}
          </p>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Valoración General
          </h3>
          <p className="text-sm text-gray-600">
            Basado en las valoraciones de {totalRatings} corredores que
            participaron en este evento
          </p>
        </div>
      </div>

      {/* Desglose por criterios */}
      <div className="pt-6 space-y-3">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">
          Desglose por Criterios
        </h4>

        {Object.entries(RATING_CRITERIA).map(([key, criteria]) => {
          const value = breakdown[key as keyof typeof breakdown];

          return (
            <div key={key} className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700">
                  {criteria.label}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${(value / 4) * 100}%` }}
                  />
                </div>

                <div className="flex items-center gap-1 w-20 justify-end">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {value.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
