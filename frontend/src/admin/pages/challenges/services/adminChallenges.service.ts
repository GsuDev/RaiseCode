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
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/challenges/${id}/validate`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ approved, comment }),
  });

  if (!response.ok) {
    throw new Error('Error al validar el reto');
  }

  return response.json();
};

/**
 * Obtiene todos los retos para el panel de admin con paginacion
 */
export const getAllChallengesAdmin = async (page: number = 1, limit: number = 10) => {
  const tokken = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/challenges/admin/all?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener todos los retos');
  }

  return response.json();
};

/**
 * Edita un reto existente
 */
export const updateChallenge = async (id: number, data: any) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/challenges/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar el reto');
  }

  return response.json();
}

/**
 * Elimina un reto. Lanza error si tiene soluciones enviadas.
 */
export const deleteChallenge = async (id: number) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/challenges/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.message ?? 'Error al eliminar el reto');
  }

  return response.json();
};