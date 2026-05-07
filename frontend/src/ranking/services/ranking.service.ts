const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface RankingUser {
  position: number;
  userId: number;
  username: string;
  xp?: number;
  completedCount: number;
}

export const getGlobalRanking = async (): Promise<RankingUser[]> => {
  const response = await fetch(`${API_URL}/ranking/global`);
  
  if (!response.ok) {
    throw new Error('Error al obtener el ranking global');
  }
  
  return await response.json();
};

export const getSubjectRanking = async (subjectId: number): Promise<RankingUser[]> => {
  const response = await fetch(`${API_URL}/ranking/subjects/${subjectId}`);
  
  if (!response.ok) {
    throw new Error('Error al obtener el ranking por asignatura');
  }
  
  return await response.json();
};