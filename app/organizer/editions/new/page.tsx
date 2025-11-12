// app/organizer/editions/new/page.tsx - Crear nueva edición

'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import EditionForm from '@/components/forms/EditionForm';
import competitionsService from '@/lib/api/v2/competitions.service';
import type { Competition } from '@/types/competition';

function NewEditionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const competitionId = searchParams.get('competitionId');

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!competitionId) {
      router.push('/organizer/events');
      return;
    }

    const fetchCompetition = async () => {
      try {
        const data = await competitionsService.getById(competitionId);
        setCompetition(data);
      } catch (error) {
        console.error('Error fetching competition:', error);
        router.push('/organizer/events');
      } finally {
        setLoading(false);
      }
    };

    fetchCompetition();
  }, [competitionId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!competition || !competitionId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Link
            href={`/organizer/events/${competition.eventId}`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al evento
          </Link>
        </div>

        {/* Competition Context */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Competición:</span> {competition.name}
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Estás creando una nueva edición para esta competición
          </p>
          {(competition.baseDistance || competition.baseElevation || competition.baseMaxParticipants) && (
            <div className="text-xs text-blue-700 mt-2 flex flex-wrap gap-3">
              {competition.baseDistance && (
                <span>📏 {competition.baseDistance} km</span>
              )}
              {competition.baseElevation && (
                <span>⛰️ {competition.baseElevation} m D+</span>
              )}
              {competition.baseMaxParticipants && (
                <span>👥 {competition.baseMaxParticipants} participantes</span>
              )}
            </div>
          )}
        </div>

        {/* Form */}
        <EditionForm
          competitionId={competitionId}
          competition={competition}
          onSuccess={(edition) => {
            router.push(`/organizer/events/${competition.eventId}`);
          }}
          onCancel={() => {
            router.push(`/organizer/events/${competition.eventId}`);
          }}
        />
      </div>
    </div>
  );
}

export default function NewEditionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <NewEditionContent />
    </Suspense>
  );
}
