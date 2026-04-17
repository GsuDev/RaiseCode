import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Skeleton,
  Table,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toaster } from '@/components/ui/toaster';
import { AdminSubject } from './services/adminSubjects.service';
import { SubjectFormModal } from './components/SubjectFormModal';
import { useAdminSubjects } from './hooks/useAdminSubjects';

interface DeleteConfirmProps {
  subject: AdminSubject;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmOverlay = ({ subject, onConfirm, onCancel }: DeleteConfirmProps) => (
  <Box
    position="fixed" inset="0" zIndex="modal"
    bg="blackAlpha.700" backdropFilter="blur(4px)"
    display="flex" alignItems="center" justifyContent="center"
    p="4"
    onClick={onCancel}
  >
    <Box
      bg="bg.panel"
      borderRadius="xl"
      borderWidth="1px"
      borderColor="border"
      p="8"
      maxW="sm"
      w="full"
      onClick={(e) => e.stopPropagation()}
    >
      <VStack gap={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold" color="fg">Eliminar asignatura</Text>
        <Text color="fg.muted">
          ¿Seguro que quieres eliminar <strong>{subject.name}</strong>? Esta acción no se puede deshacer.
        </Text>
        <HStack gap={3} justify="flex-end">
          <Button variant="outline" borderColor="border" onClick={onCancel}>Cancelar</Button>
          <Button bg="red.500" color="white" _hover={{ opacity: 0.9 }} onClick={onConfirm}>Eliminar</Button>
        </HStack>
      </VStack>
    </Box>
  </Box>
);

export const AdminSubjectsPage = () => {
  const { subjects, loading, handleCreate, handleUpdate, handleDelete } = useAdminSubjects();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedSubject, setSelectedSubject] = useState<AdminSubject | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<AdminSubject | null>(null);

  const openCreate = () => {
    setModalMode('create');
    setSelectedSubject(undefined);
    setModalOpen(true);
  };

  const openEdit = (subject: AdminSubject) => {
    setModalMode('edit');
    setSelectedSubject(subject);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await handleDelete(deleteTarget.id);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al eliminar';
      toaster.create({ title: msg, type: 'error' });
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <VStack gap={6} align="stretch">
      <Flex justify="space-between" align="center">
        <VStack gap={1} align="flex-start">
          <Text fontSize="2xl" fontWeight="bold" color="fg">
            Gestión de Asignaturas
          </Text>
          <Text fontSize="sm" color="fg.muted">
            Administra las asignaturas del sistema
          </Text>
        </VStack>
        <Button colorScheme="brand" gap={2} onClick={openCreate}>
          <Plus size={18} />
          Nueva Asignatura
        </Button>
      </Flex>

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
              <Table.ColumnHeader color="fg" fontWeight="600">Nombre</Table.ColumnHeader>
              <Table.ColumnHeader color="fg" fontWeight="600">Ciclo</Table.ColumnHeader>
              <Table.ColumnHeader color="fg" fontWeight="600">Retos</Table.ColumnHeader>
              <Table.ColumnHeader color="fg" fontWeight="600" textAlign="center">Acciones</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Table.Row key={i}>
                    <Table.Cell><Skeleton height="20px" /></Table.Cell>
                    <Table.Cell><Skeleton height="20px" /></Table.Cell>
                    <Table.Cell><Skeleton height="20px" /></Table.Cell>
                    <Table.Cell><Skeleton height="20px" /></Table.Cell>
                  </Table.Row>
                ))
              : subjects.length === 0
                ? (
                  <Table.Row>
                    <Table.Cell colSpan={4} textAlign="center" color="fg.muted" py={8}>
                      No hay asignaturas registradas
                    </Table.Cell>
                  </Table.Row>
                )
                : subjects.map((subject) => (
                  <Table.Row key={subject.id} _hover={{ bg: 'bg.subtle' }}>
                    <Table.Cell color="fg" fontWeight="500">{subject.name}</Table.Cell>
                    <Table.Cell>
                      <HStack gap={1} flexWrap="wrap">
                        {subject.courses.map((c) => (
                          <Badge key={c.id} colorScheme="brand" variant="subtle">{c.name}</Badge>
                        ))}
                      </HStack>
                    </Table.Cell>
                    <Table.Cell color="fg">{subject.challengeCount}</Table.Cell>
                    <Table.Cell>
                      <HStack gap={2} justify="center">
                        <IconButton
                          aria-label="Editar"
                          variant="ghost"
                          colorScheme="blue"
                          size="sm"
                          onClick={() => openEdit(subject)}
                        >
                          <Edit2 size={16} />
                        </IconButton>
                        <IconButton
                          aria-label="Eliminar"
                          variant="ghost"
                          colorScheme="red"
                          size="sm"
                          onClick={() => setDeleteTarget(subject)}
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

      <SubjectFormModal
        isOpen={modalOpen}
        mode={modalMode}
        initialData={selectedSubject}
        onClose={() => setModalOpen(false)}
        onSubmit={async (dto) => {
          if (modalMode === 'create') {
            await handleCreate(dto);
          } else if (selectedSubject) {
            await handleUpdate(selectedSubject.id, dto);
          }
        }}
      />

      {deleteTarget && (
        <DeleteConfirmOverlay
          subject={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </VStack>
  );
};
