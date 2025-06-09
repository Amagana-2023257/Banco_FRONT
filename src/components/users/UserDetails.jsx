import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spinner, Alert, Button } from 'react-bootstrap';
import { useGetUserById } from '../../shared/hooks/useGetUserById';

/**
 * Componente que muestra detalles de usuario según el ID de la URL.
 */
export const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, getUserById, isLoading, error } = useGetUserById();

  useEffect(() => {
    if (id) {
      getUserById(id);
    }
  }, [id]);

  if (isLoading) {
    return <div className="text-center mt-5"><Spinner animation="border" role="status" /></div>;
  }
  if (error) {
    return <Alert variant="danger" className="mt-4">{error}</Alert>;
  }
  if (!user) {
    return <Alert variant="warning" className="mt-4">Usuario no encontrado.</Alert>;
  }

  return (
    <Card className="p-3 mt-4">
      <Card.Header>
        Detalles de Usuario
        <Button variant="secondary" size="sm" className="float-end" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </Card.Header>
      <Card.Body>
        <Card.Title>{user.username}</Card.Title>
        <Card.Text><strong>Nombre:</strong> {user.name} {user.surname}</Card.Text>
        <Card.Text><strong>Email:</strong> {user.email}</Card.Text>
        <Card.Text><strong>Teléfono:</strong> {user.phone}</Card.Text>
        <Card.Text><strong>DPI:</strong> {user.dpi}</Card.Text>
        <Card.Text><strong>Cuenta:</strong> {user.accountNumber}</Card.Text>
        <Card.Text><strong>Rol:</strong> {user.role}</Card.Text>
        <Card.Text><strong>Ingreso Q/mes:</strong> {user.monthlyIncome.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ' })}</Card.Text>
        <Card.Text><strong>Estado:</strong> {user.status ? 'Activo' : 'Inactivo'}</Card.Text>
      </Card.Body>
    </Card>
  );
};
