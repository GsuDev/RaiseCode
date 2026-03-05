const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
  const token = localStorage.getItem('token'); 

  const response = await fetch(`${API_URL}/challenges/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
  });

  if (response.status === 401) {
    throw new Error('Sesión expirada o no autorizada. Por favor, inicia sesión.');
  }

  if (!response.ok) {
    throw new Error('No se pudo cargar la información del reto');
  }

  return response.json();
};