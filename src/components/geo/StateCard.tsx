/**
 * Componente de visualización para entidades de nivel Estado o Departamento.
 */

import React from 'react';
import { State } from '../../types/geoTypes';

/**
 * Propiedades del componente StateCard.
 *
 * Parámetros:
 *   state (State): Datos regionales del estado.
 *   index (number): Indice para animaciones de entrada.
 *   onClick (function): Handler para la seleccion de la region.
 */
interface StateCardProps {
  state: State;
  index: number;
  onClick: () => void;
}

/**
 * Renderiza el bloque descriptivo de un estado regional.
 */
const StateCard: React.FC<StateCardProps> = ({ state, index, onClick }) => {
  // Retraso de animacion optimizado para transiciones rapidas.
  const animationStyle = { animationDelay: `${index * 0.03}s` };

  return (
    <div 
      className="data-card interactive component-card" 
      style={animationStyle}
      onClick={onClick}
    >
      <h3>{state.name}</h3>
      
      <div className="card-details">
        <p>Codigo Estado: {state.iso2}</p>
      </div>
      
      <div className="card-action">Explorar Ciudades →</div>
    </div>
  );
};

export default StateCard;
