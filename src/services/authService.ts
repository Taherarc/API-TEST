/**
 * Servicio fundamental de seguridad y autenticación estática lateral.
 * Gestiona el ciclo de vida del token de sesión interactuando directamente
 * con el Web Storage API (sessionStorage) del ecosistema cliente.
 */

// Identificador unico para el almacenamiento del token en la sesion del navegador.
const AUTH_KEY = 'geo_auth_token';

// Valor constante que representa el token de acceso para el entorno de demostracion.
const DEMO_TOKEN = 'token_admin_hardcoded_123';

/**
 * Interfaz de servicio que expone metodos para el control de sesion.
 */
export const authService = {
  /**
   * Ejecuta la confrontación de credenciales estáticamente asimiladas y establece el pasaje de sesión.
   *
   * Parámetros:
   *     username (string): Alias de operador capturado en la pasarela.
   *     password (string): Cadena criptográfica (texto plano operativo simulado) de cotejo.
   *
   * Efectos Secundarios:
   * - Escribe un nuevo descriptor de clave-valor (Token) inyectable en el `sessionStorage`.
   *
   * Retorna:
   *     boolean: Verdadero si la correspondencia lógica se satisface. Falso en derivación.
   */
  login: (username: string, password: string): boolean => {
    // Verifica si las credenciales coinciden con el usuario admin predeterminado.
    if (username === 'admin' && password === '123') {
      // Almacena el token de demo para persistir el estado de logueado entre recargas.
      sessionStorage.setItem(AUTH_KEY, DEMO_TOKEN);
      return true;
    }
    // Retorna falso si los datos introducidos no son validos.
    return false;
  },

  /**
   * Secuencia irreversible de cierre contextual local.
   *
   * Efectos Secundarios:
   * - Elimina imperativamente de la memoria del navegador el token reservado `geo_auth_token`.
   */
  logout: (): void => {
    // Elimina el token del storage para invalidar la sesion activa.
    sessionStorage.removeItem(AUTH_KEY);
  },

  /**
   * Interroga estructuralmente a la memoria temporal del ambiente (Navegador).
   *
   * Retorna:
   *     boolean: Condición de validez resultante de emparejar el descriptor persistido vs DEMO_TOKEN.
   */
  isAuthenticated: (): boolean => {
    // Compara el valor actual en storage con la constante del sistema.
    return sessionStorage.getItem(AUTH_KEY) === DEMO_TOKEN;
  }
};
