// components/EditionDetailTabs.tsx - Tabs para la página de detalle de Edition

'use client';

import { useState } from 'react';
import { Info, Trophy, Star, Cloud } from 'lucide-react';
import RatingSummary from './RatingSummary';
import RatingForm from './RatingForm';
import RatingCard from './RatingCard';
import PodiumCard from './PodiumCard';
import WeatherCard from './WeatherCard';
import { useRatings } from '@/hooks/useRatings';
import { usePodiums } from '@/hooks/usePodiums';
import { useWeather } from '@/hooks/useWeather';
import { useAuth } from '@/contexts/AuthContext';
import type { Edition } from '@/types/edition';

interface EditionDetailTabsProps {
  edition: Edition;
}

type TabKey = 'info' | 'regulations' | 'podiums' | 'ratings' | 'weather';

export default function EditionDetailTabs({ edition }: EditionDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('info');
  const { user } = useAuth();

  // Hooks
  const {
    ratings,
    loading: ratingsLoading,
    createRating,
    updateRating,
    deleteRating,
  } = useRatings(edition.id);

  const {
    podiumsByType,
    loading: podiumsLoading,
    createPodium,
    updatePodium,
    deletePodium,
  } = usePodiums(edition.id);

  const {
    weather,
    weatherFetched,
    loading: weatherLoading,
    fetching: weatherFetching,
    fetchWeather
  } = useWeather(edition.id);

  // User's rating
  const myRating = ratings.find((r) => r.userId === user?.id);
  const canRate = !!user && !myRating;

  const tabs = [
    { key: 'info' as TabKey, label: 'Información', icon: Info },
    {
      key: 'regulations' as TabKey,
      label: 'Reglamento',
      icon: Info,
      show: !!edition.regulations,
    },
    {
      key: 'podiums' as TabKey,
      label: 'Clasificaciones',
      icon: Trophy,
      count: edition.podiums?.length,
    },
    {
      key: 'ratings' as TabKey,
      label: 'Valoraciones',
      icon: Star,
      count: edition.totalRatings,
    },
    {
      key: 'weather' as TabKey,
      label: 'Meteo',
      icon: Cloud,
      show: true, // Always show weather tab
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs Header */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
          {tabs
            .filter((tab) => tab.show !== false)
            .map((tab) => {
              const isActive = activeTab === tab.key;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      isActive
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`
                        ml-2 py-0.5 px-2 rounded-full text-xs
                        ${
                          isActive
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600'
                        }
                      `}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Información */}
        {activeTab === 'info' && (
          <div className="prose max-w-none">
            <h2>Información de la Edición</h2>
            {edition.chronicle ? (
              <div className="whitespace-pre-wrap">{edition.chronicle}</div>
            ) : (
              <p className="text-gray-600">
                Esta edición aún no tiene información detallada.
              </p>
            )}
          </div>
        )}

        {/* Reglamento */}
        {activeTab === 'regulations' && (
          <div className="prose max-w-none">
            <h2>Reglamento</h2>
            {edition.regulations ? (
              <div className="whitespace-pre-wrap">{edition.regulations}</div>
            ) : (
              <p className="text-gray-600">
                Esta edición aún no tiene reglamento publicado.
              </p>
            )}
          </div>
        )}

        {/* Clasificaciones / Podios */}
        {activeTab === 'podiums' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Clasificaciones</h2>

            {podiumsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-64 bg-gray-200 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <>
                {/* Podios obligatorios */}
                {podiumsByType.general && (
                  <PodiumCard podium={podiumsByType.general} />
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  {podiumsByType.male && (
                    <PodiumCard podium={podiumsByType.male} />
                  )}

                  {podiumsByType.female && (
                    <PodiumCard podium={podiumsByType.female} />
                  )}
                </div>

                {/* Categorías opcionales */}
                {podiumsByType.categories.length > 0 && (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mt-8">
                      Clasificaciones por Categoría
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      {podiumsByType.categories.map((podium) => (
                        <PodiumCard
                          key={podium.id}
                          podium={podium}
                          variant="compact"
                        />
                      ))}
                    </div>
                  </>
                )}

                {!podiumsByType.general &&
                  !podiumsByType.male &&
                  !podiumsByType.female &&
                  podiumsByType.categories.length === 0 && (
                    <p className="text-gray-600 text-center py-12">
                      Esta edición aún no tiene clasificaciones publicadas
                    </p>
                  )}
              </>
            )}
          </div>
        )}

        {/* Valoraciones */}
        {activeTab === 'ratings' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Valoraciones</h2>

            {/* Resumen */}
            {edition.avgRating && edition.totalRatings && edition.totalRatings > 0 && (
              <RatingSummary
                summary={{
                  avgRating: edition.avgRating,
                  totalRatings: edition.totalRatings,
                  breakdown: {
                    // TODO: Get from API
                    infoBriefing: edition.avgRating,
                    racePack: edition.avgRating,
                    village: edition.avgRating,
                    marking: edition.avgRating,
                    aid: edition.avgRating,
                    finisher: edition.avgRating,
                    eco: edition.avgRating,
                  },
                }}
              />
            )}

            {/* Formulario de valoración */}
            {canRate && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <RatingForm editionId={edition.id} />
              </div>
            )}

            {/* Lista de valoraciones */}
            {ratingsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-40 bg-gray-200 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : ratings.length > 0 ? (
              <div className="space-y-4">
                {ratings.map((rating) => (
                  <RatingCard
                    key={rating.id}
                    rating={rating}
                    canEdit={rating.userId === user?.id}
                    onDelete={() => deleteRating(rating.id)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-12">
                Esta edición aún no tiene valoraciones
              </p>
            )}
          </div>
        )}

        {/* Meteo */}
        {activeTab === 'weather' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Condiciones Meteorológicas
            </h2>

            <WeatherCard
              weather={weather}
              weatherFetched={weatherFetched}
              loading={weatherLoading}
              fetching={false}
              canFetch={false}
              onFetch={undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
}
