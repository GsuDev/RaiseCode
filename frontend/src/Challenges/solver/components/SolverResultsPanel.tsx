import { Box, Text, VStack, HStack, Spinner } from '@chakra-ui/react';
import { CheckCircle2, XCircle, Terminal } from 'lucide-react';

export interface TestResult {
  id: number;
  description: string;
  passed: boolean;
  actual?: string;
  expected?: string;
}

interface Props {
  results: TestResult[] | null;
  output: string | null;
  isRunning: boolean;
}

export const SolverResultsPanel = ({ results, output, isRunning }: Props) => {
  return (
    <Box h="250px" bg="#0d0d0d" borderTopWidth="4px" borderColor="border" display="flex" flexDirection="column">
      <HStack bg="#1a1a1a" px="4" py="2" gap="2" borderBottomWidth="1px" borderColor="whiteAlpha.100">
        <Terminal size={14} color="#4ade80" />
        <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase">Consola de Salida</Text>
      </HStack>

      <Box flex="1" overflowY="auto" p="4" fontFamily="mono" fontSize="sm">
        {isRunning ? (
          <HStack gap="3" color="gray.400">
            <Spinner size="xs" />
            <Text>Ejecutando pruebas en el servidor...</Text>
          </HStack>
        ) : results ? (
          <VStack align="stretch" gap="3">
            {results.map((res) => (
              <Box key={res.id}>
                <HStack color={res.passed ? "green.400" : "red.400"} gap="2">
                  {res.passed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  <Text fontWeight="bold">{res.description}</Text>
                </HStack>
                {!res.passed && (
                  <VStack align="start" pl="6" gap="0" fontSize="xs" mt="1" color="gray.500">
                    <Text>Esperado: {res.expected}</Text>
                    <Text>Obtenido: {res.actual}</Text>
                  </VStack>
                )}
              </Box>
            ))}
          </VStack>
        ) : (
          <Text color="gray.600">{output || '> Pulsa "Ejecutar" para validar tu solución'}</Text>
        )}
      </Box>
    </Box>
  );
};