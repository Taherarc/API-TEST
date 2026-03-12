/**
 * Componente de visualización final para entidades territoriales de nivel Ciudad.
 * Enfocado en la presentación del último eslabón geoespacial y en
 * la activación paramétrica del inspector de metadatos externos vinculantes.
 */

import React from 'react';
import { City } from '../../types/geoTypes';

/**
 * Interfaz definitoria del paso de mensajes de estado al componente de ciudad.
 *
 * Parámetros:
 *     city (City): Objeto empaquetado contenedor de nomenclaturas locales extraído de CSC API.
 *     index (number): Escalón secuencial para cálculo de funciones de tiempo (animación offset).
 *     onClick (function): Callback mutador del árbol de decisiones para activar el modal de inspección OpenStreetMap.
 *     onMouseEnter (function?): Callback opcional invocable tras detección de hover pasivo.
 */
interface CityCardProps {
  city: City;
  index: number;
  onClick: () => void;
  onMouseEnter?: () => void;
}

/**
 * Renderiza el plano tabular (tarjeta) de la demarcación urbana terminal.
 *
 * Parámetros:
 *     Props (CityCardProps): Objeto inyector extraído en desestructuración sintáctica plena.
 *
 * Retorna:
 *     JSX.Element: Nodo de bloque HTML div estilizado que reacciona a interacciones de cursor.
 */
const CityCard: React.FC<CityCardProps> = ({ city, index, onClick, onMouseEnter }) => {
  // Fórmula matemática de cascada visual: Disgrega el renderizado por múltiplos de 20ms por índice incremental.
  const animationStyle = { animationDelay: `${index * 0.02}s` };

  return (
    <div 
      className="data-card interactive component-card" 
      style={animationStyle}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <h3>{city.name}</h3>
      
      {/* Indicador persistente del panel modal subyacente interactuando con OpenStreetMap. */}
      <div className="card-action-osm">Ver inspector OSM 🌐</div>
    </div>
  );
};

export default CityCard;
