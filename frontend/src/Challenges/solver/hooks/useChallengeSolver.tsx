import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getChallengeById, type ChallengeDetail } from '../../detail/services/challengeDetail.service';

export const useChallengeSolver = () => {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    getChallengeById(id)
      .then((data) => {
        setChallenge(data);
        setCode(`// Reto: ${data.title}\n\nfunction solution() {\n  // Tu código aquí\n}`);
      })
      .catch(err => console.error("Error en solver:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const runCode = async () => {
    setIsRunning(true);
    // Aquí es donde en el futuro llamaremos al microservicio de ejecución (Worker)
    setTimeout(() => {
      setOutput('Ejecución completada en el servidor...');
      setIsRunning(false);
    }, 1000);
  };

  return { challenge, loading, code, setCode, isRunning, runCode, output };
};