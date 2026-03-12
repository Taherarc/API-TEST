/**
 * Módulo de infraestructura abstracta para la persistencia efímera (caché).
 * Implementa una capa de protección e inyección sobre el `sessionStorage` nativo,
 * facilitando envolturas tipadas para serialización/deserialización de estructuras JSON completas.
 */

/**
 * Evalúa y rehidrata instancialmente un objeto de texto plano almacenado por su clave.
 *
 * Parámetros:
 *     key (string): Firma identificatoria única del recurso en el diccionario de sesión.
 *
 * Efectos Secundarios:
 * - Realiza lecturas sincrónicas subyacentes (`sessionStorage.getItem`).
 * - Intercepta fallos de formato `JSON.parse` emitiendo advertencias por consola.
 *
 * Retorna:
 *     T | null: El objeto genérico `T` reconstruido en memoria. Devuelve nulo frente a carencia o corrupción.
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
 * Codifica una estructura de memoria reactiva en `string` forzando su preservación local.
 *
 * Parámetros:
 *     key (string): Clave alfanumérica índice bajo la cual se asociará el string final.
 *     data (any): Entidad JavaScript (primitivo u objeto complejo serializable).
 *
 * Efectos Secundarios:
 * - Mutación destructiva de la entrada global en `sessionStorage` correspondiente al `key`.
 */
export function saveToCache(key: string, data: any): void {
  // Convierte el objeto en una cadena JSON y lo almacena.
  sessionStorage.setItem(key, JSON.stringify(data));
}

/**
 * Descarta selectivamente una entrada pre-existente forzando recargas futuras de red.
 *
 * Parámetros:
 *     key (string): Descriptor índice del recurso objetivo a destruir.
 *
 * Efectos Secundarios:
 * - Remueve el binomio de datos del `sessionStorage` si la clave coincide.
 */
export function invalidateCache(key: string): void {
  // Remueve la entrada asociada a la clave proporcionada.
  sessionStorage.removeItem(key);
}

/**
 * Evento destructivo contundente orientado a sanitizar toda traza pre-cachada global.
 *
 * Efectos Secundarios:
 * - Vacía incondicionalmente todos los vectores del `sessionStorage` ligados al origen actual.
 */
export function clearCache(): void {
  // Ejecuta una limpieza completa del objeto sessionStorage.
  sessionStorage.clear();
}
