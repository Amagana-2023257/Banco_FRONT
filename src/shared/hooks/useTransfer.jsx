// src/shared/hooks/useTransfer.js
import { useState, useCallback } from 'react';
import { transfer as apiTransfer } from '../../services/api';

export const useTransfer = () => {
  const [transactions, setTransactions] = useState(null);
  const [balances, setBalances]         = useState(null);
  const [isLoading, setLoading]         = useState(false);
  const [error, setError]               = useState(null);

  const transfer = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiTransfer(data);
      if (result.success) {
        setTransactions(result.transactions);
        setBalances(result.balances);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { transactions, balances, transfer, isLoading, error };
};
