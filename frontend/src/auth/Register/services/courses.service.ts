export interface Course {
  id: number;
  name: string;
}

/**
 * Obtiene los cursos desde el endpoint público del backend.
 * GET /api/courses
 */
export const getCourses = async (): Promise<Course[]> => {
  const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost/api';
  
  const response = await fetch(`${API_URL}/courses`);
  
  if (!response.ok) {
    throw new Error('No se pudieron cargar los cursos');
  }
  
  return response.json();
};