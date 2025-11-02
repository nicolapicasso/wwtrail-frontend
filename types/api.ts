// types/api.ts
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export type Language = 'ES' | 'EN' | 'FR' | 'IT' | 'DE' | 'CA';

export const LANGUAGES: Language[] = ['ES', 'EN', 'FR', 'IT', 'DE', 'CA'];

export const LANGUAGE_NAMES: Record<Language, string> = {
  ES: 'Español',
  EN: 'English',
  FR: 'Français',
  IT: 'Italiano',
  DE: 'Deutsch',
  CA: 'Català',
};
