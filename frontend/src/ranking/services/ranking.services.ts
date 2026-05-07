import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface RankingUser {
  position: number;
  userId: number;
  username: string;
  xp?: number;
  completedCount: number;
}

export const getGlobalRanking = async (): Promise<RankingUser[]> => {
  const { data } = await axios.get(`${API_URL}/ranking/global`);
  return data;
};

export const getSubjectRanking = async (subjectId: number): Promise<RankingUser[]> => {
  const { data } = await axios.get(`${API_URL}/ranking/subjects/${subjectId}`);
  return data;
};