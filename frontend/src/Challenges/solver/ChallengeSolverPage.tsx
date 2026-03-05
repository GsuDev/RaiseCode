import { Box, Grid, GridItem, Spinner, Center, VStack, Text } from '@chakra-ui/react';
import { useChallengeSolver } from './hooks/useChallengeSolver';
import { ChallengeCodeEditor } from './components/ChallengeCodeEditor';
import { ChallengeEditorToolbar } from './components/ChallengeEditorToolbar';
import { ChallengeStatementPanel } from '../detail/components/ChallengeStatementPanel';
import { SolverResultsPanel } from './components/SolverResultsPanel';
import { SolverTestsPanel } from './components/SolverTestsPanel';

export const ChallengeSolverPage = () => {
  const { challenge, loading, code, setCode, isRunning, runCode, results, output } = useChallengeSolver();

  if (loading) {
    return (
      <Center h="calc(100vh - 64px)">
        <Spinner size="xl" color="green.500" />
      </Center>
    );
  }

  return (
    <Box h="calc(100vh - 64px)" overflow="hidden" bg="bg.canvas">
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1.2fr' }} h="full">
        
        {/* PANEL IZQUIERDO: Información y Ejemplos */}
        <GridItem borderRightWidth="1px" borderColor="border" overflowY="auto" p="6" bg="bg.panel">
          <VStack align="stretch" gap="6">
            <Text fontSize="2xl" fontWeight="bold">{challenge?.title}</Text>
            <ChallengeStatementPanel statement={challenge?.statement || ''} />
            <SolverTestsPanel />
          </VStack>
        </GridItem>

        {/* PANEL DERECHO: Editor y Consola */}
        <GridItem h="full" display="flex" flexDirection="column">
          <ChallengeEditorToolbar 
            onRun={runCode} 
            isRunning={isRunning} 
            language={challenge?.language.name.toLowerCase() || 'javascript'} 
          />
          
          <Box flex="1" position="relative">
            <ChallengeCodeEditor 
              code={code} 
              language={challenge?.language.name.toLowerCase() || 'javascript'} 
              onChange={(val) => setCode(val || '')} 
            />
          </Box>

          {/* Nuestra nueva consola profesional */}
          <SolverResultsPanel 
            results={results} 
            output={output} 
            isRunning={isRunning} 
          />
        </GridItem>
      </Grid>
    </Box>
  );
};