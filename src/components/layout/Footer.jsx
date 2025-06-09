// src/components/layout/Footer.jsx
import React from "react";

export const Footer = () => (
  <footer
    className="w-100"
    style={{
      height: "60px",
      backgroundColor: "rgba(0, 83, 155, 0.8)",
      borderTop: "2px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.25)",
      zIndex: 1,
    }}
  >
    <div className="container-fluid h-100 d-flex align-items-center px-3 text-white">
      <div className="row g-0 w-100">
        {/* Columna 1: Nombre y año */}
        <div className="col-12 col-md-4">
          <h5 className="fw-semibold mb-0">Banca Kinal</h5>
          <p className="mb-0 small">
            © {new Date().getFullYear()} Banca Kinal. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
