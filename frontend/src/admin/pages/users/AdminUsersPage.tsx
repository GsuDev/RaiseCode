
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
import { useState } from 'react';

interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  cycle: string;
  roles: string[];
}

export const AdminUsersPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const users: User[] = []
    
    const getRoleColor = (role: string) => {
        const colors: Record<string, string> = {
        ADMIN: 'red',
        USER: 'blue',
        };
        return colors[role] || 'gray';
    };

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
                Gestión de Usuarios
            </Text>
            <Text fontSize="sm" color="fg.muted">
                Administra los usuarios del sistema
            </Text>
            </VStack>
            <Button colorScheme="brand" gap={2}>
            <Plus size={18} />
            Nuevo Usuario
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
                    Apellidos
                </Table.ColumnHeader>
                <Table.ColumnHeader color="fg" fontWeight="600">
                    Correo
                </Table.ColumnHeader>
                <Table.ColumnHeader color="fg" fontWeight="600">
                    Curso
                </Table.ColumnHeader>
                <Table.ColumnHeader color="fg" fontWeight="600">
                    Rol
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
                {isLoading || users.length === 0
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
                    </Table.Row>
                    ))
                : users.map((user) => (
                    <Table.Row key={user.id} _hover={{ bg: 'bg.subtle' }}>
                        <Table.Cell color="fg">{user.name}</Table.Cell>
                        <Table.Cell color="fg">{user.lastname}</Table.Cell>
                        <Table.Cell color="fg.muted" fontSize="sm">
                        {user.email}
                        </Table.Cell>
                        <Table.Cell color="fg">{user.cycle}</Table.Cell>
                        <Table.Cell>
                        <HStack gap={1}>
                            {user.roles.map((role) => (
                            <Badge
                                key={role}
                                colorScheme={getRoleColor(role)}
                                variant="solid"
                                textTransform="capitalize"
                            >
                                {role}
                            </Badge>
                            ))}
                        </HStack>
                        </Table.Cell>
                        <Table.Cell>
                        <HStack gap={2} justify="center">
                            <IconButton
                            aria-label="Editar"
                            variant="ghost"
                            colorScheme="blue"
                            size="sm"
                            onClick={() => handleEdit(user.id)}
                            >
                            <Edit2 size={16} />
                            </IconButton>
                            <IconButton
                            aria-label="Eliminar"
                            variant="ghost"
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
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