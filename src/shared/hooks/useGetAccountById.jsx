// src/shared/hooks/useGetAccountById.js
import { useState, useCallback } from 'react';
import { getAccountById as fetchAccount } from '../../services/api';

export const useGetAccountById = () => {
  const [account, setAccount] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAccountById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAccount(id);
      if (result.success) {
        setAccount(result.account);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { account, getAccountById, isLoading, error };
};
