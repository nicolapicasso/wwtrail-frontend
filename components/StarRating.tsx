// components/StarRating.tsx - Componente de selector de estrellas

'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  label?: string;
  description?: string;
}

export default function StarRating({
  value,
  onChange,
  max = 4,
  size = 'md',
  readonly = false,
  label,
  description,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  const handleClick = (newValue: number) => {
    if (!readonly && onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-1">
      {label && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
      )}

      <div className="flex items-center gap-1">
        {Array.from({ length: max }, (_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= displayValue;

          return (
            <button
              key={i}
              type="button"
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => !readonly && setHoverValue(starValue)}
              onMouseLeave={() => !readonly && setHoverValue(null)}
              disabled={readonly}
              className={`
                ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
                transition-transform
                ${!readonly && 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded'}
              `}
              aria-label={`${starValue} ${starValue === 1 ? 'estrella' : 'estrellas'}`}
            >
              <Star
                className={`
                  ${sizeClasses[size]}
                  ${isFilled ? 'fill-yellow-400 text-yellow-400' : 'fill-none text-gray-300'}
                  transition-colors
                `}
              />
            </button>
          );
        })}

        {!readonly && (
          <span className="text-sm text-gray-600 ml-2">
            {value > 0 ? `${value}/${max}` : 'Sin valorar'}
          </span>
        )}
      </div>
    </div>
  );
}
