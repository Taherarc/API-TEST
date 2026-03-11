/**
 * Componente de visualización final para entidades de nivel Ciudad.
 * Enfocado en la activacion del inspector de metadatos externos.
 */

import React from 'react';
import { City } from '../../types/geoTypes';

/**
 * Propiedades del componente CityCard.
 *
 * Parámetros:
 *   city (City): Datos basicos de la ciudad remitidos por CSC API.
 *   index (number): Posicion relativa en la grilla visual.
 *   onClick (function): Disparador del modal de inspeccion detallada.
 */
interface CityCardProps {
  city: City;
  index: number;
  onClick: () => void;
}

/**
 * Renderiza la tarjeta de una ubicacion urbana.
 */
const CityCard: React.FC<CityCardProps> = ({ city, index, onClick }) => {
  // Animacion fluida ajustada para densidades altas de elementos.
  const animationStyle = { animationDelay: `${index * 0.02}s` };

  return (
    <div 
      className="data-card interactive component-card" 
      style={animationStyle}
      onClick={onClick}
    >
      <h3>{city.name}</h3>
      
      {/* Boton indicativo de que existe informacion extendida via OSM. */}
      <div className="card-action-osm">Ver inspector OSM 🌐</div>
    </div>
  );
};

export default CityCard;
