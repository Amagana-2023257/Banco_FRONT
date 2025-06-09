// src/shared/hooks/useGetAllUsers.js
import { useState, useEffect, useCallback } from 'react';
import { getAllUsers as fetchAllUsers } from '../../services/api';

export const useGetAllUsers = () => {
  const [users, setUsers]     = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // Memoizamos la función para que sea estable entre renders
  const getAllUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAllUsers();
      if (result.success) {
        setUsers(result.users);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);  // sin deps, se crea solo una vez

  return { users, getAllUsers, isLoading, error };
};
