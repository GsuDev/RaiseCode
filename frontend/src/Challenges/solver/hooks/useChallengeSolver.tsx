import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getChallengeById, type ChallengeDetail } from '../../detail/services/challengeDetail.service';

/** Genera el stub de código inicial según el lenguaje del reto */
function getInitialCode(title: string, language: string): string {
  const lang = language.toLowerCase();

  if (lang === 'python') {
    return `# Reto: ${title}\n\ndef solution(n):\n    # Tu código aquí\n    pass\n`;
  }
  if (lang === 'java') {
    return `// Reto: ${title}\n\nstatic Object solution(Object n) {\n    // Tu código aquí\n    return null;\n}\n`;
  }
  // Default: JavaScript / Node.js / TypeScript
  return `// Reto: ${title}\n\nfunction solution(n) {\n  // Tu código aquí\n}\n`;
}

export const useChallengeSolver = () => {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    if (!id) return;

    getChallengeById(id)
      .then((data) => {
        setChallenge(data);
        setCode(getInitialCode(data.title, data.language.name));
      })
      .catch((err) => console.error('Error al cargar el reto:', err))
      .finally(() => setLoading(false));
  }, [id]);

  return { challenge, loading, code, setCode };
};
