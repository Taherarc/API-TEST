/**
 * Proveedor de estado global para la navegación y gestión topológica geográfica.
 * Centraliza la posición jerárquica del usuario (país/estado/ciudad) y la retención
 * segura de los volúmenes de datos asociados consumidos de la capa de persistencia API.
 */

import React, { createContext, useState, ReactNode, useContext } from 'react';
import { Country, State } from '../types/geoTypes';
import { useGeoData } from '../hooks/useGeoData';

/**
 * Definición rigurosa de la interfaz de control semántico y estado del dominio geográfico.
 */
interface GeoContextType {
  // Arreglo polimórfico efímero de datos geográficos cargados actualmente.
  dataList: any[];
  // Estados transaccionales de control de flujo asíncrono y diagnóstico.
  loading: boolean;
  error: string | null;
  source: 'network' | 'cache' | 'fallback' | null;
  
  // Nivel absoluto representativo de la profundidad de navegación actual en el árbol.
  currentLevel: 'countries' | 'states' | 'cities';
  selectedCountry: Country | null;
  selectedState: State | null;
  
  // Acciones inyectoras interactivas para el cambio estructural jerárquico.
  setCountries: () => void;
  setStatesByCountry: (country: Country) => void;
  setCitiesByState: (state: State) => void;
  goBack: () => void;
  resetNavigation: () => void;
}

// Creación estructural estática del contexto fuertemente tipado para el árbol React.
const GeoContext = createContext<GeoContextType | undefined>(undefined);

/**
 * Componente Provider que orquesta la persistencia local de los datos geográficos
 * y expone la máquina de estados de enrutamiento jerárquico interno (drill-down).
 *
 * Parámetros:
 *     children (ReactNode): Sub-árbol de componentes que observarán mutaciones de este nodo.
 *
 * Retorna:
 *     JSX.Element: Nodo JSX instanciando el proveedor global con toda la topología envuelta.
 */
export const GeoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Integra la logica de peticiones desde el gancho useGeoData.
  const geo = useGeoData();
  
  // Estados que rastrean la posicion logica del usuario en la jerarquia.
  const [currentLevel, setCurrentLevel] = useState<'countries' | 'states' | 'cities'>('countries');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);

  /**
   * Restablece la vista al nivel primario forzando la visualización del listado de naciones.
   *
   * Efectos Secundarios:
   * - Anula variables estáticas de selección profunda en el estado reactivo local.
   * - Lanza una invocación HTTP silenciosa delegada en `geo.fetchCountries()`.
   */
  const setCountries = () => {
    setCurrentLevel('countries');
    setSelectedCountry(null);
    setSelectedState(null);
    geo.fetchCountries();
  };

  /**
   * Desciende dinámicamente al nivel intermedio de la aplicación cargando estados.
   *
   * Parámetros:
   *     country (Country): Objeto estructurado de la nación elegida durante la interacción.
   *
   * Efectos Secundarios:
   * - Conserva la estructura `Country` como referencia matriz viva y anula entidades inferiores.
   * - Provoca petición IO exigiendo `country.iso2` para bajar estados correlativos interactuables.
   */
  const setStatesByCountry = (country: Country) => {
    setSelectedCountry(country);
    setCurrentLevel('states');
    setSelectedState(null);
    geo.fetchStates(country.iso2);
  };

  /**
   * Ejecuta el cierre o anidación más profunda iterando las ciudades constituyentes regionales.
   *
   * Parámetros:
   *     state (State): Objeto estado conteniendo identificantes requeridos en red.
   *
   * Efectos Secundarios:
   * - Confirma el estado seleccionado fijándolo en base reactiva viva.
   * - Desempaqueta y envía el cruce de peticiones requiriendo los códigos primarios `iso2`.
   */
  const setCitiesByState = (state: State) => {
    setSelectedState(state);
    setCurrentLevel('cities');
    if (selectedCountry) {
      geo.fetchCities(selectedCountry.iso2, state.iso2);
    }
  };

  /**
   * Método orquestado general para anular forzosamente cualquier estado geográfico navegativo actual.
   */
  const resetNavigation = () => {
    setCountries();
  };

  /**
   * Implementa mecánica de escape contextual moviendo hacia atrás en la profundidad de capas visuales.
   * Resuelve re-aserciones si los índices geográficos demandan sincronización paralela.
   */
  const goBack = () => {
    if (currentLevel === 'cities') {
      setCurrentLevel('states');
      setSelectedState(null);
      // Re-descarga delegada o toma desde caché de todos los estados correspondientes a la unidad nacional.
      if (selectedCountry) geo.fetchStates(selectedCountry.iso2);
    } else if (currentLevel === 'states') {
      // Regreso inmediato y re-sincronización con el estrato raíz visible.
      setCountries();
    }
  };

  return (
    <GeoContext.Provider value={{
      ...geo,
      currentLevel,
      selectedCountry,
      selectedState,
      setCountries,
      setStatesByCountry,
      setCitiesByState,
      goBack,
      resetNavigation
    }}>
      {children}
    </GeoContext.Provider>
  );
};

/**
 * Hook de abstracción para consumo interno reactivo del `GeoContext`.
 *
 * Retorna:
 *     GeoContextType: Colección de métodos y estados fuertemente tipados.
 */
export const useGeo = () => {
  const context = useContext(GeoContext);
  // Bloqueo preventivo crítico a nivel de consola si el hook se invoca en un plano DOM ajeno al Provider.
  if (!context) throw new Error('useGeo debe usarse dentro de la jerarquía protegida de un GeoProvider');
  return context;
};
