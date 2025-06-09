// src/index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
// Importa CSS de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// Importa JS de Bootstrap (incluye Popper para el collapse)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Puedes definir un pequeño estilo inline para el gradiente de fondo
const fullScreenGradient = {
  background: 'linear-gradient(to right, #3B82F6, #2563EB, #1D4ED8)',
};

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Contenedor que ocupa toda la pantalla y centra vertical/horizontalmente */}
      <div
        className="d-flex justify-content-center align-items-center min-vh-100"
        style={fullScreenGradient}
      >
        {/* Tarjeta central con sombra, bordes redondeados y padding */}
        <div className="card shadow rounded w-100" style={{ maxWidth: '1120px' }}>
          <div className="card-body p-4">
            <App />
          </div>
        </div>
      </div>
    </BrowserRouter>
  </React.StrictMode>
);
