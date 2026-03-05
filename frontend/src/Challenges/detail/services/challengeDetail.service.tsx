const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost/api';

export interface ChallengeDetail {
  id: number;
  title: string;
  statement: string;
  creatorName: string;
  completedCount: number;
  dificulty: { 
    id: number;
    name: 'Easy' | 'Medium' | 'Hard';
  };
  language: { 
    id: number;
    name: string; 
  };
  subject: { 
    id: number;
    name: string; 
  };
}

export const getChallengeById = async (id: string): Promise<ChallengeDetail> => {
  const response = await fetch(`${API_URL}/challenges/${id}`);
  
  if (!response.ok) {
    throw new Error('No se pudo cargar la información del reto');
  }

  return response.json();
};