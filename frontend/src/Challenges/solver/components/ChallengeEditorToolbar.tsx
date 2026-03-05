import { Button, Flex, HStack, Text, Box } from '@chakra-ui/react';
import { Play, RotateCcw } from 'lucide-react';

interface Props {
  onRun: () => void;
  isRunning: boolean;
  language: string;
}

export const ChallengeEditorToolbar = ({ onRun, isRunning, language }: Props) => {
  return (
    <Flex 
      bg="bg.panel" 
      borderBottomWidth="1px" 
      borderColor="border" 
      px="4" 
      py="2" 
      justify="space-between" 
      align="center"
    >
      <HStack gap="4">
        <Text fontSize="xs" fontWeight="bold" color="fg.muted" textTransform="uppercase">
          Lenguaje: <Text as="span" color="green.500">{language}</Text>
        </Text>
      </HStack>

      <HStack gap="2">
        <Button variant="ghost" size="sm">
          <Box as="span" display="inline-flex" mr="2">
            <RotateCcw size={14} />
          </Box>
          Reiniciar
        </Button>

        <Button 
          colorPalette="green" 
          size="sm" 
          onClick={onRun}
          disabled={isRunning}
        >
          <Box as="span" display="inline-flex" mr="2">
            <Play size={14} fill="currentColor" />
          </Box>
          {isRunning ? 'Ejecutando...' : 'Ejecutar'}
        </Button>
      </HStack>
    </Flex>
  );
};