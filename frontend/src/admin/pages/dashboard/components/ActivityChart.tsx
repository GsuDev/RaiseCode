import { Box, HStack, VStack, Text, Skeleton } from '@chakra-ui/react';
import { TrendingUp } from 'lucide-react';

interface ActivityData {
  date: string;
  completions: number;
}

interface ActivityChartProps {
  data?: ActivityData[];
  isLoading?: boolean;
}

export const ActivityChart = ({ data = [], isLoading = false }: ActivityChartProps) => {
  return (
    <Box
      bg="bg.panel"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="border"
      p={6}
    >
      <HStack gap={4} align="flex-start" mb={6}>
        <TrendingUp size={24} />
        <Text fontSize="lg" fontWeight="bold" color="fg">
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
          : data.map((day, idx) => {
              const maxCompletions = Math.max(
                ...data.map((d) => d.completions),
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
  );
};
