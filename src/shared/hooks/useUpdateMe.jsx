// src/shared/hooks/useUpdateMe.js
import { useState } from 'react';
import { updateMe as apiUpdateMe } from '../../services/api';
import toast from 'react-hot-toast';

export const useUpdateMe = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateMe = async (payload) => {
    setIsLoading(true);
    try {
      const result = await apiUpdateMe(payload);
      if (result.success) {
        toast.success(result.message || 'Perfil actualizado');
        return result.user;
      } else {
        toast.error(result.message || 'Error al actualizar perfil');
        return null;
      }
    } catch (err) {
      toast.error(err.message || 'Error de red');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateMe, isLoading };
};
