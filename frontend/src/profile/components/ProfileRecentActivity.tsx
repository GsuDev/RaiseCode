import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { Trophy, Target } from "lucide-react";

interface Activity {
  id: string;
  challengeTitle: string;
  languageName: string;
  time: string; 
  points: number;
}

interface Props {
  recentActivity: Activity[];
}

export const ProfileRecentActivity = ({ recentActivity }: Props) => {
  return (
    <Box bg="bg.panel" p={6} borderRadius="xl" border="1px solid" borderColor="border" h="full">
      
      {/* Título */}
      <Flex alignItems="center" gap={2} mb={6}>
        <Trophy size={20} color="var(--chakra-colors-brand-500)" />
        <Text fontSize="lg" fontWeight="bold" color="fg">
          Actividad Reciente
        </Text>
      </Flex>

      {/* Lista de actividades */}
      <VStack align="stretch" gap={3}>
        {recentActivity.slice(0, 4).map((activity) => (
          <Flex 
            key={activity.id} 
            p={3} 
            bg="bg.canvas"
            borderRadius="lg" 
            border="1px solid" 
            borderColor="border"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex alignItems="center" gap={4}>
              {/* Icono del reto completado */}
              <Flex 
                alignItems="center" 
                justifyContent="center" 
                h="10" 
                w="10" 
                borderRadius="md" 
                bg="rgba(72, 187, 120, 0.15)" 
                color="green.500"
              >
                <Target size={20} />
              </Flex>
              
              {/* Textos */}
              <Box>
                <Text fontSize="sm" fontWeight="semibold" color="fg" noOfLines={1}>
                  Completaste el reto '{activity.challengeTitle}'
                </Text>
                <Text fontSize="xs" color="fg.muted">
                  {activity.time}
                </Text>
              </Box>
            </Flex>

            {/* Badge de puntos */}
            <Box px={2} py={1} bg="rgba(72, 187, 120, 0.15)" color="green.500" borderRadius="md" fontSize="xs" fontWeight="bold">
              +{activity.points}
            </Box>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};