// src/pages/StartPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import ExchangeTicker from "../../components/layout/ExchangeTicker";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useExchangeRates } from "../../shared/hooks/useExchangeRates";
import "./StartPage.css";

import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import cx from "classnames";

// -------------------- Constantes --------------------
const HERO_BG =
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1920&q=80";

const QUICK_ACTIONS = [
  { icon: "bi-cash-coin", label: "Transferir", link: "/auth" },
  { icon: "bi-receipt", label: "Pagar servicios", link: "/auth" },
  { icon: "bi-graph-up", label: "Ver estados", link: "/auth" },
  { icon: "bi-journal-text", label: "Solicitar préstamo", link: "/auth" },
  { icon: "bi-credit-card", label: "Solicitar tarjeta", link: "/auth" },
  { icon: "bi-people", label: "Atención al cliente", link: "/support" },
];

const PRODUCT_CARDS = [
  {
    id: "savings",
    title: "Cuenta de Ahorros",
    desc: "Abre tu cuenta sin salir de casa, en minutos y 100% en línea.",
    cta: "Solicitar ahora",
    link: "/auth",
    img: "https://images.unsplash.com/photo-1581622552985-6e3b7287b6f1?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "debit",
    title: "Tarjeta de Débito",
    desc: "Compras seguras, retiros rápidos y control total desde tu app.",
    cta: "Solicitar ahora",
    link: "/auth",
    img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "loan",
    title: "Préstamo Personal",
    desc: "Simula tu cuota y obtén respuesta rápida, sin filas ni papeleo.",
    cta: "Solicitar ahora",
    link: "/auth",
    img: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=800&q=60",
  },
];

const FEATURES = [
  {
    icon: "bi-shield-lock",
    title: "Seguridad",
    desc: "Cifrado avanzado, autenticación multifactor y monitoreo 24/7.",
  },
  {
    icon: "bi-phone",
    title: "Acceso 24/7",
    desc: "Opera desde cualquier dispositivo, en cualquier momento.",
  },
  {
    icon: "bi-people",
    title: "Atención al Cliente",
    desc: "Soporte humano y chat en vivo para ayudarte siempre.",
  },
];

const STEPS = [
  { num: 1, title: "Regístrate", text: "Crea tu usuario en minutos." },
  { num: 2, title: "Verifica tu identidad", text: "Proceso seguro y totalmente en línea." },
  { num: 3, title: "Elige tu producto", text: "Cuentas, préstamos y más." },
  { num: 4, title: "Gestiona todo", text: "Desde tu panel, 24/7." },
];

const FAQ = [
  {
    q: "¿Cómo abro una cuenta?",
    a: "Haz clic en 'Solicitar ahora', completa el formulario y verifica tu identidad. En pocos minutos tendrás tu cuenta.",
  },
  {
    q: "¿Qué necesito para un préstamo?",
    a: "Documento de identificación, comprobante de ingresos y historial crediticio. Puedes simular tu cuota antes de aplicar.",
  },
  {
    q: "¿Cobran comisión por transferencias?",
    a: "Transferencias internas son gratuitas. Para bancos externos se aplica una tarifa mínima según el monto.",
  },
  {
    q: "¿Cómo contacto soporte?",
    a: "Dispones de chat en vivo, línea telefónica y correo 24/7 en la sección de Atención al Cliente.",
  },
];

const TESTIMONIALS = [
  {
    name: "María López",
    role: "Emprendedora",
    text: "Abrí mi cuenta y obtuve mi préstamo en línea sin hacer filas. Todo súper rápido.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "Carlos Pérez",
    role: "Ingeniero",
    text: "La app es intuitiva y segura. Hago transferencias y pago mis servicios en minutos.",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    name: "Ana García",
    role: "Docente",
    text: "El soporte al cliente me ayudó a resolver una duda en segundos. Excelente experiencia.",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  },
];

// -------------------- Animaciones --------------------
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" },
  }),
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay, ease: "easeOut" },
  }),
};
const staggerChildren = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

// -------------------- Helpers --------------------
const Section = ({ id, className, children, bg = "transparent" }) => (
  <section
    id={id}
    className={cx("position-relative py-5 py-md-6", className)}
    style={{ background: bg }}
  >
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </motion.div>
  </section>
);

