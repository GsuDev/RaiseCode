import { Box, Card, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import type { ChallengeTest } from '../services/challengeDetail.service';

interface Props {
  tests?: ChallengeTest[];
}

export const ChallengeExampleTests = ({ tests }: Props) => {
  const visibleTests = tests?.filter((t) => !t.hidden) ?? [];

  if (visibleTests.length === 0) {
    return (
      <Card.Root bg="bg.panel" borderWidth="1px" borderColor="bg.subtle" borderRadius="xl">
        <Card.Header>
          <Heading size="md">⭐ Tests de Ejemplo</Heading>
        </Card.Header>
        <Card.Body>
          <Text color="fg.muted" fontSize="sm">
            Este reto no tiene tests de ejemplo públicos.
          </Text>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root bg="bg.panel" borderWidth="1px" borderColor="bg.subtle" borderRadius="xl">
      <Card.Header>
        <Heading size="md">⭐ Tests de Ejemplo</Heading>
      </Card.Header>
      <Card.Body>
        <VStack align="stretch" gap="4">
          {visibleTests.map((test, index) => (
            <Box
              key={test.id}
              p="3"
              bg="bg.canvas"
              borderRadius="md"
              borderWidth="1px"
              borderColor="bg.subtle"
              overflow="hidden"
              minW="0"
            >
              <VStack align="start" gap="1" w="full" minW="0">
                <Text fontWeight="bold" fontSize="xs" color="fg.muted">
                  Test {index + 1}
                </Text>
                <VStack align="start" gap="0" w="full" minW="0">
                  <Text fontWeight="bold" fontSize="xs" color="fg.muted">INPUT:</Text>
                  <Text fontFamily="mono" fontSize="sm" w="full" overflowWrap="break-word" wordBreak="break-all">{test.input}</Text>
                </VStack>
                <VStack align="start" gap="0" w="full" minW="0">
                  <Text fontWeight="bold" fontSize="xs" color="fg.muted">EXPECTED:</Text>
                  <Text fontFamily="mono" fontSize="sm" color="green.500" w="full" overflowWrap="break-word" wordBreak="break-all">{test.expectedOutput}</Text>
                </VStack>
              </VStack>
            </Box>
          ))}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
