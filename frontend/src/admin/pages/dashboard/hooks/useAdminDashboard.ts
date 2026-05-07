import { useState, useEffect } from 'react';
import { adminDashboardService, type DashboardData } from '../services/adminDashboard.service';

interface UseAdminDashboardReturn {
  dashboard: DashboardData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useAdminDashboard = (): UseAdminDashboardReturn => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminDashboardService.getStats();
      setDashboard(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      setError(error);
      console.error('Error al cargar dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    dashboard,
    isLoading,
    error,
    refetch: fetchDashboardData,
  };
};
