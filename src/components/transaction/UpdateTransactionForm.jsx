// src/components/transaction/UpdateTransactionForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetTransactionById } from '../../shared/hooks/useGetTransactionById';
import { useUpdateTransaction } from '../../shared/hooks/useUpdateTransaction';

export const UpdateTransactionForm = () => {
  const { id } = useParams();
  const {
    transaction,
    getTransactionById,
    isLoading: loadingTxn,
    error: loadError
  } = useGetTransactionById();
  const {
    updateTransaction,
    transaction: updatedTxn,
    isLoading: saving,
    error: saveError
  } = useUpdateTransaction();

  const [form, setForm] = useState({
    type: '',
    amount: '',
    relatedAccount: '',
    reversed: false
  });

  // Solo cargar si tenemos un id válido
  useEffect(() => {
    if (id) {
      getTransactionById(id);
    }
  }, [getTransactionById, id]);

  // Rellenar formulario cuando llegan datos
  useEffect(() => {
    if (transaction) {
      setForm({
        type: transaction.type,
        amount: transaction.amount,
        relatedAccount: transaction.relatedAccount?.id || '',
        reversed: transaction.reversed
      });
    }
  }, [transaction]);

  const handleChange = e => {
    const { name, value, type: t, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: t === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!id) return;
    updateTransaction(id, {
      type: form.type,
      amount: Number(form.amount),
      relatedAccount: form.relatedAccount || null,
      reversed: form.reversed
    });
  };

  if (!id) {
    return <div className="alert alert-warning">ID de transacción no proporcionado</div>;
  }
  if (loadingTxn) return <p>Cargando datos...</p>;
  if (loadError) return <div className="alert alert-danger">{loadError}</div>;

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Tipo</label>
        <select name="type" className="form-select" value={form.type} onChange={handleChange} required>
          <option value="">Seleccione</option>
          {['DEPOSITO', 'TRANSFERENCIA', 'COMPRA', 'CREDITO'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Monto</label>
        <input
          name="amount"
          type="number"
          className="form-control"
          value={form.amount}
          onChange={handleChange}
          step="0.01"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Cuenta Relacionada (opcional)</label>
        <input
          name="relatedAccount"
          className="form-control"
          value={form.relatedAccount}
          onChange={handleChange}
        />
      </div>

      <div className="form-check mb-3">
        <input
          name="reversed"
          type="checkbox"
          className="form-check-input"
          checked={form.reversed}
          onChange={handleChange}
        />
        <label className="form-check-label">Revertida</label>
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={saving}>
        {saving ? 'Actualizando...' : 'Actualizar Transacción'}
      </button>

      {saveError && <div className="alert alert-danger mt-3">{saveError}</div>}
      {updatedTxn && (
        <div className="alert alert-success mt-3">
          Transacción actualizada: {updatedTxn.id}
        </div>
      )}
    </form>
  );
};
