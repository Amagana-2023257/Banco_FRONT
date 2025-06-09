// src/shared/hooks/usePurchase.js
import { useState, useCallback } from 'react';
import { purchase as apiPurchase } from '../../services/api';

export const usePurchase = () => {
  const [txn, setTxn]             = useState(null);
  const [balance, setBalance]     = useState(null);
  const [isLoading, setLoading]   = useState(false);
  const [error, setError]         = useState(null);

  const purchase = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiPurchase(data);
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

  return { txn, balance, purchase, isLoading, error };
};
