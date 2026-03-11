/**
 * Gancho personalizado para gestionar la lógica de fragmentación de listas.
 * Abstrae el estado de la página actual y automatiza el calculo de segmentos visibles.
 */

import { useState, useMemo } from 'react';
import { paginateList, calculateTotalPages } from '../utils/paginationUtils';

/**
 * Orquesta el comportamiento de paginacion para cualquier coleccion de datos.
 *
 * Parámetros:
 *   items (T[]): Coleccion completa de elementos a paginar.
 *   pageSize (number): Cantidad maxima de elementos a mostrar por página.
 *
 * Retorna:
 *   Objeto con estados y utilidades de navegacion.
 */
export function usePagination<T>(items: T[], pageSize: number) {
  // Estado que rastrea el indice de la página activa (iniciando en 1).
  const [currentPage, setCurrentPage] = useState(1);

  // Efecto de memorizacion para resetear la página al primer bloque si cambia la fuente de datos.
  // Esto es critico cuando el usuario realiza una busqueda nueva.
  useMemo(() => {
    setCurrentPage(1);
  }, [items]);

  // Deriva el segmento de la lista que debe renderizarse actualmente.
  const paginatedItems = useMemo(() => {
    return paginateList(items, currentPage, pageSize);
  }, [items, currentPage, pageSize]);

  // Calcula el total de paginas totales basadas en la dimensiones del dataset.
  const totalPages = useMemo(() => {
    return calculateTotalPages(items.length, pageSize);
  }, [items, pageSize]);

  return {
    currentPage,
    setCurrentPage,
    paginatedItems,
    totalPages,
    // Banderas logicas para la habilitacion de controles de interfaz.
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
}
