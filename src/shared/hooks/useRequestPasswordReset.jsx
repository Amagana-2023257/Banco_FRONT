// src/shared/hooks/useRequestPasswordReset.jsx
import { useState } from 'react';
import { requestPasswordReset as apiRequest } from '../../services/api';
import toast from 'react-hot-toast';

export const useRequestPasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const requestPasswordReset = async email => {
    setIsLoading(true);
    try {
      const data = await apiRequest(email.trim().toLowerCase());
      if (data.error) throw new Error(data.message);
      toast.success(data.msg);
      return { success: true };
    } catch (err) {
      console.error('Request reset error:', err);
      toast.error(err.message);
      return { error: true };
    } finally {
      setIsLoading(false);
    }
  };
  return { requestPasswordReset, isLoading };
};
