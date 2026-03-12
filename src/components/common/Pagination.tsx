/**
 * Módulo de interfaz para el control interactivo de bloques de paginación.
 * Desacopla la vista de botones e indicadores del componente orquestador externo
 * y abstrae los recálculos aritméticos en la navegación bidireccional de datos.
 */

import React, { useEffect } from 'react';

/**
 * Contrato de tipos para la inyección de propiedades al componente de paginación.
 *
 * Parámetros:
 *     currentPage (number): Índice entero escalar de la página visualizada actualmente.
 *     totalPages (number): Techo absoluto de páginas calculadas sobre la dimensión del dataset.
 *     onPageChange (function): Callback de retrollamada inyector disparado para requerir un cambio logico de bloque.
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Renderiza dinámicamente el controlador visual de desplazamiento estructurado.
 *
 * Parámetros:
 *     Props (PaginationProps): Diccionario desestructurado con valores y funciones de la interfaz tipada.
 *
 * Efectos Secundarios:
 * - Emite mutaciones asíncronas de desplazamiento sobre el objeto `window` (scroll pasivo forzado).
 *
 * Retorna:
 *     JSX.Element | null: Contenedor HTML interactivo para recorrido del array, o nodo nulo
 *     (inactivo) si la subdivisión aritmética deviene en un margen unitario de páginas.
 */
const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  /**
   * Hook de montado sincronizado para re-posicionar el viewport tras la solicitud de un paginado.
   * Modifica imperativamente la posición vertical del DOM subiendo a punto `0`.
   */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Optimizador lógico: Si la volumetría de elementos cabe en una cuadrícula sencilla, inactiva la UI.
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-controls">
      {/* Botón de recesión indexada. Su estado inactivo es derivado si se toca el tope inferior 1. */}
      <button 
        disabled={currentPage === 1} 
        onClick={() => onPageChange(currentPage - 1)}
        className="page-btn"
      >
        Anterior
      </button>
      
      {/* Etiquetado no accionable exponiendo las métricas paramétricas al observador. */}
      <span className="page-indicator">Bloque {currentPage} de {totalPages}</span>
      
      {/* Botón de progresión condicional. Auto-inhabilitado iterativamente frente a bordes del array. */}
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
