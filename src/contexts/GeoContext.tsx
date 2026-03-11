/**
 * Proveedor de estado global para la navegacion y gestion geografica.
 * Centraliza la posicion jerarquica del usuario y la recuperacion de datos asociados.
 */

import React, { createContext, useState, ReactNode, useContext } from 'react';
import { Country, State } from '../types/geoTypes';
import { useGeoData } from '../hooks/useGeoData';

/**
 * Definicion de la interfaz de control y datos del dominio geografico.
 */
interface GeoContextType {
  // Coleccion de datos cargados actualmente (Paises, Estados o Ciudades).
  dataList: any[];
  // Estados de control de flujo asincrono.
  loading: boolean;
  error: string | null;
  source: 'network' | 'cache' | 'fallback' | null;
  
  // Rastro de navegacion y seleccion actual.
  currentLevel: 'countries' | 'states' | 'cities';
  selectedCountry: Country | null;
  selectedState: State | null;
  
  // Acciones de transicion de nivel.
  setCountries: () => void;
  setStatesByCountry: (country: Country) => void;
  setCitiesByState: (state: State) => void;
  goBack: () => void;
  resetNavigation: () => void;
}

// Creacion del contexto para el arbol de componentes.
const GeoContext = createContext<GeoContextType | undefined>(undefined);

/**
 * Componente Provider que orquesta los ganchos de carga y el estado de ruteo interno.
 */
export const GeoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Integra la logica de peticiones desde el gancho useGeoData.
  const geo = useGeoData();
  
  // Estados que rastrean la posicion logica del usuario en la jerarquia.
  const [currentLevel, setCurrentLevel] = useState<'countries' | 'states' | 'cities'>('countries');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);

  /**
   * Establece la vista principal de paises a nivel global.
   */
  const setCountries = () => {
    setCurrentLevel('countries');
    setSelectedCountry(null);
    setSelectedState(null);
    geo.fetchCountries();
  };

  /**
   * Transiciona al nivel de estados tras seleccionar un pais.
   */
  const setStatesByCountry = (country: Country) => {
    setSelectedCountry(country);
    setCurrentLevel('states');
    setSelectedState(null);
    geo.fetchStates(country.iso2);
  };

  /**
   * Transiciona al nivel de ciudades dentro de una region administrativa.
   */
  const setCitiesByState = (state: State) => {
    setSelectedState(state);
    setCurrentLevel('cities');
    if (selectedCountry) {
      geo.fetchCities(selectedCountry.iso2, state.iso2);
    }
  };

  /**
   * Reinicia el arbol de navegacion al punto de origen.
   */
  const resetNavigation = () => {
    setCountries();
  };

  /**
   * Implementa la logica de retroceso un nivel en la jerarquia.
   */
  const goBack = () => {
    if (currentLevel === 'cities') {
      setCurrentLevel('states');
      setSelectedState(null);
      // Recarga los estados del pais actual para asegurar consistencia de datos.
      if (selectedCountry) geo.fetchStates(selectedCountry.iso2);
    } else if (currentLevel === 'states') {
      // Retorno directo al nivel de paises.
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
 * Hook de acceso simplificado para consumidores del GeoContext.
 */
export const useGeo = () => {
  const context = useContext(GeoContext);
  // Garantiza que el hook sea utilizado dentro de un GeoProvider para evitar fallos de referencia.
  if (!context) throw new Error('useGeo debe usarse dentro de GeoProvider');
  return context;
};
