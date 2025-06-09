import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Spinner, Alert, Card, Row, Col } from 'react-bootstrap';
import { useUpdateUser } from '../../shared/hooks/useUpdateUser';
import { useGetUserById } from '../../shared/hooks/useGetUserById';

/**
 * Componente para actualizar un usuario existente.
 * onClose(updatedUser, allUsers) se invoca al terminar:
 * - updatedUser: objeto de usuario recién modificado
 * - allUsers: lista completa de usuarios activos actualizada
 */
export const UpdateUserForm = ({ userId, onClose }) => {
  const [form, setForm] = useState(null);
  const { user, getUserById, isLoading: loadingUser, error: loadError } = useGetUserById();
  const { updateUser, isLoading: updating } = useUpdateUser();
  const [error, setError] = useState(null);

  // Cargar datos del usuario al montar
  useEffect(() => {
    if (userId) getUserById(userId);
  }, [userId]);

  // Inicializar formulario cuando llega el usuario
  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || '',
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        jobName: user.jobName || '',
        monthlyIncome: user.monthlyIncome || 100,
        status: user.status,
        role: user.role || 'CLIENTE'
      });
      setError(null);
    }
  }, [user]);

  const handleChange = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    const result = await updateUser(userId, form);

    if (result && result.success) {
      getUserById(userId);
      onClose?.(result.user, result.users);
    } else if (result) {
      const msg = result.errors
        ? result.errors.join(', ')
        : result.message || 'Error al actualizar usuario.';
      setError(msg);
    } else {
      setError('Error desconocido al actualizar.');
    }
  };

  if (loadingUser || !form) return <div className="text-center mt-5"><Spinner animation="border" role="status" /></div>;
  if (loadError) return <Alert variant="danger" className="mt-4">{loadError}</Alert>;

  return (
    <Card className="p-3 mt-4">
      <Card.Header>Actualizar Usuario</Card.Header>
      <Form onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}

        <Row>
          <Col md={4} className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={form.username}
              onChange={e => handleChange('username', e.target.value)}
              required
            />
          </Col>
          <Col md={4} className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              required
            />
          </Col>
          <Col md={4} className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              value={form.surname}
              onChange={e => handleChange('surname', e.target.value)}
              required
            />
          </Col>
        </Row>

        <Row>
          <Col md={6} className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              required
            />
          </Col>
          <Col md={6} className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              value={form.phone}
              onChange={e => handleChange('phone', e.target.value)}
              required
            />
          </Col>
        </Row>

        <Row>
          <Col md={6} className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              value={form.address}
              onChange={e => handleChange('address', e.target.value)}
              required
            />
          </Col>
          <Col md={6} className="mb-3">
            <Form.Label>Trabajo</Form.Label>
            <Form.Control
              type="text"
              value={form.jobName}
              onChange={e => handleChange('jobName', e.target.value)}
              required
            />
          </Col>
        </Row>

        <Row>
          <Col md={4} className="mb-3">
            <Form.Label>Ingreso Mensual (GTQ)</Form.Label>
            <Form.Control
              type="number"
              value={form.monthlyIncome}
              onChange={e => handleChange('monthlyIncome', e.target.value)}
              required
              min={100}
            />
          </Col>
          <Col md={4} className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              value={form.status ? 'Activo' : 'Inactivo'}
              onChange={e => handleChange('status', e.target.value === 'Activo')}
            >
              <option>Activo</option>
              <option>Inactivo</option>
            </Form.Select>
          </Col>
          <Col md={4} className="mb-3">
            <Form.Label>Rol</Form.Label>
            <Form.Select
              value={form.role}
              onChange={e => handleChange('role', e.target.value)}
              required
            >
              <option value="ADMIN_GLOBAL">ADMIN_GLOBAL</option>
              <option value="GERENTE_SUCURSAL">GERENTE_SUCURSAL</option>
              <option value="CAJERO">CAJERO</option>
              <option value="CLIENTE">CLIENTE</option>
            </Form.Select>
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
          <Button variant="secondary" onClick={() => onClose?.(null, null)} className="me-2">
            Cancelar
          </Button>
          <Button type="submit" variant="success" disabled={updating}>
            {updating ? <Spinner animation="border" size="sm" role="status" /> : 'Actualizar'}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

UpdateUserForm.propTypes = {
  userId: PropTypes.string.isRequired,
  onClose: PropTypes.func
};
