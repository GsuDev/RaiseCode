import { Box, Button, Flex, HStack, Text, Textarea, VStack } from '@chakra-ui/react';
import { Code2, ArrowLeft, ArrowRight } from 'lucide-react';
import type { ChallengeFormState } from '../types';

interface Props {
  form: ChallengeFormState;
  updateField: <K extends keyof ChallengeFormState>(field: K, value: ChallengeFormState[K]) => void;
  onBack: () => void;
  onNext: () => void;
}

const STATEMENT_PLACEHOLDER = `## Título del problema

Descripción detallada del problema a resolver...

### Ejemplo

\`\`\`javascript
miFunction([1, 2, 3])
// returns "resultado esperado"
\`\`\`

### Notas
- Nota 1
- Nota 2`;

/**
 * Paso 2 — Enunciado completo del reto en formato Markdown.
 * Este campo se envía al backend como `statement`.
 */
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
      <Box p="6" flex="1">
        <Text mb="2" fontSize="sm" fontWeight="medium" color="fg">
          Enunciado Completo
        </Text>
        <Textarea
          value={form.statement}
          onChange={(e) => updateField('statement', e.target.value)}
          placeholder={STATEMENT_PLACEHOLDER}
          fontFamily="mono"
          fontSize="sm"
          rows={18}
          bg="bg.subtle"
          border="1px solid"
          borderColor="border"
          color="fg"
          resize="vertical"
          _placeholder={{ color: 'fg.muted', opacity: 0.5 }}
          _focus={{ borderColor: 'brand.500', outline: 'none' }}
        />
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
