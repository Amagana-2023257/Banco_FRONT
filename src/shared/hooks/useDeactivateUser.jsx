// src/shared/hooks/useDeactivateUser.js
import { useState } from 'react';
import { deactivateUser as apiDeactivate } from '../../services/api';
import toast from 'react-hot-toast';

export const useDeactivateUser = () => {
  const [isLoading, setIsLoading] = useState(false);

  const deactivateUser = async (id) => {
    setIsLoading(true);
    try {
      const result = await apiDeactivate(id);
      if (result.success) {
        toast.success(result.message || 'Usuario desactivado');
        return true;
      } else {
        toast.error(result.message || 'Error al desactivar usuario');
        return false;
      }
    } catch (err) {
      toast.error(err.message || 'Error de red');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { deactivateUser, isLoading };
};
