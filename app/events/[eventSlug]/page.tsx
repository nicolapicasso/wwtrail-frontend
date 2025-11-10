/**
 * 🔧 app/events/[eventSlug]/page.tsx - VERSIÓN MEJORADA
 * ======================================================
 * ✅ Logo destacado en sidebar
 * ✅ Mapa interactivo con Leaflet
 * ✅ Eventos cercanos en el mapa
 */

import { eventsService } from '@/lib/api/events.service';
import { Event } from '@/types/api';
import { 
  MapPin, Calendar, Globe, Mail, Phone, Facebook, Instagram,
  Trophy, Eye, Clock, Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import EventMap from '@/components/EventMap';
import EventGallery from '@/components/EventGallery';

// ============================================================================
// 📋 METADATA
// ============================================================================

export async function generateMetadata({ params }: { params: { eventSlug: string } }) {
  try {
    const event = await eventsService.getBySlug(params.eventSlug);
    
    return {
      title: `${event.name} | WWTRAIL`,
      description: event.description || `Trail running event in ${event.city}, ${event.country}`,
      openGraph: {
        title: event.name,
        description: event.description,
        images: event.coverImage ? [event.coverImage] : [],
      }
    };
  } catch (error) {
    return {
      title: 'Event Not Found | WWTRAIL',
    };
  }
}

// ============================================================================
// 🎨 PÁGINA PRINCIPAL
// ============================================================================

export default async function EventDetailPage({ 
  params 
}: { 
  params: { eventSlug: string } 
}) {
  let event: Event;
  let nearbyEvents: Event[] = [];

  try {
    event = await eventsService.getBySlug(params.eventSlug);
    
    // ✅ Obtener eventos cercanos para el mapa
    if (event.latitude && event.longitude) {
      try {
        nearbyEvents = await eventsService.getNearby(
          event.latitude, 
          event.longitude, 
          50 // 50km radius
        );
        // Filtrar el evento actual
        nearbyEvents = nearbyEvents.filter(e => e.id !== event.id);
      } catch (error) {
        console.error('Error loading nearby events:', error);
      }
    }
  } catch (error) {
    console.error('Error loading event:', error);
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ============================================================ */}
      {/* 🖼️ HERO SECTION CON COVER IMAGE */}
      {/* ============================================================ */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-green-600">
        {(event.coverImage || event.coverImageUrl) ? (
          <img
            src={event.coverImage || event.coverImageUrl}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Breadcrumb */}
        <div className="absolute top-4 left-4 z-10">
          <Link 
            href="/events" 
            className="text-white hover:text-gray-200 flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm"
          >
            ← Volver a eventos
          </Link>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
          <div className="container mx-auto">
            <div className="flex items-end justify-between">
              <div>
                {event.featured && (
                  <div className="mb-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-semibold">
                      <Trophy className="h-4 w-4 fill-white" />
                      Featured
                    </span>
                  </div>
                )}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {event.name}
                </h1>
                <div className="flex flex-wrap gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{event.city}, {event.country}</span>
                  </div>
                  {event.typicalMonth && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      <span>{getMonthName(event.typicalMonth)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ============================================================ */}
          {/* 📄 COLUMNA PRINCIPAL - Información detallada */}
          {/* ============================================================ */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Descripción */}
            {event.description && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Sobre el Evento</h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

           {/* Galería */}
<EventGallery 
  images={event.gallery || []} 
  eventName={event.name}
/>
            {/* Competiciones del Evento */}
            {event.competitions && event.competitions.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-green-600" />
                  Competiciones ({event.competitions.length})
                </h2>
                <div className="space-y-3">
                  {event.competitions.map((competition) => (
                    <Link
                      key={competition.id}
                      href={`/events/${event.slug}/${competition.slug}`}
                      className="block p-4 border rounded-lg hover:border-green-600 hover:bg-green-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{competition.name}</h3>
                          {competition._count?.editions && (
                            <p className="text-sm text-gray-600">
                              {competition._count.editions} ediciones
                            </p>
                          )}
                        </div>
                        <span className="text-green-600 font-semibold">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Información Detallada */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Información Detallada</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="País" value={event.country} />
                <InfoRow label="Ciudad" value={event.city} />
                {event.region && <InfoRow label="Región" value={event.region} />}
                
                {event.type && (
                  <div className="flex items-start gap-3">
                    <div className="font-semibold text-gray-700 w-32">Tipo:</div>
                    <div className="flex-1">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {event.type}
                      </span>
                    </div>
                  </div>
                )}
                
                {event.firstEditionYear && (
                  <InfoRow label="Primera Edición" value={event.firstEditionYear.toString()} />
                )}
                
                {event.typicalMonth && (
                  <InfoRow label="Mes Típico" value={getMonthName(event.typicalMonth)} />
                )}
                
                {event.originalLanguage && (
                  <InfoRow label="Idioma Original" value={getLanguageName(event.originalLanguage)} />
                )}
              </div>
            </div>

            {/* Organizador */}
            {event.organizer && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Organizador</h2>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white text-2xl font-bold">
                    {event.organizer.firstName?.[0] || event.organizer.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      {event.organizer.firstName && event.organizer.lastName
                        ? `${event.organizer.firstName} ${event.organizer.lastName}`
                        : event.organizer.username}
                    </p>
                    <p className="text-sm text-gray-600">{event.organizer.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* 📊 SIDEBAR - Logo, Mapa, Estadísticas y Contacto */}
          {/* ============================================================ */}
          <div className="space-y-6">
            
            {/* ✅ LOGO DEL EVENTO */}
            {(event.logo || event.logoUrl) && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-center">
                  <img
                    src={event.logo || event.logoUrl}
                    alt={`${event.name} logo`}
                    className="max-h-32 w-auto object-contain"
                  />
                </div>
              </div>
            )}

            {/* ✅ MAPA INTERACTIVO */}
            {event.latitude && event.longitude && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Ubicación
                </h3>
                <EventMap 
                  event={event}
                  nearbyEvents={nearbyEvents}
                />
                <div className="mt-4">
                  <a 
                    href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver en Google Maps
                  </a>
                </div>
              </div>
            )}
            
            {/* Estadísticas */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-4">Estadísticas</h3>
              <div className="space-y-3">
                <StatItem
                  icon={<Eye className="h-5 w-5 text-gray-500" />}
                  label="Visualizaciones"
                  value={event.viewCount.toLocaleString()}
                />
                {event._count?.competitions && (
                  <StatItem
                    icon={<Trophy className="h-5 w-5 text-gray-500" />}
                    label="Competiciones"
                    value={event._count.competitions.toString()}
                  />
                )}
                {event.firstEditionYear && (
                  <StatItem
                    icon={<Clock className="h-5 w-5 text-gray-500" />}
                    label="Años de historia"
                    value={(new Date().getFullYear() - event.firstEditionYear + 1).toString()}
                  />
                )}
              </div>
            </div>

            {/* Contacto y Redes Sociales */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-4">Contacto</h3>
              <div className="space-y-3">
                {event.website && (
                  <ContactLink
                    href={event.website}
                    icon={<Globe className="h-5 w-5" />}
                    label="Sitio Web"
                  />
                )}
                
                {event.email && (
                  <ContactLink
                    href={`mailto:${event.email}`}
                    icon={<Mail className="h-5 w-5" />}
                    label={event.email}
                  />
                )}
                
                {event.phone && (
                  <ContactLink
                    href={`tel:${event.phone}`}
                    icon={<Phone className="h-5 w-5" />}
                    label={event.phone}
                  />
                )}
                
                {event.facebook && (
                  <ContactLink
                    href={event.facebook}
                    icon={<Facebook className="h-5 w-5" />}
                    label="Facebook"
                  />
                )}
                
                {event.instagram && (
                  <ContactLink
                    href={event.instagram}
                    icon={<Instagram className="h-5 w-5" />}
                    label="Instagram"
                  />
                )}
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-lg shadow-lg p-6 text-white">
              <h3 className="font-bold text-lg mb-2">¿Interesado?</h3>
              <p className="text-sm mb-4 text-white/90">
                Guarda este evento en tus favoritos
              </p>
              <button className="w-full bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Guardar Evento
              </button>
            </div>

            {/* Eventos Similares */}
            {nearbyEvents && nearbyEvents.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg mb-4">
                  Eventos Cercanos ({nearbyEvents.length})
                </h3>
                <div className="space-y-2">
                  {nearbyEvents.slice(0, 3).map((nearbyEvent) => (
                    <Link
                      key={nearbyEvent.id}
                      href={`/events/${nearbyEvent.slug}`}
                      className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      → {nearbyEvent.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 🧩 COMPONENTES AUXILIARES
// ============================================================================

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="font-semibold text-gray-700 w-32">{label}:</div>
      <div className="flex-1 text-gray-900">{value}</div>
    </div>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-gray-600">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className="font-bold text-gray-900">{value}</span>
    </div>
  );
}

function ContactLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors group"
    >
      <div className="text-green-600 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-sm group-hover:underline">{label}</span>
    </a>
  );
}

// ============================================================================
// 🛠️ UTILIDADES
// ============================================================================

function getMonthName(month: number): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[month - 1] || 'Desconocido';
}

function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    ES: 'Español',
    EN: 'English',
    IT: 'Italiano',
    CA: 'Català',
    FR: 'Français',
    DE: 'Deutsch'
  };
  return languages[code] || code;
}
