'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { ImageIcon } from 'lucide-react';

interface EventGalleryProps {
  images: string[];
  eventName: string;
}

export default function EventGallery({ images, eventName }: EventGalleryProps) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  // Preparar slides para el lightbox
  const slides = images.map((url) => ({
    src: url,
    alt: eventName,
  }));

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
          <ImageIcon className="w-6 h-6 text-green-600" />
          Galería
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => openLightbox(index)}
              className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer 
                         hover:ring-2 hover:ring-green-500 transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label={`Ver imagen ${index + 1} de ${images.length}`}
            >
              <Image
                src={image}
                alt={`${eventName} - Imagen ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              
              {/* Overlay en hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 
                            transition-colors duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ImageIcon className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
              </div>
              
              {/* Número de imagen */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs 
                            px-2 py-1 rounded-full font-medium">
                {index + 1}/{images.length}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={currentIndex}
        on={{
          view: ({ index }) => setCurrentIndex(index),
        }}
        controller={{
          closeOnBackdropClick: true,
        }}
        carousel={{
          finite: images.length <= 1,
        }}
        render={{
          buttonPrev: images.length <= 1 ? () => null : undefined,
          buttonNext: images.length <= 1 ? () => null : undefined,
        }}
      />
    </>
  );
}
