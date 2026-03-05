import { useState, useEffect } from 'react';
import { useAuth } from '@/auth/context/AuthContext';
import { getProfileService, type ProfileResponse } from '../services/profile.service';

export const useProfile = () => {
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { token } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {

      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const response = await getProfileService(token);
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error inesperado al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  return { data, loading, error };
};