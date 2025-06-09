// src/shared/hooks/useDeactivateAccount.js
import { useState, useCallback } from 'react';
import { deactivateAccount as apiDeactivateAccount } from '../../services/api';

export const useDeactivateAccount = () => {
  const [message, setMessage] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deactivateAccount = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiDeactivateAccount(id);
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

  return { message, deactivateAccount, isLoading, error };
};
