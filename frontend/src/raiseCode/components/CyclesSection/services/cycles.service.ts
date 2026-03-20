import { CourseWithStats } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export const getCourses = async (): Promise<CourseWithStats[]> => {
  const response = await fetch(`${API_URL}/courses`);

  if (!response.ok) {
    throw new Error('Error al obtener los ciclos formativos');
  }

  return response.json();
};