/**
 * Infraestructura de comunicacion con la API CountryStateCity.
 * Provee metodos desacoplados para la consulta de datos geograficos globales.
 */

import { Country, State, City } from '../../types/geoTypes';

// Url base del servicio externo remoto.
const BASE_URL = 'https://api.countrystatecity.in/v1';

// Recuperacion de la llave de API desde las variables de entorno de Vite.
const API_KEY = import.meta.env.VITE_CSC_API_KEY;

/**
 * Error de dominio para escenarios donde se excede la cuota de peticiones contratada.
 */
export class RateLimitError extends Error {
  constructor() {
    super('Límite de peticiones de la API alcanzado (429)');
    this.name = 'RateLimitError';
  }
}

/**
 * Error de dominio para fallos internos o criticos del servidor remoto.
 */
export class ServerError extends Error {
  constructor() {
    super('Error interno del servicio externo (500)');
    this.name = 'ServerError';
  }
}

/**
 * Función interna de bajo nivel para ejecutar peticiones HTTP autenticadas.
 *
 * Parámetros:
 *   endpoint (string): Ruta parcial del recurso a consultar.
 *
 * Retorna:
 *   Promise<T>: Promesa que resuelve al tipo generico solicitado tras el parseo JSON.
 *
 * Dependencias:
 *   fetch: API nativa del navegador para transmision de datos.
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
 * Objeto de servicio que implementa los puntos finales de la API CSC.
 */
export const cscService = {
  /**
   * Recupera el listado completo de paises registrados a nivel mundial.
   */
  getCountries: () => fetchCSC<Country[]>('/countries'),
  
  /**
   * Obtiene la coleccion de estados o departamentos asociados a un pais especifico.
   *
   * Parámetros:
   *   countryIso (string): Codigo ISO2 identificador del pais.
   */
  getStates: (countryIso: string) => 
    fetchCSC<State[]>(`/countries/${countryIso}/states`),
    
  /**
   * Consulta las ciudades pertenecientes a una subdivision administrativa de un pais.
   *
   * Parámetros:
   *   countryIso (string): Codigo ISO2 del pais.
   *   stateIso (string): Codigo del estado o provincia.
   */
  getCities: (countryIso: string, stateIso: string) => 
    fetchCSC<City[]>(`/countries/${countryIso}/states/${stateIso}/cities`)
};
