import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  Center,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useAdminCourses } from "./hooks/useAdminCourses";
import { CoursesTable } from "./components/CoursesTable";
import { CourseFormModal } from "./components/CourseFormModal";
import { toaster } from "@/components/ui/toaster";

export const AdminCoursesPage = () => {
  const { courses, loading, error, handleCreate, handleUpdate, handleDelete } =
    useAdminCourses();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const openCreate = () => {
    setSelectedCourse(null);
    setFormOpen(true);
  };

  const openEdit = (course: any) => {
    setSelectedCourse(course);
    setFormOpen(true);
  };

  const onConfirm = async (name: string) => {
    try {
      if (selectedCourse) {
        await handleUpdate(selectedCourse.id, name);
        toaster.create({
          title: "Ciclo actualizado correctamente",
          type: "success",
          duration: 3000,
        });
      } else {
        await handleCreate(name);
        toaster.create({
          title: "Ciclo creado correctamente",
          type: "success",
          duration: 3000,
        });
      }
    } catch {
      toaster.create({
        title: "Error al guardar el ciclo",
        type: "error",
        duration: 3000,
      });
    }
  };

  const onDelete = async (id: number) => {
    try {
      await handleDelete(id);
      toaster.create({
        title: "Ciclo eliminado correctamente",
        type: "success",
        duration: 3000,
      });
    } catch (err: any) {
      toaster.create({ title: err.message, type: "error", duration: 3000 });
    }
  };

  return (
    <VStack align="stretch" gap={6} w="full">
      <HStack justify="space-between">
        <Box>
          <Heading size="lg" mb={1}>
            Gestión de Ciclos Formativos
          </Heading>
          <Text color="gray.500">
            Crea, edita y elimina los ciclos formativos.
          </Text>
        </Box>
        <Button onClick={openCreate}>+ Nuevo ciclo</Button>
      </HStack>

      {error && (
        <Box p={4} bg="red.50" color="red.500" borderRadius="md">
          {error}
        </Box>
      )}

      {loading ? (
        <Center h="200px">
          <Spinner size="xl" />
        </Center>
      ) : courses.length === 0 ? (
        <Center
          p={10}
          bg="gray.50"
          borderRadius="lg"
          border="1px dashed"
          borderColor="gray.200"
        >
          <Text color="gray.500">
            No hay ciclos formativos. ¡Crea el primero!
          </Text>
        </Center>
      ) : (
        <CoursesTable courses={courses} onEdit={openEdit} onDelete={onDelete} />
      )}

      <CourseFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onConfirm={onConfirm}
        course={selectedCourse}
      />
    </VStack>
  );
};
