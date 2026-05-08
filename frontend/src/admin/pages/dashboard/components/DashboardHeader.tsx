import { VStack, Text } from '@chakra-ui/react';

export const DashboardHeader = () => (
  <VStack gap={2} align="flex-start">
    <Text fontSize="2xl" fontWeight="bold" color="fg">
      Panel de Administración
    </Text>
    <Text fontSize="sm" color="fg.muted">
      Resumen de la plataforma y validación de retos
    </Text>
  </VStack>
);
