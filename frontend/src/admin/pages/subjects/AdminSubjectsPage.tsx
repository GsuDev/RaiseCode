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

interface Subject {
  id: number;
  name: string;
  studentCount: number;
}

export const AdminSubjectsPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const subjects: Subject[] = []

    const handleEdit = (id: number) => {
        throw new Error('Function not implemented.');
    }

    const handleDelete = (id: number) => {
        throw new Error('Function not implemented.');
    }
    

    return (
        <VStack gap={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
            <VStack gap={1} align="flex-start">
            <Text fontSize="2xl" fontWeight="bold" color="fg">
                Gestión de Asignaturas
            </Text>
            <Text fontSize="sm" color="fg.muted">
                Administra las asignaturas del sistema
            </Text>
            </VStack>
            <Button colorScheme="brand" gap={2}>
            <Plus size={18} />
            Nueva Asignatura
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
                    Nombre
                </Table.ColumnHeader>
                <Table.ColumnHeader color="fg" fontWeight="600">
                    Número de Alumnos
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
                {isLoading || subjects.length === 0
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
                    </Table.Row>
                    ))
                : subjects.map((subject) => (
                    <Table.Row key={subject.id} _hover={{ bg: 'bg.subtle' }}>
                        <Table.Cell color="fg">{subject.name}</Table.Cell>
                        <Table.Cell color="fg">
                        <Badge colorScheme="brand" variant="solid">
                            {subject.studentCount} estudiantes
                        </Badge>
                        </Table.Cell>
                        <Table.Cell>
                        <HStack gap={2} justify="center">
                            <IconButton
                            aria-label="Editar"
                            variant="ghost"
                            colorScheme="blue"
                            size="sm"
                            onClick={() => handleEdit(subject.id)}
                            >
                            <Edit2 size={16} />
                            </IconButton>
                            <IconButton
                            aria-label="Eliminar"
                            variant="ghost"
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleDelete(subject.id)}
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