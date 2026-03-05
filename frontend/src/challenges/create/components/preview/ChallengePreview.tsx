import {
  Box, Button, Flex, HStack, Modal, ModalBody, ModalContent,
  ModalHeader, ModalOverlay, Text, VStack, Badge,
} from '@chakra-ui/react';
import { Eye, X, Send } from 'lucide-react';
import type { ChallengeFormState, SelectOption } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: ChallengeFormState;
  languages: SelectOption[];
  subjects: SelectOption[];
  difficulties: SelectOption[];
  submitLoading: boolean;
}

const findName = (options: SelectOption[], id: number | null) =>
  options.find((o) => o.id === id)?.name ?? '—';

/**
 * Modal de vista previa antes de publicar el reto.
 * Muestra un resumen de todos los campos rellenados en los 3 pasos.
 */
export const ChallengePreview = ({
  isOpen, onClose, onSubmit, form,
  languages, subjects, difficulties, submitLoading,
}: Props) => {
  if (!isOpen) return null;

  return (
    <Box
      position="fixed" inset="0" zIndex="modal"
      bg="blackAlpha.700" backdropFilter="blur(4px)"
      display="flex" alignItems="center" justifyContent="center"
      p="4"
      onClick={onClose}
    >
      <Box
        bg="bg.panel" borderRadius="2xl" border="1px solid" borderColor="border"
        w="full" maxW="2xl" maxH="90vh" overflowY="auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <Flex p="5" align="center" justify="space-between" borderBottom="1px solid" borderColor="border">
          <HStack gap="2">
            <Eye size={18} color="var(--chakra-colors-brand-500)" />
            <Text fontWeight="bold" fontSize="lg">Vista Previa</Text>
          </HStack>
          <Button variant="ghost" size="sm" onClick={onClose} color="fg.muted">
            <X size={16} />
          </Button>
        </Flex>

        <VStack gap="5" p="6" align="stretch">
          {/* Título y badges */}
          <Box>
            <HStack gap="2" mb="3" flexWrap="wrap">
              <Box as="span" px="2" py="0.5" bg="bg.subtle" borderRadius="md" fontSize="xs" border="1px solid" borderColor="border">
                {findName(subjects, form.subjectId)}
              </Box>
              <Box as="span" px="2" py="0.5" bg="bg.subtle" borderRadius="md" fontSize="xs" border="1px solid" borderColor="border">
                {findName(languages, form.languageId)}
              </Box>
              <Box as="span" px="2" py="0.5" bg="brand.500" borderRadius="md" fontSize="xs" color="white">
                {findName(difficulties, form.dificultyId)}
              </Box>
            </HStack>
            <Text fontWeight="bold" fontSize="2xl">{form.title || '(Sin título)'}</Text>
            <Text color="fg.muted" mt="1">{form.description}</Text>
          </Box>

          {/* Enunciado */}
          <Box>
            <Text fontWeight="semibold" mb="2" fontSize="sm">Enunciado</Text>
            <Box
              p="4" bg="bg.subtle" borderRadius="lg" border="1px solid" borderColor="border"
              fontFamily="mono" fontSize="sm" whiteSpace="pre-wrap" color="fg"
              maxH="200px" overflowY="auto"
            >
              {form.statement || '(Sin enunciado)'}
            </Box>
          </Box>

          {/* Tests */}
          <Box>
            <Text fontWeight="semibold" mb="2" fontSize="sm">
              Tests de Validación ({form.tests.length})
            </Text>
            <VStack gap="2" align="stretch">
              {form.tests.map((t, i) => (
                <Flex
                  key={t.id} gap="3" p="3" bg="bg.subtle"
                  borderRadius="lg" border="1px solid" borderColor="border"
                  fontSize="xs" fontFamily="mono"
                >
                  <Box flex="1">
                    <Text color="fg.muted" mb="0.5">Input</Text>
                    <Text color="fg">{t.input || '—'}</Text>
                  </Box>
                  <Box flex="1">
                    <Text color="fg.muted" mb="0.5">Expected</Text>
                    <Text color="brand.500">{t.expectedOutput || '—'}</Text>
                  </Box>
                </Flex>
              ))}
            </VStack>
          </Box>
        </VStack>

        {/* Footer */}
        <Flex p="5" gap="3" justify="flex-end" borderTop="1px solid" borderColor="border">
          <Button variant="outline" borderColor="border" color="fg" onClick={onClose}>
            Cerrar
          </Button>
          <Button
            bg="brand.500" color="white" _hover={{ bg: 'brand.600' }}
            loading={submitLoading} loadingText="Publicando..."
            onClick={onSubmit}
          >
            <Send size={16} />
            Publicar Reto
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};
