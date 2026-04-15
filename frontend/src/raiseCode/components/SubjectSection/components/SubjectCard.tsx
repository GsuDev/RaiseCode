import { Badge, Box, Button, Card, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { Subject } from '../types';

interface Props {
  subject: Subject;
}

const CYCLE_COLORS: Record<string, { color: string; border: string; bg: string }> = {
  DAW:  { color: '#f59e0b', border: 'rgba(245,158,11,0.6)',  bg: 'rgba(245,158,11,0.1)' },
  DAM:  { color: '#22c55e', border: 'rgba(34,197,94,0.6)',   bg: 'rgba(34,197,94,0.1)'  },
  ASIR: { color: '#06b6d4', border: 'rgba(6,182,212,0.6)',   bg: 'rgba(6,182,212,0.1)'  },
};

export const SubjectCard = ({ subject }: Props) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const primaryCourse = subject.courses[0]?.name ?? '';
  const palette = CYCLE_COLORS[primaryCourse] ?? { color: 'var(--chakra-colors-brand-500)', border: 'rgba(34,177,87,0.6)', bg: 'rgba(34,177,87,0.1)' };

  const isMulti = subject.courses.length > 1;
  const cycleColors = subject.courses.map(c => CYCLE_COLORS[c.name]?.color ?? palette.color);
  const gradientBorder = `linear-gradient(135deg, ${cycleColors.join(', ')})`;
  const gradientBg = `linear-gradient(135deg, ${subject.courses.map(c => CYCLE_COLORS[c.name]?.bg ?? palette.bg).join(', ')})`;

  if (isMulti) {
    return (
      <Box
        position="relative"
        borderRadius="xl"
        cursor="pointer"
        onClick={() => navigate(`/asignaturas/${subject.id}`)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        transform={hovered ? 'translateY(-4px)' : 'translateY(0)'}
        shadow={hovered ? 'xl' : 'none'}
        transition="all 0.3s ease"
      >
        {/* Gradient border layer */}
        <Box
          position="absolute"
          inset="0"
          borderRadius="xl"
          background={gradientBorder}
          opacity={hovered ? 1 : 0.55}
          transition="opacity 0.3s ease"
          pointerEvents="none"
        />

        {/* Card content inset by 2px */}
        <Box position="relative" m="2px" borderRadius="xl" overflow="hidden">
          <Card.Root bg="bg.panel" borderWidth="0" borderRadius="xl" overflow="hidden">
            <Card.Body p="6">
              <VStack align="start" gap="4">
                <Flex justify="space-between" w="full" align="center">
                  <Box p="2.5" borderRadius="lg" bg={gradientBg} color={palette.color}>
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
        </Box>
      </Box>
    );
  }

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
