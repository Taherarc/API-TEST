/**
 * Módulo para la gestión lógica de fragmentación de listas.
 * Abstrae el estado de la página activa y automatiza el cálculo matemático
 * de los segmentos visibles y métricas escalares de paginación.
 */

import { useState, useMemo } from 'react';
import { paginateList, calculateTotalPages } from '../utils/paginationUtils';

/**
 * Orquesta el comportamiento de paginación en memoria para colecciones abstractas.
 *
 * Parámetros:
 *     items (T[]): Arreglo genérico inmutable completo de elementos a fraccionar.
 *     pageSize (number): Límite escalar máximo tolerado de elementos a renderizar en bloque.
 *
 * Retorna:
 *     Object: Entidad empaquetada con la porción seccionada de datos (`paginatedItems`),
 *     variables operativas de recorrido (`currentPage`, `totalPages`) y banderas lógicas
 *     derivadas (`hasNextPage`, `hasPrevPage`).
 */
export function usePagination<T>(items: T[], pageSize: number) {
  // Estado local reactivo que rastrea el índice escalar de la página activa (base 1).
  const [currentPage, setCurrentPage] = useState(1);

  // Hook de memorización pasivo para forzar el reinicio unívoco a la página 1.
  // Es crítico para re-alinear la vista cuando existen transmutaciones bruscas de búsqueda.
  useMemo(() => {
    setCurrentPage(1);
  }, [items]);

  // Deriva sincrónicamente el segmento (slice) exacto de la lista basándose en límites calculados.
  const paginatedItems = useMemo(() => {
    return paginateList(items, currentPage, pageSize);
  }, [items, currentPage, pageSize]);

  // Opera la división estructural del dataset bruto contra la constante de tamaño por página.
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
