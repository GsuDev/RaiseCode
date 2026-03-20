import type { Subject, SubjectDetail, SubjectChallengesResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export const getSubjects = async (): Promise<Subject[]> => {
  const res = await fetch(`${API_URL}/subjects`);
  if (!res.ok) throw new Error('Error al cargar asignaturas');
  return res.json();
};

export const getSubjectDetail = async (id: number): Promise<SubjectDetail> => {
  const res = await fetch(`${API_URL}/subjects/${id}`);
  if (!res.ok) throw new Error('Error al cargar la asignatura');
  return res.json();
};

export const getSubjectChallenges = async (
  subjectId: number,
  page = 1,
  limit = 12,
): Promise<SubjectChallengesResponse> => {
  const res = await fetch(`${API_URL}/subjects/${subjectId}/challenges?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Error al cargar los retos');
  return res.json();
};
