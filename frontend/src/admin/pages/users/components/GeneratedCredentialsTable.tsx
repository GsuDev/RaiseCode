import {
  Box,
  Button,
  HStack,
  Skeleton,
  Table,
  Text,
  VStack,
} from '@chakra-ui/react';
import { CheckIcon, CopyIcon, DownloadIcon } from 'lucide-react';
import { useState } from 'react';
import type { GeneratedUserCredentials } from '../service/adminUsers.service';

interface GeneratedCredentialsTableProps {
  credentials: GeneratedUserCredentials[];
  isLoading?: boolean;
  onDownloadCSV: () => void;
}

export const GeneratedCredentialsTable: React.FC<
  GeneratedCredentialsTableProps
> = ({ credentials, isLoading = false, onDownloadCSV }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = () => {
    const text = credentials.map((c) => `${c.username},${c.password}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (credentials.length === 0 && !isLoading) {
    return null;
  }

  return (
    <Box
      bg="bg.panel"
      borderRadius="md"
      p={6}
      borderWidth="1px"
      borderColor="border"
    >
      <VStack align="stretch" gap={4}>
        {/* Header */}
        <HStack justify="space-between" align="start">
          <VStack align="stretch" gap={1}>
            <Text fontSize="lg" fontWeight="600">
              Credenciales Generadas
            </Text>
            <Box
              bg="warning"
              color="warning.fg"
              borderRadius="md"
              px={3}
              py={2}
              fontSize="xs"
              display="flex"
              gap={2}
              alignItems="start"
            >
              <Box pt="1px">⚠️</Box>
              <Text>
                Las contraseñas solo se muestran una vez. Descarga el CSV
                antes de cerrar esta ventana.
              </Text>
            </Box>
          </VStack>

          <HStack gap={2}>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyAll}
            >
              {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
              {copied ? 'Copiado' : 'Copiar'}
            </Button>
            <Button
              size="sm"
              colorScheme="blue"
              onClick={onDownloadCSV}
            >
              <DownloadIcon size={16} />
              Descargar CSV
            </Button>
          </HStack>
        </HStack>

        {/* Table */}
        <Box overflowX="auto">
          <Table.Root striped colorPalette="gray">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>#</Table.ColumnHeader>
                <Table.ColumnHeader>Usuario</Table.ColumnHeader>
                <Table.ColumnHeader>Contraseña</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">Acciones</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <Table.Row key={idx}>
                    <Table.Cell>
                      <Skeleton height="20px" />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton height="20px" />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton height="20px" />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton height="20px" />
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                credentials.map((cred, idx) => (
                  <Table.Row key={idx}>
                    <Table.Cell fontWeight="500" fontSize="sm">
                      {idx + 1}
                    </Table.Cell>
                    <Table.Cell fontFamily="mono" fontSize="sm">
                      <HStack gap={2}>
                        <Text>{cred.username}</Text>
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() =>
                            navigator.clipboard.writeText(cred.username)
                          }
                        >
                          <CopyIcon size={14} />
                        </Button>
                      </HStack>
                    </Table.Cell>
                    <Table.Cell fontFamily="mono" fontSize="sm">
                      <HStack gap={2}>
                        <Text>{cred.password}</Text>
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() =>
                            navigator.clipboard.writeText(cred.password)
                          }
                        >
                          <CopyIcon size={14} />
                        </Button>
                      </HStack>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Button
                        size="xs"
                        colorScheme="blue"
                        onClick={() => {
                          const text = `${cred.username}\t${cred.password}`;
                          navigator.clipboard.writeText(text);
                        }}
                      >
                        Copiar fila
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Box>

        {/* Summary */}
        <Box
          bg="blue.50"
          borderRadius="md"
          px={3}
          py={2}
          fontSize="xs"
          color="blue.900"
        >
          Total de usuarios generados: <strong>{credentials.length}</strong>
        </Box>
      </VStack>
    </Box>
  );
};
