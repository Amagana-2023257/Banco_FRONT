// src/components/account/DeactivateAccount.jsx
import React, { useState } from 'react';
import { useDeactivateAccount } from '../../shared/hooks/useDeactivateAccount';

export const DeactivateAccount = () => {
  const { deactivateAccount, message, isLoading, error } = useDeactivateAccount();
  const [id, setId] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    deactivateAccount(id);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group mb-3">
        <input
          className="form-control"
          placeholder="ID de cuenta"
          value={id}
          onChange={e => setId(e.target.value)}
          required
        />
        <button className="btn btn-danger" disabled={isLoading}>
          {isLoading ? 'Desactivando...' : 'Desactivar'}
        </button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
    </form>
  );
};
