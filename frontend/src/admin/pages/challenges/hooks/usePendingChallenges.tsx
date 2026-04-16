import { useState, useEffect } from 'react';
import { getPendingChallenges, validateChallenge } from '../services/adminChallenges.service';

export const usePendingChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar los retos desde la API
  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const data = await getPendingChallenges();
      setChallenges(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los retos pendientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Función para aprobar o rechazar
  const handleValidate = async (id: number, approved: boolean, comment?: string) => {
    try {
      await validateChallenge(id, approved, comment);
      setChallenges((prev) => prev.filter((challenge: any) => challenge.id !== id));
    } catch (err) {
      console.error('Error al validar el reto:', err);
      throw err; 
    }
  };

  // Carga inicial al montar el componente
  useEffect(() => {
    fetchChallenges();
  }, []);

  return {
    challenges,
    loading,
    error,
    handleValidate,
    refetch: fetchChallenges
  };
};