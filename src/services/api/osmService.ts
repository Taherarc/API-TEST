/**
 * Módulo especializado en la instrumentación del servicio externo OpenStreetMap Nominatim.
 * Orquesta la transformación interactiva de variables textuales toponímicas hacia
 * diccionarios unificados de vectorización inversa geoespacial estricta.
 */

import { OSMPlace } from '../../types/geoTypes';

// Punto de acceso publico para busquedas en el servicio Nominatim.
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export const osmService = {
  /**
   * Instrumenta jerárquicamente una búsqueda geolocal cruzando topónimos nominales
   * y filtros de jurisdicción territorial ISO de nivel pre-candidato.
   *
   * Parámetros:
   *     cityName (string): Referencia nominal obligatoria del segmento urbano explícito.
   *     countryCode (string): Acrónimo ISO emparejado operando como ancla perimetral geográfica.
   *
   * Retorna:
   *     Promise<OSMPlace | null>: Registro plano tipado posicional de primer impacto convergente,
   *     o resultado condicionado asimétrico nulo cuando la inyectividad falla exhaustivamente.
   *
   * Dependencias:
   *     URLSearchParams: Instancia de plataforma nativa creadora de diccionarios de clave-valor URLEncoded.
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
