import { useState, useEffect } from 'react';
import { toaster } from '@/components/ui/toaster';

interface AdminSettings {
  registrationEnabled: string;
  [key: string]: string;
}

type ApiConfigEntry = { key: string; value: string };

/** La API devuelve [{key, value}] — lo convertimos a objeto plano */
const toSettingsObject = (data: ApiConfigEntry[] | AdminSettings): AdminSettings => {
  if (Array.isArray(data)) {
    return data.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {} as AdminSettings);
  }
  return data;
};

interface UseAdminSettingsReturn {
  settings: AdminSettings | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: Error | null;
  registrationEnabled: boolean;
  toggleRegistration: () => Promise<void>;
  refetch: () => Promise<void>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const useAdminSettings = (): UseAdminSettingsReturn => {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: 'GET',
        headers: getAuthHeader(),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`Error al obtener configuración: ${response.status}`);
      }
      const raw = await response.json();
      setSettings(toSettingsObject(raw));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      setError(error);
      console.error('Error al cargar settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRegistration = async () => {
    if (!settings) return;
    const current = settings.registrationEnabled === 'true';
    const newValue = (!current).toString();
    try {
      setIsUpdating(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: 'PATCH',
        headers: getAuthHeader(),
        credentials: 'include',
        body: JSON.stringify({ registrationEnabled: newValue }),
      });
      if (!response.ok) {
        throw new Error(`Error al actualizar configuración: ${response.status}`);
      }
      const updatedRaw = await response.json();
      setSettings(toSettingsObject(updatedRaw));
      toaster.create({
        title: 'Configuración guardada',
        description: `Registro público ${newValue === 'true' ? 'activado' : 'desactivado'} correctamente.`,
        type: 'success',
        duration: 3000,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      setError(error);
      // Revertir al valor anterior
      setSettings(prev => prev ? { ...prev, registrationEnabled: current.toString() } : prev);
      toaster.create({
        title: 'Error al guardar',
        description: error.message,
        type: 'error',
        duration: 4000,
      });
      console.error('Error al actualizar settings:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    isLoading,
    isUpdating,
    error,
    registrationEnabled: settings?.registrationEnabled === 'true',
    toggleRegistration,
    refetch: fetchSettings,
  };
};
