/**
 * Componente de interfaz para la autenticacion de usuarios.
 * Provee un formulario de acceso restringido con manejo de estados de error.
 */

import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/Login.css';

/**
 * Renderiza la vista de autenticacion global.
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
   * Procesa el evento de envio del formulario.
   *
   * Parámetros:
   *   e (React.FormEvent): Objeto del evento de formulario.
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
          <h2>Geo Explorer Pro</h2>
          <p>Acceso Restringido</p>
        </div>
        
        <div className="form-group">
          <label>Identificador</label>
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
          <label>Credencial</label>
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
