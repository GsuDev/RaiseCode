import { Box, Container, Spinner, Center, Text, SimpleGrid, VStack } from '@chakra-ui/react';
import { useChallengeDetail } from './hooks/useChallengeDetail';
import { ChallengeDetailHeader } from './components/ChallengeDetailHeader';
import { ChallengeStatCards } from './components/ChallengeStatCards';
import { ChallengeStatementPanel } from './components/ChallengeStatementPanel';
import { ChallengeExampleTests } from './components/ChallengeExampleTests';
import { ChallengeStartBar } from './components/ChallengeStartBar';

export const ChallengeDetailPage = () => {
  const { challenge, loading, error } = useChallengeDetail();

  if (loading) {
    return (
      <Center h="70vh">
        <Spinner size="xl" color="green.500" borderWidth="4px" />
      </Center>
    );
  }

  if (error || !challenge) {
    return (
      <Center h="70vh">
        <VStack gap="4">
          <Text color="red.500" fontSize="lg">
            {error || 'No se pudo encontrar el reto solicitado.'}
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box position="relative" minH="100vh" bg="bg.canvas">
      <Container maxW="7xl" py="8" pb="32">
        <VStack gap="8" align="stretch">

          {/* Cabecera con título y badges */}
          <ChallengeDetailHeader challenge={challenge} />

          {/* Tarjetas de estadísticas */}
          <ChallengeStatCards challenge={challenge} />

          {/* Grid principal: Enunciado (izquierda) y Tests (derecha) */}
          <SimpleGrid 
            columns={{ base: 1, lg: 3 }} 
            gap="8" 
            alignItems={{ lg: 'start' }}
          >
            <Box gridColumn={{ lg: 'span 2' }}>
              <ChallengeStatementPanel statement={challenge.statement} />
            </Box>
            <Box>
              {/* Pasamos los tests reales — solo los visibles (hidden=false) */}
              <ChallengeExampleTests tests={challenge.tests} />
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Barra fija inferior */}
      <ChallengeStartBar />
    </Box>
  );
};
