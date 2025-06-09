// src/components/account/CreateAccount.jsx
import React, { useState, useEffect } from 'react';
import { useCreateAccount } from '../../shared/hooks/useCreateAccount';
import { useGetAllUsers } from '../../shared/hooks/useGetAllUsers';

export const CreateAccount = () => {
  const { createAccount, account, isLoading, error } = useCreateAccount();
  const { users, getAllUsers, isLoading: loadingUsers, error: usersError } = useGetAllUsers();

  const [form, setForm] = useState({ userId: '', currency: 'GTQ' });

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    createAccount(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Cliente</label>
        {loadingUsers ? (
          <p>Cargando usuarios...</p>
        ) : usersError ? (
          <div className="alert alert-danger">{usersError}</div>
        ) : (
          <select
            name="userId"
            className="form-select"
            value={form.userId}
            onChange={handleChange}
            required
          >
            <option value="">-- selecciona un usuario --</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} {u.surname} ({u.username})
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Moneda (código 3 letras)</label>
        <input
          name="currency"
          type="text"
          className="form-control"
          value={form.currency}
          onChange={handleChange}
          maxLength="3"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={isLoading || loadingUsers}
      >
        {isLoading ? 'Creando...' : 'Crear Cuenta'}
      </button>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {account && (
        <div className="alert alert-success mt-3">
          Cuenta creada: <strong>{account.accountNumber}</strong> (Saldo: Q{account.balance})
        </div>
      )}
    </form>
  );
};
