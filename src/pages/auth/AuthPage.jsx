// src/pages/AuthPage.jsx
import React, { useState } from "react";
import { Login } from "../../components/authForm/Login";
import { Register } from "../../components/authForm/Register";
import { RequestPasswordReset } from "../../components/authForm/RequestPasswordReset";
import { ResetPassword } from "../../components/authForm/ResetPassword";

import ExchangeTicker from "../../components/layout/ExchangeTicker";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export const AuthPage = () => {
  // modos: 'login' | 'register' | 'request' | 'reset'
  const [mode, setMode] = useState("login");

  const renderForm = () => {
    switch (mode) {
      case "login":
        return (
          <Login
            switchAuthHandler={() => setMode("register")}
            onForgotPassword={() => setMode("request")}
          />
        );
      case "register":
        return <Register switchAuthHandler={() => setMode("login")} />;
      case "request":
        return (
          <RequestPasswordReset
            switchAuthHandler={() => setMode("login")}
            onNext={() => setMode("reset")}
          />
        );
      case "reset":
        return <ResetPassword switchAuthHandler={() => setMode("login")} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        margin: "2px",
        minHeight: "calc(100vh - 4px)",
      }}
      className="d-flex flex-column w-100 p-0"
    >
      {/* ---------- ExchangeTicker ---------- */}
      <ExchangeTicker />

      {/* ---------- Header ---------- */}
      <Header />

      {/* ---------- Contenido principal ---------- */}
      <div className="flex-grow-1 bg-light">
        <div className="container-fluid p-0 h-100">
          <div className="row g-0 h-100">
            {/* ---------- IZQUIERDA: Imagen/banner (solo en md+) ---------- */}
            <div
              className="col-md-6 d-none d-md-flex align-items-center justify-content-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1573164574395-6fc2cb8bb885?auto=format&fit=crop&w=800&q=60')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="w-100 h-100 d-flex flex-column justify-content-center align-items-center"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              >
                <h2 className="display-6 fw-bold text-white text-center px-3 mb-3">
                  Con Banca Kinal, tu dinero está a un clic de distancia.
                </h2>
                <p className="lead text-light text-center px-3">
                  Realiza todas tus transacciones de forma segura y sencilla.
                </p>
              </div>
            </div>

            {/* ---------- DERECHA: Formulario ---------- */}
            <div className="col-12 col-md-6 d-flex align-items-center justify-content-center px-3">
              <div className="w-100" style={{ maxWidth: "400px" }}>
                {/* Logo centrado */}
                <div className="text-center mb-4">
                  <img
                    src="../src/assets/logo.png"
                    alt="Banca Kinal"
                    style={{ height: "60px", objectFit: "contain" }}
                  />
                </div>

                {/* Título del formulario */}
                <h4 className="text-center mb-4">
                  {mode === "login" && "Iniciar Sesión"}
                  {mode === "register" && "Crear Cuenta"}
                  {mode === "request" && "Recuperar Contraseña"}
                  {mode === "reset" && "Restablecer Contraseña"}
                </h4>

                {/* Formulario sin cards ni boxes */}
                <div>{renderForm()}</div>

                {/* Links de navegación entre modos */}
                {mode === "login" && (
                  <div className="text-center mt-3 small">
                    ¿No tienes cuenta?{" "}
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      onClick={() => setMode("register")}
                    >
                      Regístrate
                    </button>
                  </div>
                )}
                {mode === "register" && (
                  <div className="text-center mt-3 small">
                    ¿Ya tienes cuenta?{" "}
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      onClick={() => setMode("login")}
                    >
                      Iniciar Sesión
                    </button>
                  </div>
                )}
                {mode === "request" && (
                  <div className="text-center mt-3 small">
                    ¿Recordaste tu contraseña?{" "}
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      onClick={() => setMode("login")}
                    >
                      Iniciar Sesión
                    </button>
                  </div>
                )}
                {mode === "reset" && (
                  <div className="text-center mt-3 small">
                    ¿Recordaste tu contraseña?{" "}
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      onClick={() => setMode("login")}
                    >
                      Iniciar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Footer ---------- */}
      <Footer />
    </div>
  );
};

export default AuthPage;
