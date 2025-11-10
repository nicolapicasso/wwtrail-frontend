// components/EventCard.tsx - Extended card with images and management features

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Event } from '@/lib/types/event';
import { 
  Calendar, MapPin, Users, Eye, Edit, Trash2, Plus, 
  CheckCircle, XCircle, Clock, Star, Mountain, Globe, 
  TrendingUp, Image as ImageIcon 
} from 'lucide-react';

interface EventCardProps {
  event: Event;
  showStats?: boolean;
  onClick?: () => void;
  viewMode?: 'grid' | 'list';
  // Props para modo gestión
  managementMode?: boolean;
  userRole?: 'ADMIN' | 'ORGANIZER' | 'ATHLETE';
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  onAddCompetition?: (eventId: string) => void;
  onApprove?: (eventId: string) => void;
  onReject?: (eventId: string) => void;
  onToggleFeatured?: (eventId: string) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const COUNTRY_FLAGS: { [key: string]: string } = {
  'ES': '🇪🇸', 'FR': '🇫🇷', 'IT': '🇮🇹', 'CH': '🇨🇭',
  'US': '🇺🇸', 'GB': '🇬🇧', 'DE': '🇩🇪', 'AT': '🇦🇹',
  'PT': '🇵🇹', 'CA': '🇨🇦', 'NL': '🇳🇱', 'BE': '🇧🇪',
};

export default function EventCard({ 
  event, 
  showStats = true, 
  onClick,
  viewMode = 'grid',
  // Management mode props
  managementMode = false,
  userRole = 'ATHLETE',
  onEdit,
  onDelete,
  onAddCompetition,
  onApprove,
  onReject,
  onToggleFeatured,
}: EventCardProps) {
  
  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Determinar imagen principal
  const mainImage = event.coverImage || event.gallery?.[0] || event.bannerImage || null;
  const hasGallery = event.gallery && event.gallery.length > 0;
  const competitionCount = event._count?.competitions || 0;

  // Función para obtener config de estado (modo gestión)
  const getStatusConfig = (status: string) => {
    const configs = {
      PUBLISHED: {
        label: 'Publicado',
        color: 'text-green-700',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: CheckCircle,
      },
      DRAFT: {
        label: 'Borrador',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        icon: Clock,
      },
      REJECTED: {
        label: 'Rechazado',
        color: 'text-red-700',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: XCircle,
      },
      CANCELLED: {
        label: 'Cancelado',
        color: 'text-gray-700',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        icon: XCircle,
      },
    };
    return configs[status as keyof typeof configs] || configs.DRAFT;
  };

  // Permisos según rol (modo gestión)
  const statusConfig = getStatusConfig(event.status);
  const StatusIcon = statusConfig.icon;
  const canEdit = managementMode && (userRole === 'ADMIN' || event.status !== 'PUBLISHED');
  const canApprove = managementMode && userRole === 'ADMIN' && event.status === 'DRAFT';
  const canDelete = managementMode && userRole === 'ADMIN';
  const canAddCompetition = managementMode && event.status === 'PUBLISHED';
  const canToggleFeatured = managementMode && userRole === 'ADMIN';

  // Renderizar imagen o placeholder
  const renderImage = () => {
    if (mainImage && !imageError) {
      return (
        <Image
          src={mainImage}
          alt={event.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImageError(true)}
        />
      );
    } else {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
          <Mountain className="h-20 w-20 text-gray-300" />
        </div>
      );
    }
  };

  const content = (
    <div className={`group relative overflow-hidden rounded-lg border text-card-foreground shadow-sm transition-all hover:shadow-md ${
      managementMode ? statusConfig.borderColor + ' bg-white' : 'bg-white border-gray-200'
    } ${viewMode === 'list' ? 'flex flex-col md:flex-row' : 'flex flex-col h-full'}`}>
      
      {/* Image Section */}
      <div className={`relative overflow-hidden bg-gradient-to-br from-blue-50 to-green-50 ${
        viewMode === 'list' ? 'w-full md:w-64 h-48 flex-shrink-0' : 'w-full h-48'
      }`}>
        {renderImage()}

        {/* Overlay Gradient (solo si hay imagen) */}
        {mainImage && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        )}

        {/* Logo Overlay */}
        {event.logoUrl && !logoError && (
          <div className="absolute bottom-3 left-3 bg-white rounded-lg p-2 shadow-lg z-10">
            <div className="relative w-12 h-12">
              <Image
                src={event.logoUrl}
                alt={`${event.name} logo`}
                fill
                className="object-contain"
                onError={() => setLogoError(true)}
              />
            </div>
          </div>
        )}

        {/* Top Right Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
          {/* Featured Badge */}
          {(event.isFeatured || event.featured) && (
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500 px-2.5 py-0.5 text-xs font-semibold text-white shadow-lg">
              <Star className="h-3 w-3 fill-current" />
              Featured
            </span>
          )}
          
