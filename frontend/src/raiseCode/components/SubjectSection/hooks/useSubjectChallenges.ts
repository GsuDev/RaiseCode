import { useEffect, useMemo, useState } from 'react';
import { getSubjectChallenges } from '../services/subjects.service';
import type { SubjectChallenge, SubjectChallengesResponse } from '../types';

export const useSubjectChallenges = (subjectId: number) => {
  const [allChallenges, setAllChallenges] = useState<SubjectChallenge[]>([]);
  const [meta, setMeta] = useState<SubjectChallengesResponse['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'ALL' | 'Easy' | 'Medium' | 'Hard'>('ALL');

  useEffect(() => {
    setLoading(true);
    getSubjectChallenges(subjectId, page)
      .then((res) => {
        setAllChallenges(res.data);
        setMeta(res.meta);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [subjectId, page]);

  const challenges = useMemo(() => {
    return allChallenges.filter((c) => {
      const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDiff = selectedDifficulty === 'ALL' || c.dificulty.name === selectedDifficulty;
      return matchesSearch && matchesDiff;
    });
  }, [allChallenges, searchTerm, selectedDifficulty]);

  return { challenges, meta, loading, error, page, setPage, searchTerm, setSearchTerm, selectedDifficulty, setSelectedDifficulty };
};
