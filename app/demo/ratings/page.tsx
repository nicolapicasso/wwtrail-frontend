// app/demo/ratings/page.tsx - Página de demo para probar componentes

'use client';

import { useState } from 'react';
import StarRating from '@/components/StarRating';
import RatingForm from '@/components/RatingForm';
import RatingSummary from '@/components/RatingSummary';
import RatingCard from '@/components/RatingCard';
import PodiumCard from '@/components/PodiumCard';
import EditionGallery from '@/components/EditionGallery';
import WeatherCard from '@/components/WeatherCard';
import RecentRatingsWidget from '@/components/RecentRatingsWidget';
import { PodiumType } from '@/types/podium';

export default function DemoRatingsPage() {
  const [starValue, setStarValue] = useState(0);

  // Datos de ejemplo
  const mockRatingSummary = {
    avgRating: 3.7,
    totalRatings: 24,
    breakdown: {
      infoBriefing: 3.8,
      racePack: 3.5,
      village: 3.9,
      marking: 4.0,
      aid: 3.6,
      finisher: 3.7,
      eco: 3.8,
    },
  };

  const mockRating = {
    id: '1',
    editionId: 'edition-1',
    userId: 'user-1',
    ratingInfoBriefing: 4,
    ratingRacePack: 3,
    ratingVillage: 4,
    ratingMarking: 4,
    ratingAid: 3,
    ratingFinisher: 4,
    ratingEco: 4,
    comment: 'Increíble experiencia en el UTMB 2024. La organización fue impecable, el marcaje perfecto y los avituallamientos muy completos. ¡Volveré el próximo año!',
    user: {
      id: 'user-1',
      username: 'runner_pro',
      avatar: undefined,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockPodium = {
    id: '1',
    editionId: 'edition-1',
    type: PodiumType.GENERAL,
    firstPlace: 'Kilian Jornet',
    firstTime: '19:49:30',
    secondPlace: 'Jim Walmsley',
    secondTime: '20:15:45',
    thirdPlace: 'Zach Miller',
    thirdTime: '20:42:18',
    sortOrder: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockPhotos = [
    {
      id: '1',
      editionId: 'edition-1',
      url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
      thumbnail: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400',
      caption: 'Salida del UTMB 2024',
      photographer: 'John Doe',
      sortOrder: 0,
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      editionId: 'edition-1',
      url: 'https://images.unsplash.com/photo-1472198779197-52d723bb5d81?w=800',
      thumbnail: 'https://images.unsplash.com/photo-1472198779197-52d723bb5d81?w=400',
      caption: 'Paso por montaña',
      sortOrder: 1,
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      editionId: 'edition-1',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      caption: 'Vista panorámica',
      sortOrder: 2,
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const mockWeather = {
    date: '2024-08-26',
    temperature: {
      avg: 18.5,
      min: 12.0,
      max: 25.0,
    },
    condition: 'sunny' as const,
    conditionText: 'Soleado',
    precipitation: 0.0,
    wind: {
      speed: 12,
      direction: 180,
      directionText: 'S',
    },
    humidity: 65,
    pressure: 1013,
    cloudCover: 20,
    fetchedAt: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Demo de Nuevos Componentes
          </h1>
          <p className="text-gray-600">
            Visualización de todos los componentes implementados
          </p>
        </div>

        {/* Grid de componentes */}
        <div className="space-y-12">

          {/* 1. StarRating */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Star Rating (Selector de Estrellas)
            </h2>
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
              <StarRating
                label="Ejemplo interactivo"
                description="Haz click en las estrellas"
                value={starValue}
                onChange={setStarValue}
                max={4}
                size="lg"
              />

              <StarRating
                label="Solo lectura (3 estrellas)"
                value={3}
                readonly
                size="md"
              />

              <StarRating
                label="Tamaño pequeño"
                value={4}
                readonly
                size="sm"
              />
            </div>
          </section>

          {/* 2. Rating Summary */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Rating Summary (Resumen de Valoraciones)
            </h2>
            <RatingSummary summary={mockRatingSummary} />
          </section>

          {/* 3. Rating Card */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Rating Card (Tarjeta de Valoración)
            </h2>
            <RatingCard rating={mockRating} canEdit={false} />
          </section>

          {/* 4. Rating Form */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Rating Form (Formulario de Valoración)
            </h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-sm text-gray-600 mb-4">
                ⚠️ Este formulario no funciona sin backend conectado
              </p>
              {/* Deshabilitado para demo */}
            </div>
          </section>

          {/* 5. Podium Card */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Podium Card (Clasificación)
            </h2>
            <PodiumCard podium={mockPodium} canEdit={false} />
          </section>

          {/* 6. Edition Gallery */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Edition Gallery (Galería de Fotos)
            </h2>
            <EditionGallery
              photos={mockPhotos}
              editionId="edition-1"
              canEdit={false}
            />
          </section>

          {/* 7. Weather Card */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Weather Card (Condiciones Meteorológicas)
            </h2>
            <WeatherCard weather={mockWeather} canRefetch={false} />
          </section>

          {/* 8. Recent Ratings Widget */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Recent Ratings Widget (Últimos Comentarios)
            </h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-sm text-gray-600">
                ⚠️ Este widget requiere backend conectado para mostrar datos reales
              </p>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
