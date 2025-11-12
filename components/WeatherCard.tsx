// components/WeatherCard.tsx - Tarjeta de información meteorológica

'use client';

import { RefreshCw } from 'lucide-react';
import { WEATHER_ICONS, WEATHER_COLORS, WIND_DIRECTIONS } from '@/types/weather';
import type { EditionWeather } from '@/types/weather';

interface WeatherCardProps {
  weather: EditionWeather | null | undefined;
  editionId?: string;
  canRefetch?: boolean;
  onRefetch?: () => Promise<void>;
}

export default function WeatherCard({
  weather,
  editionId,
  canRefetch = false,
  onRefetch,
}: WeatherCardProps) {
  if (!weather) {
    return (
      <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            No hay datos meteorológicos disponibles para esta edición
          </p>

          {canRefetch && onRefetch && editionId && (
            <button
              onClick={onRefetch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Obtener datos meteorológicos
            </button>
          )}
        </div>
      </div>
    );
  }

  const { temperature, condition, precipitation, wind, humidity, pressure, cloudCover } =
    weather;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Condiciones Meteorológicas</h3>

        {canRefetch && onRefetch && (
          <button
            onClick={onRefetch}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Refetch weather"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Weather */}
      <div className="flex items-center gap-6 mb-6 pb-6 border-b">
        {/* Icon */}
        <div className="text-6xl">{WEATHER_ICONS[condition]}</div>

        {/* Temperature */}
        <div>
          <div className="text-4xl font-bold text-gray-900">
            {temperature.avg.toFixed(1)}°C
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {temperature.min.toFixed(1)}° / {temperature.max.toFixed(1)}°
          </div>
          <div className={`text-sm font-medium mt-2 ${WEATHER_COLORS[condition]}`}>
            {weather.conditionText}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <WeatherDetail
          icon="💧"
          label="Precipitación"
          value={`${precipitation} mm`}
        />

        <WeatherDetail
          icon="💨"
          label="Viento"
          value={`${wind.speed} km/h ${wind.directionText}`}
        />

        <WeatherDetail icon="💦" label="Humedad" value={`${humidity}%`} />

        <WeatherDetail icon="🔽" label="Presión" value={`${pressure} hPa`} />

        <WeatherDetail
          icon="☁️"
          label="Nubosidad"
          value={`${cloudCover}%`}
        />

        <div className="text-xs text-gray-500 col-span-2 pt-2 border-t">
          Datos del {new Date(weather.date).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Detalle individual de meteo
 */
interface WeatherDetailProps {
  icon: string;
  label: string;
  value: string;
}

function WeatherDetail({ icon, label, value }: WeatherDetailProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-xs text-gray-600">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
