// src/components/account/UpdateAccount.jsx
import React, { useState } from 'react';
import { useUpdateAccount } from '../../shared/hooks/useUpdateAccount';

export const UpdateAccount = () => {
  const { updateAccount, account, isLoading, error } = useUpdateAccount();
  const [form, setForm] = useState({ id: '', currency: '', status: true });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const { id, ...payload } = form;
    updateAccount(id, payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Cuenta ID</label>
        <input name="id" className="form-control" value={form.id} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Moneda</label>
        <input name="currency" className="form-control" value={form.currency} onChange={handleChange} />
      </div>
      <div className="form-check mb-3">
        <input
          name="status"
          type="checkbox"
          className="form-check-input"
          checked={form.status}
          onChange={handleChange}
        />
        <label className="form-check-label">Activa</label>
      </div>
      <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
        {isLoading ? 'Actualizando...' : 'Actualizar Cuenta'}
      </button>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {account && (
        <div className="alert alert-success mt-3">
          Actualizada: {account.accountNumber} – Estado: {account.status ? 'Activa' : 'Inactiva'}
        </div>
      )}
    </form>
  );
};
