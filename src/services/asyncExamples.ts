/**
 * Módulo de demostración técnica sobre asincronismo nativo en JavaScript/TypeScript.
 * Expone implementaciones de Promesas (then, catch, pending, fulfilled, rejected),
 * temporizadores simulados y el manejo de códigos HTTP direccionales.
 */

const API_KEY = (import.meta as any).env.VITE_CSC_API_KEY;

export const asyncExamples = {
  /**
   * Patrón A: Verificador de Salud del API (.then / .catch clásico).
   * Encadena lógicamente promesas de red de forma explícita sin azucar sintáctico,
   * demostrando la captura de rechazos y la limpieza de tubería con .finally().
   *
   * Retorna:
   *     Promise<string>: Cadena textual empacada en Promesa indicando salud del endpoint.
   */
  checkServerHealth: (): Promise<string> => {
    console.log("Iniciando Verificación de Salud (Promesa PENDING)...");
    
    // fetch retorna una Promesa en estado PENDING.
    return fetch('https://api.countrystatecity.in/v1/countries', { headers: { 'X-CSCAPI-KEY': API_KEY } })
      .then(response => {
        // La Promesa se resuelve (FULFILLED) aunque el status HTTP sea un error.
        if (response.ok) {
          console.log("Servidor Fulfilled (Exitoso)");
          return "API Saludable (Promesa Resuelta Correctamente).";
        } else {
          // Si el estatus indica fallo, forzamos un rechazo explícito.
          throw new Error(`El servidor falló con código de estado: ${response.status}`);
        }
      })
      .catch(error => {
        // Atrapa fallos de red (reject nativo de fetch) o los errores forzados por nosotros.
        console.error("Servidor Rejected (Rechazado explícitamente):", error.message);
        throw error;
      })
      .finally(() => {
        // Este bloque siempre se ejecuta, confirmando que la promesa salió de PENDING.
        console.log("Comprobación finalizada (Se completó el ciclo asíncrono).");
      });
  },

  /**
   * Patrón B: Geolocalización simulada con latencia (new Promise, setTimeout).
   * Fabrica manualmente un objeto Promise encapsulando generadores pseudo-aleatorios
   * transicionando artificialmente hacia estados "resolve" o "reject" vía callbacks.
   *
   * Retorna:
   *     Promise<string>: Coordenadas ficticias simuladas o error de conectividad emulado.
   */
  simulateGPS: (): Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log("Simulador GPS en estado PENDING (Esperando callback de timeout)...");
      
      // Simulamos una latencia de red de 2 segundos mediante un callback.
      setTimeout(() => {
        const chance = Math.random();
        
        // Simula un 60% de probabilidad de éxito.
        if (chance > 0.4) {
          console.log("Callback ejecutado. Evaluando GPS: Fulfilled");
          resolve("✅ Ubicación Simulada: Latitud 4.6097, Longitud -74.0817"); 
        } else {
          console.log("Callback ejecutado. Evaluando GPS: Rejected");
          reject(new Error("📡 Señal de GPS perdida de forma aleatoria (Promesa Rechazada)."));
        }
      }, 2000);
    });
  },

  /**
   * Patrón C: Buscador estricto de códigos territoriales (Manejo explícito de Error HTTP 404).
   * Instrumenta el uso asíncrono-secuencial (async/await) interceptando respuestas del protocolo web.
   *
   * Parámetros:
   *     isoCode (string): Acrónimo internacional enviado por el input del usuario.
   *
   * Retorna:
   *     Promise<string>: Representación textual indicando correspondencia topónima o disparo de rechazo sintáctico.
   */
  testStrict404: async (isoCode: string): Promise<string> => {
    if (!isoCode || isoCode.length < 2) {
      throw new Error("Escribe al menos 2 letras en el buscador para validar.");
    }
    
    console.log(`Buscando código ISO '${isoCode}' usando Async/Await...`);
    
    try {
      const response = await fetch(`https://api.countrystatecity.in/v1/countries/${isoCode.toUpperCase()}`, {
        headers: { 'X-CSCAPI-KEY': API_KEY }
      });
      
      if (response.status === 404) {
        throw new Error(`ERROR 404: El servidor no reconoce '${isoCode}' como un código de país oficial.`);
      }
      
      if (!response.ok) {
        throw new Error(`Error de servidor (${response.status}).`);
      }
      
      const data = await response.json();
      return `¡País Encontrado! Es ${data.name} (Promesa Resuelta).`;
      
    } catch (error: any) {
      throw error;
    }
  }
};
