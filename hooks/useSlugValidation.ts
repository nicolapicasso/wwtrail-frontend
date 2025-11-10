// hooks/useSlugValidation.ts
import { useState, useEffect, useRef } from 'react';
import { eventsService } from '@/lib/api/v2';

interface UseSlugValidationOptions {
  slug: string;
  excludeId?: string;
  debounceMs?: number;
}

interface SlugValidationResult {
  isChecking: boolean;
  isAvailable: boolean | null;
  error: string | null;
}

/**
 * Hook para validar disponibilidad de slug en tiempo real
 * 
 * @example
 * const { isChecking, isAvailable, error } = useSlugValidation({
 *   slug: formData.slug,
 *   debounceMs: 500
 * });
 */
export function useSlugValidation({
  slug,
  excludeId,
  debounceMs = 500,
}: UseSlugValidationOptions): SlugValidationResult {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const timeoutRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  useEffect(() => {
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Abortar request anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Si el slug está vacío o es muy corto, no validar
    if (!slug || slug.length < 3) {
      setIsAvailable(null);
      setIsChecking(false);
      setError(null);
      return;
    }

    // Validar formato básico del slug
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      setIsAvailable(false);
      setIsChecking(false);
      setError('El slug solo puede contener letras minúsculas, números y guiones');
      return;
    }

    // Debounce: esperar antes de hacer la petición
    setIsChecking(true);
    setError(null);

    timeoutRef.current = setTimeout(async () => {
      try {
        // Crear nuevo AbortController para esta petición
        abortControllerRef.current = new AbortController();

        const response = await eventsService.checkSlug(slug, excludeId);
        
        setIsAvailable(response.available);
        setIsChecking(false);
      } catch (err: any) {
        // Ignorar errores de peticiones abortadas
        if (err.name === 'AbortError' || err.name === 'CanceledError') {
          return;
        }

        console.error('Error checking slug:', err);
        setError('Error al verificar disponibilidad del slug');
        setIsAvailable(null);
        setIsChecking(false);
      }
    }, debounceMs);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [slug, excludeId, debounceMs]);

  return { isChecking, isAvailable, error };
}
