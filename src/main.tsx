/**
 * Punto de entrada de la aplicación.
 * Orquesta el arranque del entorno de React y la hidratacion del DOM.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

/**
 * Inicializa el arbol de componentes dentro del contenedor root.
 * Utiliza el Modo Estricto de React para detectar efectos secundarios inesperados.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Componente principal que contiene la lógica de Providers y ruteo. */}
    <App />
  </React.StrictMode>,
)
