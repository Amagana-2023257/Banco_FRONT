// src/components/transaction/CreditForm.jsx
import React, { useState, useEffect } from 'react';
import { useCredit } from '../../shared/hooks/useCredit';
import { useGetAllAccounts } from '../../shared/hooks/useGetAllAccounts';

export const CreditForm = () => {
  const { credit, txn, balance, isLoading: isCrediting, error: creditError } = useCredit();
  const { accounts, getAllAccounts, isLoading: loadingAccounts, error: accountsError } = useGetAllAccounts();
  const [form, setForm] = useState({ accountId: '', amount: '' });

  useEffect(() => {
    getAllAccounts();
  }, [getAllAccounts]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    credit({ accountId: form.accountId, amount: Number(form.amount) });
  };

  return (
    <form onSubmit={handleSubmit}>
      {loadingAccounts ? (
        <p>Cargando cuentas...</p>
      ) : accountsError ? (
        <div className="alert alert-danger">{accountsError}</div>
      ) : (
        <div className="mb-3">
          <label className="form-label">Selecciona Cuenta</label>
          <select
            name="accountId"
            className="form-select"
            value={form.accountId}
            onChange={handleChange}
            required
          >
            <option value="">-- elige una cuenta --</option>
            {accounts.map(acct => (
              <option key={acct.id} value={acct.id}>
                {acct.accountNumber} (Saldo: Q{acct.balance.toFixed(2)})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Monto de crédito</label>
        <input
          name="amount"
          type="number"
          className="form-control"
          value={form.amount}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
          disabled={loadingAccounts}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={isCrediting || loadingAccounts}
      >
        {isCrediting ? 'Aplicando...' : 'Aplicar Crédito'}
      </button>

      {creditError && <div className="alert alert-danger mt-3">{creditError}</div>}
      {txn && (
        <div className="alert alert-success mt-3">
          Crédito OK. Nuevo saldo: Q{balance.toFixed(2)}
        </div>
      )}
    </form>
  );
};
