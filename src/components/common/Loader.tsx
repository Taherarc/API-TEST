/**
 * Componente representacional de estado de espera.
 * Provee feedback visual durante operaciones asincronas de red o procesamiento.
 */

import React from 'react';

/**
 * Renderiza un spinner animado acompañado de un mensaje descriptivo.
 */
const Loader: React.FC = () => (
  <div className="system-feedback loader">
    {/* Contenedor circular con animacion rotativa via CSS. */}
    <div className="spinner"></div>
    <p>Estableciendo comunicacion segura...</p>
    
    {/* Estilizado embebido para garantizar la encapsulacion del efecto visual. */}
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
