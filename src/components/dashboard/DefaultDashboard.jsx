// src/components/dashboard/DefaultDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Spinner, Alert, Badge, Modal, Button } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { useUserDetails } from "../../shared/hooks/useUserDetails";
import { useGetAllAccounts } from "../../shared/hooks/useGetAllAccounts";
import "./DefaultDashboard.css";

/* ---------- BG ---------- */
const HERO_BG =
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1920&q=80";

/* ---------- Animations ---------- */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.45, ease: "easeOut" },
  }),
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

/* ---------- Helpers ---------- */
const currency = (n = 0) => `Q${Number(n).toFixed(2)}`;
const can = (role, allowed) => allowed.includes("ALL") || allowed.includes(role);
const isClient = (r) => r === "CLIENTE" || r === "CLIENT";

/* ---------- Copia del menú del Sidebar ---------- */
const ROLES = {
  ADMIN_GLOBAL: "ADMIN_GLOBAL",
  GERENTE_SUCURSAL: "GERENTE_SUCURSAL",
  CAJERO: "CAJERO",
  CLIENTE: "CLIENTE",
};

const MENU_ROOT = [
  { path: "/dashboard", label: "Inicio", icon: "bi-house-door", roles: ["ALL"] },
];

const USERS_MENU = [
  {
    path: "/dashboard/users",
    label: "Usuarios",
    icon: "bi-people",
    roles: [ROLES.ADMIN_GLOBAL, ROLES.GERENTE_SUCURSAL],
    children: [
      {
        path: "/dashboard/users",
        label: "Listado",
        icon: "bi-list-ul",
        roles: [ROLES.ADMIN_GLOBAL, ROLES.GERENTE_SUCURSAL],
      },
      {
        path: "/dashboard/users/create",
        label: "Crear",
        icon: "bi-person-plus",
        roles: [ROLES.ADMIN_GLOBAL, ROLES.GERENTE_SUCURSAL],
      },
    ],
  },
];

const ACCOUNTS_MENU = [
  {
    path: "/dashboard/accounts",
    label: "Cuentas",
    icon: "bi-wallet2",
    roles: [ROLES.ADMIN_GLOBAL, ROLES.GERENTE_SUCURSAL],
    children: [
      {
        path: "/dashboard/accounts",
        label: "Listado",
        icon: "bi-list-check",
        roles: [ROLES.ADMIN_GLOBAL, ROLES.GERENTE_SUCURSAL],
      },
      {
        path: "/dashboard/accounts/create",
        label: "Crear",
        icon: "bi-patch-plus",
        roles: [ROLES.ADMIN_GLOBAL, ROLES.GERENTE_SUCURSAL],
      },
    ],
  },
];

const TX_MENU = [
  {
    path: "/dashboard/transactions",
    label: "Transacciones",
    icon: "bi-cash-stack",
    roles: [
      ROLES.ADMIN_GLOBAL,
      ROLES.GERENTE_SUCURSAL,
      ROLES.CAJERO,
      ROLES.CLIENTE,
    ],
    children: [
      {
        path: "/dashboard/transactions",
        label: "Listado",
        icon: "bi-list-columns",
        roles: [ROLES.ADMIN_GLOBAL, ROLES.GERENTE_SUCURSAL, ROLES.CAJERO],
      },
      {
        path: "/dashboard/transactions/deposit",
        label: "Depósito",
        icon: "bi-cash-coin",
        roles: [ROLES.ADMIN_GLOBAL, ROLES.CAJERO, ROLES.CLIENTE],
      },
      {
        path: "/dashboard/transactions/transfer",
        label: "Transferencia",
        icon: "bi-arrow-left-right",
        roles: [ROLES.ADMIN_GLOBAL, ROLES.CLIENTE],
      },
      {
        path: "/dashboard/transactions/purchase",
        label: "Compra",
        icon: "bi-bag-heart",
        roles: [ROLES.ADMIN_GLOBAL, ROLES.CLIENTE],
      },
      {
        path: "/dashboard/transactions/credit",
        label: "Crédito",
        icon: "bi-credit-card-2-front",
        roles: [ROLES.ADMIN_GLOBAL, ROLES.CAJERO],
      },
    ],
  },
];

const GROUPS = [...USERS_MENU, ...ACCOUNTS_MENU, ...TX_MENU];

