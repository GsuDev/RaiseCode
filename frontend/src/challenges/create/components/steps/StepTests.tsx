import {
  Box, Button, Flex, Grid, HStack, IconButton, Input, Text, VStack,
} from '@chakra-ui/react';
import { FlaskConical, Plus, Trash2, ArrowLeft, Eye, Send } from 'lucide-react';
import type { ChallengeFormState, TestCase } from '../types';

interface Props {
  form: ChallengeFormState;
  updateField: <K extends keyof ChallengeFormState>(field: K, value: ChallengeFormState[K]) => void;
  onBack: () => void;
  onPreview: () => void;
  onSubmit: () => void;
  submitLoading: boolean;
}

const isStep3Valid = (tests: TestCase[]) =>
  tests.length > 0 && tests.every((t) => t.input.trim() !== '' && t.expectedOutput.trim() !== '');

/**
 * Paso 3 — Tests de validación del reto.
 * Los tests son mock en esta HU: se guardan en estado local para
 * mostrarse en la vista previa pero NO se envían al backend
 * (no existe tabla de tests en el schema aún).
 * TODO: conectar con backend cuando exista el endpoint de tests.
 */
export const StepTests = ({ form, updateField, onBack, onPreview, onSubmit, submitLoading }: Props) => {
  const tests = form.tests;

  const addTest = () => {
    updateField('tests', [
      ...tests,
      { id: crypto.randomUUID(), input: '', expectedOutput: '' },
    ]);
  };

  const removeTest = (id: string) => {
    if (tests.length <= 1) return;
    updateField('tests', tests.filter((t) => t.id !== id));
  };

  const updateTest = (id: string, field: 'input' | 'expectedOutput', value: string) => {
    updateField(
      'tests',
      tests.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const valid = isStep3Valid(tests);

  return (
    <VStack gap="0" align="stretch" h="full">
      {/* Cabecera */}
      <Box p="6" borderBottom="1px solid" borderColor="border">
        <HStack gap="2" mb="1">
          <FlaskConical size={18} color="var(--chakra-colors-brand-500)" />
          <Text fontWeight="bold" fontSize="lg">Tests de Validación</Text>
        </HStack>
        <Text fontSize="sm" color="fg.muted">
          Define los tests que validarán las soluciones de los usuarios. Mínimo 1 test requerido.
        </Text>
      </Box>

      {/* Lista de tests */}
      <VStack gap="4" p="6" flex="1" align="stretch" overflowY="auto">
        {tests.map((test, index) => (
          <Box
            key={test.id}
            p="4"
            borderRadius="lg"
            border="1px solid"
            borderColor="border"
            bg="bg.subtle"
          >
            {/* Header del test */}
            <Flex justify="space-between" align="center" mb="3">
              <Text fontWeight="semibold" fontSize="sm">
                Test {index + 1}
              </Text>
              <IconButton
                aria-label="Eliminar test"
                variant="ghost"
                color="red.400"
                size="sm"
                disabled={tests.length <= 1}
                onClick={() => removeTest(test.id)}
                _hover={{ bg: 'bg.panel', color: 'red.500' }}
              >
                <Trash2 size={14} />
              </IconButton>
            </Flex>

            {/* Campos input / output */}
            <Grid templateColumns="1fr 1fr" gap="3">
              <Box>
                <Text mb="1" fontSize="xs" color="fg.muted">
                  Input
                </Text>
                <Input
                  value={test.input}
                  onChange={(e) => updateTest(test.id, 'input', e.target.value)}
                  placeholder='Ej: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]'
                  fontFamily="mono"
                  fontSize="sm"
                  bg="bg.panel"
                  border="1px solid"
                  borderColor="border"
                  color="fg"
                  _placeholder={{ color: 'fg.muted' }}
                  _focus={{ borderColor: 'brand.500', outline: 'none' }}
                />
              </Box>
              <Box>
                <Text mb="1" fontSize="xs" color="fg.muted">
                  Output Esperado
                </Text>
                <Input
                  value={test.expectedOutput}
                  onChange={(e) => updateTest(test.id, 'expectedOutput', e.target.value)}
                  placeholder='Ej: "(123) 456-7890"'
                  fontFamily="mono"
                  fontSize="sm"
                  bg="bg.panel"
                  border="1px solid"
                  borderColor="border"
                  color="fg"
                  _placeholder={{ color: 'fg.muted' }}
                  _focus={{ borderColor: 'brand.500', outline: 'none' }}
                />
              </Box>
            </Grid>
          </Box>
        ))}

        {/* Añadir test */}
        <Button
          variant="outline"
          borderColor="border"
          borderStyle="dashed"
          color="fg.muted"
          w="full"
          onClick={addTest}
          _hover={{ borderColor: 'brand.500', color: 'brand.500' }}
        >
          <Plus size={16} />
          Añadir Test
        </Button>
      </VStack>

      {/* Footer */}
      <Flex p="6" justify="space-between" align="center" borderTop="1px solid" borderColor="border">
        <Button variant="outline" borderColor="border" color="fg" onClick={onBack}>
          <ArrowLeft size={16} />
          Anterior
        </Button>
        <HStack gap="3">
          <Button variant="outline" borderColor="border" color="fg" onClick={onPreview}>
            <Eye size={16} />
            Vista Previa
          </Button>
          <Button
            bg="brand.500"
            color="white"
            _hover={{ bg: 'brand.600' }}
            disabled={!valid}
            loading={submitLoading}
            loadingText="Publicando..."
            onClick={onSubmit}
          >
            <Send size={16} />
            Publicar Reto
          </Button>
        </HStack>
      </Flex>
    </VStack>
  );
};
