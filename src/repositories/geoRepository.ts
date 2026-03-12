/**
 * Orquestador principal de persistencia transaccional (Patrón Repository).
 * Encapsula la lógica de decisión sobre las fuentes de datos (Red vs Memoria) y gestiona
 * el flujo de resiliencia mediante la estrategia asíncrona "Network First + Cache Fallback".
 */

import { cscService } from '../services/api/countryStateCityService';
import { osmService } from '../services/api/osmService';
import { getFromCache, saveToCache } from '../services/cacheService';
import { Country, State, City, GeoDataResponse, OSMPlace } from '../types/geoTypes';

/**
 * Fachada inyectable de acceso a metadatos geográficos que garantiza 
 * tolerancias a fallos e idempotencia en la infraestructura proxy.
 */
export const geoRepository = {
  /**
   * Obtiene la colección taxonómica de países priorizando la ingesta real de red.
   *
   * Retorna:
   *     Promise<GeoDataResponse<Country[]>>: Tupla encapsulando los datos mapeados y la huella de origen (`network` o `cache`).
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
   * Gestiona la carga dependiente de divisiones administrativas con respaldo de sesión local.
   *
   * Parámetros:
   *     countryIso (string): Código ISO Alfa-2 identificador soberano.
   *
   * Retorna:
   *     Promise<GeoDataResponse<State[]>>: Promesa resolviendo arreglo derivado acoplado a la raíz nacional.
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
   * Coordina la petición determinística de municipalidades cruzando códigos jerárquicos.
   *
   * Parámetros:
   *     countryIso (string): Nomenclatura geodésica soberana pre-recolectada.
   *     stateIso (string): Identidad regional para concatenación de Endpoints.
   *
   * Retorna:
   *     Promise<GeoDataResponse<City[]>>: Resolución asíncrona devolviendo arrays poblacionales acotados.
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
   * Recupera metadatos geoespaciales enriquecidos (lat/lon/tipo) desde OpenStreetMap Nominatim.
   * Forzosa ejecución bajo la política "Cache First" mitigando el estrangulamiento limitativo remoto.
   *
   * Parámetros:
   *     cityName (string): Cadena nominal explícita del centro objetivo.
   *     countryCode (string): Abreviante ISO emparejado al nivel root.
   *
   * Retorna:
   *     Promise<OSMPlace | null>: Registro posicional tipado o entidad nula representativa de falla descriptiva.
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
