/**
 * Proveedor de estado global para la gestión de seguridad y sesión de usuario.
 * Centraliza el contexto de autenticación permitiendo el control de acceso
 * y la distribución del estado de login en la jerarquía de componentes.
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

/**
 * Definición estructurada de las capacidades expuestas por el contexto de autenticación.
 */
interface AuthContextType {
  // Indica si existe una sesión activa y validada en el cliente.
  isLogged: boolean;
  // Método inyector para procesar credenciales e intentar el acceso lógico al sistema.
  loginUser: (user: string, pass: string) => boolean;
  // Método limpiador para purgar el token/estado de sesión activa.
  logoutUser: () => void;
}

/**
 * Inicializacion del contexto con valores operacionales seguros.
 */
export const AuthContext = createContext<AuthContextType>({
  isLogged: false,
  loginUser: () => false,
  logoutUser: () => {}
});

/**
 * Componente funcional envoltorio que inyecta la lógica de sesión en el árbol de dependencias.
 *
 * Parámetros:
 *     children (ReactNode): Nodos React anidados que consumirán este contexto.
 *
 * Retorna:
 *     JSX.Element: Un proveedor de contexto de React con los métodos y estados inyectados.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estado local reactivo que refleja la validez de credenciales en memoria.
  const [isLogged, setIsLogged] = useState<boolean>(false);

  /**
   * Hook de inicialización que verifica el estado persistente al montar el proveedor.
   *
   * Efectos Secundarios:
   * - Modifica el estado interno `isLogged` sincronizándolo con el sistema de almacenamiento.
   * - Ejecuta la lectura de persistencia a través de `authService`.
   */
  useEffect(() => {
    // Sincroniza el estado reactivo consultando el servicio de autenticación estático.
    setIsLogged(authService.isAuthenticated());
  }, []);

  /**
   * Valida credenciales de entrada y transiciona el sistema hacia un estado autenticado.
   *
   * Parámetros:
   *     user (string): Nombre de usuario objetivo aportado en el formulario.
   *     pass (string): Contraseña ingresada en texto plano (en concepto).
   *
   * Efectos Secundarios:
   * - Modifica el estado reactivo `isLogged` mutando la vista de toda la aplicación.
   * - Persiste la capa de sesión delegando en `authService.login()`.
   *
   * Retorna:
   *     boolean: Verdadero si las credenciales concuerdan con la lógica interna, Falso en caso adverso.
   */
  const loginUser = (user: string, pass: string): boolean => {
    // Delega la verificación de integridad al servicio base auxiliar.
    const success = authService.login(user, pass);
    // Si la operación devuelve validez, actualiza el re-renderizado de estado global.
    if (success) setIsLogged(true);
    return success;
  };

  /**
   * Ejecuta la secuencia de desconexión segura del usuario, invalidando su permanencia.
   *
   * Efectos Secundarios:
   * - Purga el almacenamiento persistido delegando al método interno del `authService`.
   * - Pone el estado lógico `isLogged` en false forzando el retorno al componente de entrada.
   */
  const logoutUser = () => {
    authService.logout();
    setIsLogged(false);
  };

  return (
    <AuthContext.Provider value={{ isLogged, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
