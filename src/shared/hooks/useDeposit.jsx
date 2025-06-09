// src/shared/hooks/useDeposit.js
import { useState, useCallback } from 'react';
import { deposit as apiDeposit } from '../../services/api';

export const useDeposit = () => {
  const [balance, setBalance] = useState(null);
  const [txn, setTxn]         = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError]       = useState(null);

  const deposit = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiDeposit(data);
      if (result.success) {
        setTxn(result.transaction);
        setBalance(result.balance);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { txn, balance, deposit, isLoading, error };
};
