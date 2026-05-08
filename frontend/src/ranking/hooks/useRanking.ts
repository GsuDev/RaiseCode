import { useState, useEffect, useCallback } from 'react';
import { getGlobalRanking, getSubjectRanking } from '../services/ranking.service';
import type { RankingUser } from '../services/ranking.service';

export const useRanking = () => {
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);

  const fetchRanking = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data: RankingUser[];
      if (selectedSubjectId) {
        data = await getSubjectRanking(selectedSubjectId);
      } else {
        data = await getGlobalRanking();
      }
      setRanking(data);
    } catch (err) {
      setError('Error al cargar el ranking. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSubjectId]);

  useEffect(() => {
    fetchRanking();
  }, [fetchRanking]);

  return {
    ranking,
    isLoading,
    error,
    selectedSubjectId,
    setSelectedSubjectId,
    refresh: fetchRanking
  };
};