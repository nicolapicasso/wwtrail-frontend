// components/RatingForm.tsx - Formulario de creación/edición de rating

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import StarRating from './StarRating';
import ratingsService from '@/lib/api/ratings.service';
import { RATING_CRITERIA } from '@/types/rating';
import type { CreateRatingDTO, EditionRating } from '@/types/rating';
import { toast } from 'sonner';

interface RatingFormProps {
  editionId: string;
  existingRating?: EditionRating;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RatingForm({
  editionId,
  existingRating,
  onSuccess,
  onCancel,
}: RatingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [ratings, setRatings] = useState({
    ratingInfoBriefing: existingRating?.ratingInfoBriefing || 0,
    ratingRacePack: existingRating?.ratingRacePack || 0,
    ratingVillage: existingRating?.ratingVillage || 0,
    ratingMarking: existingRating?.ratingMarking || 0,
    ratingAid: existingRating?.ratingAid || 0,
    ratingFinisher: existingRating?.ratingFinisher || 0,
    ratingEco: existingRating?.ratingEco || 0,
  });

  const [comment, setComment] = useState(existingRating?.comment || '');

  const isValid = Object.values(ratings).every((r) => r >= 1 && r <= 4);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      toast.error('Por favor, valora todos los criterios (1-4 estrellas)');
      return;
    }

    setLoading(true);

    try {
      const data: CreateRatingDTO = {
        ...ratings,
        comment: comment.trim() || undefined,
      };

      if (existingRating) {
        await ratingsService.update(existingRating.id, data);
        toast.success('Valoración actualizada correctamente');
      } else {
        await ratingsService.create(editionId, data);
        toast.success('Valoración creada correctamente');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } catch (error: any) {
      console.error('Error saving rating:', error);
      toast.error(
        error.response?.data?.message ||
          'Error al guardar la valoración. Inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Título */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {existingRating ? 'Editar Valoración' : 'Valorar Edición'}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Valora cada aspecto del evento de 1 a 4 estrellas
        </p>
      </div>

      {/* 7 Criterios */}
      <div className="space-y-4">
        {Object.entries(RATING_CRITERIA).map(([key, criteria]) => (
          <StarRating
            key={key}
            label={criteria.label}
            description={criteria.description}
            value={ratings[criteria.key as keyof typeof ratings]}
            onChange={(value) =>
              setRatings({ ...ratings, [criteria.key]: value })
            }
            max={4}
            size="md"
          />
        ))}
      </div>

      {/* Comentario */}
      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Comentario (opcional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={2000}
          rows={6}
          placeholder="Comparte tu experiencia en este evento..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          {comment.length}/2000 caracteres
        </p>
      </div>

      {/* Botones */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        )}

        <button
          type="submit"
          disabled={loading || !isValid}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {existingRating ? 'Actualizar Valoración' : 'Enviar Valoración'}
        </button>
      </div>
    </form>
  );
}
