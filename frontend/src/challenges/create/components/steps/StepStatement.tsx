import { Box, Button, Center, Flex, HStack, Spinner, Text, VStack } from '@chakra-ui/react';
import { Code2, ArrowLeft, ArrowRight } from 'lucide-react';
import Editor from '@monaco-editor/react';
import type { ChallengeFormState } from '../types';

interface Props {
  form: ChallengeFormState;
  updateField: <K extends keyof ChallengeFormState>(field: K, value: ChallengeFormState[K]) => void;
  onBack: () => void;
  onNext: () => void;
}

export const StepStatement = ({ form, updateField, onBack, onNext }: Props) => {
  const valid = form.statement.trim().length > 0;

  return (
    <VStack gap="0" align="stretch" h="full">
      {/* Cabecera */}
      <Box p="6" borderBottom="1px solid" borderColor="border">
        <HStack gap="2" mb="1">
          <Code2 size={18} color="var(--chakra-colors-brand-500)" />
          <Text fontWeight="bold" fontSize="lg">Enunciado del Reto</Text>
        </HStack>
        <Text fontSize="sm" color="fg.muted">
          Escribe el enunciado completo con ejemplos y notas. Soporta formato Markdown.
        </Text>
      </Box>

      {/* Editor */}
      <Box px="12" py="4" flex="1">
      <Box bg="#1e1e1e" borderRadius="lg" overflow="hidden">
        <Editor
          height="420px"
          language="markdown"
          theme="vs-dark"
          value={form.statement}
          onChange={(val) => updateField('statement', val ?? '')}
          loading={
            <Center h="full" bg="#1e1e1e">
              <Spinner color="green.500" />
            </Center>
          }
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            automaticLayout: true,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            lineNumbers: 'off',
            fixedOverflowWidgets: true,
          }}
        />
      </Box>
      </Box>

      {/* Footer */}
      <Flex p="6" justify="space-between" borderTop="1px solid" borderColor="border">
        <Button variant="outline" borderColor="border" color="fg" onClick={onBack}>
          <ArrowLeft size={16} />
          Anterior
        </Button>
        <Button
          bg="brand.500"
          color="white"
          _hover={{ bg: 'brand.600' }}
          disabled={!valid}
          onClick={onNext}
        >
          Siguiente: Tests
          <ArrowRight size={16} />
        </Button>
      </Flex>
    </VStack>
  );
};
