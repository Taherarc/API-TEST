/**
 * Componente de visualización modular para subdivisión administrativa abstracta (Estados/Departamentos/Provincias).
 * Encapsula la interacción de transcurso de nivel iterando transiciones al último marco lógico territorial (Ciudades).
 */

import React from 'react';
import { State } from '../../types/geoTypes';

/**
 * Interface contenedora del contrato estricto de pase del modelo `State` a visualización de bloque.
 *
 * Parámetros:
 *     state (State): Sub-nodo cartográfico acotando a una referencia provincial local.
 *     index (number): Clave posicional autocomputada de iteración, funcional exclusivamente con props estéticas.
 *     onClick (function): Suscriptor al evento accionado emitiendo señal descendente al componente raíz `App`.
 *     onMouseEnter (function?): Receptor paramétrico facultativo atado a sobrevuelos no destructivos.
 */
interface StateCardProps {
  state: State;
  index: number;
  onClick: () => void;
  onMouseEnter?: () => void;
}

/**
 * Engloba representacionalmente un segmento de territorio soberano dependiente (Estado).
 *
 * Retorna:
 *     JSX.Element: Un panel responsivo envuelto provisto de clases controladas por módulos CSS y enlazado condicionalmente a delegados onClick.
 */
const StateCard: React.FC<StateCardProps> = ({ state, index, onClick, onMouseEnter }) => {
  // Asigna el coeficiente dinámico calculado (delta de 30ms en cascada) al objeto literal estilo en línea.
  const animationStyle = { animationDelay: `${index * 0.03}s` };

  return (
    <div 
      className="data-card interactive component-card" 
      style={animationStyle}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
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
