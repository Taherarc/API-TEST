/**
 * Gancho para la orquestacion de carga de datos geograficos.
 * Actua como puente entre la interfaz de usuario y el repositorio de datos.
 */

import { useState, useCallback } from 'react';
import { geoRepository } from '../repositories/geoRepository';

/**
 * Provee estados de carga, error y metodos para la adquisicion de datos.
 */
export function useGeoData() {
  // Almacena el listado de elementos recuperados (paises, estados o ciudades).
  const [dataList, setDataList] = useState<any[]>([]);
  // Bandera de control para la visualizacion de estados de espera (spinners).
  const [loading, setLoading] = useState(false);
  // Almacena mensajes descriptivos en caso de fallo en la infraestructura.
  const [error, setError] = useState<string | null>(null);
  // Indica la procedencia del dato (red, cache o respaldo).
  const [source, setSource] = useState<'network' | 'cache' | 'fallback' | null>(null);

  /**
   * Ejecuta la recuperacion de paises desde el repositorio.
   */
  const fetchCountries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await geoRepository.getCountries();
      setDataList(response.data);
      setSource(response.source);
    } catch (err: any) {
      // Captura y propaga el mensaje de error del repositorio.
      setError(err.message);
    } finally {
      // Asegura el cese del estado de carga independientemente del resultado.
      setLoading(false);
    }
  }, []);

  /**
   * Solicita el listado de subdivisiones regionales de un pais.
   *
   * Parámetros:
   *   countryIso (string): Codigo identificador del pais.
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
   * Obtiene la coleccion de centros urbanos de una region especifica.
   *
   * Parámetros:
   *   countryIso (string): Codigo del pais.
   *   stateIso (string): Codigo de la region o estado.
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
