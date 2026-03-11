/**
 * Componente de visualización para entidades de nivel Pais.
 * Diseñado para presentar informacion financiera e identificacion geografica basica.
 */

import React from 'react';
import { Country } from '../../types/geoTypes';

/**
 * Propiedades requeridas para la tarjeta de pais.
 *
 * Parámetros:
 *   country (Country): Objeto con los datos del pais.
 *   index (number): Posicion en la lista para el calculo de animacion escalonada.
 *   onClick (function): Accion al interactuar con el elemento.
 */
interface CountryCardProps {
  country: Country;
  index: number;
  onClick: () => void;
}

/**
 * Renderiza una tarjeta interactiva con metadatos de un pais.
 */
const CountryCard: React.FC<CountryCardProps> = ({ country, index, onClick }) => {
  // Calcula un retraso proporcional para producir un efecto de cascada en la carga.
  const animationStyle = { animationDelay: `${index * 0.05}s` };

  return (
    <div 
      className="data-card interactive component-card" 
      style={animationStyle}
      onClick={onClick}
    >
      <h3>
        {/* Muestra el glifo representativo si esta disponible en la entidad. */}
        {country.emoji && <span className="entity-emoji">{country.emoji} </span>} 
        {country.name}
      </h3>
      
      <div className="card-details">
        <p>Codigo ISO: {country.iso2}</p>
        <p>Moneda: {country.currency}</p>
      </div>
      
      <div className="card-action">Explorar Estados →</div>
    </div>
  );
};

export default CountryCard;
