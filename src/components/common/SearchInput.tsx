/**
 * Módulo de recolección semántica especializado en la captura de dominios literales
 * de búsqueda. Compone internamente mecanismos atenuantes (debouncing) reduciendo
 * el consumo intensivo que acarrean los motores lógicos reactivos subyacentes.
 */

import React, { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import '../../styles/SearchInput.css';

/**
 * Descripción técnica del contrato de interface consumible.
 *
 * Parámetros:
 *     onSearch (function): Promotor disparado unívocamente tras finalizar la carencia del retraso inyector.
 *     placeholder (string?): Texto descriptivo secundario proyectado condicionalmente en el campo mudo.
 */
interface SearchInputProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

/**
 * Expone y procesa el elemento de formulario asíncrono controlando retardos tipográficos.
 *
 * Parámetros:
 *     Props (SearchInputProps): Paquete descriptivo extraído en `onSearch` y valor por defecto en `placeholder`.
 *
 * Efectos Secundarios:
 * - Emite de manera delegada la notificación textual validada hacia la unidad ancestro.
 *
 * Retorna:
 *     JSX.Element: Un input HTML controlado y envuelto con identidad estructural para hojas de cascada.
 */
export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, placeholder = "Buscar..." }) => {
  // Almacenamiento puramente sincrónico para renderizar la escritura humana (input controlado).
  const [inputValue, setInputValue] = useState('');
  
  // Utilidad consumida para estabilizar el valor estático solo mediante ventanas temporales vacías (300ms).
  const debouncedSearch = useDebounce(inputValue, 300);

  /**
   * Hook reactivo programado para resolver la sincronización ascendente.
   * Triggerea la invocación callback únicamente asimilada tras cumplirse los tiempos calculados en debouncedSearch.
   */
  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <span className="search-icon">🔍</span>
    </div>
  );
};
