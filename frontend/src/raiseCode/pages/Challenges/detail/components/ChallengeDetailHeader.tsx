import { Badge, Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ChallengeDetail } from '../services/challengeDetail.service';

interface Props {
  challenge: ChallengeDetail;
}

export const ChallengeDetailHeader = ({ challenge }: Props) => {
  const navigate = useNavigate();

  const difficultyColors = {
    Easy: 'green',
    Medium: 'orange',
    Hard: 'red',
  };

  return (
    <VStack align="start" gap="4" w="full">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate(-1)}
      >
        <Box as="span" display="inline-flex" mr="2">
          <ArrowLeft size={16} />
        </Box>
        Volver
      </Button>

      <HStack gap="3" wrap="wrap">
        <Badge colorPalette="blue" variant="subtle">{challenge.subject.name}</Badge>
        <Badge colorPalette="purple" variant="subtle">{challenge.language.name}</Badge>
        <Badge 
          colorPalette={difficultyColors[challenge.dificulty.name]} 
          variant="solid"
        >
          {challenge.dificulty.name}
        </Badge>
      </HStack>

      <VStack align="start" gap="1">
        <Heading size="4xl" fontWeight="bold">
          {challenge.title}
        </Heading>
        <Text color="fg.muted">
          Creado por <Text as="span" fontWeight="semibold">{challenge.creatorName}</Text>
        </Text>
      </VStack>
    </VStack>
  );
};