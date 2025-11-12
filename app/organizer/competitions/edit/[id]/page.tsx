// app/organizer/competitions/edit/[id]/page.tsx - Editar competición existente

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import CompetitionForm from '@/components/forms/CompetitionForm';
import competitionsService from '@/lib/api/v2/competitions.service';
import type { Competition } from '@/types/competition';

interface EditCompetitionPageProps {
  params: {
    id: string;
  };
}

export default function EditCompetitionPage({ params }: EditCompetitionPageProps) {
  const router = useRouter();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const data = await competitionsService.getById(params.id);
        setCompetition(data);
      } catch (err: any) {
        console.error('Error fetching competition:', err);
        setError('No se pudo cargar la competición');
      } finally {
        setLoading(false);
      }
    };

    fetchCompetition();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando competición...</p>
        </div>
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h2 className="text-lg font-semibold text-red-900 mb-2">
              Error al cargar
            </h2>
            <p className="text-sm text-red-700 mb-4">
              {error || 'Competición no encontrada'}
            </p>
            <Link
              href="/organizer/events"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a mis eventos
            </Link>
          </div>
        </div>
      </div>
    );
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
            <span className="font-semibold">Editando:</span> {competition.name}
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Los cambios se aplicarán inmediatamente
          </p>
        </div>

        {/* Form */}
        <CompetitionForm
          eventId={competition.eventId}
          competition={competition}
          onSuccess={(updatedCompetition) => {
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
