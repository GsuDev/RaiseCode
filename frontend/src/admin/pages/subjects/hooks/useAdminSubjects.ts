import { useAuth } from '@/auth/context/AuthContext';
import { useEffect, useState } from 'react';
import { toaster } from '@/components/ui/toaster';
import {
  AdminSubject,
  SubjectFormDto,
  createSubject,
  deleteSubject,
  getAdminSubjects,
  updateSubject,
} from '../services/adminSubjects.service';

export const useAdminSubjects = () => {
  const [subjects, setSubjects] = useState<AdminSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getAdminSubjects();
      setSubjects(data);
    } catch (e) {
      toaster.create({ title: 'Error al cargar asignaturas', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  // Cada operación recarga la tabla para reflejar el estado real de la BD
  const handleCreate = async (dto: SubjectFormDto) => {
    await createSubject(dto, token!);
    toaster.create({ title: 'Asignatura creada', type: 'success' });
    await refresh();
  };

  const handleUpdate = async (id: number, dto: Partial<SubjectFormDto>) => {
    await updateSubject(id, dto, token!);
    toaster.create({ title: 'Asignatura actualizada', type: 'success' });
    await refresh();
  };

  const handleDelete = async (id: number) => {
    await deleteSubject(id, token!);
    toaster.create({ title: 'Asignatura eliminada', type: 'success' });
    await refresh();
  };

  return { subjects, loading, handleCreate, handleUpdate, handleDelete };
};
