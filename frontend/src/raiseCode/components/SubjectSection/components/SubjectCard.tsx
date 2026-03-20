import { Badge, Box, Button, Card, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { Subject } from '../types';

interface Props {
  subject: Subject;
}

const CYCLE_COLORS: Record<string, { color: string; border: string; bg: string }> = {
  DAW:  { color: '#f59e0b', border: 'rgba(245,158,11,0.3)',  bg: 'rgba(245,158,11,0.08)' },
  DAM:  { color: '#22c55e', border: 'rgba(34,197,94,0.3)',   bg: 'rgba(34,197,94,0.08)'  },
  ASIR: { color: '#06b6d4', border: 'rgba(6,182,212,0.3)',   bg: 'rgba(6,182,212,0.08)'  },
};

export const SubjectCard = ({ subject }: Props) => {
  const navigate = useNavigate();
  const primaryCourse = subject.courses[0]?.name ?? '';
  const palette = CYCLE_COLORS[primaryCourse] ?? { color: 'var(--chakra-colors-brand-500)', border: 'rgba(34,177,87,0.3)', bg: 'rgba(34,177,87,0.08)' };

  return (
    <Card.Root
      bg="bg.panel"
      borderWidth="2px"
      borderColor={palette.border}
      borderRadius="xl"
      overflow="hidden"
      cursor="pointer"
      _hover={{ borderColor: palette.color, transform: 'translateY(-4px)', shadow: 'xl' }}
      transition="all 0.3s ease"
      onClick={() => navigate(`/asignaturas/${subject.id}`)}
    >
      <Card.Body p="6">
        <VStack align="start" gap="4">
          <Flex justify="space-between" w="full" align="center">
            <Box p="2.5" borderRadius="lg" bg={palette.bg} color={palette.color}>
              <BookOpen size={22} />
            </Box>
            <HStack gap="1">
              {subject.courses.map((c) => (
                <Badge key={c.id} borderRadius="full" px="3" size="sm" bg={CYCLE_COLORS[c.name]?.color ?? palette.color} color="white">
                  {c.name}
                </Badge>
              ))}
            </HStack>
          </Flex>

          <VStack align="start" gap="1" flex="1">
            <Text fontWeight="bold" fontSize="md" color="fg" letterSpacing="tight">
              {subject.name}
            </Text>
            <Text fontSize="sm" color="fg.muted" lineClamp={2}>
              {subject.description || 'Sin descripción'}
            </Text>
          </VStack>

          <Flex justify="space-between" w="full" align="center">
            <Text fontSize="sm" color="fg.muted">
              <Text as="span" fontWeight="bold" color="fg">{subject.challengeCount}</Text>{' '}
              {subject.challengeCount === 1 ? 'reto' : 'retos'}
            </Text>
            <Button size="xs" variant="ghost" color={palette.color} px="0" _hover={{ bg: 'transparent', opacity: 0.8 }}>
              Ver retos <ArrowRight size={14} />
            </Button>
          </Flex>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
