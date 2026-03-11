/**
 * Servicio de enriquecimiento de datos mediante OpenStreetMap (Nominatim).
 * Provee geolocalizacion y metadatos detallados de fuentes colaborativas.
 */

import { OSMPlace } from '../../types/geoTypes';

// Punto de acceso publico para busquedas en el servicio Nominatim.
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export const osmService = {
  /**
   * Realiza una búsqueda inversa de metadatos para una ubicacion urbana especifica.
   *
   * Parámetros:
   *   cityName (string): Nombre de la ciudad a inspeccionar.
   *   countryCode (string): Codigo del pais para filtrar el ambito de búsqueda.
   *
   * Retorna:
   *   Promise<OSMPlace | null>: Datos geoespaciales o null si no hay coincidencias.
   *
   * Dependencias:
   *   URLSearchParams: Codifica los parametros en formato adecuado para URL query.
   */
  getCityDetails: async (cityName: string, countryCode: string): Promise<OSMPlace | null> => {
    try {
      // Configuracion de parametros requeridos por la API de Nominatim.
      const params = new URLSearchParams({
        city: cityName,
        country: countryCode,
        format: 'json',
        limit: '1',
        addressdetails: '1'
      });

      // Ejecucion de peticion HTTP con identificacion de aplicacion requerida por politicas de OSM.
      const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'GeoExplorerPro/1.0 (Professional Architecture Refactor)'
        }
      });

      // Valida que la respuesta de red haya sido exitosa.
      if (!response.ok) return null;

      // Parsea el arreglo de resultados y retorna el primer elemento encontrado.
      const data: OSMPlace[] = await response.json();
      return data[0] || null;
    } catch (error) {
      // Registra el fallo en la consola para depuracion sin interrumpir el flujo del usuario.
      console.error('Error en osmService:', error);
      return null;
    }
  }
};
