import { Badge, Box, Card, Flex, Text, VStack } from '@chakra-ui/react';
import { BookOpen } from 'lucide-react'; 

export interface Subject {
  id: string;
  title: string;
  cycle: 'DAW' | 'DAM' | 'ASIR';
  challenges: number;
}

interface Props {
  subject: Subject;
}

export const SubjectCard = ({ subject }: Props) => {
  const cycleColors = {
    DAW: 'blue',
    DAM: 'purple',
    ASIR: 'orange',
  };

  return (
    <Card.Root 
      bg="bg.panel" 
      borderWidth="1px"
      borderColor="bg.subtle" 
      borderRadius="xl"
      overflow="hidden"
      _hover={{ borderColor: 'brand.500', transform: 'translateY(-4px)', shadow: 'xl' }} 
      transition="all 0.3s ease"
    >
      <Card.Body p="6">
        <VStack align="start" gap="5">
          <Flex justify="space-between" w="full" align="center">
            <Box 
              p="2.5" 
              borderRadius="lg" 
              bg={`${cycleColors[subject.cycle]}.500/10`} 
              color={`${cycleColors[subject.cycle]}.500`}
            >
              {/* Icono de libro abierto */}
              <BookOpen size={22} />
            </Box>
            <Badge 
              colorPalette={cycleColors[subject.cycle]} 
              variant="solid" 
              borderRadius="full" 
              px="3"
              size="sm"
            >
              {subject.cycle}
            </Badge>
          </Flex>

          <VStack align="start" gap="1">
            <Text fontWeight="bold" fontSize="xl" color="fg" letterSpacing="tight">
              {subject.title}
            </Text>
            <Text fontSize="sm" color="fg.muted">
              {subject.challenges} {subject.challenges === 1 ? 'reto disponible' : 'retos disponibles'}
            </Text>
          </VStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};