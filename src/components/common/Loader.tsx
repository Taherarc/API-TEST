/**
 * Módulo representacional para estados de espera.
 * Encapsula la retroalimentación visual estandarizada para notificar a los usuarios
 * operaciones transaccionales pendientes de red o simuladas en curso.
 */

import React from 'react';

/**
 * Renderiza un spinner animado vectorialmente acompañado de una descripción estática.
 * Genera de forma aislada las animaciones CSS en el DOM, prescribiendo la cascada.
 *
 * Retorna:
 *     JSX.Element: Estructura DOM de bloqueo o espera nativa.
 */
const Loader: React.FC = () => (
  <div className="system-feedback loader">
    {/* Componente base vacío destinado a soportar la rotación continua programada */}
    <div className="spinner"></div>
    <p>Estableciendo comunicacion segura...</p>
    
    {/* Bloque autodenominado de estilado. Inyecta propiedades exclusivas para el loader
        evitando colisiones sintácticas externas mediante nombres dedicados y un alcance local estricto. */}
    <style>{`
      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(59, 130, 246, 0.1);
        border-left-color: var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default Loader;
