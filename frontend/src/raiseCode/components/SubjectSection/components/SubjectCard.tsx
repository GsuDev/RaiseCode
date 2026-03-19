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

const CYCLE_COLORS: Record<string, { color: string; border: string; bg: string }> = {
  DAW:  { color: '#f59e0b', border: 'rgba(245,158,11,0.3)',  bg: 'rgba(245,158,11,0.08)' },
  DAM:  { color: '#22c55e', border: 'rgba(34,197,94,0.3)',   bg: 'rgba(34,197,94,0.08)'  },
  ASIR: { color: '#06b6d4', border: 'rgba(6,182,212,0.3)',   bg: 'rgba(6,182,212,0.08)'  },
};

export const SubjectCard = ({ subject }: Props) => {
  const palette = CYCLE_COLORS[subject.cycle];

  return (
    <Card.Root
      bg="bg.panel"
      borderWidth="2px"
      borderColor={palette.border}
      borderRadius="xl"
      overflow="hidden"
      _hover={{ borderColor: palette.color, transform: 'translateY(-4px)', shadow: 'xl' }}
      transition="all 0.3s ease"
    >
      <Card.Body p="6">
        <VStack align="start" gap="5">
          <Flex justify="space-between" w="full" align="center">
            <Box
              p="2.5"
              borderRadius="lg"
              bg={palette.bg}
              color={palette.color}
            >
              <BookOpen size={22} />
            </Box>
            <Badge
              borderRadius="full"
              px="3"
              size="sm"
              bg={palette.color}
              color="white"
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