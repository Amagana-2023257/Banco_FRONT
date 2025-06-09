// src/shared/hooks/useResetPassword.jsx
import { useState } from 'react';
import { resetPassword as apiReset } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const resetPassword = async (email, code, newPassword) => {
    setIsLoading(true);
    try {
      const data = await apiReset(
        email.trim().toLowerCase(),
        code,
        newPassword
      );
      if (data.error) throw new Error(data.message);
      toast.success(data.msg);
      navigate('/login');
      return { success: true };
    } catch (err) {
      console.error('Reset password error:', err);
      toast.error(err.message);
      return { error: true };
    } finally {
      setIsLoading(false);
    }
  };
  return { resetPassword, isLoading };
};
