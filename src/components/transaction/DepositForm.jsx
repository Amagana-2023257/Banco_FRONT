// src/components/transaction/DepositForm.jsx
import React, { useState, useEffect } from 'react';
import { useDeposit } from '../../shared/hooks/useDeposit';
import { useGetAllAccounts } from '../../shared/hooks/useGetAllAccounts';

export const DepositForm = () => {
  const { deposit, txn, balance, isLoading: isDepositing, error: depositError } = useDeposit();
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
    deposit({ accountId: form.accountId, amount: Number(form.amount) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Selecciona Cuenta</label>
        {loadingAccounts ? (
          <p>Cargando cuentas...</p>
        ) : accountsError ? (
          <div className="alert alert-danger">{accountsError}</div>
        ) : (
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
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Monto a depositar</label>
        <input
          name="amount"
          type="number"
          className="form-control"
          value={form.amount}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={isDepositing || loadingAccounts}>
        {isDepositing ? 'Depositando...' : 'Depositar'}
      </button>

      {depositError && <div className="alert alert-danger mt-3">{depositError}</div>}
      {txn && (
        <div className="alert alert-success mt-3">
          Depósito OK. Nuevo saldo: Q{balance.toFixed(2)}
        </div>
      )}
    </form>
  );
};
