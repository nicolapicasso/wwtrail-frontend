'use client';

import { PendingEvent } from '@/lib/api/admin.service';
import { Calendar, MapPin, User, Clock, Check, X, Eye } from 'lucide-react';

interface EventApprovalQueueProps {
  events: PendingEvent[];
  onApprove: (eventId: string) => void;
  onReject: (eventId: string) => void;
  onView: (eventId: string) => void;
}

export default function EventApprovalQueue({ 
  events, 
  onApprove, 
  onReject,
  onView 
}: EventApprovalQueueProps) {
  const getStatusBadge = (status: string) => {
    const styles = {
      DRAFT: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      PUBLISHED: 'bg-green-100 text-green-700 border-green-200',
      REJECTED: 'bg-red-100 text-red-700 border-red-200',
    };

    return (
      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <Clock className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No hay eventos pendientes
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Todos los eventos han sido revisados
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            {/* Event Info */}
            <div className="flex-1">
              <div className="flex items-start gap-4">
                {/* Event Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {event.name}
                    </h3>
                    {getStatusBadge(event.status)}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{event.city}, {event.country}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{event.organizer.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Enviado {formatDate(event.createdAt)}</span>
                    </div>
                  </div>

                  {/* Organizer Info */}
                  <div className="mt-3 rounded-lg bg-gray-50 p-3">
                    <p className="text-xs font-medium text-gray-500">ORGANIZADOR</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-sm font-semibold">
                        {event.organizer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {event.organizer.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {event.organizer.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="ml-6 flex flex-col gap-2">
              <button
                onClick={() => onView(event.id)}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Eye className="h-4 w-4" />
                Ver Detalle
              </button>
              <button
                onClick={() => {
                  if (confirm(`¿Aprobar el evento "${event.name}"?`)) {
                    onApprove(event.id);
                  }
                }}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                <Check className="h-4 w-4" />
                Aprobar
              </button>
              <button
                onClick={() => {
                  const reason = prompt('Motivo del rechazo (opcional):');
                  if (reason !== null) {
                    onReject(event.id);
                  }
                }}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                <X className="h-4 w-4" />
                Rechazar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
