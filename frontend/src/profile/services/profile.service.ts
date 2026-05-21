const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost/api';

export interface LanguageStat {
  languageName: string;
  count: number;
}

export interface RecentActivity {
  challengeId: number;
  challengeTitle: string;
  languageName: string;
  executionTime: number;
  completedAt: string;
  xpEarned: number;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  xpReward: number;
}

export interface UserAchievement {
  achievementId: number,
  unlockedAt: string;
  achivement: Achievement;
}

export interface ProfileStats {
  completedCount: number;
  byLanguage: LanguageStat[];
  avgExecutionTime: number | null; 
  bestExecutionTime: number | null; 
}

export interface ProfileResponse {
  id: number;
  name: string;
  lastname: string;
  email: string;
  xp: number;
  course: { id: number; name: string } | null;
  roles: string[];
  stats: ProfileStats;
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

export const getAllAchievementsService = async (): Promise<Achievement[]> => {
  const response = await fetch(`${API_URL}/achievements`);
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message ?? 'Error al obtener los logros');
  }
  return json;
}

export const getUserAchievementsService = async (userId: number, token: string): Promise<UserAchievement[]> => {
  const response = await fetch(`${API_URL}/users/${userId}/achievements`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.message ?? 'Error al obtener los logros del usuario');
  return json;  
}