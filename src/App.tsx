/**
 * Módulo orquestador central de la aplicación React.
 * Define la estructura de alto nivel de la interfaz de usuario, gestiona el enrutamiento
 * condicional basado en el estado de autenticación, y establece los proveedores de
 * estado global (Context API) para la sesión y los datos geográficos.
 */

import React, { useState, useMemo } from 'react';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { GeoProvider, useGeo } from './contexts/GeoContext';

// Importacion de modulos de interfaz segmentados por dominio.
import { Login } from './components/auth/Login';
import { SearchInput } from './components/common/SearchInput';
import { CityDetails } from './components/geo/CityDetails';
import CountryCard from './components/geo/CountryCard';
import StateCard from './components/geo/StateCard';
import CityCard from './components/geo/CityCard';
import Loader from './components/common/Loader';
import Pagination from './components/common/Pagination';
import { filterGeoData } from './utils/searchUtils';
import { usePagination } from './hooks/usePagination';
import { asyncExamples } from './services/asyncExamples';
import { FooterSection } from './components/common/FooterSection';

// Estilos globales de la aplicacion.
import './styles/App.css';

/**
 * Componente funcional que renderiza el diseño y la lógica principal de la aplicación.
 * Solo debe montarse cuando existe una sesión de usuario verificada.
 * Gestiona la disposición de paneles, la barra de herramientas de búsqueda,
 * el componente de paginación y la interacción dinámica con el mapa externo.
 *
 * Efectos Secundarios:
 * - Provoca la carga asíncrona de la lista de países al montarse si hay sesión activa.
 * 
 * Dependencias:
 * - AuthContext: Para verificar permisos de acceso y ejecutar cierre de sesión.
 * - GeoContext: Para el consumo y filtrado reactivo de datos geográficos.
 *
 * Retorna:
 *     JSX.Element: Interfaz de usuario estructurada o redirección al componente Login.
 */
