// src/pages/auth/AuthPage.jsx
import React, { useState, useEffect } from "react";
import ExchangeTicker from "../../components/layout/ExchangeTicker";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

import { Login } from "../../components/authForm/Login";
import { Register } from "../../components/authForm/Register";
import { RequestPasswordReset } from "../../components/authForm/RequestPasswordReset";
import { ResetPassword } from "../../components/authForm/ResetPassword";

import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import "./AuthPage.css";
import logo from "../../assets/logo.png";
import { a } from "framer-motion/client";

const MODES = { LOGIN: "login", REGISTER: "register", REQUEST: "request", RESET: "reset" };

const PHRASES = [
  "¡Bienvenido a Banca Kinal!",
  "Tu dinero, a un clic de distancia.",
  "Operaciones seguras y fáciles, 24/7.",
  "Transfiere, paga y controla tus finanzas.",
  "Tu banco digital, siempre contigo.",
  "Gestiona tus cuentas sin filas ni papeleo.",
  "Confianza y seguridad en cada transacción.",
  "Todo lo que necesitas en un solo lugar.",
  "Tu futuro financiero empieza aquí.",
  "Estamos listos cuando tú lo estés.",
  "Recibe notificaciones y alertas en tiempo real.",
  "Tus metas financieras, más cerca.",
  "Tecnología al servicio de tu dinero.",
  "Haz más con tu tiempo, banca en línea.",
  "Protegemos lo que más valoras.",
  "Tu banca, tu ritmo, tu control.",
  "Haz crecer tus ahorros con nosotros.",
  "Solicita productos en minutos.",
  "Transparencia, seguridad y soporte humano.",
  "La banca que cabe en tu bolsillo.",
  "Conéctate y maneja tu dinero sin límites.",
  "Estamos a un tap de distancia.",
  "Menos trámites, más resultados.",
  "Evoluciona tu manera de hacer banca.",
  "Nos importa tu tranquilidad.",
  "Cada transacción, protegida.",
  "Tu experiencia financiera, optimizada.",
  "Cumple tus objetivos con nuestra ayuda.",
  "Tu información, siempre segura.",
  "¡Gracias por confiar en nosotros!",
];

// Imagen remota
const HERO_IMG =
  "https://images.unsplash.com/photo-1556741533-411cf82e4e2d?auto=format&fit=crop&w=1600&q=80";

/* Animaciones básicas */
const pageFade = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};
const phraseFade = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.4 } },
};

const AuthPage = () => {
  const [mode, setMode] = useState(MODES.LOGIN);
  const [phraseIdx, setPhraseIdx] = useState(0);

  /* Rotar frases */
  useEffect(() => {
    const id = setInterval(() => {
      setPhraseIdx((i) => {
        let next = Math.floor(Math.random() * PHRASES.length);
        if (next === i) next = (i + 1) % PHRASES.length;
        return next;
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  /* Toast por query param */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified")) {
      toast.success("Tu correo fue verificado correctamente. ¡Inicia sesión!", {
        id: "verified-msg",
      });
    }
  }, []);

  const renderForm = () => {
    switch (mode) {
      case MODES.LOGIN:
        return (
          <Login
            switchAuthHandler={() => setMode(MODES.REGISTER)}
            onForgotPassword={() => setMode(MODES.REQUEST)}
          />
        );
      case MODES.REGISTER:
        return <Register switchAuthHandler={() => setMode(MODES.LOGIN)} />;
      case MODES.REQUEST:
        return (
          <RequestPasswordReset
            switchAuthHandler={() => setMode(MODES.LOGIN)}
            onNext={() => setMode(MODES.RESET)}
          />
        );
      case MODES.RESET:
        return <ResetPassword switchAuthHandler={() => setMode(MODES.LOGIN)} />;
      default:
        return null;
    }
  };

  const titles = {
    [MODES.LOGIN]: "Iniciar Sesión",
    [MODES.REGISTER]: "Crear Cuenta",
    [MODES.REQUEST]: "Recuperar Contraseña",
    [MODES.RESET]: "Restablecer Contraseña",
  };

  return (
    <div className="d-flex flex-column w-100 min-vh-100 p-0" data-bs-theme="light">
      <ExchangeTicker />
      <Header />

      {/* Sin overflow-hidden para permitir fluidez, sin scrolls internos */}
      <main className="flex-grow-1 position-relative auth-page">
        <div className="container-fluid">
          <div className="row g-0 auth-row">
            {/* IZQUIERDA */}
            <div className="col-md-6 d-none d-md-flex auth-left px-0">
              <div
                className="auth-left-bg"
                style={{ backgroundImage: `url("${HERO_IMG}")` }}
                aria-hidden="true"
              />
              <div className="auth-left-overlay" aria-hidden="true" />

              <div className="phrase-rotator w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center px-4">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={phraseIdx}
                    variants={phraseFade}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="display-6 fw-bold mb-3 phrase-title"
                  >
                    {PHRASES[phraseIdx]}
                  </motion.h2>
                </AnimatePresence>

                <motion.ul
                  className="list-unstyled small text-white-50 mt-3"
                  variants={phraseFade}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill me-2 text-primary" />
                    Autenticación multifactor
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill me-2 text-primary" />
                    Cifrado de extremo a extremo
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill me-2 text-primary" />
                    Alertas en tiempo real
                  </li>
                </motion.ul>
              </div>
            </div>

            {/* DERECHA */}
            <div className="col-12 col-md-6 auth-right d-flex justify-content-center p-4 p-md-5 position-relative">
              <div
                className="auth-right-bg"
                style={{ backgroundImage: `url("${HERO_IMG}")` }}
                aria-hidden="true"
              />
              <div className="auth-right-overlay" aria-hidden="true" />

              {/* layout para animar altura cuando cambia el formulario */}
              <motion.div
                layout
                className="auth-card glass rounded-4 shadow-lg w-100 position-relative"
                style={{ maxWidth: 440 }}
                variants={pageFade}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ layout: { type: "spring", stiffness: 190, damping: 26 } }}
              >
                <motion.div layout className="text-center mb-4">
                  <img src={logo} alt="Banca Kinal" className="auth-logo" />
                </motion.div>

                <motion.h4
                  layout
                  className="text-center mb-4 fw-semibold"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {titles[mode]}
                </motion.h4>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    layout
                    variants={pageFade}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {renderForm()}
                  </motion.div>
                </AnimatePresence>

                <motion.div
                  layout
                  className="text-center mt-4 small"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  {mode === MODES.LOGIN && (
                    <>
                      ¿No tienes cuenta?{" "}
                      <button
                        type="button"
                        className="btn btn-link p-0"
                        onClick={() => setMode(MODES.REGISTER)}
                      >
                        Regístrate
                      </button>
                    </>
                  )}
                  {mode === MODES.REGISTER && (
                    <>
                      ¿Ya tienes cuenta?{" "}
                      <button
                        type="button"
                        className="btn btn-link p-0"
                        onClick={() => setMode(MODES.LOGIN)}
                      >
                        Inicia sesión
                      </button>
                    </>
                  )}
                  {(mode === MODES.REQUEST || mode === MODES.RESET) && (
                    <>
                      ¿Recordaste tu contraseña?{" "}
                      <button
                        type="button"
                        className="btn btn-link p-0"
                        onClick={() => setMode(MODES.LOGIN)}
                      >
                        Inicia sesión
                      </button>
                    </>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuthPage;
export { AuthPage } 