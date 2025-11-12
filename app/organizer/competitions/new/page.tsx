// app/organizer/competitions/new/page.tsx - Crear nueva competición

'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CompetitionForm from '@/components/forms/CompetitionForm';
import eventsService from '@/lib/api/v2/events.service';
import type { Event } from '@/types/api';

function NewCompetitionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) {
      router.push('/organizer/events');
      return;
    }

    const fetchEvent = async () => {
      try {
        const data = await eventsService.getById(eventId);
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
        router.push('/organizer/events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!event || !eventId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Link
            href={`/organizer/events/${eventId}`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a {event.name}
          </Link>
        </div>

        {/* Event Context */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Evento:</span> {event.name}
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Estás creando una nueva competición para este evento
          </p>
        </div>

        {/* Form */}
        <CompetitionForm
          eventId={eventId}
          onSuccess={(competition) => {
            router.push(`/organizer/events/${eventId}`);
          }}
          onCancel={() => {
            router.push(`/organizer/events/${eventId}`);
          }}
        />
      </div>
    </div>
  );
}

export default function NewCompetitionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <NewCompetitionContent />
    </Suspense>
  );
}
