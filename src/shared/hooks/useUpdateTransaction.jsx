// src/shared/hooks/useUpdateTransaction.js
import { useState, useCallback } from 'react';
import { updateTransaction as apiUpdateTxn } from '../../services/api';

export const useUpdateTransaction = () => {
  const [transaction, setTransaction] = useState(null);
  const [isLoading, setLoading]       = useState(false);
  const [error, setError]             = useState(null);

  const updateTransaction = useCallback(async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiUpdateTxn(id, payload);
      if (result.success) {
        setTransaction(result.transaction);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { transaction, updateTransaction, isLoading, error };
};
