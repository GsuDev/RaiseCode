import { Box, Grid, GridItem, Spinner, Center, VStack, Text } from '@chakra-ui/react';
import { useChallengeSolver } from './hooks/useChallengerSolver';
import { ChallengeCodeEditor } from './components/ChallengeCodeEditor';
import { ChallengeEditorToolbar } from './components/ChallengeEditorToolbar';
import { ChallengeStatementPanel } from '../detail/components/ChallengeStatementPanel';

export const ChallengeSolverPage = () => {
  const { challenge, loading, code, setCode, isRunning, runCode, output } = useChallengeSolver();

  if (loading) {
    return (
      <Center h="calc(100vh - 64px)">
        <Spinner size="xl" color="green.500" borderWidth="4px" />
      </Center>
    );
  }

  return (
    <Box h="calc(100vh - 64px)" overflow="hidden" bg="bg.canvas">
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1.2fr' }} h="full">
        {/* Panel Izquierdo: Enunciado Real */}
        <GridItem borderRightWidth="1px" borderColor="border" overflowY="auto" p="6" bg="bg.panel">
          <VStack align="stretch" gap="6">
            <Text fontSize="2xl" fontWeight="bold">{challenge?.title}</Text>
            <ChallengeStatementPanel statement={challenge?.statement || ''} />
          </VStack>
        </GridItem>

        {/* Panel Derecho: Editor */}
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

          <Box h="200px" borderTopWidth="4px" borderColor="border" bg="black" p="4" color="green.400" fontFamily="mono">
             <Text color="gray.500" fontSize="xs" mb="2" fontWeight="bold">CONSOLA DE SALIDA</Text>
             <Box whiteSpace="pre-wrap">{output || '> Esperando ejecución...'}</Box>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};