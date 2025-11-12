// types/weather.ts - Tipos para el sistema de meteo

/**
 * Datos meteorológicos de una edición
 */
export interface EditionWeather {
  date: string;
  temperature: {
    avg: number;
    min: number;
    max: number;
  };
  condition: WeatherCondition;
  conditionText: string;
  precipitation: number;
  wind: {
    speed: number;
    direction: number;
    directionText: string;
  };
  humidity: number;
  pressure: number;
  cloudCover: number;
  fetchedAt: string;
}

/**
 * Condiciones meteorológicas posibles
 */
export type WeatherCondition =
  | 'sunny'
  | 'partly_cloudy'
  | 'cloudy'
  | 'rainy'
  | 'stormy'
  | 'snowy';

/**
 * Iconos para cada condición
 */
export const WEATHER_ICONS: Record<WeatherCondition, string> = {
  sunny: '☀️',
  partly_cloudy: '⛅',
  cloudy: '☁️',
  rainy: '🌧️',
  stormy: '⛈️',
  snowy: '❄️',
};

/**
 * Colores para cada condición
 */
export const WEATHER_COLORS: Record<WeatherCondition, string> = {
  sunny: 'text-yellow-500',
  partly_cloudy: 'text-gray-400',
  cloudy: 'text-gray-500',
  rainy: 'text-blue-500',
  stormy: 'text-purple-600',
  snowy: 'text-blue-200',
};

/**
 * Direcciones cardinales
 */
export const WIND_DIRECTIONS: Record<string, string> = {
  N: 'Norte',
  NE: 'Noreste',
  E: 'Este',
  SE: 'Sureste',
  S: 'Sur',
  SW: 'Suroeste',
  W: 'Oeste',
  NW: 'Noroeste',
};
