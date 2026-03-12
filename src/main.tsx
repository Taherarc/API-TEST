/**
 * Punto de entrada principal de la aplicación.
 * Orquesta el arranque del entorno de React, importando los estilos globales
 * y montando el árbol de componentes en el DOM del navegador.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

/**
 * Inicializa el árbol de componentes dentro del elemento HTML contenedor 'root'.
 * Se utiliza el contenedor StrictMode de React para habilitar comprobaciones
 * adicionales y advertencias durante el desarrollo, facilitando la detección
 * temprana de efectos secundarios inesperados o métodos obsoletos.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Instancia el componente raíz que orquesta los proveedores y la interfaz */}
    <App />
  </React.StrictMode>,
)
