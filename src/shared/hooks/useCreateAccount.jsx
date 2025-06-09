// src/shared/hooks/useCreateAccount.js
import { useState, useCallback } from 'react';
import { createAccount as apiCreateAccount } from '../../services/api';

export const useCreateAccount = () => {
  const [account, setAccount] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createAccount = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCreateAccount(data);
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

  return { account, createAccount, isLoading, error };
};
