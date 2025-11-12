// components/PodiumCard.tsx - Tarjeta de podio con top 3

'use client';

import { Edit2, Trash2 } from 'lucide-react';
import { PODIUM_TYPE_LABELS, MEDAL_EMOJIS } from '@/types/podium';
import type { EditionPodium } from '@/types/podium';

interface PodiumCardProps {
  podium: EditionPodium;
  canEdit?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  variant?: 'default' | 'compact';
}

export default function PodiumCard({
  podium,
  canEdit = false,
  onEdit,
  onDelete,
  variant = 'default',
}: PodiumCardProps) {
  const title =
    podium.type === 'CATEGORY'
      ? podium.categoryName
      : PODIUM_TYPE_LABELS[podium.type];

  const isCompact = variant === 'compact';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>

        {canEdit && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                aria-label="Editar podio"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}

            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                aria-label="Eliminar podio"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Podio */}
      <div className={isCompact ? 'space-y-3' : 'space-y-4'}>
        {/* 1er puesto */}
        <PodiumPosition
          rank={1}
          runner={podium.firstPlace}
          time={podium.firstTime}
          isCompact={isCompact}
        />

        {/* 2do puesto */}
        {podium.secondPlace && (
          <PodiumPosition
            rank={2}
            runner={podium.secondPlace}
            time={podium.secondTime}
            isCompact={isCompact}
          />
        )}

        {/* 3er puesto */}
        {podium.thirdPlace && (
          <PodiumPosition
            rank={3}
            runner={podium.thirdPlace}
            time={podium.thirdTime}
            isCompact={isCompact}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Componente de posición individual
 */
interface PodiumPositionProps {
  rank: 1 | 2 | 3;
  runner: string;
  time?: string;
  isCompact?: boolean;
}

function PodiumPosition({ rank, runner, time, isCompact = false }: PodiumPositionProps) {
  const bgColors = {
    1: 'bg-yellow-50',
    2: 'bg-gray-50',
    3: 'bg-orange-50',
  };

  const borderColors = {
    1: 'border-yellow-300',
    2: 'border-gray-300',
    3: 'border-orange-300',
  };

  return (
    <div
      className={`
        flex items-center gap-3 p-3 rounded-lg border-2
        ${bgColors[rank]} ${borderColors[rank]}
      `}
    >
      {/* Medalla */}
      <div className={`${isCompact ? 'text-2xl' : 'text-3xl'} flex-shrink-0`}>
        {MEDAL_EMOJIS[rank]}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className={`
            font-bold text-gray-900 truncate
            ${isCompact ? 'text-sm' : 'text-base'}
          `}
        >
          {runner}
        </p>
        {time && (
          <p className={`font-mono text-gray-600 ${isCompact ? 'text-xs' : 'text-sm'}`}>
            {time}
          </p>
        )}
      </div>

      {/* Rank número */}
      <div
        className={`
          flex-shrink-0 font-bold text-gray-400
          ${isCompact ? 'text-lg' : 'text-2xl'}
        `}
      >
        #{rank}
      </div>
    </div>
  );
}
