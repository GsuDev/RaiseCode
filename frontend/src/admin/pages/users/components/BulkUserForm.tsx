import {
  Box,
  Button,
  HStack,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';

interface BulkUserFormProps {
  onSubmit: (prefix: string, count: number) => void;
  isLoading?: boolean;
}

export const BulkUserForm: React.FC<BulkUserFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [prefix, setPrefix] = useState('');
  const [count, setCount] = useState(5);
  const [errors, setErrors] = useState<{ prefix?: string; count?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { prefix?: string; count?: string } = {};

    if (!prefix.trim()) {
      newErrors.prefix = 'El prefijo es requerido';
    } else if (prefix.length < 3) {
      newErrors.prefix = 'El prefijo debe tener al menos 3 caracteres';
    } else if (/\s/.test(prefix)) {
      newErrors.prefix = 'El prefijo no puede contener espacios';
    }

    if (count < 1) {
      newErrors.count = 'Mínimo 1 usuario';
    } else if (count > 50) {
      newErrors.count = 'Máximo 50 usuarios';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(prefix, count);
      setPrefix('');
      setCount(5);
      setErrors({});
    }
  };

  const handlePrefixChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrefix(e.target.value);
    if (errors.prefix) {
      setErrors({ ...errors, prefix: undefined });
    }
  };

  const handleCountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setCount(Math.min(Math.max(value, 1), 50));
    if (errors.count) {
      setErrors({ ...errors, count: undefined });
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      bg="bg.panel"
      borderRadius="md"
      p={6}
      borderWidth="1px"
      borderColor="border"
    >
      <VStack align="stretch" gap={6}>
        <Box>
          <Text fontSize="lg" fontWeight="600" mb={2}>
            Generar Lote de Usuarios
          </Text>
          <Text fontSize="sm" color="fg.subtle">
            Crea múltiples usuarios genéricos con credenciales auto-generadas
          </Text>
        </Box>

        <SimpleGrid columns={2} gap={4}>
          <VStack align="stretch" gap={1}>
            <Text fontSize="sm" fontWeight="500">
              Prefijo *
            </Text>
            <Input
              placeholder="ej: alumno, curso01"
              value={prefix}
              onChange={handlePrefixChange}
              type="text"
              disabled={isLoading}
              maxLength={20}
              borderColor={errors.prefix ? 'red.500' : 'border'}
            />
            {errors.prefix && (
              <Text fontSize="xs" color="red.600">
                {errors.prefix}
              </Text>
            )}
          </VStack>

          <VStack align="stretch" gap={1}>
            <Text fontSize="sm" fontWeight="500">
              Cantidad *
            </Text>
            <Input
              placeholder="1-50"
              value={count}
              onChange={handleCountChange}
              type="number"
              disabled={isLoading}
              min="1"
              max="50"
              borderColor={errors.count ? 'red.500' : 'border'}
            />
            {errors.count && (
              <Text fontSize="xs" color="red.600">
                {errors.count}
              </Text>
            )}
          </VStack>
        </SimpleGrid>

        <HStack justify="flex-end" gap={3}>
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            colorScheme="blue"
            disabled={isLoading}
            loading={isLoading}
          >
            {isLoading ? 'Generando...' : 'Generar Lote'}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};
