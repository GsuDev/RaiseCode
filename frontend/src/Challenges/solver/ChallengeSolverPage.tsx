import { Box, Center, Grid, GridItem, Spinner, Text, VStack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useChallengeSolver } from './hooks/useChallengeSolver';
import { useExecution } from './hooks/useExecution';
import { ChallengeCodeEditor } from './components/ChallengeCodeEditor';
import { ChallengeEditorToolbar } from './components/ChallengeEditorToolbar';
import { ChallengeStatementPanel } from '../detail/components/ChallengeStatementPanel';
import { SolverResultsPanel } from './components/SolverResultsPanel';
import { SolverTestsPanel } from './components/SolverTestsPanel';
import { ChallengeSuccessModal } from './components/ChallengeSuccessModal';

export const ChallengeSolverPage = () => {
  const { challenge, loading, code, setCode } = useChallengeSolver();
  const { submit, status, result, error } = useExecution();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (result?.status === 'accepted') setShowSuccess(true);
  }, [result]);

  if (loading) {
    return (
      <Center h="calc(100vh - 64px)">
        <Spinner size="xl" color="green.500" />
      </Center>
    );
  }

  if (!challenge) {
    return (
      <Center h="calc(100vh - 64px)">
        <VStack gap="4">
          <Text color="red.500" fontSize="lg">No se pudo cargar el reto.</Text>
        </VStack>
      </Center>
    );
  }

  const handleRun = () => {
    submit(challenge.id, code);
  };

  return (
    <Box h="calc(100vh - 64px)" overflow="hidden" bg="bg.canvas">
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1.2fr' }} h="full">

        {/* PANEL IZQUIERDO: Enunciado y ejemplos */}
        <GridItem borderRightWidth="1px" borderColor="border" overflowY="auto" p="6" bg="bg.panel">
          <VStack align="stretch" gap="6">
            <Text fontSize="2xl" fontWeight="bold">{challenge.title}</Text>
            <ChallengeStatementPanel statement={challenge.statement} />
            {/* Tests públicos reales del reto */}
            <SolverTestsPanel tests={challenge.tests} />
          </VStack>
        </GridItem>

        {/* PANEL DERECHO: Editor y consola */}
        <GridItem h="full" display="flex" flexDirection="column">
          <ChallengeEditorToolbar
            onRun={handleRun}
            isRunning={status === 'running'}
            language={challenge.language.name.toLowerCase()}
          />

          <Box flex="1" position="relative">
            <ChallengeCodeEditor
              code={code}
              language={challenge.language.name.toLowerCase()}
              onChange={(val) => setCode(val || '')}
            />
          </Box>

          <SolverResultsPanel
            status={status}
            result={result}
            error={error}
          />
        </GridItem>
      </Grid>

      <ChallengeSuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </Box>
  );
};
