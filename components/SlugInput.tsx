'use client';

import { Loader2, Check, X, AlertCircle } from 'lucide-react';
import { useSlugValidation } from '@/hooks/useSlugValidation';

interface SlugInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  helpText?: string;
  excludeId?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

/**
 * Input para slug con validación en tiempo real
 * Verifica disponibilidad contra el backend
 */
export default function SlugInput({
  value,
  onChange,
  label = 'Slug (URL amigable)',
  helpText = 'Se genera automáticamente desde el nombre',
  excludeId,
  disabled = false,
  readOnly = false,
}: SlugInputProps) {
  const { isChecking, isAvailable, error } = useSlugValidation({
    slug: value,
    excludeId,
    debounceMs: 500,
  });

  // Determinar estado visual
  const getInputClass = () => {
    const baseClass = 'w-full rounded-lg border px-4 py-2 pr-10 focus:ring-2 focus:outline-none transition-colors';
    
    if (disabled) {
      return `${baseClass} bg-gray-100 cursor-not-allowed border-gray-300`;
    }

    if (readOnly) {
      return `${baseClass} bg-gray-50 text-gray-600 border-gray-300`;
    }

    if (error) {
      return `${baseClass} border-red-300 focus:border-red-500 focus:ring-red-500`;
    }

    if (isAvailable === false) {
      return `${baseClass} border-red-300 focus:border-red-500 focus:ring-red-500`;
    }

    if (isAvailable === true) {
      return `${baseClass} border-green-300 focus:border-green-500 focus:ring-green-500`;
    }

    return `${baseClass} border-gray-300 focus:border-blue-500 focus:ring-blue-500`;
  };

  // Icono de estado
  const renderStatusIcon = () => {
    if (isChecking) {
      return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    }

    if (error) {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    }

    if (isAvailable === false) {
      return <X className="h-5 w-5 text-red-500" />;
    }

    if (isAvailable === true) {
      return <Check className="h-5 w-5 text-green-500" />;
    }

    return null;
  };

  // Mensaje de feedback
  const renderFeedback = () => {
    if (error) {
      return (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      );
    }

    if (isChecking) {
      return (
        <p className="mt-1 text-sm text-blue-600">
          Verificando disponibilidad...
        </p>
      );
    }

    if (isAvailable === false) {
      return (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <X className="h-4 w-4" />
          Este slug ya está en uso. Por favor, elige otro.
        </p>
      );
    }

    if (isAvailable === true) {
      return (
        <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
          <Check className="h-4 w-4" />
          Slug disponible
        </p>
      );
    }

    if (helpText && value.length > 0) {
      return (
        <p className="mt-1 text-xs text-gray-500">
          {helpText}
        </p>
      );
    }

    return null;
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          readOnly={readOnly}
          placeholder="mi-evento-slug"
          className={getInputClass()}
        />
        
        {/* Icono de estado */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {renderStatusIcon()}
        </div>
      </div>

      {/* Mensaje de feedback */}
      {renderFeedback()}
    </div>
  );
}
