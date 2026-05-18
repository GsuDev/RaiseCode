import { Badge, Button, Card, Flex, Text, VStack } from '@chakra-ui/react';
import { Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { SubjectChallenge } from '../../../components/SubjectSection/types';

interface Props {
  challenge: SubjectChallenge;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy:   'green',
  Medium: 'orange',
  Hard:   'red',
};

export const SubjectChallengeCard = ({ challenge }: Props) => {
  const navigate = useNavigate();
  const colorPalette = DIFFICULTY_COLORS[challenge.dificulty.name] ?? 'gray';

  return (
    <Card.Root bg="bg.panel" borderWidth="1px" borderColor="bg.subtle" borderRadius="xl" overflow="hidden"
      _hover={{ borderColor: 'brand.500', transform: 'translateY(-2px)', shadow: 'md' }}
      transition="all 0.2s ease"
    >
      <Card.Body p="5">
        <VStack align="stretch" gap="3">
          <Flex justify="space-between" align="center">
            <Flex gap="2" align="center">
              <Badge colorPalette={colorPalette} variant="solid" borderRadius="full" px="2" size="sm">
                {challenge.dificulty.name}
              </Badge>
              <Text fontSize="xs" color="fg.muted">{challenge.language.name}</Text>
            </Flex>
            <Flex align="center" gap="1" color="fg.muted" fontSize="xs">
              <Users size={12} />
              <Text>{challenge.completedCount}</Text>
            </Flex>
          </Flex>

          <VStack align="start" gap="1">
            <Text fontWeight="bold" fontSize="md" color="fg">{challenge.title}</Text>
            <Text fontSize="sm" color="fg.muted" lineClamp={2}>{challenge.description}</Text>
          </VStack>

          <Button
            size="sm"
            variant="outline"
            borderColor="brand.500"
            color="brand.500"
            w="full"
            _hover={{ bg: 'primary.muted' }}
            onClick={() => navigate(`/retos/${challenge.id}`)}
          >
            Ver reto <ArrowRight size={14} />
          </Button>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
