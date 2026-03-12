/**
 * Gancho orquestador general de peticiones de infraestructura geográfica.
 * Actúa integrando repositorios aislados con el entorno asíncrono y los
 * estados reactivos transaccionales requeridos en el renderizado de la interfaz.
 */

import { useState, useCallback } from 'react';
import { geoRepository } from '../repositories/geoRepository';

/**
 * Provee un mecanismo seguro y autocontenido para ejecutar flujos de petición de datos,
 * aislando el control de fallos, la carga progresiva y las mutaciones en arreglos.
 * 
 * Dependencias:
 * - geoRepository: Lógica externa abstracta encargada de invocar Endpoints en crudo.
 *
 * Retorna:
 *     Object: Diccionario con variables de estado de solo lectura e invocadores asíncronos (`fetchCountries`, `fetchStates`, `fetchCities`).
 */
export function useGeoData() {
  // Arreglo inmutable base para almacenar secuencias atómicas territoriales.
  const [dataList, setDataList] = useState<any[]>([]);
  // Bandera operacional true/false denotando ejecución de promesa transaccional en curso.
  const [loading, setLoading] = useState(false);
  // Propiedad contenedor de reportes descriptivos frente a un rechazo de petición HTTP o parseo.
  const [error, setError] = useState<string | null>(null);
  // Rastros telemetrales devueltos pre-embebidos por Axios u OS informando si es cache o red pura.
  const [source, setSource] = useState<'network' | 'cache' | 'fallback' | null>(null);

  /**
   * Ejecuta asíncronamente el recuperador primario de países indexados mundialmente.
   *
   * Efectos Secundarios:
   * - Limpia el string de fallos anteriores (`setError(null)`).
   * - Cambia banderas booleanas de inicio/fin carga.
   * - Inyecta volúmenes de arreglos pesados a `dataList` de ser exitoso.
   */
  const fetchCountries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await geoRepository.getCountries();
      setDataList(response.data);
      setSource(response.source);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Recupera asíncronamente divisiones administrativas de grado matriz para un país origen.
   *
   * Parámetros:
   *     countryIso (string): Código ISO-2 Alpha único identificando al país nativo.
   *
   * Efectos Secundarios:
   * - Modifica de nuevo todo el arreglo `dataList` sustituyendo su historial.
   */
  const fetchStates = useCallback(async (countryIso: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await geoRepository.getStates(countryIso);
      setDataList(response.data);
      setSource(response.source);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Recoge secuencialmente agrupaciones de ciudades subyacentes emparejadas al estado objetivo.
   *
   * Parámetros:
   *     countryIso (string): Código ISO identificatorio del ente nacional.
   *     stateIso (string): Código normalizado representativo del estado colindante.
   *
   * Efectos Secundarios:
   * - Refresca el almacén `dataList` con las colecciones poblacionales finales.
   */
  const fetchCities = useCallback(async (countryIso: string, stateIso: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await geoRepository.getCities(countryIso, stateIso);
      setDataList(response.data);
      setSource(response.source);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    dataList,
    loading,
    error,
    source,
    fetchCountries,
    fetchStates,
    fetchCities
  };
}
