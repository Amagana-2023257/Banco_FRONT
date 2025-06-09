// src/components/nav/NavBar.jsx
import React from 'react';
import { Navbar, Container, Button, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useUserDetails } from '../../shared/hooks/useUserDetails';
import logo from '../../assets/logo.png';

export const NavBar = ({ onToggleSidebar }) => {
  const { isLogged, logout } = useUserDetails();

  return (
    <Navbar bg="white" expand={false} className="border-bottom shadow-sm">
      <Container fluid>
        <Button
          variant="link"
          className="d-md-none p-0 me-2"
          onClick={onToggleSidebar}
        >
          <i className="bi bi-list fs-3 text-dark" />
        </Button>
        <Navbar.Brand as={Link} to="/dashboard" className="d-flex align-items-center">
          <img src={logo} alt="Logo" width={32} height={32} className="me-2" />
          <span className="fw-bold text-dark">Banca Kinal</span>
        </Navbar.Brand>
        <Nav className="ms-auto align-items-center">
          {!isLogged ? (
            <Nav.Link as={Link} to="/auth" className="text-dark">
              Iniciar sesión
            </Nav.Link>
          ) : (
            <>
              <Nav.Link as={Link} to="/dashboard/users/me" className="text-dark">
                <FaUserCircle size={24} />
              </Nav.Link>
              <Button variant="outline-danger" className="ms-3" onClick={logout}>
                Cerrar sesión
              </Button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};
