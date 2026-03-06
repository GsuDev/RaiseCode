import { Box, Flex, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { Trophy, Users, Timer } from 'lucide-react';
import {  type ChallengeDetail } from '../services/challengeDetail.service';

interface Props {
  challenge: ChallengeDetail;
}

export const ChallengeStatCards = ({ challenge }: Props) => {
  const stats = [
    {
      label: 'Puntos',
      value: '+100',
      description: 'Gana puntos al resolverlo',
      icon: Trophy,
      color: 'yellow.500',
    },
    {
      label: 'Completados',
      value: challenge.completedCount,
      description: 'Usuarios que lo lograron',
      icon: Users,
      color: 'blue.500',
    },
    {
      label: 'Intentos totales',
      value: '234', 
      description: 'Participación global',
      icon: Timer,
      color: 'purple.500',
    },
  ];

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} gap="4" w="full">
      {stats.map((stat) => (
        <Flex
          key={stat.label}
          bg="bg.panel"
          p="5"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="bg.subtle"
          align="center"
          gap="4"
        >
          <Box p="3" borderRadius="lg" bg={`${stat.color}/10`} color={stat.color}>
            <stat.icon size={24} />
          </Box>
          <VStack align="start" gap="0">
            <Text fontSize="2xl" fontWeight="bold" color="fg">
              {stat.value}
            </Text>
            <Text fontSize="sm" color="fg.muted">
              {stat.label}
            </Text>
          </VStack>
        </Flex>
      ))}
    </SimpleGrid>
  );
};