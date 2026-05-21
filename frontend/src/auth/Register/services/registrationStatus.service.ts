const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Consulta si el registro público está habilitado.
 * No requiere autenticación.
 */
export const registrationStatusService = {
  async isEnabled(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/registration-status`);
      if (!response.ok) return true; // fallback: permitir registro si la API falla
      const data = await response.json();
      return data.registrationEnabled === true;
    } catch {
      return true; // fallback
    }
  },
};
