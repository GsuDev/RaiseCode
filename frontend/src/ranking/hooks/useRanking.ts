import { useState, useEffect, useCallback } from 'react';
import { getGlobalRanking, getSubjectRanking } from '../services/ranking.service';
import type { RankingUser } from '../services/ranking.service';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useRanking = () => {
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchRanking = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      
      let response: any; 
      if (selectedSubjectId) {
        response = await getSubjectRanking(selectedSubjectId, pagination.page, pagination.limit);
      } else {
        response = await getGlobalRanking(pagination.page, pagination.limit);
      }
      
     
      if (response && response.meta) {
        setRanking(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.meta.total,
          totalPages: response.meta.totalPages,
        }));
      } 
      
      else if (Array.isArray(response)) {
        console.warn(" El backend devolvió un array antiguo. ¡Reinicia tu API (NestJS)!");
        setRanking(response);
      }
    } catch (err) {
      setError('Error al cargar el ranking. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSubjectId, pagination.page, pagination.limit]);

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
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
    pagination,
    setPagination,
    refresh: fetchRanking
  };
};