import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { useUpdateMe } from '../../shared/hooks/useUpdateMe';
import { useUserDetails } from '../../shared/hooks/useUserDetails';
import { useGetUserById } from '../../shared/hooks/useGetUserById';

export const UpdateMeForm = ({ initialData }) => {
  // Obtiene el ID y detalles del usuario logueado
  const { id: userId, loading: detailsLoading } = useUserDetails();
  
  // Hook para obtener los datos del usuario por ID
  const { user, getUserById, isLoading: loadingUser, error: loadError } = useGetUserById();
  
  // Estado del formulario
  const [form, setForm] = useState({ ...initialData });
  
  // Hook para actualizar el perfil del usuario
  const { updateMe, isLoading } = useUpdateMe();
  
  // Estado para mostrar errores
  const [error, setError] = useState(null);

  // Verificar si el usuario logueado puede editar sus datos
  useEffect(() => {
    if (!detailsLoading && userId && initialData) {
      // Solo permitir la actualización si los IDs coinciden
      if (initialData.id !== userId) {
        setError('No puedes actualizar los datos de otro usuario.');
      } else {
        setError(null); // Resetea el error si todo es correcto
      }
    }
  }, [detailsLoading, userId, initialData]);

  // Manejo de cambios en los campos del formulario
  const handleChange = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
  };

  // Enviar los datos del formulario
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null); // Resetear error antes de enviar
    const updated = await updateMe(form);
    if (!updated) setError('No se pudo actualizar tu perfil.');
  };

  // Asegúrate de que los datos del usuario se carguen
  useEffect(() => {
    if (userId) {
      getUserById(userId);
    }
  }, [userId, getUserById]);

  // Mostrar error si los datos no se pudieron cargar correctamente
  if (loadError) {
    setError('No se pudo cargar la información del usuario.');
  }

  return (
    <Card className="p-3 mt-4 mx-auto" style={{ maxWidth: 500 }}>
      <h5 className="mb-3">Mi perfil</h5>
      <Form onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Apellido</Form.Label>
          <Form.Control
            type="text"
            value={form.surname}
            onChange={e => handleChange('surname', e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={form.username}
            onChange={e => handleChange('username', e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={form.email}
            onChange={e => handleChange('email', e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="text"
            value={form.phone}
            onChange={e => handleChange('phone', e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Dirección</Form.Label>
          <Form.Control
            type="text"
            value={form.address}
            onChange={e => handleChange('address', e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Trabajo</Form.Label>
          <Form.Control
            type="text"
            value={form.jobName}
            onChange={e => handleChange('jobName', e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ingreso Mensual (GTQ)</Form.Label>
          <Form.Control
            type="number"
            value={form.monthlyIncome}
            onChange={e => handleChange('monthlyIncome', e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Estado</Form.Label>
          <Form.Select
            value={form.status ? 'Activo' : 'Inactivo'}
            onChange={e => handleChange('status', e.target.value === 'Activo')}
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Rol</Form.Label>
          <Form.Select
            value={form.role}
            onChange={e => handleChange('role', e.target.value)}
          >
            {['ADMIN_GLOBAL', 'GERENTE_SUCURSAL', 'CAJERO', 'CLIENTE'].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button type="submit" variant="primary" disabled={isLoading || loadingUser || error}>
          {isLoading || loadingUser ? <Spinner animation="border" size="sm" /> : 'Guardar cambios'}
        </Button>
      </Form>
    </Card>
  );
};
