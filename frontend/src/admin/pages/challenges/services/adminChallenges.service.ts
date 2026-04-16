// frontend/src/admin/pages/challenges/services/adminChallenges.service.ts

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Obtiene la lista de retos pendientes de validación.
 */
export const getPendingChallenges = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/challenges/pending`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los retos pendientes');
  }

  return response.json();
};

/**
 * Aprueba o rechaza un reto.
 */
export const validateChallenge = async (id: number, approved: boolean, comment?: string) => {
  const response = await fetch(`${API_URL}/challenges/${id}/validate`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ approved, comment }),
  });

  if (!response.ok) {
    throw new Error('Error al validar el reto');
  }

  return response.json();
};