import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Box, Grid, Text, VStack, Center, Spinner } from "@chakra-ui/react";
import { Flame, Target, Clock, TrendingUp } from "lucide-react";
import { ProfileStatCard } from "./components/ProfileStatCard";
import { ProfileHeader } from "./components/ProfileHeader";
import { useAuth } from "@/auth/context/AuthContext";
import { ProfileLanguageChart } from "./components/ProfileLanguageChart";
import { ProfileRecentActivity } from "./components/ProfileRecentActivity";
import { ProfileAchievements } from "./components/ProfileAchievements";
import { useProfile } from "./hooks/useProfile";

export const ProfilePage = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { data, loading, error, achievements, userAchievements } = useProfile();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn || !user) return null;

  if (loading) {
    return (
      <Center h="60vh">
        <VStack gap={4}>
          <Spinner size="xl" color="brand.500" borderWidth="4px" />
          <Text color="fg.muted">Cargando tu perfil...</Text>
        </VStack>
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="60vh">
        <Box bg="red.500" p={6} borderRadius="xl" color="white" textAlign="center">
          <Text fontWeight="bold" fontSize="lg" mb={2}>Algo salio mal</Text>
          <Text>{error}</Text>
        </Box>
      </Center>
    );
  }

  // TODO: Conectar cuando exista HU de rachas
  const mockStats = {
    currentStreak: "7 dias",
    avgTime: "125ms",
    bestStreak: "15 dias",
  };

  return (
    <Box maxW="7xl" mx="auto" p={{ base: 4, md: 8 }} mt={4}>
      <VStack align="stretch" gap={8}>
        <ProfileHeader
          name={user.name}
          lastname={user.lastname}
          email={user.email}
          cycle={user.cycle}
          xp={data?.xp ?? 0}
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
            value={data?.stats.completedCount || 0}
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
          <ProfileLanguageChart byLanguage={data?.stats.byLanguage || []} />
          <ProfileRecentActivity recentActivity={data?.recentActivity || []} />
        </Grid>

        <ProfileAchievements
          achievements={achievements}
          userAchievements={userAchievements}
        />
      </VStack>
    </Box>
  );
};