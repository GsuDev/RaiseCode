import { useState } from 'react';
import { 
  registerUserService, 
  type RegisterResponse 
} from '../services/registerUser.service';


export interface RegisterFormData {
  name: string;             
  lastname: string;         
  email: string;
  password: string;
  passwordConfirm: string;
  courseId: number;         
}

interface UseRegisterUserReturn {
  
  register: (data: RegisterFormData) => Promise<RegisterResponse | null>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

/**
 * Hook que encapsula la lógica de registro adaptado a la tabla Course
 */
export const useRegisterUser = (): UseRegisterUserReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const register = async (data: RegisterFormData): Promise<RegisterResponse | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await registerUserService(data);
      setSuccess(true);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error, success };
};