interface ActivityDataRaw {
  _count: number;
  createdAt: string;
}

interface DashboardData {
  totalUsers: number;
  totalChallenges: number;
  pendingChallenges: number;
  totalCompletions: number;
  topChallenge: {
    id: number;
    title: string;
    completedCount: number;
  };
  topUser: {
    name: string;
    xp: number;
  };
  activityLast7Days: Array<{
    date: string;
    completions: number;
  }>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

/**
 * Transforma los datos crudos de la API al formato esperado por el componente
 */
const transformDashboardData = (data: any): DashboardData => {
  return {
    ...data,
    activityLast7Days: (data.activityLast7Days || []).map((item: ActivityDataRaw) => ({
      date: item.createdAt,
      completions: item._count,
    })),
  };
};

export const adminDashboardService = {
  /**
   * Obtiene todas las estadísticas del dashboard de administración
   * @returns Promesa con los datos del dashboard
   */
  async getStats(): Promise<DashboardData> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        method: 'GET',
        headers: getAuthHeader(),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return transformDashboardData(data);
    } catch (error) {
      console.error('Error al obtener estadísticas del dashboard:', error);
      throw error;
    }
  },

  /**
   * Obtiene el total de usuarios
   */
  async getTotalUsers(): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.total || 0;
    } catch (error) {
      console.error('Error al obtener total de usuarios:', error);
      throw error;
    }
  },

  /**
   * Obtiene el total de retos
   */
  async getTotalChallenges(): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/challenges/count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.total || 0;
    } catch (error) {
      console.error('Error al obtener total de retos:', error);
      throw error;
    }
  },

  /**
   * Obtiene el total de retos pendientes de validación
   */
  async getPendingChallenges(): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/challenges/pending`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.total || 0;
    } catch (error) {
      console.error('Error al obtener retos pendientes:', error);
      throw error;
    }
  },

  /**
   * Obtiene el reto más popular
   */
  async getTopChallenge() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/challenges/top`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener reto más popular:', error);
      throw error;
    }
  },

  /**
   * Obtiene el usuario con más experiencia
   */
  async getTopUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/top`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener usuario top:', error);
      throw error;
    }
  },

  /**
   * Obtiene la actividad de los últimos 7 días
   */
  async getActivityLast7Days() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/activity/last-7-days`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener actividad últimos 7 días:', error);
      throw error;
    }
  },
};

export type { DashboardData };
