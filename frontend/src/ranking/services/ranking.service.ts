const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface RankingUser {
  position: number;
  userId: number;
  username: string;
  xp?: number;
  completedCount: number;
}


export interface RankingResponse {
  data: RankingUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getGlobalRanking = async (page: number = 1, limit: number = 10): Promise<RankingResponse> => {
  const response = await fetch(`${API_URL}/ranking/global?page=${page}&limit=${limit}`);
  
  if (!response.ok) {
    throw new Error('Error al obtener el ranking global');
  }
  
  return await response.json();
};

export const getSubjectRanking = async (subjectId: number, page: number = 1, limit: number = 10): Promise<RankingResponse> => {
  const response = await fetch(`${API_URL}/ranking/subjects/${subjectId}?page=${page}&limit=${limit}`);
  
  if (!response.ok) {
    throw new Error('Error al obtener el ranking por asignatura');
  }
  
  return await response.json();
};