import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/auth/context/AuthContext';
import { toaster } from '@/components/ui/toaster';
import { createChallengeService } from '../services/createChallenge.service';
import type { ChallengeFormState } from '../types';

/**
 * Hook que gestiona el envío del formulario al backend.
 * Solo se llama desde el paso 3 al pulsar "Publicar Reto".
 */
export const useCreateChallenge = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const submit = async (form: ChallengeFormState): Promise<void> => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      await createChallengeService(
        {
          title: form.title,
          description: form.description,
          statement: form.statement,
          dificultyId: form.dificultyId!,
          languageId: form.languageId!,
          subjectId: form.subjectId!,
        },
        token
      );

      toaster.create({
        title: '¡Reto creado!',
        description: 'Tu reto está pendiente de validación por un administrador.',
        type: 'success',
      });

      navigate('/');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error inesperado';
      setError(msg);
      toaster.create({
        title: 'Error al crear el reto',
        description: msg,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
};
