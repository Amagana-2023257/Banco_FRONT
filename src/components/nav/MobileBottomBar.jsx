// src/components/nav/MobileBottomBar.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useUserDetails } from "../../shared/hooks/useUserDetails";
import { ROLES } from "./Sidebar"; // reutilizamos roles
import "./MobileBottomBar.css";

/**
 * Ítems que mostraremos en la barra inferior.
 * Puedes agregar/quitar según tu necesidad.
 */
const RAW_ITEMS = [
  { to: "/dashboard", icon: "bi-house-door", label: "Inicio", roles: ["ALL"] },
  {
    to: "/dashboard/transactions",
    icon: "bi-cash-stack",
    label: "Movs",
    roles: [ROLES.ADMIN_GLOBAL, ROLES.GERENTE_SUCURSAL, ROLES.CAJERO, ROLES.CLIENTE],
  },
  {
    to: "/dashboard/accounts",
    icon: "bi-wallet2",
    label: "Cuentas",
    roles: [ROLES.ADMIN_GLOBAL, ROLES.GERENTE_SUCURSAL],
  },
  {
    to: "/dashboard/users/me",
    icon: "bi-person-circle",
    label: "Perfil",
    roles: ["ALL"],
  },
];

const can = (role, allowed) => allowed.includes("ALL") || allowed.includes(role);

export const MobileBottomBar = ({ onMore }) => {
  const { role = ROLES.CLIENTE } = useUserDetails();
  const location = useLocation();

  const items = useMemo(
    () => RAW_ITEMS.filter((i) => can(role, i.roles)),
    [role]
  );

  return (
    <nav className="mobile-bottom-bar d-md-none" aria-label="Menú inferior">
      <ul className="mbb__list">
        {items.map((item) => {
          const isActive = location.pathname.startsWith(item.to);
          return (
            <li key={item.to} className="mbb__item">
              <NavLink to={item.to} className="mbb__link">
                <motion.i
                  className={`bi ${item.icon} mbb__icon ${isActive ? "active" : ""}`}
                  animate={{ y: isActive ? -2 : 0, scale: isActive ? 1.12 : 1 }}
                  transition={{ type: "spring", stiffness: 240, damping: 18 }}
                />
                <span className={`mbb__label ${isActive ? "active" : ""}`}>
                  {item.label}
                </span>
              </NavLink>
            </li>
          );
        })}

        {/* Botón "Más" para abrir Offcanvas con el Sidebar completo */}
        <li className="mbb__item">
          <button
            type="button"
            className="mbb__link mbb__more-btn"
            onClick={onMore}
            aria-label="Más opciones"
          >
            <motion.i
              className="bi bi-grid-3x3-gap mbb__icon"
              whileTap={{ scale: 0.9 }}
            />
            <span className="mbb__label">Más</span>
          </button>
        </li>
      </ul>
      <div className="mbb__safe" aria-hidden="true" />
    </nav>
  );
};

MobileBottomBar.propTypes = {
  onMore: PropTypes.func.isRequired,
};
