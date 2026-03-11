/**
 * Modulo de seguridad y gestion de acceso.
 * Controla la simulacion de autenticacion mediante el uso de tokens persistentes en sesion.
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
   * Ejecuta la comprobacion de credenciales y establece la sesion si son correctas.
   *
   * Parámetros:
   *   username (string): Nombre de usuario proporcionado.
   *   password (string): Contraseña en texto plano para verificacion.
   *
   * Retorna:
   *   boolean: True si las credenciales coinciden con los valores predefinidos.
   *
   * Efectos secundarios:
   *   Establece una entrada en sessionStorage si la autenticacion es exitosa.
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
   * Finaliza la sesion actual eliminando los registros de seguridad.
   *
   * Efectos secundarios:
   *   Remueve la clave de autenticacion del almacenamiento de la sesion.
   */
  logout: (): void => {
    // Elimina el token del storage para invalidar la sesion activa.
    sessionStorage.removeItem(AUTH_KEY);
  },

  /**
   * Verifica de manera sincrona si existe una sesion activa valida.
   *
   * Retorna:
   *   boolean: True si el token almacenado coincide con el token esperado.
   */
  isAuthenticated: (): boolean => {
    // Compara el valor actual en storage con la constante del sistema.
    return sessionStorage.getItem(AUTH_KEY) === DEMO_TOKEN;
  }
};