const ProductCard = ({ title, desc, cta, link, img, idx }) => (
  <motion.article
    className="h-100 bank-card border-0 rounded-4 overflow-hidden shadow-sm"
    variants={fadeUp}
    custom={0.1 * idx}
  >
    <div
      className="bank-card__img position-relative"
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="bank-card__overlay" />
    </div>
    <div className="p-4 d-flex flex-column justify-content-between flex-grow-1">
      <h5 className="fw-semibold">{title}</h5>
      <p className="text-muted small mb-4">{desc}</p>
      <a
        href={link}
        className="btn btn-outline-primary btn-sm stretched-link"
        aria-label={`${cta}: ${title}`}
      >
        {cta}
      </a>
    </div>
  </motion.article>
);

const FeatureCard = ({ icon, title, desc, idx }) => (
  <motion.div
    className="col-12 col-md-4 text-center"
    variants={fadeUp}
    custom={0.1 * idx}
  >
    <div className="feature-icon-wrapper mx-auto mb-3">
      <i className={`bi ${icon}`} aria-hidden="true" />
    </div>
    <h5 className="mt-2 fw-semibold">{title}</h5>
    <p className="text-muted small">{desc}</p>
  </motion.div>
);

const StepCard = ({ num, title, text, idx }) => (
  <motion.div
    className="col-12 col-md-3 text-center"
    variants={fadeUp}
    custom={0.1 * idx}
  >
    <div className="step-card rounded-4 p-4 h-100 shadow-sm">
      <div className="step-number mb-3">{num}</div>
      <h6 className="fw-semibold mb-2">{title}</h6>
      <p className="small text-muted mb-0">{text}</p>
    </div>
  </motion.div>
);

const FAQItem = ({ q, a, idx }) => {
  const id = `faq-${idx}`;
  return (
    <motion.div variants={fadeUp} custom={0.05 * idx} className="accordion-item">
      <h2 className="accordion-header" id={`${id}-header`}>
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#${id}-body`}
          aria-expanded="false"
          aria-controls={`${id}-body`}
        >
          {q}
        </button>
      </h2>
      <div
        id={`${id}-body`}
        className="accordion-collapse collapse"
        aria-labelledby={`${id}-header`}
        data-bs-parent="#faqAccordion"
      >
        <div className="accordion-body text-muted small">{a}</div>
      </div>
    </motion.div>
  );
};

// Sustituye el Counter actual
const Counter = ({ to, duration = 2.2, suffix = "", prefix = "" }) => {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.floor(v)),
    });
    return () => controls.stop();
  }, [to, duration]);

  return <>{prefix}{value}{suffix}</>;
};

