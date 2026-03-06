import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getChallengeById, type ChallengeDetail } from '../../detail/services/challengeDetail.service';

// Definimos la interfaz para que TypeScript no se queje
export interface TestResult {
  id: number;
  description: string;
  passed: boolean;
  actual?: string;
  expected?: string;
}

export const useChallengeSolver = () => {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [code, setCode] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  // Añadimos el estado de resultados que faltaba
  const [results, setResults] = useState<TestResult[] | null>(null);

  useEffect(() => {
    if (!id) return;

    getChallengeById(id)
      .then((data) => {
        setChallenge(data);
        setCode(`// Reto: ${data.title}\n\nfunction solution() {\n  // Tu código aquí\n}`);
      })
      .catch(err => console.error("Error al cargar el reto:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const runCode = async () => {
    setIsRunning(true);
    setResults(null); // Limpiamos resultados previos
    
    // Simulación de ejecución de tests
    setTimeout(() => {
      const mockResults: TestResult[] = [
        { id: 1, description: "Debe ser una función", passed: true },
        { id: 2, description: "Formato de retorno correcto", passed: true },
        { id: 3, description: "Validación de dígitos", passed: false, expected: "10 dígitos", actual: "9 dígitos" }
      ];
      setResults(mockResults);
      setOutput("Ejecución finalizada.");
      setIsRunning(false);
    }, 1500);
  };

  return { 
    challenge, 
    loading, 
    code, 
    setCode, 
    isRunning, 
    runCode, 
    results, 
    output 
  };
};