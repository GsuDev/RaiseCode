import { useState, useEffect } from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Skeleton,
  Badge,
  Grid,
} from '@chakra-ui/react';
import { TrendingUp, Award, Zap, CheckCircle, Stars } from 'lucide-react';

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
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        setIsLoading(false);
    }, []);

    const StatCard = ({
        label,
        value,
        icon: Icon,
        color = 'brand',
    }: {
        label: string;
        value: string | number;
        icon: React.ComponentType<any>;
        color?: string;
    }) => (
        <Box
        bg="bg.panel"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="border"
        p={6}
        >
        <HStack gap={4} align="flex-start">
            <Box
            p={3}
            borderRadius="lg"
            bg={`${color}.50`}
            color={`${color}.500`}
            >
            <Icon size={24} />
            </Box>
            <VStack gap={1} align="flex-start" flex={1}>
            <Text fontSize="sm" color="fg.muted" fontWeight="500">
                {label}
            </Text>
            {isLoading ? (
                <Skeleton height="28px" width="80px" />
            ) : (
                <Text fontSize="2xl" fontWeight="bold" color="fg">
                {value}
                </Text>
            )}
            </VStack>
        </HStack>
        </Box>
    );

    const InfoCard = ({
        title,
        items,
        icon : Icon,
    }: {
        title: string;
        icon: React.ComponentType<any>;
        items: Array<{ label: string; value: string | number; highlight?: boolean }>;
    }) => (
        <Box
        bg="bg.panel"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="border"
        p={6}
        >
        <HStack gap={4} align="flex-start">
            <Icon size={24} />
            <Text fontSize="lg" fontWeight="bold" color="fg" mb={4}>
                {title}
            </Text>
        </HStack>
        <VStack gap={3} align="stretch">
            {items.map((item, idx) => (
            <HStack key={idx} justify="space-between" gap={2}>
                <Text fontSize="sm" color="fg.muted">
                {item.label}
                </Text>
                {isLoading ? (
                <Skeleton height="20px" width="60px" />
                ) : (
                <Badge
                    colorScheme={item.highlight ? 'brand' : 'gray'}
                    variant={item.highlight ? 'solid' : 'subtle'}
                >
                    {item.value}
                </Badge>
                )}
            </HStack>
            ))}
        </VStack>
        </Box>
    );

    return (
        <VStack gap={8} align="stretch">
        {/* Título */}
        <VStack gap={2} align="flex-start">
            <Text fontSize="2xl" fontWeight="bold" color="fg">
            Panel de Administración
            </Text>
            <Text fontSize="sm" color="fg.muted">
            Resumen de la plataforma y validación de retos
            </Text>
        </VStack>

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
            />
            <StatCard
            label="Total de Retos"
            value={dashboard?.totalChallenges ?? 0}
            icon={Zap}
            color="brand"
            />
            <StatCard
            label="Retos Pendientes"
            value={dashboard?.pendingChallenges ?? 0}
            icon={CheckCircle}
            color="yellow"
            />
            <StatCard
            label="Completaciones"
            value={dashboard?.totalCompletions ?? 0}
            icon={TrendingUp}
            color="green"
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
            />
        </Grid>

        {/* Actividad últimos 7 días */}
        <Box
            bg="bg.panel"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="border"
            p={6}
        >
            <HStack gap={4} align="flex-start">
                <TrendingUp size={24} />
                <Text fontSize="lg" fontWeight="bold" color="fg" mb={4}>
                Actividad Últimos 7 Días
                </Text>
            </HStack>
            <HStack gap={2} align="flex-end" justify="center" minH="120px">
            {isLoading
                ? Array.from({ length: 7 }).map((_, i) => (
                    <VStack key={i} gap={2} align="center" flex={1}>
                    <Skeleton height="60px" width="100%" />
                    </VStack>
                ))
                : dashboard?.activityLast7Days.map((day, idx) => {
                    const maxCompletions = Math.max(
                    ...dashboard.activityLast7Days.map((d) => d.completions),
                    1
                    );
                    const height = (day.completions / maxCompletions) * 100;
                    return (
                    <VStack key={idx} gap={1} align="center" flex={1}>
                        <Box
                        bg="brand.500"
                        borderRadius="md"
                        width="100%"
                        height={`${Math.max(height, 20)}px`}
                        transition="all 0.3s"
                        _hover={{ opacity: 0.8 }}
                        title={`${day.completions} completaciones`}
                        />
                        <Text fontSize="xs" color="fg.muted">
                        {new Date(day.date).toLocaleDateString('es', {
                            weekday: 'short',
                        })}
                        </Text>
                    </VStack>
                    );
                })}
            </HStack>
        </Box>
        </VStack>
    );
};