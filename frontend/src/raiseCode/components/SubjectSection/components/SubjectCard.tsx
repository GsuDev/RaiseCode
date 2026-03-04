import { Badge, Box, Card, Flex, Text, VStack } from '@chakra-ui/react';
import { Book } from 'lucide-react';

export interface Subject {
  id: string;
  title: string;
  cycle: 'DAW' | 'DAM' | 'ASIR';
  challenges: number;
}

interface Props {
  subject: Subject;
}

/**
 * Tarjeta individual para mostrar una asignatura.
 * Utiliza el sistema de diseño de Chakra v3.
 */
export const SubjectCard = ({ subject }: Props) => {
  const cycleColors = {
    DAW: 'blue',
    DAM: 'purple',
    ASIR: 'orange',
  };

  return (
    <Card.Root 
      variant="outline" 
      _hover={{ shadow: 'md', borderColor: 'brand.500' }} 
      transition="all 0.2s"
    >
      <Card.Body p="5">
        <Flex gap="4" align="center">
          {/* Icono/Color representativo */}
          <Box 
            p="3" 
            borderRadius="lg" 
            bg={`${cycleColors[subject.cycle]}.500`} 
            color="white"
          >
            <Book size={24} />
          </Box>

          <VStack align="start" gap="1" flex="1">
            <Badge colorPalette={cycleColors[subject.cycle]} variant="subtle">
              {subject.cycle}
            </Badge>
            <Text fontWeight="bold" fontSize="lg" lineHeight="tight" color="fg">
              {subject.title}
            </Text>
            <Text fontSize="sm" color="fg.muted">
              {subject.challenges} {subject.challenges === 1 ? 'reto disponible' : 'retos disponibles'}
            </Text>
          </VStack>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};