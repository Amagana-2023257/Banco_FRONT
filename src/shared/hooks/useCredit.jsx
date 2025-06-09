// src/shared/hooks/useCredit.js
import { useState, useCallback } from 'react';
import { credit as apiCredit } from '../../services/api';

export const useCredit = () => {
  const [txn, setTxn]           = useState(null);
  const [balance, setBalance]   = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError]       = useState(null);

  const credit = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCredit(data);
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

  return { txn, balance, credit, isLoading, error };
};
