/**
 * Módulo para la optimización de frecuencia de actualización reactiva.
 * Proporciona un hook que retrasa la propagación de un cambio de estado continuo
 * (debouncing) hasta que transcurre un período de inactividad de redibujado.
 */

import { useState, useEffect } from 'react';

/**
 * Aplica una lógica de estabilización "debouncing" sobre un valor atómico reactivo.
 *
 * Parámetros:
 *     value (T): El valor variable genérico de entrada cuya propagación se desea postergar.
 *     delay (number): Tiempo muerto de espera predefinido en milisegundos.
 *
 * Efectos Secundarios:
 * - Arranca y destruye iterativamente instancias de temporizadores (`setTimeout`/`clearTimeout`).
 * - Forzará un re-renderizado a los consumidores cada vez que expire exitosamente el timer activo.
 *
 * Retorna:
 *     T: El valor actualizado tras ser validado por la carencia reactiva del período impuesto.
 */
export function useDebounce<T>(value: T, delay: number): T {
  // Estado local encapsulado utilizado para guardar la captura retrasada segura del valor.
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura la función temporizada destinada a resolver la actualización del estado retardada.
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Método de contención para ciclo de actualización del componente. Elimina el temporizador pendiente.
    // Garantiza que la cascada final no dispare transmutaciones simultáneas.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
