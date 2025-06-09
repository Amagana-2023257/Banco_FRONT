// src/components/transaction/DeleteTransaction.jsx
import React, { useState } from 'react';
import { useDeleteTransaction } from '../../shared/hooks/useDeleteTransaction';

export const DeleteTransaction = () => {
  const { deleteTransaction, message, isLoading, error } = useDeleteTransaction();
  const [id, setId] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    deleteTransaction(id);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group mb-3">
        <input
          className="form-control"
          placeholder="ID de transacción"
          value={id}
          onChange={e => setId(e.target.value)}
          required
        />
        <button className="btn btn-danger" disabled={isLoading}>
          {isLoading ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
    </form>
  )
};
