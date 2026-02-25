import { useState } from 'react';
import { loginService, type LoginPayload, type LoginResponse } from '../services/login.service';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginPayload): Promise<LoginResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginService(data);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};