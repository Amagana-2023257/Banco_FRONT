// src/components/common/Unauthorized.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // vuelve a la página anterior
  };

  const goDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card text-center" style={{ maxWidth: '400px', borderColor: '#dc3545' }}>
        <div className="card-header bg-danger text-white">
          <h4 className="mb-0">403 - No autorizado</h4>
        </div>
        <div className="card-body">
          <p className="card-text text-dark">
            Lo sentimos, no tienes permisos para ver esta página.
          </p>
          <button
            className="btn btn-outline-danger me-2"
            onClick={goBack}
          >
            Volver
          </button>
          <button
            className="btn btn-danger"
            onClick={goDashboard}
          >
            Ir al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
