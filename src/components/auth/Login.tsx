/**
 * Módulo de interfaz base para recolección formal de credenciales de usuario.
 * Suministra un renderizado de formulario asilado con validación reactiva pasiva,
 * orquestando y despachando eventos al contexto de sesión global `AuthContext`.
 */

import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import appLogo from '../../assets/logoprin.png';
import '../../styles/Login.css';

/**
 * Renderiza la vista de acceso inyectando la previsualización gráfica de la aplicación.
 * 
 * Dependencias:
 * - AuthContext: Consumo imperativo del método `loginUser` interactuando con las firmas base secretas.
 * 
 * Retorna:
 *     JSX.Element: Un overlay de bloqueo que envuelve elementos `<form>` nativos con eventos customizados.
 */
export const Login: React.FC = () => {
  // Consume el metodo de login del contexto global.
  const { loginUser } = useContext(AuthContext);

  // Estados locales para la captura de credenciales del formulario.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Estado de control para la visibilidad de alertas ante credenciales incorrectas.
  const [errorVisible, setErrorVisible] = useState(false);

  /**
   * Procesa el evento de sumisión encolado del elemento `<form>` interceptado.
   *
   * Parámetros:
   *     e (React.FormEvent): Interfaz envoltorio sintética de cascada conteniendo la estructura base del evento DOM.
   *
   * Efectos Secundarios:
   * - Neutraliza la navegación nativa HTML5 invocando `e.preventDefault()`.
   * - Ejecuta la verificación persistente forzando el cambio contextual `loginUser`.
   * - Enciende notificaciones booleanas rojas temporalizadas de confirmarse una falsedad.
   */
  const handleAuth = (e: React.FormEvent) => {
    // Evita la recarga de la página por defecto de los formularios HTML.
    e.preventDefault();

    // Intenta la autenticacion mediante el servicio inyectado.
    const success = loginUser(username, password);

    if (!success) {
      // Activa el feedback visual de error si las credenciales fallan.
      setErrorVisible(true);
      // Oculta el mensaje automaticamente tras un periodo de 3 segundos.
      setTimeout(() => setErrorVisible(false), 3000);
    }
  };

  return (
    <div className="login-overlay">
      <form className="login-form" onSubmit={handleAuth}>
        <div className="login-header">
          <img src={appLogo} alt="Geo Explorador Logo" className="login-logo" />
          <p>Iniciar Sesión</p>
        </div>

        <div className="form-group">
          <label>Nombre de Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            required
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123"
            required
            autoComplete="current-password"
          />
        </div>

        {/* Renderizado condicional del mensaje de error operacional. */}
        {errorVisible && <p className="auth-error">Credenciales invalidas.</p>}

        <button type="submit" className="login-btn">Entrar</button>
      </form>
    </div>
  );
};
