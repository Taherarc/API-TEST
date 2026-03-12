/**
 * Módulo de infraestructura para transacciones de red contra la API CountryStateCity.
 * Encapsula la configuración de endpoints, inyección de tokens paramétricos y
 * expone métodos de hidratación tipados al modelo del dominio territorial.
 */

import { Country, State, City } from '../../types/geoTypes';

// Url base del servicio externo remoto.
const BASE_URL = 'https://api.countrystatecity.in/v1';

// Recuperacion de la llave de API desde las variables de entorno de Vite.
const API_KEY = import.meta.env.VITE_CSC_API_KEY;

/**
 * Clase de excepción extendida para el control de saturación de la cuota de red autorizada.
 */
export class RateLimitError extends Error {
  constructor() {
    super('Límite de peticiones de la API alcanzado (429)');
    this.name = 'RateLimitError';
  }
}

/**
 * Clase de excepción extendida para el colapso absoluto del host remoto del proveedor geográfico.
 */
export class ServerError extends Error {
  constructor() {
    super('Error interno del servicio externo (500)');
    this.name = 'ServerError';
  }
}

/**
 * Función inyectora asíncrona de bajo nivel que instrumenta promesas HTTP y deserialización estricta.
 *
 * Parámetros:
 *     endpoint (string): Segmento URI complementario a concatenar sobre el dominio base.
 *
 * Retorna:
 *     Promise<T>: Estructura promisoria tipada delegando objetos `Country`, `State` o `City`.
 *
 * Dependencias:
 *     fetch: API de la plataforma cliente subyacente transaccionando el flujo I/O en red.
 */
async function fetchCSC<T>(endpoint: string): Promise<T> {
  // Realiza la llamada asincrona inyectando la llave de API en las cabeceras.
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: { 'X-CSCAPI-KEY': API_KEY }
  });

  // Manejo de respuestas no satisfactorias segun codigos de estado HTTP.
  if (!response.ok) {
    // Lanza error de limite de cuota si el servidor retorna 429.
    if (response.status === 429) throw new RateLimitError();
    // Lanza error de servidor si el codigo es superior o igual a 500.
    if (response.status >= 500) throw new ServerError();
    // Lanza error generico para otros fallos de red.
    throw new Error(`Fallo en la peticion HTTP: ${response.status}`);
  }

  // Deserializa el cuerpo de la respuesta en formato JSON.
  return response.json();
}

/**
 * Objeto utilitario abstracto que expone los puentes transaccionales paramétricos para consultas CSC.
 */
export const cscService = {
  /**
   * Exige activamente el listado matricial completo de países indizados a nivel mundial.
   *
   * Retorna:
   *     Promise<Country[]>: Listado serializado directo del nodo topológico principal.
   */
  getCountries: () => fetchCSC<Country[]>('/countries'),
  
  /**
   * Sub-deriva la colección dependiente de estados o departamentos inscritos al país emisor.
   *
   * Parámetros:
   *     countryIso (string): Código universal identificador del nodo padre.
   *
   * Retorna:
   *     Promise<State[]>: Sub-árbol espacial del nivel estadual.
   */
  getStates: (countryIso: string) => 
    fetchCSC<State[]>(`/countries/${countryIso}/states`),
    
  /**
   * Sub-deriva transversalmente la base estructural urbana asociando dependencias ISO de dos fronteras.
   *
   * Parámetros:
   *     countryIso (string): Nomenclatura universal validada de país.
   *     stateIso (string): Código colateral asignado al sub-nodo regional.
   *
   * Retorna:
   *     Promise<City[]>: Agrupaciones base de los poblados intersectando ambas dependencias.
   */
  getCities: (countryIso: string, stateIso: string) => 
    fetchCSC<City[]>(`/countries/${countryIso}/states/${stateIso}/cities`)
};
