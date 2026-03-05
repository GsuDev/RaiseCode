import { Box, Grid, Text, VStack } from "@chakra-ui/react";
import { Flame, Target, Clock, TrendingUp } from "lucide-react";
import { ProfileStatCard } from "./components/ProfileStatCard";
import { ProfileHeader } from "./components/ProfileHeader";
import { useAuth } from "@/auth/context/AuthContext";
import { ProfileLanguageChart } from "./components/ProfileLanguageChart";
import { ProfileRecentActivity } from "./components/ProfileRecentActivity";

export const ProfilePage = () => {
  const { user } = useAuth();

  // Uso datos mockeados para comprobar como se ve, en el futuro se cambiaran por datos reales
  const mockStats = {
    completedCount: 45,
    currentStreak: "7 dias",
    avgTime: "125ms",
    bestStreak: "15 dias",
  };

  const mockLanguages = [
    { languageName: "JavaScript", count: 28 },
    { languageName: "PHP", count: 8 },
    { languageName: "Java", count: 5 },
    { languageName: "Python", count: 4 },
  ];

  const mockActivity = [
    {
      id: "1",
      challengeTitle: "Crear numero de telefono",
      languageName: "JavaScript",
      time: "Hoy",
      points: 100,
    },
    {
      id: "2",
      challengeTitle: "Suma de numeros en string",
      languageName: "JavaScript",
      time: "Ayer",
      points: 80,
    },
    {
      id: "3",
      challengeTitle: "Validar email con regex",
      languageName: "PHP",
      time: "Hace 2 días",
      points: 50,
    },
    {
      id: "4",
      challengeTitle: "Fibonacci recursivo",
      languageName: "Java",
      time: "Hace 3 días",
      points: 250,
    },
  ];

  if (!user) return null;

  return (
    <Box maxW="7xl" mx="auto" p={{ base: 4, md: 8 }} mt={4}>
      <VStack align="stretch" gap={8}>
        {/* Cabecera del perfil */}
        <ProfileHeader
          name={user.name}
          lastname={user.lastname}
          email={user.email}
          cycle={user.cycle}
        />

        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={4}
        >
          <ProfileStatCard
            icon={<Target size={24} />}
            value={mockStats.completedCount}
            label="Retos Completados"
            iconColor="green.500"
            boxBg="rgba(72, 187, 120, 0.15)"
          />
          <ProfileStatCard
            icon={<Flame size={24} />}
            value={mockStats.currentStreak}
            label="Racha Actual"
            iconColor="orange.500"
            boxBg="rgba(237, 137, 54, 0.15)"
          />
          <ProfileStatCard
            icon={<Clock size={24} />}
            value={mockStats.avgTime}
            label="Tiempo Promedio"
            iconColor="blue.500"
            boxBg="rgba(66, 153, 225, 0.15)"
          />
          <ProfileStatCard
            icon={<TrendingUp size={24} />}
            value={mockStats.bestStreak}
            label="Mejor Racha"
            iconColor="teal.500"
            boxBg="rgba(56, 178, 172, 0.15)"
          />
        </Grid>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
          <ProfileLanguageChart byLanguage={mockLanguages} />
          <ProfileRecentActivity recentActivity={mockActivity} />
        </Grid>
      </VStack>
    </Box>
  );
};
