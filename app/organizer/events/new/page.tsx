// app/organizer/events/new/page.tsx - VERSIÓN COMPLETAMENTE CORREGIDA
// ✅ FIX 1: Importación correcta de eventsService (default export)
// ✅ FIX 2: Validación de slug con checkSlug
// ✅ FIX 3: Mes típico restaurado
// ✅ FIX 4: Layout horizontal para imágenes
// ✅ FIX 5: Estructura del servicio verificada

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import eventsService from '@/lib/api/v2/events.service'; // ✅ FIX: default import
import { ArrowLeft, MapPin, Calendar, Save, Loader2, Check, X, AlertCircle, Image } from 'lucide-react';
import CountrySelect from '@/components/CountrySelect';
import FileUpload from '@/components/FileUpload';

export default function NewEventPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    city: '',
    country: '',
    description: '',
    website: '',
    typicalMonth: '',
    firstEditionYear: new Date().getFullYear().toString(),
    latitude: '',
    longitude: '',
    logoUrl: '',
    coverImage: '',
    gallery: [] as string[],
    featured: false,
  });

  // Slug validation state
  const [slugValidation, setSlugValidation] = useState<{
    isChecking: boolean;
    isAvailable: boolean | null;
    error: string | null;
  }>({
    isChecking: false,
    isAvailable: null,
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

  const handleNameChange = (value: string) => {
    const newSlug = generateSlug(value);
    setFormData({
      ...formData,
      name: value,
      slug: newSlug,
    });
    
    // Validar slug si tiene suficiente longitud
    if (newSlug.length >= 3) {
      validateSlug(newSlug);
    } else {
      setSlugValidation({
        isChecking: false,
        isAvailable: null,
        error: null,
      });
    }
  };

  // ✅ FIX: Validación de slug con timeout para debounce
  const validateSlug = async (slug: string) => {
    if (!slug || slug.length < 3) {
      setSlugValidation({
        isChecking: false,
        isAvailable: null,
        error: null,
      });
      return;
    }

    setSlugValidation({
      isChecking: true,
      isAvailable: null,
      error: null,
    });

    try {
      // ✅ FIX: Verificar que eventsService existe y tiene checkSlug
      if (!eventsService || typeof eventsService.checkSlug !== 'function') {
        console.error('eventsService.checkSlug no está disponible');
        setSlugValidation({
          isChecking: false,
          isAvailable: null,
          error: 'Error al validar slug',
        });
        return;
      }

      const result = await eventsService.checkSlug(slug);
      
      setSlugValidation({
        isChecking: false,
        isAvailable: result.available,
        error: null,
      });
    } catch (err: any) {
      console.error('Error checking slug:', err);
      setSlugValidation({
        isChecking: false,
        isAvailable: null,
        error: 'Error al verificar disponibilidad',
      });
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Geocoding con Nominatim
  const handleGeocoding = async () => {
    if (!formData.city.trim() || !formData.country.trim()) {
      setError('Por favor, rellena ciudad y país antes de buscar coordenadas');
      return;
    }

    try {
      setGeocoding(true);
      setError(null);

      const query = `${formData.city}, ${formData.country}`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}` +
        `&format=json` +
        `&limit=1`,
        {
          headers: {
            'User-Agent': 'WWTRAIL/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al buscar coordenadas');
      }

      const data = await response.json();

      if (data.length === 0) {
        setError(`No se encontraron coordenadas para "${query}". Por favor, ingrésalas manualmente.`);
        return;
      }

      setFormData({
        ...formData,
        latitude: parseFloat(data[0].lat).toFixed(6),
        longitude: parseFloat(data[0].lon).toFixed(6),
      });

      alert(`✓ Coordenadas encontradas:\n${data[0].display_name}`);
    } catch (err: any) {
      console.error('Geocoding error:', err);
      setError('Error al buscar coordenadas. Ingrésalas manualmente.');
    } finally {
      setGeocoding(false);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('El nombre del evento es obligatorio');
      return false;
    }
    if (!formData.city.trim()) {
      setError('La ciudad es obligatoria');
      return false;
    }
    if (!formData.country.trim()) {
      setError('El país es obligatorio');
      return false;
    }
    if (!formData.firstEditionYear || parseInt(formData.firstEditionYear) < 1900) {
      setError('El año de primera edición debe ser válido (mayor a 1900)');
      return false;
    }
    if (formData.latitude && (parseFloat(formData.latitude) < -90 || parseFloat(formData.latitude) > 90)) {
      setError('La latitud debe estar entre -90 y 90');
      return false;
    }
    if (formData.longitude && (parseFloat(formData.longitude) < -180 || parseFloat(formData.longitude) > 180)) {
      setError('La longitud debe estar entre -180 y 180');
      return false;
    }
    
    // Validar disponibilidad del slug
    if (formData.slug.length >= 3 && slugValidation.isAvailable === false) {
      setError('El slug ya está en uso. Por favor, modifica el nombre del evento.');
      return false;
    }
    
    return true;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // ✅ CONSOLE.LOG AQUÍ (antes de cualquier validación)
  console.log('📤 FORM DATA COMPLETO:', formData);
  console.log('🖼️ Logo URL:', formData.logoUrl);
  console.log('🎨 Cover URL:', formData.coverImage);
  console.log('📸 Gallery:', formData.gallery);
  
  setError(null);
  
  if (!validateForm()) {
    return;
  }

    // Verificación final del slug
    if (formData.slug.length >= 3) {
      try {
        const slugCheck = await eventsService.checkSlug(formData.slug);
        if (!slugCheck.available) {
          setError('El slug ya está en uso. Por favor, modifica el nombre del evento.');
          return;
        }
      } catch (err) {
        console.error('Error checking slug:', err);
      }
    }

    try {
      setLoading(true);

      const eventData: any = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        city: formData.city.trim(),
        country: formData.country,
        description: formData.description.trim() || null,
        website: formData.website.trim() || null,
        typicalMonth: formData.typicalMonth ? parseInt(formData.typicalMonth) : null,
        firstEditionYear: parseInt(formData.firstEditionYear),
        featured: formData.featured,
        logoUrl: formData.logoUrl || null,
        coverImageUrl: formData.coverImage || null,
        gallery: formData.gallery.length > 0 ? formData.gallery : null,
      };

      console.log('📦 EVENT DATA A ENVIAR:', eventData);
console.log('📦 Logo en eventData:', eventData.logo || eventData.logoUrl);
console.log('📦 Cover en eventData:', eventData.coverImage);

      if (formData.latitude && formData.longitude) {
        eventData.latitude = parseFloat(formData.latitude);
        eventData.longitude = parseFloat(formData.longitude);
      }

      const newEvent = await eventsService.create(eventData);

      const isAdmin = user?.role === 'ADMIN';
      const message = isAdmin
        ? 'Evento creado y publicado correctamente'
        : 'Evento creado correctamente. Pendiente de aprobación por un administrador.';

      alert(message);
      router.push(`/organizer/events`);
    } catch (err: any) {
      console.error('Error creating event:', err);
      
      const errorMessage = err.response?.data?.message || '';
      if (errorMessage.includes('slug') || errorMessage.includes('Unique constraint')) {
        setError('El slug ya está en uso. Por favor, modifica el nombre del evento.');
      } else {
        setError(errorMessage || 'Error al crear el evento');
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para determinar el estado visual del slug input
  const getSlugInputClass = () => {
    const baseClass = 'w-full rounded-lg border px-4 py-2 pr-10 bg-gray-50 text-gray-600 focus:border-blue-500 focus:ring-2 focus:outline-none transition-colors';
    
    if (slugValidation.error) {
      return `${baseClass} border-red-300 focus:border-red-500 focus:ring-red-500`;
    }
    
    if (slugValidation.isAvailable === false) {
      return `${baseClass} border-red-300 focus:border-red-500 focus:ring-red-500`;
    }
    
    if (slugValidation.isAvailable === true) {
      return `${baseClass} border-green-300 focus:border-green-500 focus:ring-green-500`;
    }
    
    return baseClass;
  };

  // Renderizar icono de estado del slug
  const renderSlugIcon = () => {
    if (slugValidation.isChecking) {
      return <Loader2 className="h-5 w-5 animate-spin text-gray-400" />;
    }
    
    if (slugValidation.isAvailable === false) {
      return <X className="h-5 w-5 text-red-500" />;
    }
    
    if (slugValidation.isAvailable === true) {
      return <Check className="h-5 w-5 text-green-500" />;
    }
    
    return null;
  };

  // Renderizar mensaje de feedback del slug
  const renderSlugFeedback = () => {
    if (slugValidation.isChecking) {
      return (
        <p className="mt-1 text-xs text-gray-500">
          Verificando disponibilidad...
        </p>
      );
    }
    
    if (slugValidation.error) {
      return (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {slugValidation.error}
        </p>
      );
    }
    
    if (slugValidation.isAvailable === false) {
      return (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Este slug ya está en uso
        </p>
      );
    }
    
    if (slugValidation.isAvailable === true) {
      return (
        <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
          <Check className="h-3 w-3" />
          Slug disponible
        </p>
      );
    }
    
    return (
      <p className="mt-1 text-xs text-gray-500">
        Se genera automáticamente desde el nombre
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Evento</h1>
          <p className="mt-2 text-gray-600">
            {user?.role === 'ADMIN'
              ? 'El evento se publicará inmediatamente'
              : 'Tu evento será revisado antes de publicarse'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card: Información Básica */}
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Save className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Información Básica</h2>
            </div>
            
            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Evento *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ej: UTMB Mont-Blanc"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Slug con validación visual */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL amigable)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    placeholder="utmb-mont-blanc"
                    className={getSlugInputClass()}
                    readOnly
                  />
                  {/* Icono de estado */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {renderSlugIcon()}
                  </div>
                </div>
                {/* Mensaje de feedback */}
                {renderSlugFeedback()}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Descripción breve del evento..."
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Card: Imágenes */}
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Image className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Imágenes</h2>
            </div>

            {/* Layout horizontal para imágenes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo del Evento
                </label>
                <FileUpload
                  fieldname="logo"
                  onUpload={(url) => handleChange('logoUrl', url)}
                  buttonText="Subir logo"
                  maxSizeMB={2}
                  accept="image/*"
                  showPreview={true}
                />
                {formData.logoUrl && (
                  <p className="text-xs text-green-600 font-medium mt-2">
                    ✓ Logo cargado
                  </p>
                )}
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen de Portada
                </label>
                <FileUpload
                  fieldname="cover"
                  onUpload={(url) => handleChange('coverImage', url)}
                  buttonText="Subir portada"
                  maxSizeMB={5}
                  accept="image/*"
                  showPreview={true}
                />
                {formData.coverImage && (
                  <p className="text-xs text-green-600 font-medium mt-2">
                    ✓ Portada cargada
                  </p>
                )}
              </div>

              {/* Galería */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Galería de Fotos
                </label>
                <FileUpload
                  fieldname="gallery" 
                  multiple={true}
                  onUploadMultiple={(urls) => handleChange('gallery', urls)}
                  buttonText="Subir fotos"
                  maxSizeMB={3}
                  accept="image/*"
                  showPreview={true}
                />
                {formData.gallery.length > 0 && (
                  <p className="text-xs text-green-600 font-medium mt-2">
                    ✓ {formData.gallery.length} fotos
                  </p>
                )}
              </div>
            </div>

            {/* Info compacta */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
              💡 Las imágenes se optimizan automáticamente. Máximo 5MB por archivo.
            </div>
          </div>

          {/* Card: Ubicación */}
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Ubicación</h2>
            </div>

            <div className="space-y-4">
              {/* Ciudad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Ej: Chamonix"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* País */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  País *
                </label>
                <CountrySelect
                  value={formData.country}
                  onChange={(code) => handleChange('country', code)}
                  error={!formData.country && error ? 'Selecciona un país' : undefined}
                />
              </div>

              {/* Botón Geocoding */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGeocoding}
                  disabled={geocoding || !formData.city || !formData.country}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {geocoding ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Buscando coordenadas...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4" />
                      Buscar Coordenadas Automáticamente
                    </>
                  )}
                </button>
                <p className="mt-2 text-xs text-gray-500 text-center">
                  O ingrésalas manualmente abajo
                </p>
              </div>

              {/* Coordenadas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitud
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.latitude}
                    onChange={(e) => handleChange('latitude', e.target.value)}
                    placeholder="41.385063"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitud
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.longitude}
                    onChange={(e) => handleChange('longitude', e.target.value)}
                    placeholder="2.173404"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card: Información Adicional */}
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Información Adicional</h2>
            </div>

            <div className="space-y-4">
              {/* Grid 2 columnas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Mes Típico */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mes Típico del Evento
                  </label>
                  <select
                    value={formData.typicalMonth}
                    onChange={(e) => handleChange('typicalMonth', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Selecciona un mes</option>
                    <option value="1">Enero</option>
                    <option value="2">Febrero</option>
                    <option value="3">Marzo</option>
                    <option value="4">Abril</option>
                    <option value="5">Mayo</option>
                    <option value="6">Junio</option>
                    <option value="7">Julio</option>
                    <option value="8">Agosto</option>
                    <option value="9">Septiembre</option>
                    <option value="10">Octubre</option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Mes habitual del evento
                  </p>
                </div>

                {/* Año Primera Edición */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Año Primera Edición *
                  </label>
                  <input
                    type="number"
                    value={formData.firstEditionYear}
                    onChange={(e) => handleChange('firstEditionYear', e.target.value)}
                    min="1900"
                    max={new Date().getFullYear() + 5}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sitio Web Oficial
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://www.ejemplo.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={
                loading || 
                (formData.slug.length >= 3 && (slugValidation.isChecking || slugValidation.isAvailable === false))
              }
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Crear Evento
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
