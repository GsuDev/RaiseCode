import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getChallengeById, type ChallengeDetail } from '../services/challengeDetail.service';

export const useChallengeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    getChallengeById(id)
      .then((data) => {
        setChallenge(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error al cargar el reto:", err);
        setError("No se pudo cargar la información del reto.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { challenge, loading, error };
};