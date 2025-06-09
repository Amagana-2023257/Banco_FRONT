// src/components/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserDetails } from '../../shared/hooks/useUserDetails';
import { Unauthorized } from '../common/Unauthorized';

/**
 * ProtectedRoute: protege rutas según autenticación y rol.
 * @param {Object} props
 * @param {string[]} props.allowedRoles - Lista de roles permitidos. Si está vacío, permite cualquier usuario autenticado.
 * @param {React.ReactNode} props.children - Componentes hijos a renderizar protegidos.
 */
export const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { isLogged, role } = useUserDetails();

  if (!isLogged) {
    return <Navigate to="/auth" replace />;
  }
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Unauthorized />;
  }

  return <>{children}</>;
};
