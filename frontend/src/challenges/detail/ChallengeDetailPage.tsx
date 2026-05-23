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
    <Box display="flex" flexDirection="column" h="calc(100vh - 64px)" bg="bg.canvas">
      {/* Área scrollable */}
      <Box flex="1" overflowY="auto">
        <Container maxW="7xl" py="8">
          <VStack gap="8" align="stretch">
            <ChallengeDetailHeader challenge={challenge} />
            <ChallengeStatCards challenge={challenge} />
            <SimpleGrid
              columns={{ base: 1, lg: 3 }}
              gap="8"
              alignItems={{ lg: 'start' }}
            >
              <Box gridColumn={{ lg: 'span 2' }}>
                <ChallengeStatementPanel statement={challenge.statement} />
              </Box>
              <Box>
                <ChallengeExampleTests tests={challenge.tests} />
              </Box>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Footer fijo */}
      <ChallengeStartBar />
    </Box>
  );
};
