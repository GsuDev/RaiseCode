import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getChallengeById, type ChallengeDetail } from '../services/challengeDetail.service';

// export const useChallengeDetail = () => {
//   const { id } = useParams<{ id: string }>();
//   const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!id) return;

//     setLoading(true);
//     getChallengeById(id)
//       .then((data) => {
//         setChallenge(data);
//         setError(null);
//       })
//       .catch((err) => {
//         setError(err.message || 'Error al cargar el reto');
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [id]);

//   return { challenge, loading, error };
// };


// Datos mockeados para monstrar la página
export const useChallengeDetail = () => {
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    // Simulamos una carga de 1000ms para ver el spinner
    const timer = setTimeout(() => {
      setChallenge({
        id: 1,
        title: "Crear número de teléfono",
        statement: "## Descripción\n\nEscribe una función que acepte una matriz de 10 enteros (entre 0 y 9), que devuelva una cadena de esos números en forma de número de teléfono.\n\n### Ejemplo:\n`createPhoneNumber([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])` // => devuelve \"(123) 456-7890\"",
        creatorName: "Usuario de Prueba",
        completedCount: 156,
        dificulty: { id: 1, name: 'Easy' },
        language: { id: 1, name: 'JavaScript' },
        subject: { id: 2, name: 'Desarrollo Web en Entorno Cliente' }
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { challenge, loading, error };
};
