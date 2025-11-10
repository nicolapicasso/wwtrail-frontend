// lib/data/countries.ts

export interface Country {
  code: string;
  name: string;
  flag: string;
}

/**
 * Lista completa de países para trail running
 * Ordenados por relevancia para el deporte
 */
export const COUNTRIES: Country[] = [
  // Principales países europeos (trail running muy popular)
  { code: 'ES', name: 'España', flag: '🇪🇸' },
  { code: 'IT', name: 'Italia', flag: '🇮🇹' },
  { code: 'FR', name: 'Francia', flag: '🇫🇷' },
  { code: 'CH', name: 'Suiza', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'DE', name: 'Alemania', flag: '🇩🇪' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'GB', name: 'Reino Unido', flag: '🇬🇧' },
  { code: 'NO', name: 'Noruega', flag: '🇳🇴' },
  { code: 'SE', name: 'Suecia', flag: '🇸🇪' },
  
  // Otros europeos
  { code: 'AD', name: 'Andorra', flag: '🇦🇩' },
  { code: 'BE', name: 'Bélgica', flag: '🇧🇪' },
  { code: 'CZ', name: 'República Checa', flag: '🇨🇿' },
  { code: 'DK', name: 'Dinamarca', flag: '🇩🇰' },
  { code: 'FI', name: 'Finlandia', flag: '🇫🇮' },
  { code: 'GR', name: 'Grecia', flag: '🇬🇷' },
  { code: 'IE', name: 'Irlanda', flag: '🇮🇪' },
  { code: 'IS', name: 'Islandia', flag: '🇮🇸' },
  { code: 'NL', name: 'Países Bajos', flag: '🇳🇱' },
  { code: 'PL', name: 'Polonia', flag: '🇵🇱' },
  { code: 'RO', name: 'Rumanía', flag: '🇷🇴' },
  { code: 'SI', name: 'Eslovenia', flag: '🇸🇮' },
  { code: 'SK', name: 'Eslovaquia', flag: '🇸🇰' },
  
  // América
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' },
  { code: 'CA', name: 'Canadá', flag: '🇨🇦' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'PE', name: 'Perú', flag: '🇵🇪' },
  
  // Asia y Oceanía
  { code: 'JP', name: 'Japón', flag: '🇯🇵' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'NZ', name: 'Nueva Zelanda', flag: '🇳🇿' },
  { code: 'TH', name: 'Tailandia', flag: '🇹🇭' },
  { code: 'SG', name: 'Singapur', flag: '🇸🇬' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
  
  // África
  { code: 'ZA', name: 'Sudáfrica', flag: '🇿🇦' },
  { code: 'MA', name: 'Marruecos', flag: '🇲🇦' },
  { code: 'KE', name: 'Kenia', flag: '🇰🇪' },
];

/**
 * Obtener país por código
 */
export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find(c => c.code === code);
}

/**
 * Buscar países por nombre (para el buscador)
 */
export function searchCountries(query: string): Country[] {
  const lowerQuery = query.toLowerCase();
  return COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(lowerQuery) ||
    c.code.toLowerCase().includes(lowerQuery)
  );
}