/* ---------- Component ---------- */
export const DefaultDashboard = () => {
  const { name, surname, username, role, email, id: userId } = useUserDetails();
  const {
    accounts,
    getAllAccounts,
    isLoading: loadingAccounts,
    error: accountsError,
  } = useGetAllAccounts();

  // favoritos en localStorage
  const [favIds, setFavIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favAccounts") || "[]");
    } catch {
      return [];
    }
  });

  // modal para agregar favoritas
  const [showFavModal, setShowFavModal] = useState(false);

  useEffect(() => {
    getAllAccounts();
  }, [getAllAccounts]);

  const myAccounts = useMemo(() => {
    if (!accounts) return [];
    if (isClient(role)) {
      return accounts.filter(
        (a) =>
          String(a.user) === String(userId) ||
          a.user?._id === userId ||
          a.user?.id === userId
      );
    }
    return accounts;
  }, [accounts, role, userId]);

  const favAccounts = useMemo(
    () => myAccounts.filter((a) => favIds.includes(a.id)),
    [myAccounts, favIds]
  );
  const otherAccounts = useMemo(
    () => myAccounts.filter((a) => !favIds.includes(a.id)),
    [myAccounts, favIds]
  );

  const addFav = (id) => {
    const next = [...new Set([...favIds, id])];
    setFavIds(next);
    localStorage.setItem("favAccounts", JSON.stringify(next));
  };

  const removeFav = (id) => {
    const next = favIds.filter((x) => x !== id);
    setFavIds(next);
    localStorage.setItem("favAccounts", JSON.stringify(next));
  };

  const totalFavBalance = useMemo(
    () => favAccounts.reduce((acc, a) => acc + Number(a.balance || 0), 0),
    [favAccounts]
  );

  // Accesos rápidos basados en Sidebar
  const quickActions = useMemo(() => {
    const items = [];

    MENU_ROOT.forEach((i) => can(role, i.roles) && items.push(i));

    GROUPS.forEach((g) => {
      if (!can(role, g.roles)) return;
      if (g.children && g.children.length) {
        g.children.forEach((c) => {
          if (can(role, c.roles)) items.push(c);
        });
      } else {
        items.push(g);
      }
    });

    const map = new Map();
    items.forEach((i) => {
      if (!map.has(i.path)) map.set(i.path, i);
    });

    return Array.from(map.values());
  }, [role]);

  return (
    <motion.div
      className="dashboard-wrapper d-flex flex-column w-100 h-100"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      {/* HERO */}
      <motion.section className="dash-hero position-relative" variants={fadeUp}>
        <div
          className="dash-hero__bg"
          style={{ backgroundImage: `url(${HERO_BG})` }}
          aria-hidden="true"
        />
        <div className="dash-hero__overlay" aria-hidden="true" />
        <div className="dash-hero__content text-white text-center">
          <motion.h1 className="fw-bold mb-2" variants={fadeUp}>
            ¡Hola, {name || username}!
          </motion.h1>
          <motion.p className="mb-0 small" variants={fadeUp}>
            Bienvenido a tu panel. Aquí tienes accesos y tu resumen.
          </motion.p>
        </div>
      </motion.section>

      {/* Avisos */}
      <motion.div className="container my-3" variants={fadeUp}>
        <Alert
          variant="warning"
          className="small rounded-4 shadow-sm mb-3 d-flex align-items-start gap-2"
        >
          <i className="bi bi-shield-exclamation fs-5"></i>
          <div>
            <strong>No compartas tu información personal ni códigos de seguridad.</strong>
            <br />
            Banca Kinal nunca solicitará tu contraseña por teléfono, correo o redes.
          </div>
        </Alert>

        <Alert
          variant="info"
          className="small rounded-4 shadow-sm mb-4 d-flex align-items-start gap-2"
        >
          <i className="bi bi-info-circle fs-5"></i>
          <div>
            Revisa tus movimientos. Si detectas algo inusual, contáctanos de inmediato.
          </div>
        </Alert>
      </motion.div>

      {/* Datos privados */}
      <motion.section className="container mb-4" variants={fadeUp}>
        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <div className="glass rounded-4 p-4 h-100 shadow-sm">
              <h5 className="fw-semibold mb-3">
                <i className="bi bi-person-circle me-2" />
                Tu perfil
              </h5>
              <ul className="list-unstyled small mb-0">
                <li>
                  <strong>Nombre:</strong> {name} {surname}
                </li>
                <li>
                  <strong>Usuario:</strong> {username}
                </li>
                <li>
                  <strong>Correo:</strong> {email}
                </li>
                <li>
                  <strong>Rol:</strong> {role}
                </li>
                <li className="text-muted mt-2">
                  Mantén esta información segura.
                </li>
              </ul>
            </div>
          </div>

          {/* Cuentas favoritas */}
          <div className="col-12 col-lg-6">
            <div className="glass rounded-4 p-4 h-100 shadow-sm d-flex flex-column">
              <div className="d-flex align-items-center mb-3">
                <h5 className="fw-semibold mb-0 me-auto d-flex align-items-center">
                  <i className="bi bi-wallet2 me-2" />
                  Mis cuentas favoritas
                </h5>

                {/* >>> BOTÓN AGREGAR FAVORITA <<< */}
                {!!otherAccounts.length && (
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => setShowFavModal(true)}
                    title="Agregar cuenta favorita"
                  >
                    <i className="bi bi-plus-circle me-1" />
                    Agregar
                  </Button>
                )}
              </div>

              {loadingAccounts ? (
                <div className="d-flex gap-2 align-items-center small text-muted">
                  <Spinner animation="border" size="sm" /> Cargando...
                </div>
              ) : accountsError ? (
                <Alert variant="danger" className="small mb-0">
                  {accountsError}
                </Alert>
              ) : myAccounts.length === 0 ? (
                <Alert variant="warning" className="small mb-0">
                  No tienes cuentas activas registradas.
                </Alert>
              ) : (
                <>
                  {favAccounts.length === 0 && (
                    <Alert variant="secondary" className="small py-2">
                      Aún no has marcado favoritas. Usa el botón <i className="bi bi-plus-circle" /> para agregarlas.
                    </Alert>
                  )}

                  <ul className="list-unstyled small mb-3 dash-accounts-list flex-grow-1">
                    {favAccounts.map((a) => (
                      <li
                        key={a.id}
                        className="d-flex justify-content-between align-items-start mb-2 p-2 rounded-3 account-item"
                      >
                        <div>
                          <div className="fw-semibold">{a.accountNumber}</div>
                          <div className="text-muted">
                            Moneda: {a.currency || "GTQ"} • Saldo: {currency(a.balance)}
                          </div>
                        </div>
                        <button
                          className="fav-btn text-warning ms-2"
                          title="Quitar de favoritas"
                          onClick={() => removeFav(a.id)}
                        >
                          <i className="bi bi-star-fill"></i>
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="text-end fw-semibold text-primary">
                    Total favoritos: {currency(totalFavBalance)}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Accesos rápidos (mismos del sidebar) */}
      <motion.section className="container mb-5" variants={fadeUp}>
        <h5 className="fw-semibold mb-3">
          <i className="bi bi-lightning-charge-fill me-2" />
          Accesos rápidos
        </h5>
        <div className="row g-3">
          {quickActions.map((item, i) => (
            <QuickAction
              key={item.path}
              to={item.path}
              icon={item.icon || "bi-link-45deg"}
              text={item.label}
              i={i}
            />
          ))}
        </div>
      </motion.section>

      {/* MODAL SELECCIÓN DE FAVORITAS */}
      <Modal
        show={showFavModal}
        onHide={() => setShowFavModal(false)}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-plus-circle me-2" />
            Agregar cuenta favorita
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="small">
          {otherAccounts.length === 0 ? (
            <Alert variant="secondary" className="mb-0">
              No hay más cuentas para agregar.
            </Alert>
          ) : (
            <ul className="list-unstyled mb-0">
              {otherAccounts.map((a) => (
                <li
                  key={a.id}
                  className="d-flex justify-content-between align-items-start mb-2 p-2 rounded-3 account-item"
                >
                  <div>
                    <div className="fw-semibold">{a.accountNumber}</div>
                    <div className="text-muted">
                      Moneda: {a.currency || "GTQ"} • Saldo: {currency(a.balance)}
                    </div>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-primary ms-2"
                    onClick={() => addFav(a.id)}
                    title="Agregar a favoritas"
                  >
                    <i className="bi bi-plus-circle" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowFavModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
};

/* ---------- Subcomponentes ---------- */
const QuickAction = ({ to, icon, text, i }) => (
  <motion.div
    className="col-6 col-md-4 col-lg-2"
    variants={fadeUp}
    custom={0.05 * i}
  >
    <a
      href={to}
      className="quick-link text-decoration-none d-flex flex-column align-items-center justify-content-center rounded-4 p-3 h-100 shadow-sm"
    >
      <i className={`bi ${icon} fs-3 mb-2`} />
      <span className="small text-muted text-center">{text}</span>
    </a>
  </motion.div>
);

export default DefaultDashboard;
