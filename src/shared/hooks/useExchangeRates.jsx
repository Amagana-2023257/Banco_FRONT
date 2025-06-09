// src/shared/hooks/useExchangeRates.js
import { useState, useEffect, useRef } from 'react';
import { getExchangeRates } from '../../services/api';

export const useExchangeRates = () => {
  const [rates, setRates] = useState([]);        // [{ currency, rate }, ...]
  const [timestamp, setTimestamp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  // Función que hace el fetch en vivo
  const fetchRates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { rates: fetchedRates, timestamp: fetchedTs } = await getExchangeRates();
      if (!fetchedRates || fetchedRates.length === 0) {
        throw new Error('No se obtuvieron valores');
      }
      setRates(fetchedRates);
      setTimestamp(fetchedTs);
    } catch (e) {
      console.error('useExchangeRates:', e);
      setError('No se pudo cargar el tipo de cambio');
    } finally {
      setIsLoading(false);
    }
  };

  // Al montar, hacemos la primera carga inmediata
  useEffect(() => {
    fetchRates();
  }, []);

  // Una vez que la primera carga termine sin error, iniciamos el intervalo de actualización
  useEffect(() => {
    if (!isLoading && !error) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(fetchRates, 60000); // cada 60 s
      return () => {
        clearInterval(intervalRef.current);
      };
    }
    return;
  }, [isLoading, error]);

  return { rates, timestamp, isLoading, error };
};
