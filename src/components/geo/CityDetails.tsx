/**
 * Componente Modal para la visualizacion de metadatos geoespaciales extendidos.
 * Integra la captura de datos desde OpenStreetMap Nominatim de forma aislada.
 */

import React, { useState, useEffect } from 'react';
import { OSMPlace } from '../../types/geoTypes';
import { geoRepository } from '../../repositories/geoRepository';
import '../../styles/CityDetails.css';

/**
 * Contrato de propiedades para el inspector de ciudad.
 *
 * Parámetros:
 *   cityName (string): Nombre textual de la ciudad a buscar.
 *   countryIso2 (string): Codigo ISO del pais para precision de búsqueda.
 *   onClose (function): Callback para destruir el modal y retornar a la vista previa.
 */
interface CityDetailsProps {
  cityName: string;
  countryIso2: string;
  onClose: () => void;
}

/**
 * Renderiza un dialogo modal con informacion de geolocalizacion enriquecida.
 */
export const CityDetails: React.FC<CityDetailsProps> = ({ cityName, countryIso2, onClose }) => {
  // Almacena el objeto de respuesta del repositorio OSM.
  const [details, setDetails] = useState<OSMPlace | null>(null);
  // Estado local para controlar el feedback de carga dentro del modal.
  const [loading, setLoading] = useState(true);

  /**
   * Efecto de carga inicial tras el montaje del componente.
   * Realiza la consulta asincrona al repositorio de mapas.
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
      {/* Evita que el clic dentro del modal cierre el dialogo por propagacion. */}
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
