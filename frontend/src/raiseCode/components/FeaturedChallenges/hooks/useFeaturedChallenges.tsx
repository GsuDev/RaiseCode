import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export interface FeaturedChallenge {
  id: number;
  title: string;
  description: string;
  statement: string;
  dificulty: { id: number; name: string };
  language: { id: number; name: string };
  subject: { id: number; name: string };
  completedCount: number;
}

export const useFeaturedChallenges = () => {
  const [featuredChallenges, setFeaturedChallenges] = useState<FeaturedChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/challenges/featured`)
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron cargar los retos destacados');
        return res.json() as Promise<FeaturedChallenge[]>;
      })
      .then((data) => {
        setFeaturedChallenges(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Error al cargar featured challenges:', err);
        setError('No se pudieron cargar los retos destacados');
      })
      .finally(() => setLoading(false));
  }, []);

  return { featuredChallenges, loading, error, setFeaturedChallenges };
};