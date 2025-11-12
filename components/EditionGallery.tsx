// components/EditionGallery.tsx - Galería de fotos de una edición con lightbox

'use client';

import { useState, useCallback } from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import type { EditionPhoto } from '@/types/photo';

interface EditionGalleryProps {
  photos: EditionPhoto[];
  editionId: string;
  canEdit?: boolean;
  onUpload?: (files: File[]) => Promise<void>;
  onDelete?: (photoId: string) => Promise<void>;
}

export default function EditionGallery({
  photos,
  editionId,
  canEdit = false,
  onUpload,
  onDelete,
}: EditionGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploading, setUploading] = useState(false);

  // Foto destacada
  const featuredPhoto = photos.find((p) => p.isFeatured);
  const otherPhotos = photos.filter((p) => !p.isFeatured);

  // Preparar slides para lightbox
  const slides = photos.map((photo) => ({
    src: photo.url,
    alt: photo.caption || '',
    description: photo.caption,
  }));

  const openLightbox = useCallback((index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !onUpload) return;

    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      await onUpload(files);
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  if (photos.length === 0 && !canEdit) {
    return (
      <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12">
        <div className="text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Esta edición aún no tiene fotos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Featured Photo */}
      {featuredPhoto && (
        <div className="relative group">
          <img
            src={featuredPhoto.url}
            alt={featuredPhoto.caption || 'Foto destacada'}
            className="w-full h-96 object-cover rounded-lg cursor-pointer"
            onClick={() => openLightbox(0)}
          />

          {featuredPhoto.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
              <p className="text-white text-sm font-medium">
                {featuredPhoto.caption}
              </p>
              {featuredPhoto.photographer && (
                <p className="text-white/80 text-xs mt-1">
                  📸 {featuredPhoto.photographer}
                </p>
              )}
            </div>
          )}

          {canEdit && onDelete && (
            <button
              onClick={() => onDelete(featuredPhoto.id)}
              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Photo Grid */}
      {otherPhotos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {otherPhotos.map((photo, index) => {
            const lightboxIndex = featuredPhoto ? index + 1 : index;

            return (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.thumbnail || photo.url}
                  alt={photo.caption || ''}
                  className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => openLightbox(lightboxIndex)}
                />

                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs line-clamp-2">
                      {photo.caption}
                    </p>
                  </div>
                )}

                {canEdit && onDelete && (
                  <button
                    onClick={() => onDelete(photo.id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Button */}
      {canEdit && onUpload && (
        <div>
          <label className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50">
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Subir Fotos
              </>
            )}
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Máximo 10 fotos por vez. Formatos: JPG, PNG, WEBP (máx 10 MB cada una)
          </p>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={currentIndex}
        slides={slides}
        on={{
          view: ({ index }) => setCurrentIndex(index),
        }}
      />
    </div>
  );
}
