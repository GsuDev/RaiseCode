import { Box, Button, Flex, Grid, HStack, Input, Text, Textarea, VStack } from '@chakra-ui/react';
import { FileText, ArrowRight } from 'lucide-react';
import type { ChallengeFormState, SelectOption } from '../types';

interface Props {
  form: ChallengeFormState;
  updateField: <K extends keyof ChallengeFormState>(field: K, value: ChallengeFormState[K]) => void;
  languages: SelectOption[];
  subjects: SelectOption[];
  difficulties: SelectOption[];
  optionsLoading: boolean;
  onNext: () => void;
}

const isStep1Valid = (form: ChallengeFormState) =>
  form.title.trim() !== '' &&
  form.description.trim() !== '' &&
  form.languageId !== null &&
  form.subjectId !== null &&
  form.dificultyId !== null;

const SelectField = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  label: string;
  value: number | null;
  onChange: (v: number) => void;
  options: SelectOption[];
  placeholder: string;
  disabled: boolean;
}) => (
  <Box>
    <Text mb="2" fontSize="sm" fontWeight="medium" color="fg">
      {label}
    </Text>
    <Box
      as="select"
      w="full"
      h="10"
      px="3"
      borderRadius="md"
      bg="bg.subtle"
      border="1px solid"
      borderColor="border"
      color={value ? 'fg' : 'fg.muted'}
      value={value ?? ''}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(Number(e.target.value))}
      disabled={disabled}
      _focus={{ borderColor: 'brand.500', outline: 'none' }}
    >
      <option value="">{disabled ? 'Cargando...' : placeholder}</option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.name}
        </option>
      ))}
    </Box>
  </Box>
);

/**
 * Paso 1 — Información básica del reto.
 * Recoge título, descripción breve, lenguaje, asignatura y dificultad.
 * Los puntos son un campo visual mock (no existe en el schema).
 */
export const StepBasicInfo = ({
  form, updateField, languages, subjects, difficulties, optionsLoading, onNext,
}: Props) => {
  const valid = isStep1Valid(form);

  return (
    <VStack gap="0" align="stretch" h="full">
      {/* Cabecera del panel */}
      <Box p="6" borderBottom="1px solid" borderColor="border">
        <HStack gap="2" mb="1">
          <FileText size={18} color="var(--chakra-colors-brand-500)" />
          <Text fontWeight="bold" fontSize="lg">Información Básica</Text>
        </HStack>
        <Text fontSize="sm" color="fg.muted">
          Define el título, descripción y categorización del reto.
        </Text>
      </Box>

      {/* Campos */}
      <VStack gap="5" p="6" flex="1" align="stretch">
        {/* Título */}
        <Box>
          <Text mb="2" fontSize="sm" fontWeight="medium" color="fg">
            Título del Reto
          </Text>
          <Input
            placeholder="Ej: Crear número de teléfono"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            bg="bg.subtle"
            border="1px solid"
            borderColor="border"
            color="fg"
            _placeholder={{ color: 'fg.muted' }}
            _focus={{ borderColor: 'brand.500', outline: 'none' }}
          />
        </Box>

        {/* Descripción breve */}
        <Box>
          <Text mb="2" fontSize="sm" fontWeight="medium" color="fg">
            Descripción Breve
          </Text>
          <Textarea
            placeholder="Una descripción corta que aparecerá en las tarjetas de preview..."
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
            bg="bg.subtle"
            border="1px solid"
            borderColor="border"
            color="fg"
            resize="none"
            _placeholder={{ color: 'fg.muted' }}
            _focus={{ borderColor: 'brand.500', outline: 'none' }}
          />
        </Box>

        {/* Lenguaje + Asignatura */}
        <Grid templateColumns="1fr 1fr" gap="4">
          <SelectField
            label="Lenguaje de Programación"
            value={form.languageId}
            onChange={(v) => updateField('languageId', v)}
            options={languages}
            placeholder="Selecciona un lenguaje"
            disabled={optionsLoading}
          />
          <SelectField
            label="Asignatura"
            value={form.subjectId}
            onChange={(v) => updateField('subjectId', v)}
            options={subjects}
            placeholder="Selecciona una asignatura"
            disabled={optionsLoading}
          />
        </Grid>

        {/* Dificultad + Puntos (mock) */}
        <Grid templateColumns="1fr 1fr" gap="4">
          <SelectField
            label="Dificultad"
            value={form.dificultyId}
            onChange={(v) => updateField('dificultyId', v)}
            options={difficulties}
            placeholder="Selecciona dificultad"
            disabled={optionsLoading}
          />
          <Box>
            <Text mb="2" fontSize="sm" fontWeight="medium" color="fg">
              Puntos{' '}
              <Text as="span" fontSize="xs" color="fg.muted">
                (visual)
              </Text>
            </Text>
            <Input
              type="number"
              defaultValue={100}
              bg="bg.subtle"
              border="1px solid"
              borderColor="border"
              color="fg"
              _focus={{ borderColor: 'brand.500', outline: 'none' }}
              // TODO: conectar con campo real cuando exista en el schema
            />
          </Box>
        </Grid>
      </VStack>

      {/* Footer */}
      <Flex p="6" justify="flex-end" borderTop="1px solid" borderColor="border">
        <Button
          bg="brand.500"
          color="white"
          _hover={{ bg: 'brand.600' }}
          disabled={!valid}
          onClick={onNext}
        >
          Siguiente: Enunciado
          <ArrowRight size={16} />
        </Button>
      </Flex>
    </VStack>
  );
};
