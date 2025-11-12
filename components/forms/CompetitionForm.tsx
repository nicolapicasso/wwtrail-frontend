// components/forms/CompetitionForm.tsx - Formulario reutilizable para crear/editar competiciones

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, AlertCircle, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import competitionsService from '@/lib/api/v2/competitions.service';
import type { Competition } from '@/types/competition';

interface CompetitionFormProps {
  eventId: string;
  competition?: Competition; // Si existe, es modo edición
  onSuccess?: (competition: Competition) => void;
  onCancel?: () => void;
}

export default function CompetitionForm({
  eventId,
  competition,
  onSuccess,
  onCancel,
}: CompetitionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!competition;

  // Form state
  const [formData, setFormData] = useState({
    name: competition?.name || '',
    slug: competition?.slug || '',
    distanceSlug: competition?.distanceSlug || '',
    description: competition?.description || '',
    baseDistance: competition?.baseDistance?.toString() || '',
    baseElevation: competition?.baseElevation?.toString() || '',
    baseMaxParticipants: competition?.baseMaxParticipants?.toString() || '',
    sortOrder: competition?.sortOrder?.toString() || '0',
    isFeatured: competition?.isFeatured || false,
  });

  // Slug validation state
  const [slugValidation, setSlugValidation] = useState<{
    isChecking: boolean;
    isAvailable: boolean | null;
    error: string | null;
  }>({
    isChecking: false,
    isAvailable: isEditMode ? true : null, // Si es edición, asumimos que el slug es válido
    error: null,
  });

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // Auto-generate distanceSlug from name (extract numbers + "k")
  const generateDistanceSlug = (name: string) => {
    const numbers = name.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      return `${numbers[0]}k`;
    }
    return '';
  };

  const handleNameChange = (value: string) => {
    const newSlug = generateSlug(value);
    const newDistanceSlug = generateDistanceSlug(value);

    setFormData({
      ...formData,
      name: value,
      slug: newSlug,
      distanceSlug: newDistanceSlug,
    });

    // Solo validar slug en modo creación
    if (!isEditMode && newSlug.length >= 3) {
      // TODO: Implementar validación de slug si el backend lo soporta
      setSlugValidation({
        isChecking: false,
        isAvailable: true,
        error: null,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!formData.name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    if (!formData.slug.trim()) {
      setError('El slug es obligatorio');
      return;
    }

    if (!formData.distanceSlug.trim()) {
      setError('El distance slug es obligatorio');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        distanceSlug: formData.distanceSlug.trim(),
        description: formData.description.trim() || undefined,
        baseDistance: formData.baseDistance ? parseInt(formData.baseDistance) : undefined,
        baseElevation: formData.baseElevation ? parseInt(formData.baseElevation) : undefined,
        baseMaxParticipants: formData.baseMaxParticipants
          ? parseInt(formData.baseMaxParticipants)
          : undefined,
        sortOrder: parseInt(formData.sortOrder),
        isFeatured: formData.isFeatured,
      };

      let result: Competition;

      if (isEditMode) {
        result = await competitionsService.update(competition.id, payload);
        toast.success('Competición actualizada correctamente');
      } else {
        result = await competitionsService.create(eventId, payload);
        toast.success('Competición creada correctamente');
      }

      if (onSuccess) {
        onSuccess(result);
      } else {
        router.push(`/organizer/events/${eventId}`);
      }
    } catch (err: any) {
      console.error('Error saving competition:', err);
      const errorMessage =
        err.response?.data?.message || 'Error al guardar la competición';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Editar Competición' : 'Nueva Competición'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Define las características de esta competición
          </p>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Basic Info Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Información Básica
        </h3>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la Competición *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Ej: UTMB 171K"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            El slug y distance slug se generarán automáticamente
          </p>
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug (URL) *
          </label>
          <div className="relative">
            <input
              type="text"
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="utmb-171k"
              required
              disabled={isEditMode}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
            />
            {!isEditMode && slugValidation.isAvailable && (
              <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
            )}
          </div>
        </div>

        {/* Distance Slug */}
        <div>
          <label htmlFor="distanceSlug" className="block text-sm font-medium text-gray-700 mb-1">
            Distance Slug *
          </label>
          <input
            type="text"
            id="distanceSlug"
            value={formData.distanceSlug}
            onChange={(e) => setFormData({ ...formData, distanceSlug: e.target.value })}
            placeholder="171k"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            placeholder="Descripción de la competición..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
        </div>
      </div>

      {/* Technical Specs Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Características Técnicas Base
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Base Distance */}
          <div>
            <label htmlFor="baseDistance" className="block text-sm font-medium text-gray-700 mb-1">
              Distancia Base (km)
            </label>
            <input
              type="number"
              id="baseDistance"
              value={formData.baseDistance}
              onChange={(e) => setFormData({ ...formData, baseDistance: e.target.value })}
              placeholder="171"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Base Elevation */}
          <div>
            <label htmlFor="baseElevation" className="block text-sm font-medium text-gray-700 mb-1">
              Desnivel Base (m D+)
            </label>
            <input
              type="number"
              id="baseElevation"
              value={formData.baseElevation}
              onChange={(e) => setFormData({ ...formData, baseElevation: e.target.value })}
              placeholder="10000"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Base Max Participants */}
          <div>
            <label htmlFor="baseMaxParticipants" className="block text-sm font-medium text-gray-700 mb-1">
              Participantes Máx.
            </label>
            <input
              type="number"
              id="baseMaxParticipants"
              value={formData.baseMaxParticipants}
              onChange={(e) =>
                setFormData({ ...formData, baseMaxParticipants: e.target.value })
              }
              placeholder="2500"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Estos valores base pueden ser sobreescritos en cada edición específica
        </p>
      </div>

      {/* Settings Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Configuración
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sort Order */}
          <div>
            <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
              Orden de Visualización
            </label>
            <input
              type="number"
              id="sortOrder"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Menor número = aparece primero
            </p>
          </div>

          {/* Is Featured */}
          <div className="flex items-center h-full pt-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Competición Destacada
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={loading || (slugValidation.isAvailable === false && !isEditMode)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEditMode ? 'Actualizar' : 'Crear'} Competición
            </>
          )}
        </button>
      </div>
    </form>
  );
}