// -------------------- StartPage --------------------
export const StartPage = () => {
  const { rates, isLoading, error } = useExchangeRates();
  const [fromCurrency, setFromCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [converted, setConverted] = useState(null);

  useEffect(() => {
    if (rates.length > 0 && !fromCurrency) {
      setFromCurrency(rates[0].currency);
    }
  }, [rates, fromCurrency]);

  const selectedRate = useMemo(
    () => rates.find((r) => r.currency === fromCurrency),
    [rates, fromCurrency]
  );

  const handleConvert = (e) => {
    e.preventDefault();
    if (!selectedRate || isNaN(parseFloat(amount))) {
      setConverted(null);
      return;
    }
    const resultInQ = parseFloat(amount) * selectedRate.rate;
    setConverted(resultInQ.toFixed(2));
  };

  return (
    <div className="d-flex flex-column min-vh-100 w-100 p-0" data-bs-theme="light">
      <ExchangeTicker />
      <Header />

      <main className="flex-grow-1 w-100">
        {/* HERO */}
        <motion.section
          className="hero-section position-relative w-100 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div
            className="hero-bg position-absolute top-0 start-0 w-100 h-100"
            style={{ backgroundImage: `url(${HERO_BG})` }}
            aria-hidden="true"
          />
          <div className="hero-overlay position-absolute top-0 start-0 w-100 h-100" />
          <motion.div
            className="container h-100 d-flex flex-column justify-content-center align-items-center text-center text-white position-relative"
            variants={staggerChildren}
          >
            <motion.h1
              className="display-5 fw-bold mb-3 px-3"
              variants={fadeUp}
              custom={0.1}
            >
              Bienvenido a Banca en Línea
            </motion.h1>
            <motion.p className="lead px-3 mb-4" variants={fadeUp} custom={0.2}>
              Solicita productos y gestiona tus cuentas desde cualquier lugar.
            </motion.p>
            <motion.a
              href="#currency-converter"
              className="btn btn-primary btn-lg shadow-lg hero-cta"
              variants={scaleIn}
              custom={0.3}
            >
              Comenzar ahora
            </motion.a>
          </motion.div>
        </motion.section>

        {/* Quick Actions */}
        <Section id="acciones-rapidas" className="bg-light">
          <div className="container">
            <motion.h2
              className="h5 text-center mb-4 fw-semibold"
              variants={fadeUp}
            >
              Acciones rápidas
            </motion.h2>
            <motion.div
              className="row g-3 g-md-4 justify-content-center"
              variants={staggerChildren}
            >
              {QUICK_ACTIONS.map((action, i) => (
                <motion.div
                  key={action.label}
                  className="col-6 col-sm-4 col-md-2"
                  variants={fadeUp}
                  custom={0.05 * i}
                >
                  <a
                    href={action.link}
                    className="quick-card d-flex flex-column align-items-center justify-content-center text-decoration-none"
                  >
                    <i className={`bi ${action.icon} fs-2 mb-2`} />
                    <span className="small text-muted text-center">
                      {action.label}
                    </span>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Section>

        {/* Conversor */}
        <Section id="currency-converter" className="bg-white">
          <motion.div
            className="container"
            style={{ maxWidth: "700px" }}
            variants={staggerChildren}
          >
            <motion.h2 className="h4 text-center mb-4 fw-semibold" variants={fadeUp}>
              Conversor de Divisas
            </motion.h2>

            <motion.form
              onSubmit={handleConvert}
              className="row g-3 bank-form glass p-4 rounded-4 shadow-sm"
              variants={fadeUp}
              role="form"
              aria-label="Conversor de divisas"
            >
              <div className="col-12 col-md-6">
                <label htmlFor="fromCurrency" className="form-label fw-medium">
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
                  aria-disabled={isLoading || !!error}
                >
                  {rates.map((r) => (
                    <option key={r.currency} value={r.currency}>
                      {r.currency}
                    </option>
                  ))}
                </select>
                <small className="text-muted">Tasas contra Quetzal (Q)</small>
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="amount" className="form-label fw-medium">
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
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                />
              </div>

              <div className="col-12 text-center">
                <button
                  type="submit"
                  className="btn btn-primary px-5 py-2 fw-semibold"
                  style={{ backgroundColor: "rgba(0,83,155,0.9)", border: "none" }}
                  disabled={isLoading || error}
                >
                  Convertir a Quetzales (Q)
                </button>
              </div>
            </motion.form>

            <AnimatePresence mode="wait">
              {isLoading && (
                <motion.div
                  key="loading"
                  className="text-center mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  aria-live="polite"
                >
                  <div className="skeleton-loader mx-auto mb-2" />
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  key="error"
                  className="alert alert-danger mt-3"
                  role="alert"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Error al obtener tasas de cambio. Intenta nuevamente más tarde.
                </motion.div>
              )}

              {converted !== null && !error && !isLoading && (
                <motion.div
                  key="result"
                  className="alert alert-success mt-4 text-center fw-semibold rounded-4 shadow-sm"
                  role="status"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                >
                  <span className="d-block mb-1">
                    {amount} {fromCurrency} ≈
                  </span>
                  <span className="display-6">Q{converted}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Section>

        {/* Stats */}
        <Section id="stats" className="bg-light">
          <div className="container">
            <motion.div
              className="row g-4 text-center"
              variants={staggerChildren}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div className="col-6 col-md-3" variants={fadeUp}>
                <h3 className="fw-bold mb-0"><Counter to={120} suffix="+" /></h3>
                <p className="small text-muted">Sucursales</p>
              </motion.div>
              <motion.div className="col-6 col-md-3" variants={fadeUp}>
                <h3 className="fw-bold mb-0"><Counter to={500000} suffix="+" /></h3>
                <p className="small text-muted">Clientes felices</p>
              </motion.div>
              <motion.div className="col-6 col-md-3" variants={fadeUp}>
                <h3 className="fw-bold mb-0"><Counter to={24} suffix="/7" /></h3>
                <p className="small text-muted">Soporte</p>
              </motion.div>
              <motion.div className="col-6 col-md-3" variants={fadeUp}>
                <h3 className="fw-bold mb-0"><Counter to={99} suffix="%" /></h3>
                <p className="small text-muted">Transacciones exitosas</p>
              </motion.div>
            </motion.div>
          </div>
        </Section>

        {/* Productos */}
        <Section id="productos" className="bg-white">
          <div className="container">
            <motion.h2
              className="h4 text-center mb-4 fw-semibold"
              variants={fadeUp}
            >
              Productos en Línea
            </motion.h2>
            <motion.div
              className="row g-4"
              variants={staggerChildren}
            >
              {PRODUCT_CARDS.map((p, i) => (
                <div className="col-12 col-md-4" key={p.id}>
                  <ProductCard {...p} idx={i} />
                </div>
              ))}
            </motion.div>
          </div>
        </Section>

        {/* Cómo funciona */}
        <Section id="como-funciona" className="bg-light">
          <div className="container">
            <motion.h2 className="h4 text-center mb-5 fw-semibold" variants={fadeUp}>
              ¿Cómo funciona?
            </motion.h2>
            <motion.div className="row g-4" variants={staggerChildren}>
              {STEPS.map((s, i) => (
                <StepCard key={s.num} {...s} idx={i} />
              ))}
            </motion.div>
          </div>
        </Section>

        {/* Testimonios */}
        <Section id="testimonios" className="bg-white">
          <div className="container">
            <motion.h2 className="h4 text-center mb-5 fw-semibold" variants={fadeUp}>
              Lo que dicen nuestros clientes
            </motion.h2>
            <motion.div
              className="row g-4"
              variants={staggerChildren}
            >
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={t.name}
                  className="col-12 col-md-4"
                  variants={fadeUp}
                  custom={0.05 * i}
                >
                  <div className="testimonial-card rounded-4 p-4 h-100 shadow-sm position-relative">
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="rounded-circle me-3"
                        width="52"
                        height="52"
                      />
                      <div>
                        <p className="mb-0 fw-semibold">{t.name}</p>
                        <small className="text-muted">{t.role}</small>
                      </div>
                    </div>
                    <p className="small text-muted mb-0">“{t.text}”</p>
                    <i className="bi bi-quote fs-1 text-primary position-absolute top-0 end-0 pe-3 pt-2 opacity-25" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Section>

        {/* FAQ */}
        <Section id="faq" className="bg-light">
          <div className="container" style={{ maxWidth: "820px" }}>
            <motion.h2 className="h4 text-center mb-4 fw-semibold" variants={fadeUp}>
              Preguntas frecuentes
            </motion.h2>
            <motion.div
              id="faqAccordion"
              className="accordion rounded-4 overflow-hidden shadow-sm"
              variants={staggerChildren}
            >
              {FAQ.map((item, i) => (
                <FAQItem key={item.q} {...item} idx={i} />
              ))}
            </motion.div>
          </div>
        </Section>

        {/* CTA Final */}
        <Section id="cta-final" className="bg-primary text-white">
          <div className="container text-center">
            <motion.h2
              className="h4 fw-semibold mb-3"
              variants={fadeUp}
            >
              ¿Listo para comenzar?
            </motion.h2>
            <motion.p className="mb-4 small" variants={fadeUp} custom={0.1}>
              Abre tu cuenta o solicita tu producto financiero hoy mismo.
            </motion.p>
            <motion.a
              href="/auth"
              className="btn btn-light fw-semibold px-5 py-2"
              variants={scaleIn}
              custom={0.2}
            >
              Ir al registro
            </motion.a>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default StartPage;
