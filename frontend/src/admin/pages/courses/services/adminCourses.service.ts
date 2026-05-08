const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Obtiene todos los ciclos formativos con número de asignaturas.
 */
export const getAllCoursesAdmin = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/courses/admin`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Error al obtener los ciclos');
  return response.json();
};

/**
 * Crea un nuevo ciclo formativo.
 */
export const createCourse = async (name: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error('Error al crear el ciclo');
  return response.json();
};

/**
 * Edita un ciclo formativo.
 */
export const updateCourse = async (id: number, name: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/courses/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error('Error al actualizar el ciclo');
  return response.json();
};

/**
 * Elimina un ciclo formativo.
 */
export const deleteCourse = async (id: number) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/courses/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.message ?? 'Error al eliminar el ciclo');
  }
  return response.json();
};