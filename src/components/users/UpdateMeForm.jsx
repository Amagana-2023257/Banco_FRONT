// src/components/users/UpdateMeForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { useUpdateMe } from '../../shared/hooks/useUpdateMe';
import { useUserDetails } from '../../shared/hooks/useUserDetails';
import { useGetUserById } from '../../shared/hooks/useGetUserById';

const EMPTY_FORM = {
  _id: '',
  name: '',
  surname: '',
  username: '',
  email: '',
  phone: '',
  address: '',
  jobName: '',
  monthlyIncome: '',
  // NO mandes role ni status al /me
};

const ALLOWED_SELF_FIELDS = [
  'name',
  'surname',
  'username',
  'email',
  'phone',
  'address',
  'jobName',
  'monthlyIncome',
];

export const UpdateMeForm = ({ initialData = EMPTY_FORM }) => {
  const { id: userId, loading: detailsLoading } = useUserDetails();
  const { user, getUserById, isLoading: loadingUser, error: loadError } = useGetUserById();
  const { updateMe, isLoading: updating } = useUpdateMe();

  const [form, setForm] = useState(initialData);
  const [error, setError] = useState(null);
  const [serverErrors, setServerErrors] = useState([]);

  // Evitar múltiples fetch
  const fetchedRef = useRef(false);
  useEffect(() => {
    if (userId && !fetchedRef.current) {
      getUserById(userId);
      fetchedRef.current = true;
    }
  }, [userId, getUserById]);

  // Sincroniza form cuando llegue el user
  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        ...user,
        surname: user.surname ?? user.lastName ?? '',
      }));
    }
  }, [user]);

  // Manejar error de carga
  useEffect(() => {
    if (loadError) setError('No se pudo cargar la información del usuario.');
  }, [loadError]);

  // Validación: solo su propio perfil
  useEffect(() => {
    if (!detailsLoading && userId && form._id && form._id !== userId) {
      setError('No puedes actualizar los datos de otro usuario.');
    } else if (error === 'No puedes actualizar los datos de otro usuario.') {
      setError(null);
    }
  }, [detailsLoading, userId, form._id, error]);

  const handleChange = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
  };

  const buildPayload = () => {
    const payload = {};
    ALLOWED_SELF_FIELDS.forEach(k => {
      const v = form[k];
      if (v !== undefined && v !== null && v !== '') {
        payload[k] = k === 'monthlyIncome' ? Number(v) : v;
      }
    });
    return payload;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setServerErrors([]);

    const payload = buildPayload();
    const result = await updateMe(payload);

    // Tu hook probablemente devuelve false en error.
    // Si lo modificaste para devolver la respuesta, ajusta esto.
    if (!result || result.success === false) {
      setError('No se pudo actualizar tu perfil.');
      if (result?.errors) setServerErrors(result.errors);
    }
  };

  const isBusy = updating || loadingUser || detailsLoading;

  return (
    <Card className="p-3 mt-4 mx-auto" style={{ maxWidth: 500 }}>
      <h5 className="mb-3">Mi perfil</h5>

      <Form onSubmit={handleSubmit}>
        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
        {serverErrors.length > 0 && (
          <Alert variant="warning" className="mb-3">
            {serverErrors.map((e, i) => (
              <div key={i}>{e.message || e}</div>
            ))}
          </Alert>
        )}

        {isBusy && !user && (
          <div className="text-center my-4">
            <Spinner animation="border" size="sm" /> Cargando...
          </div>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={form.name || ''}
            onChange={e => handleChange('name', e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Apellido</Form.Label>
          <Form.Control
            type="text"
            value={form.surname || ''}
            onChange={e => handleChange('surname', e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={form.username || ''}
            onChange={e => handleChange('username', e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={form.email || ''}
            onChange={e => handleChange('email', e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="text"
            value={form.phone || ''}
            onChange={e => handleChange('phone', e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Dirección</Form.Label>
          <Form.Control
            type="text"
            value={form.address || ''}
            onChange={e => handleChange('address', e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Trabajo</Form.Label>
          <Form.Control
            type="text"
            value={form.jobName || ''}
            onChange={e => handleChange('jobName', e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ingreso Mensual (GTQ)</Form.Label>
          <Form.Control
            type="number"
            value={form.monthlyIncome ?? ''}
            onChange={e => handleChange('monthlyIncome', e.target.value)}
            min={0}
          />
        </Form.Group>

        {/* Role y status los puedes mostrar deshabilitados si quieres verlos, pero NO los envíes */}
        {/* 
        <Form.Group className="mb-3">
          <Form.Label>Rol</Form.Label>
          <Form.Control type="text" value={form.role || ''} disabled />
        </Form.Group>
        */}

        <Button type="submit" variant="primary" disabled={isBusy || !!error}>
          {updating ? <Spinner animation="border" size="sm" /> : 'Guardar cambios'}
        </Button>
      </Form>
    </Card>
  );
};
