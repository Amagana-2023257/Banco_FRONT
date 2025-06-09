// src/shared/hooks/useGetAllAccounts.js
import { useState, useEffect, useCallback } from 'react';
import { getAllAccounts as fetchAccounts } from '../../services/api';

export const useGetAllAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAccounts();
      if (result.success) {
        setAccounts(result.accounts);
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
    getAllAccounts();
  }, [getAllAccounts]);

  return { accounts, getAllAccounts, isLoading, error };
};
