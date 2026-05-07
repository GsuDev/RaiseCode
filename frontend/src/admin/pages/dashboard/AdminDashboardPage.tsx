import { useState, useEffect } from 'react';
import { Grid, VStack } from '@chakra-ui/react';
import { Award, Zap, CheckCircle, Stars } from 'lucide-react';
import {
  StatCard,
  InfoCard,
  ActivityChart,
  DashboardHeader,
} from './components';

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
    username: string;
    xp: number;
  };
  activityLast7Days: Array<{
    date: string;
    completions: number;
  }>;
}

export const AdminDashboardPage = () => {
  // Hay que realizar un service y un hook para esto, pero por ahora lo dejo hardcodeado
  const [dashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <VStack gap={8} align="stretch">
      {/* Título */}
      <DashboardHeader />

      {/* Estadísticas principales */}
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
        gap={4}
      >
        <StatCard
          label="Total de Usuarios"
          value={dashboard?.totalUsers ?? 0}
          icon={Award}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard
          label="Total de Retos"
          value={dashboard?.totalChallenges ?? 0}
          icon={Zap}
          color="brand"
          isLoading={isLoading}
        />
        <StatCard
          label="Retos Pendientes"
          value={dashboard?.pendingChallenges ?? 0}
          icon={CheckCircle}
          color="yellow"
          isLoading={isLoading}
        />
        <StatCard
          label="Completaciones"
          value={dashboard?.totalCompletions ?? 0}
          icon={Stars}
          color="green"
          isLoading={isLoading}
        />
      </Grid>

      {/* Información destacada */}
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
        gap={4}
      >
        <InfoCard
          title="Reto Más Popular"
          items={[
            {
              label: 'Título',
              value: dashboard?.topChallenge.title ?? 'N/A',
              highlight: true,
            },
            {
              label: 'Completaciones',
              value: dashboard?.topChallenge.completedCount ?? 0,
            },
          ]}
          icon={Award}
          isLoading={isLoading}
        />
        <InfoCard
          title="Usuario Top"
          items={[
            {
              label: 'Usuario',
              value: dashboard?.topUser.username ?? 'N/A',
              highlight: true,
            },
            {
              label: 'XP',
              value: dashboard?.topUser.xp ?? 0,
            },
          ]}
          icon={Stars}
          isLoading={isLoading}
        />
      </Grid>

      {/* Actividad últimos 7 días */}
      <ActivityChart
        data={dashboard?.activityLast7Days}
        isLoading={isLoading}
      />
    </VStack>
  );
};