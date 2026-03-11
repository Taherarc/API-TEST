/**
 * Orquestador principal de datos (Patrón Repository).
 * Encapsula la lógica de decision sobre las fuentes de datos y gestiona el flujo
 * de resiliencia mediante la estrategia Network First + Cache Fallback.
 */

import { cscService } from '../services/api/countryStateCityService';
import { osmService } from '../services/api/osmService';
import { getFromCache, saveToCache } from '../services/cacheService';
import { Country, State, City, GeoDataResponse, OSMPlace } from '../types/geoTypes';

/**
 * Fachada de acceso a datos geograficos que garantiza la disponibilidad de informacion.
 */
export const geoRepository = {
  /**
   * Obtiene la coleccion de paises priorizando la conexion de red.
   *
   * Retorna:
   *   Promise<GeoDataResponse<Country[]>>: Objeto que contiene los datos y el origen de los mismos.
   */
  getCountries: async (): Promise<GeoDataResponse<Country[]>> => {
    const cacheKey = 'countries_data';
    
    try {
      // Intento de recuperacion de datos frescos desde la infraestructura de red.
      const data = await cscService.getCountries();
      // Actualiza el cache local para futuras contingencias.
      saveToCache(cacheKey, data);
      return { data, source: 'network' };
    } catch (error) {
      // Mecanismo de contingencia: recupera del cache ante fallos de red.
      const cached = getFromCache<Country[]>(cacheKey);
      if (cached) return { data: cached, source: 'cache' };
      // Relanza el error si no hay datos de respaldo disponibles.
      throw error;
    }
  },

  /**
   * Gestiona la carga de estados de un pais con respaldo en cache local.
   *
   * Parámetros:
   *   countryIso (string): Codigo identificador del pais.
   */
  getStates: async (countryIso: string): Promise<GeoDataResponse<State[]>> => {
    const cacheKey = `states_${countryIso}`;
    
    try {
      // Consulta asincrona al servicio de red de estados.
      const data = await cscService.getStates(countryIso);
      saveToCache(cacheKey, data);
      return { data, source: 'network' };
    } catch (error) {
      // Reintento silencioso desde el almacenamiento de sesion.
      const cached = getFromCache<State[]>(cacheKey);
      if (cached) return { data: cached, source: 'cache' };
      throw error;
    }
  },

  /**
   * Coordina la peticion de ciudades para un estado y pais definidos.
   *
   * Parámetros:
   *   countryIso (string): Codigo ISO del pais origen.
   *   stateIso (string): Codigo del estado seleccionado.
   */
  getCities: async (countryIso: string, stateIso: string): Promise<GeoDataResponse<City[]>> => {
    const cacheKey = `cities_${countryIso}_${stateIso}`;
    
    try {
      // Ejecucion de la llamada HTTP pura mediante el servicio CSC.
      const data = await cscService.getCities(countryIso, stateIso);
      saveToCache(cacheKey, data);
      return { data, source: 'network' };
    } catch (error) {
      // Recuperacion de datos persistidos si falla la infraestructura remota.
      const cached = getFromCache<City[]>(cacheKey);
      if (cached) return { data: cached, source: 'cache' };
      throw error;
    }
  },

  /**
   * Obtiene metadatos geoespaciales enriquecidos desde OpenStreetMap.
   * Aplica una politica de Cache First para cumplir con las politicas de uso de OSM.
   *
   * Parámetros:
   *   cityName (string): Nombre de la ciudad a geolocalizar.
   *   countryCode (string): Codigo del pais de busqueda.
   */
  getCityDetails: async (cityName: string, countryCode: string): Promise<OSMPlace | null> => {
    const cacheKey = `osm_city_${countryCode}_${cityName}`;
    
    // Verifica primero la existencia de datos en almacenamiento local para minimizar llamadas externas.
    const cached = getFromCache<OSMPlace>(cacheKey);
    if (cached) return cached;

    // Ejecuta la busqueda en Nominatim si el dato no reside en memoria.
    const data = await osmService.getCityDetails(cityName, countryCode);
    // Persiste el resultado exitoso para futuras consultas.
    if (data) saveToCache(cacheKey, data);
    return data;
  }
};
