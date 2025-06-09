// src/shared/hooks/useUpdateAccount.js
import { useState, useCallback } from 'react';
import { updateAccount as apiUpdateAccount } from '../../services/api';

export const useUpdateAccount = () => {
  const [account, setAccount] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateAccount = useCallback(async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiUpdateAccount(id, payload);
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

  return { account, updateAccount, isLoading, error };
};
