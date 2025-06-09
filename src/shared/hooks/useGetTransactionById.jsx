// src/shared/hooks/useGetTransactionById.js
import { useState, useCallback } from 'react';
import { getTransactionById as fetchTxn } from '../../services/api';

export const useGetTransactionById = () => {
  const [transaction, setTransaction] = useState(null);
  const [isLoading, setLoading]       = useState(false);
  const [error, setError]             = useState(null);

  const getTransactionById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchTxn(id);
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

  return { transaction, getTransactionById, isLoading, error };
};
