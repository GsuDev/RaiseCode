import { Box, Card, Heading, HStack, Text, VStack } from '@chakra-ui/react';

const MOCK_TESTS = [
  { input: '[1, 2, 3, 4, 5, 6, 7, 8, 9, 0]', expected: '"(123) 456-7890"' },
  { input: '[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]', expected: '"(111) 111-1111"' },
  { input: '[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]', expected: '"(000) 000-0000"' },
];

export const ChallengeExampleTests = () => {
  return (
    <Card.Root bg="bg.panel" borderWidth="1px" borderColor="bg.subtle" borderRadius="xl">
      <Card.Header>
        <Heading size="md">⭐ Tests de Ejemplo</Heading>
      </Card.Header>
      <Card.Body>
        <VStack align="stretch" gap="4">
          {MOCK_TESTS.map((test, index) => (
            <Box 
              key={index} 
              p="3" 
              bg="bg.canvas" 
              borderRadius="md" 
              borderWidth="1px" 
              borderColor="bg.subtle"
            >
              <VStack align="start" gap="1">
                <HStack>
                  <Text fontWeight="bold" fontSize="xs" color="fg.muted">INPUT:</Text>
                  <Text fontFamily="mono" fontSize="sm">{test.input}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" fontSize="xs" color="fg.muted">EXPECTED:</Text>
                  <Text fontFamily="mono" fontSize="sm" color="green.500">{test.expected}</Text>
                </HStack>
              </VStack>
            </Box>
          ))}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};