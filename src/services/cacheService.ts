/**
 * Modulo de infraestructura para la gestion de persistencia temporal.
 * Implementa una capa de abstracción sobre sessionStorage para facilitar
 * el almacenamiento de datos serializados.
 */

/**
 * Recupera y deserializa un objeto almacenado bajo una clave especifica.
 *
 * Parámetros:
 *   key (string): Identificador unico del recurso en el almacenamiento.
 *
 * Retorna:
 *   T | null: El objeto deserializado del tipo generico T, o null si no existe.
 *
 * Dependencias:
 *   JSON.parse: Utilizado para convertir cadenas de texto en objetos de JavaScript.
 */
export function getFromCache<T>(key: string): T | null {
  // Consulta el valor asociado a la clave en el almacenamiento de sesion.
  const cached = sessionStorage.getItem(key);
  // Si no hay dato, retorna null de forma temprana.
  if (!cached) return null;
  try {
    // Intenta transformar la cadena JSON en un objeto tipado.
    return JSON.parse(cached) as T;
  } catch (error) {
    // En caso de corrupcion de datos en el storage, registra el error y retorna null.
    console.error(`Error al parsear cache para la llave ${key}:`, error);
    return null;
  }
}

/**
 * Serializa y persiste un objeto en el almacenamiento local de sesion.
 *
 * Parámetros:
 *   key (string): Clave bajo la cual se guardara el dato.
 *   data (any): Objeto o valor a persistir.
 */
export function saveToCache(key: string, data: any): void {
  // Convierte el objeto en una cadena JSON y lo almacena.
  sessionStorage.setItem(key, JSON.stringify(data));
}

/**
 * Elimina un recurso especifico del almacenamiento.
 *
 * Parámetros:
 *   key (string): Clave del recurso a invalidar.
 */
export function invalidateCache(key: string): void {
  // Remueve la entrada asociada a la clave proporcionada.
  sessionStorage.removeItem(key);
}

/**
 * Purga la totalidad de los datos almacenados en la sesion actual.
 */
export function clearCache(): void {
  // Ejecuta una limpieza completa del objeto sessionStorage.
  sessionStorage.clear();
}
