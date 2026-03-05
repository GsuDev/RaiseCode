import { useState } from 'react';

export const useChallengeSolver = () => {
  const [code, setCode] = useState<string>('// Escribe tu solución aquí...\n\nfunction solución() {\n  \n}');
  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const runCode = async () => {
    setIsRunning(true);
    // Simulación de ejecución (Mock)
    setTimeout(() => {
      setOutput('Ejecutando tests...\n✅ Test 1 pasado\n✅ Test 2 pasado\n❌ Test 3 fallido: se esperaba "(123) 456-7890"');
      setIsRunning(false);
    }, 1500);
  };

  return {
    code,
    setCode,
    language,
    setLanguage,
    isRunning,
    runCode,
    output
  };
};