import { Box, HStack, Spinner, Text, VStack } from '@chakra-ui/react';
import { CheckCircle2, Terminal, XCircle } from 'lucide-react';
import type { ExecutionResult, ExecutionStatus } from '../hooks/useExecution';

interface Props {
  status: ExecutionStatus;
  result: ExecutionResult | null;
  error: string | null;
}

/**
 * Panel inferior del editor de código.
 * Muestra el estado de la ejecución y los resultados de los tests.
 */
export const SolverResultsPanel = ({ status, result, error }: Props) => {
  return (
    <Box
      h="250px"
      bg="#0d0d0d"
      borderTopWidth="4px"
      borderColor="border"
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      <HStack
        bg="#1a1a1a"
        px="4"
        py="2"
        gap="2"
        borderBottomWidth="1px"
        borderColor="whiteAlpha.100"
      >
        <Terminal size={14} color="#4ade80" />
        <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase">
          Consola de Salida
        </Text>
        {result && (
          <Text
            ml="auto"
            fontSize="xs"
            fontWeight="bold"
            color={result.score === 100 ? 'green.400' : 'red.400'}
          >
            {result.tests_passed} / {result.tests_total} tests pasados
          </Text>
        )}
      </HStack>

      {/* Contenido */}
      <Box flex="1" overflowY="auto" p="4" fontFamily="mono" fontSize="sm">

        {/* Idle */}
        {status === 'idle' && (
          <Text color="gray.600">&gt; Pulsa &quot;Ejecutar&quot; para validar tu solución</Text>
        )}

        {/* Running */}
        {status === 'running' && (
          <HStack gap="3" color="gray.400">
            <Spinner size="xs" />
            <Text>Ejecutando código en el servidor...</Text>
          </HStack>
        )}

        {/* Error */}
        {status === 'error' && (
          <VStack align="start" gap="1">
            <Text color="red.400" fontWeight="bold">Error en la ejecución</Text>
            {error && <Text color="gray.500" fontSize="xs">{error}</Text>}
          </VStack>
        )}

        {/* Done */}
        {status === 'done' && result && (
          <VStack align="stretch" gap="3">
            {result.test_results.map((res) => (
              <Box key={res.test_number}>
                <HStack color={res.passed ? 'green.400' : 'red.400'} gap="2">
                  {res.passed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  <Text fontWeight="bold">Test {res.test_number}</Text>
                </HStack>

                {/* Si el test falló y NO es hidden, mostrar expected/actual */}
                {!res.passed && !res.hidden && (
                  <VStack align="start" pl="6" gap="0" fontSize="xs" mt="1" color="gray.500">
                    <Text>Esperado: {res.expected}</Text>
                    <Text>Obtenido: {res.actual}</Text>
                  </VStack>
                )}

                {/* Si falló y es hidden, solo decir que falló */}
                {!res.passed && res.hidden && (
                  <Text pl="6" fontSize="xs" mt="1" color="gray.500">
                    Test oculto — output incorrecto
                  </Text>
                )}
              </Box>
            ))}

            {/* stderr si hay error de ejecución */}
            {result.stderr && (
              <Box mt="2">
                <Text color="red.300" fontSize="xs" fontWeight="bold">stderr:</Text>
                <Text color="gray.500" fontSize="xs" whiteSpace="pre-wrap">{result.stderr}</Text>
              </Box>
            )}
          </VStack>
        )}
      </Box>
    </Box>
  );
};
