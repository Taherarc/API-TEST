/**
 * Componente especializado en la captura de terminos de busqueda.
 * Integra un mecanismo de debouncing para optimizar la carga computacional en filtrados.
 */

import React, { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import '../../styles/SearchInput.css';

/**
 * Propiedades del componente SearchInput.
 *
 * Parámetros:
 *   onSearch (function): Callback disparado cuando el termino estabilizado cambia.
 *   placeholder (string): Texto de sugerencia para el campo de entrada.
 */
interface SearchInputProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

/**
 * Renderiza un campo de busqueda enriquecido con control de frecuencia.
 */
export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, placeholder = "Buscar..." }) => {
  // Estado reactivo inmediato para el valor del input (controlado).
  const [inputValue, setInputValue] = useState('');
  
  // Aplica el gancho useDebounce para retrasar la propagacion del termino 300ms.
  const debouncedSearch = useDebounce(inputValue, 300);

  /**
   * Efecto que notifica al componente padre cuando el termino estabilizado sufre cambios.
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
