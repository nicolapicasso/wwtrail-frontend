// components/forms/CompetitionForm.tsx - Formulario reutilizable para crear/editar competiciones

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import competitionsService from '@/lib/api/v2/competitions.service';
import type { Competition } from '@/types/competition';
import { CompetitionType } from '@/types/event';

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
    description: competition?.description || '',
    type: competition?.type || CompetitionType.TRAIL,
    baseDistance: competition?.baseDistance?.toString() || '',
    baseElevation: competition?.baseElevation?.toString() || '',
    baseMaxParticipants: competition?.baseMaxParticipants?.toString() || '',
    displayOrder: competition?.displayOrder?.toString() || '0',
    isActive: competition?.isActive ?? true,
    // New fields
    logoUrl: competition?.logoUrl || '',
    coverImage: competition?.coverImage || '',
    gallery: competition?.gallery || [],
    status: competition?.status || 'DRAFT',
    featured: competition?.featured || false,
  });

  const [galleryInput, setGalleryInput] = useState('');

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // Update slug when name changes (only in create mode)
  useEffect(() => {
    if (!isEditMode && formData.name && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(formData.name),
      }));
    }
  }, [formData.name, isEditMode, formData.slug]);

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

    if (!formData.type) {
      setError('El tipo de competición es obligatorio');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        type: formData.type,
        description: formData.description.trim() || undefined,
        baseDistance: formData.baseDistance ? parseFloat(formData.baseDistance) : undefined,
        baseElevation: formData.baseElevation ? parseInt(formData.baseElevation) : undefined,
        baseMaxParticipants: formData.baseMaxParticipants
          ? parseInt(formData.baseMaxParticipants)
          : undefined,
        displayOrder: parseInt(formData.displayOrder) || 0,
        isActive: formData.isActive,
        // New fields
        logoUrl: formData.logoUrl.trim() || undefined,
        coverImage: formData.coverImage.trim() || undefined,
        gallery: formData.gallery.length > 0 ? formData.gallery : undefined,
        status: formData.status,
        featured: formData.featured,
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
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Error al guardar la competición';
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
            Nombre *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="UTMB 171K"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug *
          </label>
          <input
            type="text"
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="utmb-171k"
            required
            disabled={isEditMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
          />
          {isEditMode && (
            <p className="text-xs text-gray-500 mt-1">
              El slug no puede modificarse una vez creada la competición
            </p>
          )}
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Competición *
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as CompetitionType })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value={CompetitionType.TRAIL}>Trail</option>
            <option value={CompetitionType.ULTRA}>Ultra</option>
            <option value={CompetitionType.VERTICAL}>Vertical</option>
            <option value={CompetitionType.SKYRUNNING}>Skyrunning</option>
            <option value={CompetitionType.CANICROSS}>Canicross</option>
            <option value={CompetitionType.OTHER}>Otro</option>
          </select>
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
          Características Base
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Estos valores pueden ser sobreescritos en cada edición
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Base Distance */}
          <div>
            <label htmlFor="baseDistance" className="block text-sm font-medium text-gray-700 mb-1">
              Distancia (km)
            </label>
            <input
              type="number"
              id="baseDistance"
              value={formData.baseDistance}
              onChange={(e) => setFormData({ ...formData, baseDistance: e.target.value })}
              placeholder="171"
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Base Elevation */}
          <div>
            <label htmlFor="baseElevation" className="block text-sm font-medium text-gray-700 mb-1">
              Desnivel (m D+)
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
            <label
              htmlFor="baseMaxParticipants"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Participantes Máx.
            </label>
            <input
              type="number"
              id="baseMaxParticipants"
              value={formData.baseMaxParticipants}
              onChange={(e) => setFormData({ ...formData, baseMaxParticipants: e.target.value })}
              placeholder="2500"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Media Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Imágenes y Medios
        </h3>

        {/* Logo URL */}
        <div>
          <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-1">
            URL del Logo
          </label>
          <input
            type="url"
            id="logoUrl"
            value={formData.logoUrl}
            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
            placeholder="https://example.com/logo.png"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Logo específico de la competición (opcional)
          </p>
        </div>

        {/* Cover Image */}
        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
            Imagen de Portada
          </label>
          <input
            type="url"
            id="coverImage"
            value={formData.coverImage}
            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            placeholder="https://example.com/cover.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Imagen principal para la portada de la competición
          </p>
        </div>

        {/* Gallery */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Galería de Imágenes
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={galleryInput}
              onChange={(e) => setGalleryInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
              type="button"
              onClick={() => {
                if (galleryInput.trim()) {
                  setFormData({
                    ...formData,
                    gallery: [...formData.gallery, galleryInput.trim()],
                  });
                  setGalleryInput('');
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Añadir
            </button>
          </div>
          {formData.gallery.length > 0 && (
            <div className="mt-2 space-y-2">
              {formData.gallery.map((url, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="flex-1 text-sm text-gray-700 truncate">{url}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        gallery: formData.gallery.filter((_, i) => i !== index),
                      })
                    }
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            URLs de imágenes para la galería ({formData.gallery.length} imágenes)
          </p>
        </div>
      </div>

      {/* Display Settings Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Configuración de Visualización
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Estado de Publicación
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="DRAFT">Borrador</option>
              <option value="PUBLISHED">Publicada</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Solo las competiciones publicadas son visibles
            </p>
          </div>

          {/* Display Order */}
          <div>
            <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-1">
              Orden de Visualización
            </label>
            <input
              type="number"
              id="displayOrder"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Número más bajo aparece primero
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Featured */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Competición Destacada
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {formData.featured ? 'Destacada' : 'Normal'}
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Las competiciones destacadas se muestran de forma prominente
            </p>
          </div>

          {/* Is Active */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activa/Inactiva
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {formData.isActive ? 'Activa' : 'Inactiva'}
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Solo las competiciones activas son visibles al público
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
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
