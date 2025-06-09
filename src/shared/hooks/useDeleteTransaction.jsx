// src/shared/hooks/useDeleteTransaction.js
import { useState, useCallback } from 'react';
import { deleteTransaction as apiDeleteTxn } from '../../services/api';

export const useDeleteTransaction = () => {
  const [message, setMessage] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError]       = useState(null);

  const deleteTransaction = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiDeleteTxn(id);
      if (result.success) {
        setMessage(result.message);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { message, deleteTransaction, isLoading, error };
};
