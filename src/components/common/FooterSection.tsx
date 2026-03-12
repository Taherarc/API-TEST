/**
 * Componente representacional permanente de pie sub-página genérico (Footer).
 * Expone tipografía corporativa estructurada, hipervínculos de dominio estáticos locales
 * y canales de redireccionamiento externo (Anchor HREFs seguros).
 */

import React from 'react';
import '../../styles/Footer.css';

/**
 * Función inyectora puramente estática sin ciclos de estado ni dependencias asíncronas.
 *
 * Retorna:
 *     JSX.Element: Contenedor semántico HTML5 `<footer>` estructurado en retículas CSS-Grid/Flex.
 */
export const FooterSection: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-col">
          <h2 className="footer-title">Geo Explorador</h2>
          <p className="footer-text">
            Plataforma para la exploración geográfica y gestión de datos territoriales a nivel global.
          </p>
        </div>

        <div className="footer-col">
          <h3 className="footer-heading">Navegación</h3>
          <ul className="footer-links">
            <li><a href="#planet">Planeta</a></li>
            <li><a href="#about">Acerca de</a></li>
            <li><a href="#services">Servicios</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3 className="footer-heading">Legal</h3>
          <ul className="footer-links">
            <li><a href="#terms">Términos de Uso</a></li>
            <li><a href="#privacy">Privacidad</a></li>
            <li><a href="#cookies">Cookies</a></li>
          </ul>
        </div>

        <div className="footer-col donation-col">
          <h3 className="footer-heading">Apoyo</h3>
          <p className="footer-text">Si te gusta este trabajo, considera apoyar a este pobre cristiano.</p>
          <a
            href="https://www.bancolombia.com/personas"
            target="_blank"
            rel="noopener noreferrer"
            className="nequi-btn"
          >
            Donar via Nequi
          </a>
        </div>
      </div>
    </footer>
  );
};
