// components/RecentRatingsWidget.tsx - Widget de últimos comentarios para homepage

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageSquare, ChevronRight } from 'lucide-react';
import StarRating from './StarRating';
import ratingsService from '@/lib/api/ratings.service';
import type { EditionRating } from '@/types/rating';

interface RecentRatingsWidgetProps {
  limit?: number;
}

export default function RecentRatingsWidget({ limit = 10 }: RecentRatingsWidgetProps) {
  const [ratings, setRatings] = useState<EditionRating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await ratingsService.getRecent(limit);
        setRatings(data);
      } catch (error) {
        console.error('Error fetching recent ratings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, [limit]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (ratings.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Últimos Comentarios
        </h2>
        <p className="text-gray-600 text-sm">
          Aún no hay comentarios recientes
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Últimos Comentarios
      </h2>

      <div className="space-y-6">
        {ratings.map((rating) => {
          const avgRating =
            (rating.ratingInfoBriefing +
              rating.ratingRacePack +
              rating.ratingVillage +
              rating.ratingMarking +
              rating.ratingAid +
              rating.ratingFinisher +
              rating.ratingEco) /
            7;

          const timeAgo = formatDistanceToNow(new Date(rating.createdAt), {
            addSuffix: true,
            locale: es,
          });

          return (
            <div
              key={rating.id}
              className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
            >
              {/* Usuario */}
              <div className="flex items-center gap-2 mb-2">
                <p className="font-semibold text-sm text-gray-900">
                  {rating.user?.username || 'Usuario'}
                </p>
                <span className="text-gray-300">•</span>
                <p className="text-xs text-gray-500">{timeAgo}</p>
              </div>

              {/* Evento */}
              {rating.edition && (
                <Link
                  href={`/editions/${rating.edition.slug}`}
                  className="group block mb-2"
                >
                  <p className="text-sm text-blue-600 group-hover:text-blue-700 font-medium flex items-center gap-1">
                    {rating.edition.competition.event.name} -{' '}
                    {rating.edition.competition.name} {rating.edition.year}
                    <ChevronRight className="w-3 h-3" />
                  </p>
                </Link>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <StarRating value={Math.round(avgRating)} readonly size="sm" />
                <span className="text-xs font-medium text-gray-700">
                  {avgRating.toFixed(1)}
                </span>
              </div>

              {/* Comentario */}
              {rating.comment && (
                <p className="text-sm text-gray-700 line-clamp-3">
                  {rating.comment}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Ver más */}
      {ratings.length >= limit && (
        <div className="mt-6 pt-6 border-t">
          <Link
            href="/ratings"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 justify-center"
          >
            Ver todos los comentarios
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
