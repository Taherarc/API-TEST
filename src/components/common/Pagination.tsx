/**
 * Componente funcional para el control de la navegacion por bloques (Paginacion).
 * Proporciona una interfaz simplificada para el cambio de paginas.
 */

import React from 'react';

/**
 * Contrato de propiedades para el componente de paginacion.
 *
 * Parámetros:
 *   currentPage (number): Indice de la página que se visualiza actualmente.
 *   totalPages (number): Cantidad total de paginas calculadas.
 *   onPageChange (function): Callback ejecutado al solicitar un cambio de bloque.
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Renderiza los controles de desplazamiento entre bloques de datos.
 */
const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // Optimizacion: No renderiza nada si la totalidad del dataset cabe en una sola página.
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-controls">
      {/* Boton de retroceso, deshabilitado si se encuentra en el origen. */}
      <button 
        disabled={currentPage === 1} 
        onClick={() => onPageChange(currentPage - 1)}
        className="page-btn"
      >
        Anterior
      </button>
      
      {/* Indicador textual de la posicion relativa actual. */}
      <span className="page-indicator">Bloque {currentPage} de {totalPages}</span>
      
      {/* Boton de avance, deshabilitado al alcanzar el limite de datos. */}
      <button 
        disabled={currentPage === totalPages} 
        onClick={() => onPageChange(currentPage + 1)}
        className="page-btn"
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;
