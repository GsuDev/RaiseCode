import { useEffect, useState } from 'react';
import type { SelectOption } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

const fetchJson = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error cargando ${url}`);
  return res.json();
};

interface ChallengeOptions {
  languages: SelectOption[];
  subjects: SelectOption[];
  difficulties: SelectOption[];
}

/**
 * Carga en paralelo los tres catálogos necesarios para el formulario.
 * Todos los endpoints son públicos, no requieren token.
 */
export const useChallengeOptions = () => {
  const [options, setOptions] = useState<ChallengeOptions>({
    languages: [],
    subjects: [],
    difficulties: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [languages, subjects, difficulties] = await Promise.all([
          fetchJson(`${API_URL}/languages`),
          fetchJson(`${API_URL}/courses`),
          fetchJson(`${API_URL}/difficulties`),
        ]);
        setOptions({ languages, subjects, difficulties });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando opciones');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { options, loading, error };
};
