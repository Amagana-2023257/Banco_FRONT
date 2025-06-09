// src/shared/hooks/useGetAllTransactions.js
import { useState, useEffect, useCallback } from 'react';
import { getAllTransactions as fetchTxns } from '../../services/api';

export const useGetAllTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setLoading]         = useState(false);
  const [error, setError]               = useState(null);

  const getAllTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchTxns();
      if (result.success) {
        setTransactions(result.transactions);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllTransactions();
  }, [getAllTransactions]);

  return { transactions, getAllTransactions, isLoading, error };
};
