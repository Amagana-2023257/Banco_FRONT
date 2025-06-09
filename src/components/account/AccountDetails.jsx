// src/components/account/AccountDetails.jsx
import React, { useState } from 'react';
import { useGetAccountById } from '../../shared/hooks/useGetAccountById';

export const AccountDetails = () => {
  const { account, getAccountById, isLoading, error } = useGetAccountById();
  const [id, setId] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    getAccountById(id);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="input-group">
          <input
            className="form-control"
            placeholder="ID de cuenta"
            value={id}
            onChange={e => setId(e.target.value)}
            required
          />
          <button className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>
      {error && <div className="alert alert-danger">{error}</div>}
      {account && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Cuenta {account.accountNumber}</h5>
            <p>Saldo: Q{account.balance}</p>
            <p>Moneda: {account.currency}</p>
            <p>Estado: {account.status ? 'Activa' : 'Inactiva'}</p>
          </div>
        </div>
      )}
    </>
  );
};
