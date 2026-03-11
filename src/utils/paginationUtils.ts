/**
 * Modulo de fragmentación de datasets para optimizar el rendimiento del DOM.
 */

/**
 * Extrae un segmento especifico de una lista basado en coordenadas de pagina.
 *
 * Parámetros:
 *   list (T[]): Coleccion completa de datos.
 *   page (number): Indice de página solicitado (base 1).
 *   pageSize (number): Cantidad de elementos permitidos por segmento.
 *
 * Retorna:
 *   T[]: Lista recortada correspondiente al bloque visual actual.
 */
export const paginateList = <T>(list: T[], page: number, pageSize: number): T[] => {
  // Calcula el indice de inicio multiplicando la pagina previa por el tamaño de bloque.
  const startIndex = (page - 1) * pageSize;
  
  // Aplica el metodo slice para obtener el sub-arreglo.
  return list.slice(startIndex, startIndex + pageSize);
};

/**
 * Determina la cantidad total de bloques necesarios para albergar un universo de items.
 *
 * Parámetros:
 *   totalItems (number): Conteo total de elementos en la fuente de datos.
 *   pageSize (number): Dimension del bloque de pagina.
 *
 * Retorna:
 *   number: Entero redondeado hacia arriba que representa el limite de paginacion.
 */
export const calculateTotalPages = (totalItems: number, pageSize: number): number => {
  // Evita divisiones por cero y errores de calculo en listas vacias.
  if (totalItems === 0) return 0;
  return Math.ceil(totalItems / pageSize);
};
