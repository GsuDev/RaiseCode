import { useState, useEffect } from 'react';
import { getAllCoursesAdmin, createCourse, updateCourse, deleteCourse } from '../services/adminCourses.service';

export const useAdminCourses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await getAllCoursesAdmin();
      setCourses(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los ciclos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (name: string) => {
    await createCourse(name);
    await fetchCourses();
  };

  const handleUpdate = async (id: number, name: string) => {
    await updateCourse(id, name);
    await fetchCourses();
  };

  const handleDelete = async (id: number) => {
    await deleteCourse(id);
    await fetchCourses();
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch: fetchCourses,
  };
};