/**
 * Componente representacional atómico para entidades soberanas de nivel País.
 * Diseñado para ensamblar y exponer la información financiera base (moneda)
 * y la identificación geográfica unívoca (código ISO-2) recuperada por la red.
 */

import React from 'react';
import { Country } from '../../types/geoTypes';

/**
 * Dependencias posicionales forzadas para el montaje del bloque cartográfico primario.
 *
 * Parámetros:
 *     country (Country): Instancia mapeada al tipado estructurando las banderas formales del país.
 *     index (number): Puntero referencial de arreglo utilizado exclusivamente en funciones de escalonamiento CSS.
 *     onClick (function): Puntero al mecanismo accionante de inyección asincrónica descensional (hacia estados).
 *     onMouseEnter (function?): Puntero referencial optativo activado al foco de puntero pasivo sobre el nodo.
 */
interface CountryCardProps {
  country: Country;
  index: number;
  onClick: () => void;
  onMouseEnter?: () => void;
}

/**
 * Construye el mosaico visual encapsulado de nivel soberano conectando datos del modelo Country.
 * 
 * Parámetros:
 *     Props (CountryCardProps): Objeto desempaquetado con inyección obligatoria del tipo Country.
 *
 * Retorna:
 *     JSX.Element: Un contenedor React de tipo div, interactivo al flujo de puntero y clicks nativos.
 */
const CountryCard: React.FC<CountryCardProps> = ({ country, index, onClick, onMouseEnter }) => {
  // Construye sincrónicamente los modificadores vectoriales infiriendo 50ms de latencia visual de dibujado iterado.
  const animationStyle = { animationDelay: `${index * 0.05}s` };

  return (
    <div 
      className="data-card interactive component-card" 
      style={animationStyle}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <h3>
        {/* Requisita asíncronamente vía red el identificador de vector visual (SVG/PNG) correspondiente al esquema ISO-2 estándar. */}
        <img 
          src={`https://flagcdn.com/w40/${country.iso2.toLowerCase()}.png`} 
          alt={`Bandera de ${country.name}`}
          className="country-card-flag"
        />
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
