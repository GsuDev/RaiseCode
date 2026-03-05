import { useState } from 'react';
import { useAuth } from '@/auth/context/AuthContext';
import { loginService, type LoginPayload } from '../services/login.service';

/**
 * Hook de login.
 * Llama al servicio, guarda el token y el usuario en el AuthContext
 * (que a su vez los persiste en localStorage) y devuelve estados de carga/error.
 */
export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth } = useAuth();

  const login = async (data: LoginPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginService(data);
      setAuth(response.access_token, {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        lastname: response.user.lastname,
        cycle: response.user.cycle,
        roles: response.payload.roles,
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
