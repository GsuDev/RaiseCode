import { Box, Grid, Text, VStack } from "@chakra-ui/react";
import { ProfileStatCard } from "./components/ProfileStatCard";
import { Flame, Target, Clock, TrendingUp } from "lucide-react";

export const ProfilePage = () => {
  // Uso datos mockeados para comprobar como se ve, en el futuro se cambiaran por datos reales
  const mockStats = {
    completedCount: 45,
    currentStreak: "7 dias",
    avgTime: "125ms",
    bestStreak: "15 dias",
  };
  return (
    <Box maxW="7xl" mx="auto" p={{ base: 4, md: 8 }} mt={4}>
      <VStack align="stretch" gap={8}>
        {/* Título temporal de la sección */}
        <Text fontSize="2xl" fontWeight="bold" color="fg" textAlign="center">
          Mi Perfil
        </Text>

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
      </VStack>
    </Box>
  );
};
