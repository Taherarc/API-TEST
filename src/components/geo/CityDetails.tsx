/**
 * Módulo Modal para exposición de metadatos geoespaciales extendidos.
 * Aísla la instanciación de red asíncrona contra la API de OpenStreetMap Nominatim
 * y gobierna la superposición visual sobre la jerarquía z-index activa.
 */

import React, { useState, useEffect } from 'react';
import { OSMPlace } from '../../types/geoTypes';
import { geoRepository } from '../../repositories/geoRepository';
import '../../styles/CityDetails.css';

/**
 * Interfaz inyectora de dependencias para consulta y destrucción del overlay.
 *
 * Parámetros:
 *     cityName (string): Referencia toponímica matriz para búsqueda heurística textual.
 *     countryIso2 (string): Filtro de precisión ISO acotando la búsqueda al dominio nacional.
 *     onClose (function): Hook detonante para eliminación del árbol modal reactivo desde su padre.
 */
interface CityDetailsProps {
  cityName: string;
  countryIso2: string;
  onClose: () => void;
}

/**
 * Dibuja un diálogo bloqueante y despacha consultas periféricas geocientíficas.
 *
 * Parámetros:
 *     Props (CityDetailsProps): Tupla estructurada de topónimos locales y cierres en desestructuración.
 *
 * Retorna:
 *     JSX.Element: Un overlay absoluto y contenedor nodal bloqueante propagaciones al DOM subyacente.
 */
export const CityDetails: React.FC<CityDetailsProps> = ({ cityName, countryIso2, onClose }) => {
  // Inicializa a nulo un contenedor temporal en memoria para deseriales de `OSMPlace`.
  const [details, setDetails] = useState<OSMPlace | null>(null);
  // Operativa bandera asíncrona; precargada en `true` suprimiendo vistas parciales tempranas.
  const [loading, setLoading] = useState(true);

  /**
   * Disparador imperativo montado sobre variables del ecosistema unívoco geo-padre.
   * Modifica colgaduras en carga, pide flujos de proxy y deserializa las peticiones de retorno OSM.
   */
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      // Solicita datos al repositorio (aplica Cache First internamente).
      const data = await geoRepository.getCityDetails(cityName, countryIso2);
      setDetails(data);
      setLoading(false);
    };
    fetchDetails();
  }, [cityName, countryIso2]);

  return (
    <div className="city-modal-overlay" onClick={onClose}>
      {/* Detiene la cascada natural del DOM (bubbling) impidiendo el cierre del nodo padre al clickear el centro. */}
      <div className="city-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>{cityName}</h2>
        
        {loading ? (
          <p>Cargando detalles geoespaciales...</p>
        ) : details ? (
          <div className="osm-details-grid">
            {/* Presentacion de coordenadas y tipos de lugar recuperados. */}
            <p><strong>Tipo:</strong> {details.type}</p>
            <p><strong>Latitud:</strong> {details.lat}</p>
            <p><strong>Longitud:</strong> {details.lon}</p>
            <p><strong>Display:</strong> {details.display_name}</p>
            
            {/* Enlace directo a la cartografia de OpenStreetMap para visualizacion del entorno. */}
            <a 
              href={`https://www.openstreetmap.org/#map=15/${details.lat}/${details.lon}`}
              target="_blank"
              rel="noreferrer"
              className="osm-link-btn"
            >
              Ver en Mapa Real ↗
            </a>
          </div>
        ) : (
          <p>No se encontraron detalles geoespaciales adicionales para esta ubicacion.</p>
        )}
      </div>
    </div>
  );
};
