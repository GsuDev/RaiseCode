import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  HStack,
  VStack,
  Text,
  Table,
  Skeleton,
  Badge,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { Edit2, Trash2, Plus } from 'lucide-react';

interface Challenge {
  id: number;
  title: string;
  difficulty: string;
  language: string;
  subject: string;
  creator: string;
  validator: string | null;
  validated: boolean;
}

export const AdminChallengesPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const challenges: Challenge[] = []

   const handleEdit = (id: number) => {
        throw new Error('Function not implemented.');
    }

    const handleDelete = (id: number) => {
        throw new Error('Function not implemented.');
    }

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: 'green',
      medium: 'orange',
      hard: 'red',
    };
    return colors[difficulty.toLowerCase()] || 'gray';
  };

  return (
    <VStack gap={6} align="stretch">
      {/* Header */}
      <Flex justify="space-between" align="center">
        <VStack gap={1} align="flex-start">
          <Text fontSize="2xl" fontWeight="bold" color="fg">
            Gestión de Retos
          </Text>
          <Text fontSize="sm" color="fg.muted">
            Administra los retos del sistema
          </Text>
        </VStack>
        <Button colorScheme="brand" gap={2}>
          <Plus size={18} />
          Nuevo Reto
        </Button>
      </Flex>

      {/* Tabla */}
      <Box
        bg="bg.panel"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="border"
        overflow="hidden"
      >
        <Table.Root size="md" variant="line">
          <Table.Header bg="bg.subtle">
            <Table.Row>
              <Table.ColumnHeader color="fg" fontWeight="600">
                Título
              </Table.ColumnHeader>
              <Table.ColumnHeader color="fg" fontWeight="600">
                Dificultad
              </Table.ColumnHeader>
              <Table.ColumnHeader color="fg" fontWeight="600">
                Lenguaje
              </Table.ColumnHeader>
              <Table.ColumnHeader color="fg" fontWeight="600">
                Asignatura
              </Table.ColumnHeader>
              <Table.ColumnHeader color="fg" fontWeight="600">
                Creador
              </Table.ColumnHeader>
              <Table.ColumnHeader color="fg" fontWeight="600">
                Validador
              </Table.ColumnHeader>
              <Table.ColumnHeader color="fg" fontWeight="600">
                Validado
              </Table.ColumnHeader>
              <Table.ColumnHeader
                color="fg"
                fontWeight="600"
                textAlign="center"
              >
                Acciones
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {isLoading || challenges.length === 0
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Table.Row key={i}>
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
              : challenges.map((challenge) => (
                  <Table.Row key={challenge.id} _hover={{ bg: 'bg.subtle' }}>
                    <Table.Cell color="fg" fontWeight="500">
                      {challenge.title}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        colorScheme={getDifficultyColor(challenge.difficulty)}
                        variant="solid"
                        textTransform="capitalize"
                      >
                        {challenge.difficulty}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell color="fg">{challenge.language}</Table.Cell>
                    <Table.Cell color="fg">{challenge.subject}</Table.Cell>
                    <Table.Cell color="fg.muted" fontSize="sm">
                      {challenge.creator}
                    </Table.Cell>
                    <Table.Cell color="fg.muted" fontSize="sm">
                      {challenge.validator || '-'}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        colorScheme={challenge.validated ? 'green' : 'gray'}
                        variant="subtle"
                      >
                        {challenge.validated ? 'Sí' : 'No'}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <HStack gap={2} justify="center">
                        <IconButton
                          aria-label="Editar"
                          variant="ghost"
                          colorScheme="blue"
                          size="sm"
                          onClick={() => handleEdit(challenge.id)}
                        >
                          <Edit2 size={16} />
                        </IconButton>
                        <IconButton
                          aria-label="Eliminar"
                          variant="ghost"
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleDelete(challenge.id)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </VStack>
  );
};