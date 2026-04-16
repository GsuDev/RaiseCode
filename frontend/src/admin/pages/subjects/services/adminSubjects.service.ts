const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost/api';

export interface Course {
  id: number;
  name: string;
}

export interface AdminSubject {
  id: number;
  name: string;
  description: string;
  courses: Course[];
  challengeCount: number;
}

export interface SubjectFormDto {
  name: string;
  description?: string;
  courseIds: number[];
}

export const getAdminSubjects = async (): Promise<AdminSubject[]> => {
  const res = await fetch(`${API_URL}/subjects`);
  if (!res.ok) throw new Error('Error al cargar las asignaturas');
  return res.json();
};

export const createSubject = async (dto: SubjectFormDto, token: string): Promise<AdminSubject> => {
  const res = await fetch(`${API_URL}/subjects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(dto),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Error al crear la asignatura');
  return json;
};

export const updateSubject = async (id: number, dto: Partial<SubjectFormDto>, token: string): Promise<AdminSubject> => {
  const res = await fetch(`${API_URL}/subjects/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(dto),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Error al actualizar la asignatura');
  return json;
};

export const deleteSubject = async (id: number, token: string): Promise<void> => {
  const res = await fetch(`${API_URL}/subjects/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.message ?? 'Error al eliminar la asignatura');
  }
};

export const getCourses = async (): Promise<Course[]> => {
  const res = await fetch(`${API_URL}/courses`);
  if (!res.ok) throw new Error('Error al cargar los ciclos');
  return res.json();
};
