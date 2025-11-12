// components/forms/EditionForm.tsx - Formulario reutilizable para crear/editar ediciones

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import editionsService from '@/lib/api/v2/editions.service';
import type { Edition } from '@/types/edition';
import type { Competition } from '@/types/competition';
import { EditionStatus, RegistrationStatus } from '@/types/competition';

interface EditionFormProps {
  competitionId: string;
  competition: Competition; // Necesario para mostrar valores heredables
  edition?: Edition; // Si existe, es modo edición
  onSuccess?: (edition: Edition) => void;
  onCancel?: () => void;
}

export default function EditionForm({
  competitionId,
  competition,
  edition,
  onSuccess,
  onCancel,
}: EditionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!edition;

  // Form state
  const [formData, setFormData] = useState({
    year: edition?.year?.toString() || new Date().getFullYear().toString(),
    startDate: (edition?.specificDate || edition?.startDate)?.split('T')[0] || '',
    endDate: edition?.endDate?.split('T')[0] || '',
    distance: edition?.distance?.toString() || '',
    elevation: edition?.elevation?.toString() || '',
    maxParticipants: edition?.maxParticipants?.toString() || '',
    currentParticipants: edition?.currentParticipants?.toString() || '0',
    city: edition?.city || '',
    registrationUrl: edition?.registrationUrl || '',
    registrationOpenDate: edition?.registrationOpenDate?.split('T')[0] || '',
    registrationCloseDate: edition?.registrationCloseDate?.split('T')[0] || '',
    resultsUrl: edition?.resultsUrl || '',
    chronicle: edition?.chronicle || '',
    status: edition?.status || EditionStatus.UPCOMING,
    registrationStatus: edition?.registrationStatus || RegistrationStatus.NOT_OPEN,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!formData.year) {
      setError('El año es obligatorio');
      return;
    }

    const year = parseInt(formData.year);
    if (year < 1900 || year > 2100) {
      setError('El año debe estar entre 1900 y 2100');
      return;
    }

    if (!formData.startDate) {
      setError('La fecha de inicio es obligatoria');
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        year,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        distance: formData.distance ? parseFloat(formData.distance) : undefined,
        elevation: formData.elevation ? parseInt(formData.elevation) : undefined,
        maxParticipants: formData.maxParticipants
          ? parseInt(formData.maxParticipants)
          : undefined,
        currentParticipants: formData.currentParticipants
          ? parseInt(formData.currentParticipants)
          : 0,
        city: formData.city || undefined,
        registrationUrl: formData.registrationUrl || undefined,
        registrationOpenDate: formData.registrationOpenDate || undefined,
        registrationCloseDate: formData.registrationCloseDate || undefined,
        resultsUrl: formData.resultsUrl || undefined,
        status: formData.status,
        registrationStatus: formData.registrationStatus,
      };

      // Chronicle solo para actualización
      if (isEditMode && formData.chronicle) {
        payload.chronicle = formData.chronicle;
      }

      let result: Edition;

      if (isEditMode) {
        result = await editionsService.update(edition.id, payload);
        toast.success('Edición actualizada correctamente');
      } else {
        result = await editionsService.create(competitionId, payload);
        toast.success('Edición creada correctamente');
      }

      if (onSuccess) {
        onSuccess(result);
      } else {
        router.push(`/organizer/competitions/${competitionId}`);
      }
    } catch (err: any) {
      console.error('Error saving edition:', err);
      const errorMessage =
        err.response?.data?.message || 'Error al guardar la edición';
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
            {isEditMode ? 'Editar Edición' : 'Nueva Edición'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Define las características de esta edición de {competition.name}
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

        {/* Year */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
            Año *
          </label>
          <input
            type="number"
            id="year"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            placeholder="2025"
            required
            min="1900"
            max="2100"
            disabled={isEditMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
          />
          {isEditMode && (
            <p className="text-xs text-gray-500 mt-1">
              El año no puede modificarse una vez creada la edición
            </p>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fecha de Inicio *
            </label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Fin
            </label>
            <input
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad
          </label>
          <input
            type="text"
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder={
              competition.event?.city
                ? `Heredado del evento: ${competition.event.city}`
                : 'Ciudad'
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {competition.event?.city
              ? `Deja vacío para heredar del evento: ${competition.event.city}`
              : 'Opcional'}
          </p>
        </div>

        {/* Chronicle */}
        <div>
          <label htmlFor="chronicle" className="block text-sm font-medium text-gray-700 mb-1">
            Crónica
          </label>
          <textarea
            id="chronicle"
            value={formData.chronicle}
            onChange={(e) => setFormData({ ...formData, chronicle: e.target.value })}
            rows={6}
            placeholder="Escribe aquí la crónica de esta edición..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Relato detallado de cómo fue esta edición (condiciones, anécdotas, etc.)
          </p>
        </div>
      </div>

      {/* Technical Specs Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="flex items-start gap-3 mb-4">
          <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Características Técnicas
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Deja vacío para heredar los valores base de la competición
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Distance */}
          <div>
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
              Distancia (km)
            </label>
            <input
              type="number"
              id="distance"
              value={formData.distance}
              onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
              placeholder={
                competition.baseDistance
                  ? `Base: ${competition.baseDistance} km`
                  : 'Distancia'
              }
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {competition.baseDistance && (
              <p className="text-xs text-gray-500 mt-1">
                Base: {competition.baseDistance} km
              </p>
            )}
          </div>

          {/* Elevation */}
          <div>
            <label htmlFor="elevation" className="block text-sm font-medium text-gray-700 mb-1">
              Desnivel (m D+)
            </label>
            <input
              type="number"
              id="elevation"
              value={formData.elevation}
              onChange={(e) => setFormData({ ...formData, elevation: e.target.value })}
              placeholder={
                competition.baseElevation
                  ? `Base: ${competition.baseElevation} m D+`
                  : 'Desnivel'
              }
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {competition.baseElevation && (
              <p className="text-xs text-gray-500 mt-1">
                Base: {competition.baseElevation} m D+
              </p>
            )}
          </div>

          {/* Max Participants */}
          <div>
            <label
              htmlFor="maxParticipants"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Participantes Máx.
            </label>
            <input
              type="number"
              id="maxParticipants"
              value={formData.maxParticipants}
              onChange={(e) =>
                setFormData({ ...formData, maxParticipants: e.target.value })
              }
              placeholder={
                competition.baseMaxParticipants
                  ? `Base: ${competition.baseMaxParticipants}`
                  : 'Máximo'
              }
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {competition.baseMaxParticipants && (
              <p className="text-xs text-gray-500 mt-1">
                Base: {competition.baseMaxParticipants}
              </p>
            )}
          </div>
        </div>

        {/* Current Participants */}
        <div>
          <label
            htmlFor="currentParticipants"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Participantes Actuales
          </label>
          <input
            type="number"
            id="currentParticipants"
            value={formData.currentParticipants}
            onChange={(e) =>
              setFormData({ ...formData, currentParticipants: e.target.value })
            }
            placeholder="0"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Número de participantes inscritos actualmente
          </p>
        </div>
      </div>

      {/* Registration Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Inscripción</h3>

        {/* Registration URL */}
        <div>
          <label
            htmlFor="registrationUrl"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            URL de Inscripción
          </label>
          <input
            type="url"
            id="registrationUrl"
            value={formData.registrationUrl}
            onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Registration Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="registrationOpenDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Apertura de Inscripciones
            </label>
            <input
              type="date"
              id="registrationOpenDate"
              value={formData.registrationOpenDate}
              onChange={(e) =>
                setFormData({ ...formData, registrationOpenDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="registrationCloseDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cierre de Inscripciones
            </label>
            <input
              type="date"
              id="registrationCloseDate"
              value={formData.registrationCloseDate}
              onChange={(e) =>
                setFormData({ ...formData, registrationCloseDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Results URL */}
        <div>
          <label htmlFor="resultsUrl" className="block text-sm font-medium text-gray-700 mb-1">
            URL de Resultados
          </label>
          <input
            type="url"
            id="resultsUrl"
            value={formData.resultsUrl}
            onChange={(e) => setFormData({ ...formData, resultsUrl: e.target.value })}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Status Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Edition Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Estado de la Edición
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as EditionStatus })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value={EditionStatus.UPCOMING}>Próxima</option>
              <option value={EditionStatus.ONGOING}>En Curso</option>
              <option value={EditionStatus.FINISHED}>Finalizada</option>
              <option value={EditionStatus.CANCELLED}>Cancelada</option>
            </select>
          </div>

          {/* Registration Status */}
          <div>
            <label
              htmlFor="registrationStatus"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Estado de Inscripción
            </label>
            <select
              id="registrationStatus"
              value={formData.registrationStatus}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  registrationStatus: e.target.value as RegistrationStatus,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value={RegistrationStatus.NOT_OPEN}>No Abierta</option>
              <option value={RegistrationStatus.COMING_SOON}>Próximamente</option>
              <option value={RegistrationStatus.OPEN}>Abierta</option>
              <option value={RegistrationStatus.CLOSED}>Cerrada</option>
              <option value={RegistrationStatus.FULL}>Completa</option>
            </select>
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
              {isEditMode ? 'Actualizar' : 'Crear'} Edición
            </>
          )}
        </button>
      </div>
    </form>
  );
}
