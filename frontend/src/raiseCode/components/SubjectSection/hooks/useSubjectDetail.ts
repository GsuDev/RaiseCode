import { useEffect, useState } from 'react';
import { getSubjectDetail } from '../services/subjects.service';
import type { SubjectDetail } from '../types';

export const useSubjectDetail = (subjectId: number) => {
  const [subject, setSubject] = useState<SubjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSubjectDetail(subjectId)
      .then(setSubject)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [subjectId]);

  return { subject, loading, error };
};
