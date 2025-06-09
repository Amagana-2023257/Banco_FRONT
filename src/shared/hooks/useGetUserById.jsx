// src/shared/hooks/useGetUserById.js
import { useState } from 'react';
import { getUserById as fetchUserById } from '../../services/api';

export const useGetUserById = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUserById = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchUserById(id);
      if (result.success) {
        setUser(result.user);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { user, getUserById, isLoading, error };
};
