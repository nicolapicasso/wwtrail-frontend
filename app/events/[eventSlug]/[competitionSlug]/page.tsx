// app/events/[eventSlug]/[competitionSlug]/page.tsx - Competition detail page
// ⚠️ ESTE ES EL ARCHIVO CORRECTO PARA EL NIVEL [competitionSlug]

'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useCompetition } from '@/hooks/useCompetitions';
import { useEditions } from '@/hooks/useEditions';
import { EditionSelector } from '@/components/EditionSelector';
import { EditionCard } from '@/components/EditionCard';
import { Edition } from '@/types/v2';
import { Mountain, TrendingUp, Users, ArrowLeft, Calendar, MapPin, Info } from 'lucide-react';
import Link from 'next/link';
import EventMap from '@/components/EventMap';
import EventGallery from '@/components/EventGallery';

export default function CompetitionDetailPage() {
  const params = useParams();
  const competitionSlug = params?.competitionSlug as string;
  const eventSlug = params?.eventSlug as string;

  const { competition, loading, error } = useCompetition(competitionSlug);
  const { editions, loading: editionsLoading } = useEditions(competition?.id || '');
  const [selectedEdition, setSelectedEdition] = useState<Edition | null>(null);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="h-64 rounded-lg bg-gray-200" />
          <div className="h-96 rounded-lg bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-2xl font-bold text-red-900">Competition not found</h2>
          <p className="mt-2 text-red-700">{error || 'This competition does not exist'}</p>
          <Link
            href={`/events/${eventSlug}`}
            className="mt-4 inline-block rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Back to Event
          </Link>
        </div>
      </div>
    );
  }

  const handleYearChange = (year: number, edition: Edition | null) => {
    setSelectedEdition(edition);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Cover Image */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-green-600">
        {competition.coverImage && (
          <img
            src={competition.coverImage}
            alt={competition.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            href={`/events/${eventSlug}`}
            className="text-white hover:text-gray-200 flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a {competition.event?.name}
          </Link>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
          <div className="container mx-auto">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {competition.name}
                </h1>
                {competition.event && (
                  <div className="flex items-center gap-2 mt-4 text-white/90">
                    <MapPin className="h-5 w-5" />
                    <span>{competition.event.city}, {competition.event.country}</span>
                  </div>
                )}
              </div>
              {!competition.isActive && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                  Inactiva
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {competition.description && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold flex items-center gap-2">
                  <Info className="h-6 w-6 text-blue-600" />
                  Acerca de
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {competition.description}
                </p>
              </div>
            )}

            {/* Edition Selector */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Select Edition</h2>
              <EditionSelector
                competitionId={competition.id}
                competitionName={competition.name}
                onYearChange={handleYearChange}
              />
            </div>

            {/* Selected Edition Details */}
            {selectedEdition && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold">Edition Details</h2>
                <EditionCard edition={selectedEdition} showInheritance />
              </div>
            )}

            {/* Gallery */}
            {competition.gallery && competition.gallery.length > 0 && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <EventGallery
                  images={competition.gallery}
                  eventName={competition.name}
                />
              </div>
            )}

            {/* All Editions List */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold flex items-center gap-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                All Editions ({editions.length})
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Browse all available editions of this competition
              </p>

              {editionsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : editions.length > 0 ? (
                <div className="space-y-3">
                  {editions.map((edition) => (
                    <Link
                      key={edition.id}
                      href={`/editions/${edition.slug}`}
                      className="block p-4 border rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-blue-600">
                              {edition.year}
                            </span>
                            {edition.specificDate && (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Calendar className="h-4 w-4" />
                                {new Date(edition.specificDate).toLocaleDateString('es-ES', {
                                  day: 'numeric',
                                  month: 'short',
                                })}
                              </div>
                            )}
                          </div>

                          {edition.city && (
                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                              <MapPin className="h-3 w-3" />
                              {edition.city}
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                            {edition.distance && (
                              <span>{edition.distance} km</span>
                            )}
                            {edition.elevation && (
                              <span>{edition.elevation} m D+</span>
                            )}
                            {edition.currentParticipants !== undefined && (
                              <span>{edition.currentParticipants} participantes</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {edition.status && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              edition.status === 'FINISHED' ? 'bg-gray-100 text-gray-700' :
                              edition.status === 'UPCOMING' ? 'bg-blue-100 text-blue-700' :
                              edition.status === 'ONGOING' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {edition.status === 'FINISHED' ? 'Finalizada' :
                               edition.status === 'UPCOMING' ? 'Próxima' :
                               edition.status === 'ONGOING' ? 'En curso' :
                               edition.status}
                            </span>
                          )}
                          <span className="text-blue-600 font-semibold">→</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">
                    No hay ediciones disponibles aún
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Logo with Inheritance */}
            {(competition.logoUrl || competition.event?.logoUrl) && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="flex justify-center">
                  <img
                    src={competition.logoUrl || competition.event?.logoUrl}
                    alt={`${competition.name} logo`}
                    className="max-h-32 w-auto object-contain"
                  />
                </div>
              </div>
            )}

            {/* Map */}
            {competition.event?.latitude && competition.event?.longitude && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Ubicación
                </h3>
                <EventMap
                  event={{
                    ...competition.event,
                    name: competition.name,
                  }}
                  nearbyEvents={[]}
                />
                <div className="mt-4">
                  <a
                    href={`https://www.google.com/maps?q=${competition.event.latitude},${competition.event.longitude}`}
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

            {/* Base Information */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold">Base Information</h3>
              <div className="space-y-4">
                {/* Type */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Mountain className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="font-semibold">{competition.type}</p>
                  </div>
                </div>

                {/* Distance */}
                {competition.baseDistance && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Base Distance</p>
                      <p className="font-semibold">{competition.baseDistance}km</p>
                    </div>
                  </div>
                )}

                {/* Elevation */}
                {competition.baseElevation && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                      <Mountain className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Base Elevation</p>
                      <p className="font-semibold">{competition.baseElevation}m D+</p>
                    </div>
                  </div>
                )}

                {/* Max Participants */}
                {competition.baseMaxParticipants && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Max Participants</p>
                      <p className="font-semibold">{competition.baseMaxParticipants}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Event Info */}
            {competition.event && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold">Event</h3>
                <Link
                  href={`/events/${competition.event.slug}`}
                  className="group block"
                >
                  <p className="font-medium group-hover:text-green-600 transition-colors">
                    {competition.event.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {competition.event.city}, {competition.event.country}
                  </p>
                </Link>
              </div>
            )}

            {/* Stats */}
            {competition._count && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold">Statistics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Editions:</span>
                    <span className="font-semibold">{competition._count.editions || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Note about inheritance */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Individual editions may override these base values.
                Check the edition details for specific information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
