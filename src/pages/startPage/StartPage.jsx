// src/pages/StartPage.jsx
import React, { useState, useEffect } from "react";
import ExchangeTicker from "../../components/layout/ExchangeTicker";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useExchangeRates } from "../../shared/hooks/useExchangeRates";

export const StartPage = () => {
  const { rates, isLoading, error } = useExchangeRates();
  const [fromCurrency, setFromCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [converted, setConverted] = useState(null);

  // Cuando las tasas cambian, seleccionamos una por defecto
  useEffect(() => {
    if (rates.length > 0 && !fromCurrency) {
      setFromCurrency(rates[0].currency);
    }
  }, [rates, fromCurrency]);

  const handleConvert = (e) => {
    e.preventDefault();
    const selectedRate = rates.find((r) => r.currency === fromCurrency);
    if (!selectedRate || isNaN(parseFloat(amount))) {
      setConverted(null);
      return;
    }
    // Suponemos que rate = cuántos Quetzales (Q) equivale 1 unidad de fromCurrency
    const resultInQ = parseFloat(amount) * selectedRate.rate;
    setConverted(resultInQ.toFixed(2));
  };

  return (
    <div className="d-flex flex-column min-vh-100 w-100 p-0">
      {/* ---------- Ticker ---------- */}
      <ExchangeTicker />

      {/* ---------- Header ---------- */}
      <Header />

      {/* ---------- Contenido principal ---------- */}
      <main className="flex-grow-1 w-100 overflow-auto">
        {/* Hero / Banner */}
        <section
          className="w-100"
          style={{
            backgroundImage:
              "url('https://www.corporacionbi.com/gt/bancoindustrial/archivos/bi-slider-1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "300px",
          }}
        >
          <div
            className="h-100 w-100 d-flex flex-column justify-content-center align-items-center text-center"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <h1 className="display-5 fw-bold text-white px-3">
              Bienvenido a Banca En Línea
            </h1>
            <p className="lead text-light px-3">
              Solicita productos y gestiona tus cuentas desde cualquier lugar.
            </p>
          </div>
        </section>

        {/* Conversor de Divisas */}
        <section id="currency-converter" className="py-5 bg-light">
          <div className="container" style={{ maxWidth: "600px" }}>
            <h2 className="h4 text-center mb-4">Conversor de Divisas</h2>
            <form onSubmit={handleConvert} className="row g-3">
              <div className="col-12 col-md-6">
                <label htmlFor="fromCurrency" className="form-label">
                  Moneda Origen
                </label>
                <select
                  id="fromCurrency"
                  className="form-select"
                  value={fromCurrency}
                  onChange={(e) => {
                    setFromCurrency(e.target.value);
                    setConverted(null);
                  }}
                  disabled={isLoading || error}
                >
                  {rates.map((r) => (
                    <option key={r.currency} value={r.currency}>
                      {r.currency}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label htmlFor="amount" className="form-label">
                  Cantidad
                </label>
                <input
                  type="number"
                  id="amount"
                  className="form-control"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setConverted(null);
                  }}
                  disabled={isLoading || error}
                />
              </div>
              <div className="col-12 text-center">
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ backgroundColor: "rgba(0, 83, 155, 0.8)", border: "none" }}
                  disabled={isLoading || error}
                >
                  Convertir a Quetzales (Q)
                </button>
              </div>
            </form>

            {isLoading && (
              <div className="text-center mt-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                Error al obtener tasas de cambio. Intenta nuevamente más tarde.
              </div>
            )}

            {converted !== null && (
              <div className="alert alert-success mt-4 text-center" role="alert">
                <strong>{amount} {fromCurrency}</strong> ≈ <strong>Q{converted}</strong>
              </div>
            )}
          </div>
        </section>

        {/* Sección de productos destacados (simulada) */}
        <section className="py-5">
          <div className="container">
            <h2 className="h4 text-center mb-4">Productos en Línea</h2>
            <div className="row g-4">
              <div className="col-12 col-md-4">
                <div className="border rounded p-3 h-100">
                  <h5>Cuenta de Ahorros</h5>
                  <p>Abrir una cuenta de ahorros sin salir de casa.</p>
                  <a href="/auth" className="btn btn-outline-primary btn-sm">
                    Solicitar Ahora
                  </a>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="border rounded p-3 h-100">
                  <h5>Tarjeta de Débito</h5>
                  <p>Obtén tu tarjeta de débito para transacciones seguras.</p>
                  <a href="/auth" className="btn btn-outline-primary btn-sm">
                    Solicitar Ahora
                  </a>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="border rounded p-3 h-100">
                  <h5>Préstamo Personal</h5>
                  <p>Calcula tu préstamo y aplica en línea en minutos.</p>
                  <a href="/auth" className="btn btn-outline-primary btn-sm">
                    Solicitar Ahora
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Información adicional */}
        <section className="py-5 bg-light">
          <div className="container">
            <h2 className="h4 text-center mb-4">¿Por qué elegirnos?</h2>
            <div className="row g-4">
              <div className="col-12 col-md-4 text-center">
                <i className="bi bi-shield-lock fs-1 text-primary"></i>
                <h5 className="mt-3">Seguridad</h5>
                <p>Protegemos tus datos y transacciones con encriptación de última generación.</p>
              </div>
              <div className="col-12 col-md-4 text-center">
                <i className="bi bi-phone fs-1 text-primary"></i>
                <h5 className="mt-3">Acceso 24/7</h5>
                <p>Consulta saldos, transfiere y paga servicios desde tu dispositivo móvil.</p>
              </div>
              <div className="col-12 col-md-4 text-center">
                <i className="bi bi-people fs-1 text-primary"></i>
                <h5 className="mt-3">Atención al Cliente</h5>
                <p>Soporte en línea y por teléfono siempre disponible para ti.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <Footer />
    </div>
  );
};

export default StartPage;