const AppContent: React.FC = () => {
  // Extrae banderas de estado y funciones seguras del proveedor de identidad
  const { isLogged, logoutUser } = React.useContext(AuthContext);
  // Inicializa el consumo del grafo de estado geográfico de la aplicación
  const geo = useGeo();

  // Estado local para el termino de busqueda filtrado.
  const [searchTerm, setSearchTerm] = useState('');
  // Estado para controlar que ciudad esta siendo inspeccionada en el modal OSM.
  const [inspectingCity, setInspectingCity] = useState<any | null>(null);
  // Estado del mapa flotante y su nivel de zoom
  const [hoveredLocation, setHoveredLocation] = useState<string>('World');
  const [mapZoom, setMapZoom] = useState<number>(3);

  // Estado para visualizar el resultado de las promeas asíncronas
  const [asyncResult, setAsyncResult] = useState<string | null>(null);

  /**
   * Ejecuta pruebas controladas sobre funciones asíncronas para demostrar
   * el comportamiento de resolución y rechazo de Promesas nativas o asincronismo simulado.
   *
   * Parámetros:
   *     type ('health' | 'gps' | '404'): Selector del tipo de simulación asíncrona a disparar.
   *
   * Efectos Secundarios:
   * - Modifica de forma local y sincrónica el estado `asyncResult` enviando mensajes de transición (PENDING, FULFILLED, REJECTED).
   *
   * Retorna:
   *     Promise<void>: Estructura promisoria de ejecución pero sin devolver valor tipado al llamador.
   */
  const runAsyncTest = async (type: 'health' | 'gps' | '404') => {
    setAsyncResult("⏳ Ejecutando Promesa (Estado: PENDING)...");
    try {
      let res = "";
      if (type === 'health') res = await asyncExamples.checkServerHealth();
      if (type === 'gps') res = await asyncExamples.simulateGPS();
      if (type === '404') res = await asyncExamples.testStrict404(searchTerm);
      setAsyncResult(`🟢 FULFILLED (Resuelta): ${res}`);
    } catch (error: any) {
      setAsyncResult(`🔴 REJECTED (Rechazada): ${error.message}`);
    }
  };

  /**
   * Calcula de forma memorizada el subconjunto de datos geográficos que coincide
   * de forma estricta (case-insensitive) con el término de búsqueda ingresado.
   * 
   * Dependencias:
   * - geo.dataList: Arreglo inmutable base para la iteración condicional.
   * - searchTerm: String clave emitido por los inputs de interfaz de usuario.
   * 
   * Retorna:
   *     Array<any>: Un arreglo en memoria independiente filtrado según predictibilidad.
   *     La ejecución memoizada anula el recalculo intensivo si los inputs no han mutado.
   */
  const filteredData = useMemo(() => {
    return filterGeoData(geo.dataList, searchTerm);
  }, [geo.dataList, searchTerm]);

  /**
   * Instancia el manejador lógico de control de paginación para distribuir visualmente
   * el conjunto procesado en lotes predefinidos. Adosando una constante mágica de 24 ítems máximos por página visible.
   */
  const {
    paginatedItems,
    currentPage,
    setCurrentPage,
    totalPages
  } = usePagination(filteredData, 24);

  /**
   * Hook de sincronización de ciclo de vida en el montaje del componente contenedor.
   * Delega la inicialización del primer volumen de carga HTTP (bajada topológica de países).
   * 
   * Efectos Secundarios:
   * - Triggerea internamente una mutación global en el objeto GeoStore y activa flags visuales de red.
   */
  React.useEffect(() => {
    if (isLogged) geo.setCountries();
  }, [isLogged]);

  // Bloque de intercepción segura: Fuerza la re-dirección preventiva aislando la vista privada
  // renderizando la pasarela de autenticación si se carece de token de persistencia válido.
  if (!isLogged) return <Login />;

  return (
    <div className="app-container">
      {/* Visualización condicional del modal de detalles de OSM. */}
      {inspectingCity && geo.selectedCountry && (
        <CityDetails
          cityName={inspectingCity.name}
          countryIso2={geo.selectedCountry.iso2}
          onClose={() => setInspectingCity(null)}
        />
      )}
      <header className="app-header">
        <div className="header-top-bar">
          <div className="header-left">
            {/* Indicador visual de la procedencia de los datos movido a la izquierda. */}
            {geo.source && (
              <span className={`source-badge badge-${geo.source}`}>
                Origen: {geo.source.toUpperCase()}
              </span>
            )}
          </div>

          <div className="header-center">
            <h1 className="header-title">Geo Explorador</h1>
          </div>

          <div className="header-right">
            <button className="logout-btn" onClick={logoutUser}>Cerrar Sesión</button>
          </div>
        </div>

        {/* Sistema de migas de pan (Breadcrumbs) para navegacion jerarquica. */}
        <nav className="breadcrumbs">
          <span className={geo.currentLevel === 'countries' ? 'active' : 'clickable'} onClick={geo.resetNavigation}>
            Planeta
          </span>
          {geo.selectedCountry && (
            <>
              <span className="separator">/</span>
              <span className={geo.currentLevel === 'states' ? 'active' : 'clickable'} onClick={() => geo.setStatesByCountry(geo.selectedCountry!)}>
                {geo.selectedCountry.name}
              </span>
            </>
          )}
          {geo.selectedState && (
            <>
              <span className="separator">/</span>
              <span className="active">{geo.selectedState.name}</span>
            </>
          )}
        </nav>
      </header>

      <main className="main-content">
        <div className="toolbar">
          {/* Boton de retroceso contextual segun el nivel de profundidad. */}
          {geo.currentLevel !== 'countries' && (
            <button className="btn-back" onClick={geo.goBack}>← Volver</button>
          )}
          <SearchInput onSearch={setSearchTerm} />
        </div>

        {/* Manejo de estados de carga y errores de infraestructura. */}
        {geo.loading ? (
          <Loader />
        ) : geo.error ? (
          <div className="system-feedback error-view">{geo.error}</div>
        ) : (
          <div className="layout-split">
            {/* Panel Izquierdo: Lista de Datos */}
            <div className="left-pane">
              <div className="data-canvas">
                <div className="data-grid">
                  {paginatedItems.length === 0 && (
                    <div className="empty-state">
                      <h3>Sin resultados</h3>
                      <p>
                        No existe este término en {geo.currentLevel === 'countries' ? 'el Planeta' : geo.currentLevel === 'states' ? geo.selectedCountry?.name : geo.selectedState?.name}.
                      </p>
                    </div>
                  )}
                  {/* Renderizado dinamico de tarjetas segun el nivel de exploracion. */}
                  {paginatedItems.map((item, index) => {
                    if (geo.currentLevel === 'countries') return <CountryCard key={item.iso2} country={item} index={index} onClick={() => geo.setStatesByCountry(item)} onMouseEnter={() => { setHoveredLocation(item.name); setMapZoom(5); }} />;
                    if (geo.currentLevel === 'states') return <StateCard key={item.iso2} state={item} index={index} onClick={() => geo.setCitiesByState(item)} onMouseEnter={() => { setHoveredLocation(`${item.name}, ${geo.selectedCountry?.name}`); setMapZoom(6); }} />;
                    return <CityCard key={item.name} city={item} index={index} onClick={() => setInspectingCity(item)} onMouseEnter={() => { setHoveredLocation(`${item.name}, ${geo.selectedState?.name}, ${geo.selectedCountry?.name}`); setMapZoom(10); }} />;
                  })}
                </div>
              </div>

              {/* Controles de paginacion para el listado actual. */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>

            {/* Panel Derecho: Mapa Dinámico */}
            <div className="right-pane">
              <div className="map-container">
                <iframe
                  title="Mapa de Ubicación"
                  className="map-iframe"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(hoveredLocation)}&output=embed&z=${mapZoom}`}
                  allowFullScreen={true}
                  loading="lazy"
                ></iframe>
              </div>

              {/* Panel demostrativo de Asincronismo */}
              <div className="async-panel">
                <h4>Pruebas Asíncronas (Promesas)</h4>
                <div className="async-demos">
                  <button className="async-btn" onClick={() => runAsyncTest('health')}>Health (.then/.catch)</button>
                  <button className="async-btn" onClick={() => runAsyncTest('gps')}>Simular GPS (new Promise)</button>
                  <button className="async-btn" onClick={() => runAsyncTest('404')}>Validar ISO (Async 404)</button>
                </div>
                {asyncResult && <div className="async-result">{asyncResult}</div>}
              </div>
            </div>
          </div>
        )}
      </main>
      <FooterSection />
    </div>
  );
};

/**
 * Componente empaquetado final de nivel cero, encargado de la inyección en cascada
 * de todos los contextos de proveedor requeridos para que las dependencias
 * reactivas subordinadas funcionen lógicamente.
 *
 * Retorna:
 *     JSX.Element: Proveedores anidados de autorización, dominio geográfico y cuerpo de la app.
 */
function App() {
  return (
    <AuthProvider>
      <GeoProvider>
        <AppContent />
      </GeoProvider>
    </AuthProvider>
  );
}

export default App;
