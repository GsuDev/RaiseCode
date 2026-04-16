import { useState, useEffect } from 'react';
import { useAuth } from '@/auth/context/AuthContext';
import { useRef } from 'react';
import { getProfileService,
         getAllAchievementsService,
         getUserAchievementsService,
         type ProfileResponse,
         type Achievement,
         type UserAchievement
} from '../services/profile.service';
import { toaster } from '@/components/ui/toaster'

export const useProfile = () => {
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const prevUserAchievementsRef = useRef<UserAchievement[]>([])
  
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {

      if (!token || !user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const [profileData, allAchievements, unlockedAchievements] = await Promise.all([
          getProfileService(token),
          getAllAchievementsService(),
          getUserAchievementsService(user.id, token),
        ]);

        const prevIds = prevUserAchievementsRef.current.map(ua => ua.achievementId);
        const newlyUnlocked = unlockedAchievements.filter(
          ua => !prevIds.includes(ua.achievementId)
        );

        if (prevUserAchievementsRef.current.length > 0) {
          newlyUnlocked.forEach(ua => {
            const achievement = allAchievements.find(a => a.id === ua.achievementId);
            if (achievement) {
              toaster.create({
                title: `🏆 Logro desbloqueado: ${achievement.name}`,
                description: achievement.description,
                type: 'success',
                duration: 5000,
              });
            }
          });
        }

        prevUserAchievementsRef.current = unlockedAchievements;

        setData(profileData);
        setAchievements(allAchievements);
        setUserAchievements(unlockedAchievements)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error inesperado al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, user]);

  return { data, loading, error, achievements, userAchievements };
};