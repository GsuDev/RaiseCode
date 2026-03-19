import { Box, HStack, Text, VStack, Heading } from '@chakra-ui/react';
import type { ChallengeTest } from '../../detail/services/challengeDetail.service';

interface Props {
  tests?: ChallengeTest[];
}

export const SolverTestsPanel = ({ tests }: Props) => {
  const visibleTests = tests?.filter((t) => !t.hidden) ?? [];

  if (visibleTests.length === 0) {
    return (
      <VStack align="stretch" gap="4" mt="8">
        <Heading size="xs" textTransform="uppercase" color="fg.muted" letterSpacing="wider">
          Ejemplos de Prueba
        </Heading>
        <Text fontSize="sm" color="fg.muted">
          No hay tests de ejemplo públicos para este reto.
        </Text>
      </VStack>
    );
  }

  return (
    <VStack align="stretch" gap="4" mt="8">
      <Heading size="xs" textTransform="uppercase" color="fg.muted" letterSpacing="wider">
        Ejemplos de Prueba
      </Heading>
      {visibleTests.map((test, i) => (
        <Box
          key={test.id}
          bg="bg.subtle"
          p="3"
          borderRadius="md"
          borderLeftWidth="3px"
          borderColor="blue.500"
        >
          <VStack align="stretch" gap="2" fontFamily="mono" fontSize="xs">
            <VStack align="stretch" gap="0.5">
              <Text color="blue.400" fontWeight="bold">Test {i + 1} — Input:</Text>
              <Text color="fg" wordBreak="break-all">{test.input}</Text>
            </VStack>
            <VStack align="stretch" gap="0.5">
              <Text color="green.400" fontWeight="bold">Output esperado:</Text>
              <Text color="fg" wordBreak="break-all">{test.expectedOutput}</Text>
            </VStack>
          </VStack>
        </Box>
      ))}
    </VStack>
  );
};
