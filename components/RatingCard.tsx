// components/RatingCard.tsx - Tarjeta individual de rating con comentario

'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, Edit2, Trash2 } from 'lucide-react';
import StarRating from './StarRating';
import type { EditionRating } from '@/types/rating';

interface RatingCardProps {
  rating: EditionRating;
  canEdit?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function RatingCard({
  rating,
  canEdit = false,
  onEdit,
  onDelete,
}: RatingCardProps) {
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
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {rating.user?.avatar ? (
            <img
              src={rating.user.avatar}
              alt={rating.user.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
          )}

          <div>
            <p className="font-semibold text-gray-900">
              {rating.user?.username || 'Usuario'}
            </p>
            <p className="text-xs text-gray-500">{timeAgo}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StarRating value={Math.round(avgRating)} readonly size="sm" />
          <span className="text-sm font-medium text-gray-700">
            {avgRating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Comentario */}
      {rating.comment && (
        <div className="mb-4">
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {rating.comment}
          </p>
        </div>
      )}

      {/* Detalles expandibles */}
      <details className="group">
        <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-medium list-none flex items-center gap-1">
          <span className="group-open:hidden">Ver desglose</span>
          <span className="hidden group-open:inline">Ocultar desglose</span>
        </summary>

        <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-gray-600">Info & Briefing</p>
            <StarRating value={rating.ratingInfoBriefing} readonly size="sm" />
          </div>
          <div>
            <p className="text-gray-600">Race Pack</p>
            <StarRating value={rating.ratingRacePack} readonly size="sm" />
          </div>
          <div>
            <p className="text-gray-600">Village</p>
            <StarRating value={rating.ratingVillage} readonly size="sm" />
          </div>
          <div>
            <p className="text-gray-600">Marking</p>
            <StarRating value={rating.ratingMarking} readonly size="sm" />
          </div>
          <div>
            <p className="text-gray-600">Aid Stations</p>
            <StarRating value={rating.ratingAid} readonly size="sm" />
          </div>
          <div>
            <p className="text-gray-600">Finisher</p>
            <StarRating value={rating.ratingFinisher} readonly size="sm" />
          </div>
          <div className="col-span-2">
            <p className="text-gray-600">ECO Friendly</p>
            <StarRating value={rating.ratingEco} readonly size="sm" />
          </div>
        </div>
      </details>

      {/* Acciones (si puede editar) */}
      {canEdit && (
        <div className="flex gap-2 mt-4 pt-4 border-t">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Editar
            </button>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
