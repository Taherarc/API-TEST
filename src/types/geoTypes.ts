/**
 * Definicion de contratos de datos para el dominio Geografico.
 * Asegura la integridad del tipado y la interoperabilidad entre servicios y UI.
 */

/**
 * Representa la estructura fundamental de un Pais segun CSC API.
 */
export interface Country {
  id: number;
  name: string;
  iso2: string;
  emoji: string;
  currency: string;
  phonecode: string;
  capital?: string;
}

/**
 * Define una subdivision administrativa de un pais.
 */
export interface State {
  id: number;
  name: string;
  iso2: string; // Nota: Algunos estados usan codigos locales.
}

/**
 * Entidad urbana basica.
 */
export interface City {
  id: number;
  name: string;
}

/**
 * Contrato de respuesta del Repositorio con metadatos de origen.
 */
export interface GeoDataResponse<T> {
  // Carga util con el listado de elementos del tipo T.
  data: T;
  // Identificador de la fuente de procedencia para transparencia del sistema.
  source: 'network' | 'cache' | 'fallback';
}

/**
 * Estructura enriquecida retornada por el motor de búsqueda Nominatim (OSM).
 */
export interface OSMPlace {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    country: string;
    country_code: string;
  };
}
