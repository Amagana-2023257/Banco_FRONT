// src/components/nav/Sidebar.jsx
import React, { useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUserDetails } from "../../shared/hooks/useUserDetails";
import "./Sidebar.css";

/* ------------------ Roles ------------------ */
export const ROLES = {
  ADMIN_GLOBAL: "ADMIN_GLOBAL",
  GERENTE_SUCURSAL: "GERENTE_SUCURSAL",
  CAJERO: "CAJERO",
  CLIENTE: "CLIENTE",
};

/* ------------------ Helpers ------------------ */
const can = (role, allowed) => allowed.includes("ALL") || allowed.includes(role);

/* ------------------ Menús ------------------ */
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
      { path: "/dashboard/users", label: "Listado", roles: [ROLES.ADMIN_GLOBAL, ROLES.GERENTE_SUCURSAL] },
      { path: "/dashboard/users/create", label: "Crear", roles: [ROLES.ADMIN_GLOBAL, ROLES.GERENTE_SUCURSAL] },
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
      { path: "/dashboard/accounts", label: "Listado", roles: [ROLES.ADMIN_GLOBAL, ROLES.GERENTE_SUCURSAL] },
      { path: "/dashboard/accounts/create", label: "Crear", roles: [ROLES.ADMIN_GLOBAL, ROLES.GERENTE_SUCURSAL] },
    ],
  },
];

const TX_MENU = [
  {
    path: "/dashboard/transactions",
    label: "Transacciones",
    icon: "bi-cash-stack",
    roles: [ROLES.ADMIN_GLOBAL, ROLES.GERENTE_SUCURSAL, ROLES.CAJERO, ROLES.CLIENTE],
    children: [
      { path: "/dashboard/transactions", label: "Listado", roles: [ROLES.ADMIN_GLOBAL, ROLES.GERENTE_SUCURSAL, ROLES.CAJERO] },
      { path: "/dashboard/transactions/deposit", label: "Depósito", roles: [ROLES.ADMIN_GLOBAL, ROLES.CAJERO, ROLES.CLIENTE] },
      { path: "/dashboard/transactions/transfer", label: "Transferencia", roles: [ROLES.ADMIN_GLOBAL, ROLES.CLIENTE] },
      { path: "/dashboard/transactions/purchase", label: "Compra", roles: [ROLES.ADMIN_GLOBAL, ROLES.CLIENTE] },
      { path: "/dashboard/transactions/credit", label: "Crédito", roles: [ROLES.ADMIN_GLOBAL, ROLES.CAJERO] },
    ],
  },
];

const GROUPS = [...USERS_MENU, ...ACCOUNTS_MENU, ...TX_MENU];

/* ------------------ Animations ------------------ */
const listVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.28, ease: "easeOut" },
  },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
};

const itemVariants = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.2 } },
};

/* ------------------ Sidebar ------------------ */
export const Sidebar = ({
  onLinkClick,
  collapsed = false,
  onToggle,
  inOffcanvas = false, // IMPORTANTE para móvil
}) => {
  const { role = ROLES.CLIENTE } = useUserDetails();
  const location = useLocation();

  const rootItems = useMemo(() => MENU_ROOT.filter((m) => can(role, m.roles)), [role]);
  const groupItems = useMemo(
    () =>
      GROUPS.map((g) => ({
        ...g,
        children: g.children?.filter((c) => can(role, c.roles)) ?? [],
      })).filter((g) => can(role, g.roles) && g.children.length > 0),
    [role]
  );

  const defaultOpen = useCallback(
    (base) => location.pathname.startsWith(base),
    [location.pathname]
  );

  const [open, setOpen] = useState(() =>
    groupItems.reduce((acc, g) => ({ ...acc, [g.path]: defaultOpen(g.path) }), {})
  );

  const toggle = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const asideClass = [
    "sidebar",
    collapsed && "sidebar--collapsed",
    inOffcanvas && "sidebar--in-offcanvas",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <aside className={asideClass} aria-label="Menú lateral">
      <div className="sidebar__inner">
        {typeof onToggle === "function" && !inOffcanvas && (
          <button
            className="sidebar__collapse-btn"
            onClick={onToggle}
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          >
            <i className="bi bi-chevron-double-left" />
          </button>
        )}

        <nav className="sidebar__nav">
          {rootItems.map((item) => (
            <SidebarLink
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
              onLinkClick={onLinkClick}
            />
          ))}

          {groupItems.map((grp) => (
            <div className="sidebar__group" key={grp.path}>
              <button
                className="sidebar__group-toggle"
                onClick={() => toggle(grp.path)}
                aria-expanded={!!open[grp.path]}
                aria-controls={`submenu-${grp.path}`}
              >
                <i className={`bi ${grp.icon} me-2`} />
                {!collapsed && <span>{grp.label}</span>}
                <i
                  className={`bi ms-auto ${
                    open[grp.path] ? "bi-caret-up-fill" : "bi-caret-down-fill"
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {open[grp.path] && (
                  <motion.ul
                    id={`submenu-${grp.path}`}
                    className="sidebar__submenu"
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {grp.children.map((child) => (
                      <motion.li key={child.path} variants={itemVariants}>
                        <SidebarLink
                          to={child.path}
                          label={child.label}
                          collapsed={collapsed}
                          depth={1}
                          onLinkClick={onLinkClick}
                        />
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

const SidebarLink = ({ to, icon, label, depth = 0, collapsed, onLinkClick }) => (
  <NavLink
    to={to}
    end
    onClick={onLinkClick}
    className={({ isActive }) =>
      [
        "sidebar__link",
        isActive && "is-active",
        depth > 0 && "sidebar__link--child",
      ]
        .filter(Boolean)
        .join(" ")
    }
  >
    {icon && <i className={`bi ${icon} me-2`} />}
    {!collapsed && <span className="sidebar__label">{label}</span>}
    <span className="sidebar__ripple" aria-hidden="true" />
  </NavLink>
);

Sidebar.propTypes = {
  onLinkClick: PropTypes.func,
  collapsed: PropTypes.bool,
  onToggle: PropTypes.func,
  inOffcanvas: PropTypes.bool,
};

SidebarLink.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.string,
  label: PropTypes.string.isRequired,
  depth: PropTypes.number,
  collapsed: PropTypes.bool,
  onLinkClick: PropTypes.func,
};
