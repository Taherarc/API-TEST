/**
 * Gancho personalizado para optimizar la frecuencia de actualizacion de un valor.
 * Retrasa la propagacion de un cambio hasta que haya transcurrido un tiempo de inactividad especifico.
 */

import { useState, useEffect } from 'react';

/**
 * Aplica una logica de debouncing sobre un valor de entrada.
 *
 * Parámetros:
 *   value (T): El valor de entrada que se desea estabilizar.
 *   delay (number): Tiempo de espera en milisegundos antes de actualizar el valor estabilizado.
 *
 * Retorna:
 *   T: El valor estabilizado tras el periodo de espera definido.
 */
export function useDebounce<T>(value: T, delay: number): T {
  // Estado interno que almacena el valor estabilizado.
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura un temporizador para actualizar el estado tras el delay.
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpia el temporizador previo si el valor cambia antes de completar el delay.
    // Esto previene multiples actualizaciones sucesivas.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
