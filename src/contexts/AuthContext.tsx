/**
 * Proveedor de estado global para la gestion de seguridad.
 * Centraliza el contexto de sesion permitiendo el acceso controlado a la aplicacion.
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

/**
 * Definicion de las capacidades expuestas por el contexto de autenticacion.
 */
interface AuthContextType {
  // Indica si existe una sesion activa validada.
  isLogged: boolean;
  // Metodo para intentar el acceso al sistema.
  loginUser: (user: string, pass: string) => boolean;
  // Metodo para purgar la sesion activa.
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
 * Componente envoltorio que inyecta la logica de sesion en la jerarquia de componentes.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estado reactivo que refleja la validez de la sesion actual.
  const [isLogged, setIsLogged] = useState<boolean>(false);

  /**
   * Hook de inicializacion que verifica el estado persistente al montar la aplicacion.
   */
  useEffect(() => {
    // Sincroniza el estado reactivo con el almacenamiento de sesion.
    setIsLogged(authService.isAuthenticated());
  }, []);

  /**
   * Wrapper funcional para el proceso de validacion de credenciales.
   */
  const loginUser = (user: string, pass: string): boolean => {
    // Delega la verificacion al servicio de bajo nivel.
    const success = authService.login(user, pass);
    // Si la operacion es exitosa, actualiza el estado global inmediatamente.
    if (success) setIsLogged(true);
    return success;
  };

  /**
   * Wrapper para la desconexion segura del usuario.
   */
  const logoutUser = () => {
    // Purga las credenciales del almacenamiento local.
    authService.logout();
    // Invalida el estado reactivo para forzar el re-renderizado de seguridad.
    setIsLogged(false);
  };

  return (
    <AuthContext.Provider value={{ isLogged, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
