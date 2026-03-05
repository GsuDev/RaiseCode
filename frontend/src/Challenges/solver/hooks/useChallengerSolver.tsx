import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { type ChallengeDetail } from '../../detail/services/challengeDetail.service';

export const useChallengeSolver = () => {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [code, setCode] = useState<string>('// Escribe tu solución aquí...\n\nfunction solución() {\n  \n}');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  useEffect(() => {
    // Comentamos la llamada real para que no de error de "fetch"
    /*
    getChallengeById(id)
      .then(data => setChallenge(data))
      .finally(() => setLoading(false));
    */

    //  Simulamos la carga con datos de prueba
    const timer = setTimeout(() => {
      setChallenge({
        id: Number(id) || 1,
        title: "Crear número de teléfono",
        statement: "## Enunciado\nEscribe una función que acepte una matriz de 10 enteros (entre 0 y 9), que devuelva una cadena de esos números en forma de número de teléfono.\n\n### Ejemplo:\n`createPhoneNumber([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])` // => devuelve \"(123) 456-7890\"",
        creatorName: "Usuario de Prueba",
        completedCount: 156,
        dificulty: { id: 1, name: 'Easy' },
        language: { id: 1, name: 'JavaScript' },
        subject: { id: 2, name: 'Desarrollo Web en Entorno Cliente' }
      });
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const runCode = async () => {
    setIsRunning(true);
    setTimeout(() => {
      setOutput('Ejecutando tests...\n✅ Test 1 pasado\n✅ Test 2 pasado\n❌ Test 3 fallido');
      setIsRunning(false);
    }, 1000);
  };

  return { challenge, loading, code, setCode, isRunning, runCode, output };
};