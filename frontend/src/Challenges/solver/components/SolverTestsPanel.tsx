import { Box, Text, VStack, Heading } from '@chakra-ui/react';

export const SolverTestsPanel = () => {
  // Estos datos en el futuro se extraerán del reto real
  const examples = [
    { input: "[1, 2, 3, 4, 5, 6, 7, 8, 9, 0]", output: '"(123) 456-7890"' },
    { input: "[5, 5, 5, 1, 2, 3, 4, 5, 6, 7]", output: '"(555) 123-4567"' }
  ];

  return (
    <VStack align="stretch" gap="4" mt="8">
      <Heading size="xs" textTransform="uppercase" color="fg.muted" letterSpacing="wider">
        Ejemplos de Prueba
      </Heading>
      {examples.map((ex, i) => (
        <Box key={i} bg="bg.subtle" p="3" borderRadius="md" borderLeftWidth="3px" borderColor="blue.500">
          <VStack align="stretch" gap="1" fontFamily="mono" fontSize="xs">
            <HStack justifyContent="space-between">
              <Text color="blue.400" fontWeight="bold">Input:</Text>
              <Text color="fg">{ex.input}</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text color="green.400" fontWeight="bold">Output:</Text>
              <Text color="fg">{ex.output}</Text>
            </HStack>
          </VStack>
        </Box>
      ))}
    </VStack>
  );
};

import { HStack } from '@chakra-ui/react';