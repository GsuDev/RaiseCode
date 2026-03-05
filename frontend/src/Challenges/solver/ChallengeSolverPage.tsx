import { Box, Flex, Grid, GridItem } from '@chakra-ui/react';
import { useChallengeSolver } from './hooks/useChallengerSolver';

export const ChallengeSolverPage = () => {
  const { code, setCode, language, isRunning, runCode, output } = useChallengeSolver();

  return (
    <Box h="calc(100vh - 64px)" overflow="hidden" bg="bg.canvas">
      <Grid
        templateColumns={{ base: '1fr', lg: '1fr 1.2fr' }}
        h="full"
        gap="0"
      >
        {/* Panel Izquierdo: Enunciado y Tests (Scroll independiente) */}
        <GridItem 
          borderRightWidth="1px" 
          borderColor="border" 
          overflowY="auto"
          p="6"
          bg="bg.panel"
        >
          {/* Aquí irán los componentes de enunciado que ya creamos */}
          <Box color="fg.muted">Cargando enunciado del reto...</Box>
        </GridItem>

        {/* Panel Derecho: Editor y Consola */}
        <GridItem h="full" display="flex" flexDirection="column">
          <Flex flex="1" direction="column" bg="#1e1e1e" position="relative">
            {/* Aquí insertaremos el Monaco Editor */}
            <Box p="10" color="white" fontFamily="mono">
              [ ÁREA DEL EDITOR MONACO ]
            </Box>
          </Flex>

          {/* Consola de salida inferior */}
          <Box 
            h="200px" 
            borderTopWidth="4px" 
            borderColor="border" 
            bg="black" 
            p="4"
            color="green.400"
            fontFamily="mono"
            fontSize="sm"
          >
            <Box mb="2" color="gray.500" fontSize="xs" fontWeight="bold">CONSOLA DE SALIDA</Box>
            {output || '> Esperando ejecución...'}
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};