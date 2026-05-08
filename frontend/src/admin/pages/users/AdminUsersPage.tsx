
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
  Tabs,
} from '@chakra-ui/react';
import { Edit2, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { adminUsersService } from './service/adminUsers.service';
import { CreateUserModal, EditUserModal } from './components';
import { BulkUserForm } from './components/BulkUserForm';
import { GeneratedCredentialsTable } from './components/GeneratedCredentialsTable';
import { useBulkUserCreation } from './hooks/useBulkUserCreation';
import { exportCredentialsCSV } from './utils/exportCredentialsCSV';

interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  course?: {
    name: string;
  };
  roles: string[];
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [error, setError] = useState<string | null>(null);

  // Definir loadUsers antes de usarlo en el hook
  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminUsersService.getUsers(pagination.page, pagination.limit);
      setUsers(response.data);
      
      // Lógica para corregir el bug del backend
      let correctedTotal = response.meta.total;
      
      // Si recibimos tantos usuarios como el limit, probablemente haya más
      // Sumamos al menos esos datos + 1 para indicar que hay más páginas
      if (response.data.length === response.meta.limit && response.meta.total <= response.data.length) {
        correctedTotal = (pagination.page * response.meta.limit) + 1;
      }
      
      // Si recibimos menos usuarios que el limit, estamos en la última página
      if (response.data.length < response.meta.limit) {
        correctedTotal = (pagination.page - 1) * response.meta.limit + response.data.length;
      }
      
      const totalPages = Math.ceil(correctedTotal / response.meta.limit);
      
      setPagination(prev => ({
        total: correctedTotal,
        page: pagination.page,
        limit: prev.limit,
        totalPages: totalPages,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const { credentials, isLoading: isBulkLoading, createBulkUsers } = useBulkUserCreation({
    onSuccess: loadUsers,
  });

  // Cargar usuarios cuando cambia la página
  useEffect(() => {
    loadUsers();
  }, [pagination.page, pagination.limit]);

  // Volver a la primera página cuando se generen usuarios en lote exitosamente
  useEffect(() => {
    if (credentials.length > 0 && pagination.page !== 1) {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, [credentials.length]);

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handlePreviousPage = () => {
    if (pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const getRoleColor = (role: string) => {
    const normalizedRole = role?.toUpperCase() || 'USER';
    const colors: Record<string, string> = {
      ADMIN: 'red',
      USER: 'blue',
    };
    return colors[normalizedRole] || 'gray';
  };

  const handleEdit = (id: number) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setSelectedUser(user);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminUsersService.deleteUser(id);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar usuario');
    }
  };

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
        <HStack gap={2}>
          <Button colorScheme="brand" gap={2} onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            Nuevo Usuario
          </Button>
        </HStack>
      </Flex>

      {/* Error message */}
      {error && (
        <Box bg="red.50" borderRadius="lg" p={4} borderWidth="1px" borderColor="red.200">
          <Text color="red.700">{error}</Text>
        </Box>
      )}

      {/* Bulk User Generation */}
      <Box>
        <BulkUserForm
          onSubmit={createBulkUsers}
          isLoading={isBulkLoading}
        />
      </Box>

      {/* Generated Credentials */}
      {credentials.length > 0 && (
        <GeneratedCredentialsTable
          credentials={credentials}
          onDownloadCSV={() => {
            const prefix = credentials[0].email.match(/^([a-z]+)/i)?.[1] || 'usuarios';
            exportCredentialsCSV(credentials, prefix);
          }}
        />
      )}

      {/* Tabla */}
      <Box
        bg="bg.panel"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="border"
        overflow={{ base: 'auto', md: 'hidden' }}
      >
        <Box overflowX={{ base: 'auto', md: 'visible' }}>
          <Table.Root size="md" variant="line" minW={{ base: '900px', md: 'auto' }}>
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
              ? Array.from({ length: pagination.limit }).map((_, i) => (
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
                    <Table.Cell color="fg">
                      {user.course?.name || 'N/A'}
                    </Table.Cell>
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
      </Box>

      {/* Paginación */}
      <VStack gap={4} align="center">
        <HStack gap={2} wrap="wrap" justify="center">
          <Text fontSize="sm" color="fg.muted">
            Mostrar
          </Text>
          <HStack gap={1}>
            {[5, 10, 15].map((limit) => (
              <Button
                key={limit}
                size="sm"
                variant={pagination.limit === limit ? 'solid' : 'outline'}
                colorScheme={pagination.limit === limit ? 'brand' : 'gray'}
                onClick={() => handleLimitChange(limit)}
              >
                {limit}
              </Button>
            ))}
          </HStack>
          <Text fontSize="sm" color="fg.muted">
            por página
          </Text>
        </HStack>

        <Text fontSize="sm" color="fg.muted" textAlign={{ base: 'center', md: 'left' }}>
          {isLoading
            ? 'Cargando...'
            : `${(pagination.page - 1) * pagination.limit + 1}-${Math.min(
                pagination.page * pagination.limit,
                pagination.total
              )} de ${pagination.total} usuarios`}
        </Text>

        <HStack gap={2} justify="center">
          <IconButton
            aria-label="Página anterior"
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={pagination.page === 1}
          >
            <ChevronLeft size={18} />
          </IconButton>
          <Text fontSize="sm" color="fg.muted" minW="120px" textAlign="center">
            Página {pagination.page} de {pagination.totalPages}
          </Text>
          <IconButton
            aria-label="Página siguiente"
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={pagination.page >= pagination.totalPages}
          >
            <ChevronRight size={18} />
          </IconButton>
        </HStack>
      </VStack>

      {/* Modal para crear usuario */}
      <CreateUserModal
        open={isModalOpen}
        onOpenChange={(state: { open: boolean }) => setIsModalOpen(state.open)}
        onSuccess={loadUsers}
      />

      {/* Modal para editar usuario */}
      <EditUserModal
        open={isEditModalOpen}
        onOpenChange={(state: { open: boolean }) => setIsEditModalOpen(state.open)}
        user={selectedUser}
        onSuccess={loadUsers}
      />
    </VStack>
  );
};