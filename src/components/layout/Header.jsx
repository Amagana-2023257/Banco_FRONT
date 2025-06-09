// src/components/layout/Header.jsx
import React from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <nav
      className="navbar navbar-expand-lg w-100"
      style={{
        backgroundColor: "rgba(0, 83, 155, 0.8)",
        zIndex: 1,
      }}
    >
      <div className="container-fluid px-3 d-flex align-items-center">
        <Link to="/" className="navbar-brand p-0 d-flex align-items-center">
          <img
            src="../src/assets/logo.png"
            alt="Banca Kinal"
            style={{ height: "40px", objectFit: "contain" }}
          />
        </Link>

        <button
          className="navbar-toggler ms-auto"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavHeader"
          aria-controls="navbarNavHeader"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavHeader">
          <ul className="navbar-nav ms-auto">
            {/* Aquí van tus enlaces */}
            <li className="nav-item">
              <Link to="/auth" className="nav-link text-white">
                Inicio 
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
