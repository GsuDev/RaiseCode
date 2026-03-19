const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface ChallengeTest {
  id: number;
  input: string;
  expectedOutput: string;
  hidden: boolean;
}

export interface ChallengeDetail {
  id: number;
  title: string;
  statement: string;
  description: string;
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
  tests?: ChallengeTest[];
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

  const data = await response.json();

  // El backend devuelve completedChallenges._count — lo normalizamos
  return {
    ...data,
    completedCount: data._count?.completedChallenges ?? data.completedCount ?? 0,
  };
};