          {/* Status Badge (management mode) */}
          {managementMode && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white shadow-lg ${
              event.status === 'PUBLISHED' ? 'bg-green-500' :
              event.status === 'DRAFT' ? 'bg-yellow-500' :
              event.status === 'REJECTED' ? 'bg-red-500' :
              'bg-gray-500'
            }`}>
              <StatusIcon className="h-3 w-3" />
              {statusConfig.label}
            </span>
          )}
        </div>

        {/* Gallery Indicator */}
        {hasGallery && (
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs flex items-center gap-1 z-10">
            <ImageIcon className="h-3 w-3" />
            {event.gallery.length}
          </div>
        )}

        {/* Typical Month Badge */}
        {event.typicalMonth && (
          <div className="absolute bottom-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg z-10">
            {MONTHS[event.typicalMonth - 1]}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={`p-4 flex flex-col ${viewMode === 'list' ? 'flex-1' : 'flex-1'}`}>
        {/* Title */}
        <div className="flex items-start justify-between mb-2">
          <h3 className={`font-semibold group-hover:text-blue-600 transition-colors flex-1 ${
            viewMode === 'list' ? 'text-xl' : 'text-lg line-clamp-2'
          }`}>
            {event.name}
          </h3>
          {managementMode && (event.isFeatured || event.featured) && (
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0 ml-2" />
          )}
        </div>

        {/* Location */}
        <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {COUNTRY_FLAGS[event.country] || '🌍'} {event.city}, {event.country}
          </span>
        </div>

        {/* Description */}
        {event.description && (
          <p className={`mb-3 text-sm text-gray-600 ${
            viewMode === 'list' ? 'line-clamp-2' : 'line-clamp-3'
          } flex-1`}>
            {event.description}
          </p>
        )}

        {/* Rejection reason (management mode) */}
        {managementMode && event.status === 'REJECTED' && event.rejectionReason && (
          <div className="mb-3 p-2 bg-red-50 border border-red-100 rounded text-xs text-red-700">
            <strong>Motivo:</strong> {event.rejectionReason}
          </div>
        )}

        {/* Admin notes (management mode) */}
        {managementMode && userRole === 'ADMIN' && event.adminNotes && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-100 rounded text-xs text-blue-700">
            <strong>Notas admin:</strong> {event.adminNotes}
          </div>
        )}

        {/* Stats Footer */}
        {showStats && (
          <div className={`pt-3 border-t border-gray-100 space-y-2 ${managementMode ? 'mb-0' : ''}`}>
            <div className={`flex items-center text-xs text-gray-500 ${
              viewMode === 'list' ? 'flex-wrap gap-4' : 'justify-between'
            }`}>
              {/* Left side stats */}
              <div className="flex items-center gap-3">
                {event.firstEditionYear && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>Since {event.firstEditionYear}</span>
                  </div>
                )}
                
                {event.website && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <Globe className="h-3 w-3" />
                    <span>Website</span>
                  </div>
                )}
              </div>

              {/* Right side - views */}
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{0} views</span>
              </div>
            </div>

            {/* Competitions count */}
            {competitionCount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-blue-600 font-medium">
                  <Mountain className="h-4 w-4" />
                  <span>{competitionCount} {competitionCount === 1 ? 'race' : 'races'}</span>
                </div>
                {!managementMode && (
                  <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                    View details →
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions bar (management mode) */}
      {managementMode && (
        <div className="p-3 bg-gray-50 border-t flex flex-wrap gap-2">
          {/* Ver (siempre disponible) */}
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye className="h-4 w-4" />
            Ver
          </Link>

          {/* Editar */}
          {canEdit && onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(event.id);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Editar
            </button>
          )}

          {/* Agregar competición */}
          {canAddCompetition && onAddCompetition && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddCompetition(event.id);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Competición
            </button>
          )}

          {/* Aprobar (admin, si draft) */}
          {canApprove && onApprove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApprove(event.id);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              Aprobar
            </button>
          )}

          {/* Rechazar (admin, si draft) */}
          {canApprove && onReject && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReject(event.id);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              <XCircle className="h-4 w-4" />
              Rechazar
            </button>
          )}

          {/* Toggle Featured (admin) */}
          {canToggleFeatured && onToggleFeatured && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFeatured(event.id);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <Star className={`h-4 w-4 ${(event.isFeatured || event.featured) ? 'fill-yellow-500' : ''}`} />
              {(event.isFeatured || event.featured) ? 'Quitar' : 'Destacar'}
            </button>
          )}

          {/* Eliminar (admin, al final) */}
          {canDelete && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(event.id);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors ml-auto"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </button>
          )}
        </div>
      )}

      {/* Hover effect */}
      <div className="absolute inset-0 bg-blue-500/0 transition-colors group-hover:bg-blue-500/5 pointer-events-none" />
    </div>
  );

  // Si hay onClick y NO está en modo gestión con acciones, envolver en button
  if (onClick && !managementMode) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  // Si NO está en modo gestión, envolver en Link
  if (!managementMode) {
    return (
      <Link href={`/events/${event.slug}`} className="block">
        {content}
      </Link>
    );
  }

  // En modo gestión, devolver solo el content (las acciones tienen sus propios handlers)
  return content;
}
