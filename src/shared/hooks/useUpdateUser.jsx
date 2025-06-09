// src/shared/hooks/useUpdateUser.js
import { useState } from 'react';
import { updateUser as apiUpdateUser } from '../../services/api';
import toast from 'react-hot-toast';

export const useUpdateUser = () => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Ahora devolvemos TODO el objeto que regresa la API:
   * { success, message, user, users }
   */
  const updateUser = async (id, payload) => {
    setIsLoading(true);
    try {
      const result = await apiUpdateUser(id, payload);
      if (result.success) {
        toast.success(result.message || 'Usuario actualizado');
        return result;    
        toast.error(result.message || 'Error al actualizar usuario');
        return null;
      }
    } catch (err) {
      toast.error(err.message || 'Error de red');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUser, isLoading };
};
