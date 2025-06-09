// src/components/transaction/TransactionDetails.jsx
import React, { useState } from 'react';
import { useGetTransactionById } from '../../shared/hooks/useGetTransactionById';

export const TransactionDetails = () => {
  const { transaction, getTransactionById, isLoading, error } = useGetTransactionById();
  const [id, setId] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    getTransactionById(id);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="input-group">
          <input
            className="form-control"
            placeholder="ID de transacción"
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
      {transaction && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{transaction.type}</h5>
            <p>Monto: Q{transaction.amount}</p>
            <p>Cuenta: {transaction.account.accountNumber}</p>
            <p>Relacionado: {transaction.relatedAccount?.accountNumber || '—'}</p>
            <p>Fecha: {new Date(transaction.date).toLocaleString()}</p>
            <p>Revertida: {transaction.reversed ? 'Sí' : 'No'}</p>
          </div>
        </div>
      )}
    </>
  );
};
