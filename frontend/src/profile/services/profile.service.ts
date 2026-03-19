const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export interface LanguageStat {
  languageName: string;
  count: number;
}

export interface RecentActivity {
  challengeId: number;
  challengeTitle: string;
  languageName: string;
  time: number;
}

export interface ProfileResponse {
  stats: {
    completedCount: number;
    byLanguage: LanguageStat[];
  };
  recentActivity: RecentActivity[];
}

export const getProfileService = async (token: string): Promise<ProfileResponse> => {
  const response = await fetch(`${API_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? 'Error al obtener la información del perfil');
  }

  return json;
};