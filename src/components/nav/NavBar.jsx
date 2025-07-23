// src/components/nav/NavBar.jsx
import React, { useState, useEffect } from "react";
import { Navbar, Container, Button, Nav, Offcanvas } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";
import { useUserDetails } from "../../shared/hooks/useUserDetails";
import { motion, AnimatePresence } from "framer-motion";
import cx from "classnames";
import logo from "../../assets/logo.png";
import "./NavBar.css";

const fadeDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const NavBar = ({ onToggleSidebar }) => {
  const { isLogged, logout } = useUserDetails();
  const [showMobile, setShowMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  // sombra al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // toggle tema (simple demo usando atributo data-bs-theme)
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", dark ? "dark" : "light");
  }, [dark]);

  const closeMobile = () => setShowMobile(false);

  return (
    <>
      <motion.div
        variants={fadeDown}
        initial="hidden"
        animate="visible"
        className={cx(
          "nav-wrapper position-sticky top-0 z-3 w-100",
          scrolled && "nav-wrapper--scrolled"
        )}
      >
        <Navbar
          bg="transparent"
          expand="md"
          className="border-0 py-2 nav-glass"
        >
          <Container fluid className="px-3">
            {/* Botón sidebar (solo móvil) */}
            <Button
              variant="link"
              className="d-md-none p-0 me-2 text-reset"
              onClick={onToggleSidebar}
              aria-label="Abrir menú lateral"
            >
              <i className="bi bi-list fs-3" />
            </Button>

            {/* Brand */}
            <Navbar.Brand as={Link} to="/dashboard" className="d-flex align-items-center">
              <img src={logo} alt="Logo" width={34} height={34} className="me-2" />
              <span className="fw-bold brand-text">Banca Kinal</span>
            </Navbar.Brand>

            {/* Botón hamburguesa (nav interna) */}
            <Button
              variant="link"
              className="d-md-none p-0 ms-auto text-reset"
              onClick={() => setShowMobile(true)}
              aria-label="Abrir navegación"
            >
              <i className="bi bi-three-dots-vertical fs-4" />
            </Button>

            {/* Nav Desktop */}
            <Nav className="ms-auto align-items-center d-none d-md-flex gap-3">
              <ThemeToggle dark={dark} setDark={setDark} />

              {!isLogged ? (
                <NavLink
                  to="/auth"
                  className={({ isActive }) =>
                    cx("nav-link px-2", isActive && "active-link")
                  }
                >
                  Iniciar sesión
                </NavLink>
              ) : (
                <>
                  <NavLink
                    to="/dashboard/users/me"
                    className={({ isActive }) =>
                      cx("nav-link px-2 d-flex align-items-center", isActive && "active-link")
                    }
                    aria-label="Mi perfil"
                  >
                    <FaUserCircle size={24} />
                  </NavLink>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="d-flex align-items-center gap-1"
                    onClick={logout}
                  >
                    <FaSignOutAlt /> Salir
                  </Button>
                </>
              )}
            </Nav>
          </Container>
        </Navbar>
      </motion.div>

      {/* Offcanvas móvil */}
      <AnimatePresence>
        {showMobile && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Offcanvas
              show
              onHide={closeMobile}
              placement="end"
              className="mobile-offcanvas"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title className="d-flex align-items-center gap-2">
                  <img src={logo} alt="Logo" width={28} height={28} />
                  <span className="fw-semibold">Banca Kinal</span>
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body className="d-flex flex-column gap-3">
                <ThemeToggle dark={dark} setDark={setDark} />

                {!isLogged ? (
                  <NavLink
                    to="/auth"
                    className="btn btn-primary w-100"
                    onClick={closeMobile}
                  >
                    Iniciar sesión
                  </NavLink>
                ) : (
                  <>
                    <NavLink
                      to="/dashboard/users/me"
                      className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
                      onClick={closeMobile}
                    >
                      <FaUserCircle size={20} /> Mi perfil
                    </NavLink>
                    <Button
                      variant="outline-danger"
                      className="w-100 d-flex align-items-center justify-content-center gap-2"
                      onClick={() => {
                        logout();
                        closeMobile();
                      }}
                    >
                      <FaSignOutAlt size={16} /> Cerrar sesión
                    </Button>
                  </>
                )}
              </Offcanvas.Body>
            </Offcanvas>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const ThemeToggle = ({ dark, setDark }) => (
  <Button
    variant="link"
    className="p-0 d-flex align-items-center text-reset"
    onClick={() => setDark((d) => !d)}
    aria-label="Cambiar tema"
  >
    {dark ? <FaSun size={18} /> : <FaMoon size={18} />}
  </Button>
);

export default NavBar;
export { NavBar };