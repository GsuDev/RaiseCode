import { useState, useEffect } from 'react';
import { type Course, getCourses } from '../services/courses.service';

/**
 * Hook personalizado para obtener la lista de ciclos formativos
 * gestionando el estado de carga y posibles errores.
 */
export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar cursos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, isLoading, error };
};