/**
 * Orquestador principal de la aplicacion Geo Explorer.
 * Implementa la estructura de alto nivel, ruteo condicional y los proveedores de estado local.
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

// Funciones de utilidad y ganchos personalizados.
import { filterGeoData } from './utils/searchUtils';
import { usePagination } from './hooks/usePagination';

// Estilos globales de la aplicacion.
import './styles/App.css';

/**
 * Componente funcional que renderiza el contenido principal tras la autenticacion.
 */
const AppContent: React.FC = () => {
  // Accede al estado de sesion y metodos de salida.
  const { isLogged, logoutUser } = React.useContext(AuthContext);
  // Accede a la logica de navegacion geografica.
  const geo = useGeo();

  // Estado local para el termino de busqueda filtrado.
  const [searchTerm, setSearchTerm] = useState('');
  // Estado para controlar que ciudad esta siendo inspeccionada en el modal OSM.
  const [inspectingCity, setInspectingCity] = useState<any | null>(null);

  /**
   * Ejecuta el filtrado local sobre el dataset completo recuperado.
   * La memorizacion evita re-calculos innecesarios en cada renderizado.
   */
  const filteredData = useMemo(() => {
    return filterGeoData(geo.dataList, searchTerm);
  }, [geo.dataList, searchTerm]);

  /**
   * Integra la logica de paginacion para la lista filtrada.
   */
  const { 
    paginatedItems, 
    currentPage, 
    setCurrentPage, 
    totalPages 
  } = usePagination(filteredData, 24);

  /**
   * Hook de efecto para cargar el listado inicial de paises tras el login exitoso.
   */
  React.useEffect(() => {
    if (isLogged) geo.setCountries();
  }, [isLogged]);

  // Guardia de navegacion: Redirige al login si no existe sesion activa.
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
          <h1>Geo Explorer Pro</h1>
          <button className="logout-btn" onClick={logoutUser}>Cerrar Sesion</button>
        </div>
        
        {/* Indicador visual de la procedencia de los datos (Red o Cache). */}
        {geo.source && (
          <span className={`source-badge badge-${geo.source}`}>
            Origen: {geo.source.toUpperCase()}
          </span>
        )}

        {/* Sistema de migas de pan (Breadcrumbs) para navegacion jerarquica. */}
        <nav className="breadcrumbs">
          <span className={geo.currentLevel === 'countries' ? 'active' : 'clickable'} onClick={geo.resetNavigation}>
            Mundo
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
          <>
            <div className="data-grid">
              {/* Renderizado dinamico de tarjetas segun el nivel de exploracion. */}
              {paginatedItems.map((item, index) => {
                if (geo.currentLevel === 'countries') return <CountryCard key={item.iso2} country={item} index={index} onClick={() => geo.setStatesByCountry(item)} />;
                if (geo.currentLevel === 'states') return <StateCard key={item.iso2} state={item} index={index} onClick={() => geo.setCitiesByState(item)} />;
                return <CityCard key={item.name} city={item} index={index} onClick={() => setInspectingCity(item)} />;
              })}
            </div>
            
            {/* Controles de paginacion para el listado actual. */}
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </>
        )}
      </main>
    </div>
  );
};

/**
 * Punto de entrada con inyeccion de Proveedores de Estado.
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
