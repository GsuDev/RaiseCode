import {
  Button,
  Dialog,
  Field,
  HStack,
  Input,
  VStack,
  createToaster,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { adminUsersService } from '../service/adminUsers.service';
import type { User, Course } from '../service/adminUsers.service';

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (state: { open: boolean }) => void;
  user: User | null;
  onSuccess: () => void;
}

const toaster = createToaster({
  placement: 'top-end',
  duration: 4000,
});

export const EditUserModal = ({ open, onOpenChange, user, onSuccess }: EditUserModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    courseId: '',
  });

  // Cargar cursos cuando se monta el componente
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const coursesData = await adminUsersService.getCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error('Error al cargar cursos:', error);
        setCourses([]);
      }
    };
    loadCourses();
  }, []);

  // Cargar datos del usuario cuando se abre el modal
  useEffect(() => {
    if (open && user) {
      setFormData({
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        courseId: user.course?.name ? String(user.course.name) : '',
      });
    }
  }, [open, user]);

  const handleClose = () => {
    onOpenChange({ open: false });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toaster.create({
        title: 'Error',
        description: 'No se encontró el usuario a editar',
        type: 'error',
      });
      return;
    }

    // Validaciones básicas
    if (!formData.name.trim()) {
      toaster.create({
        title: 'Error',
        description: 'El nombre es requerido',
        type: 'error',
      });
      return;
    }

    if (!formData.lastname.trim()) {
      toaster.create({
        title: 'Error',
        description: 'El apellido es requerido',
        type: 'error',
      });
      return;
    }

    if (!formData.email.trim()) {
      toaster.create({
        title: 'Error',
        description: 'El email es requerido',
        type: 'error',
      });
      return;
    }

    if (!formData.courseId) {
      toaster.create({
        title: 'Error',
        description: 'El curso es requerido',
        type: 'error',
      });
      return;
    }

    try {
      setIsLoading(true);
      // Buscar el ID del curso por el nombre
      const selectedCourse = courses.find(c => String(c.name) === formData.courseId);
      
      await adminUsersService.updateUser(user.id, {
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        courseId: selectedCourse?.id,
      });

      toaster.create({
        title: 'Éxito',
        description: 'Usuario actualizado correctamente',
        type: 'success',
      });

      onSuccess();
      handleClose();
    } catch (error) {
      toaster.create({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al actualizar usuario',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} size="md">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content bg="bg.panel" borderColor="border">
          <Dialog.Header borderBottomWidth="1px" borderColor="border">
            <Dialog.Title>Editar Usuario</Dialog.Title>
          </Dialog.Header>

          <form onSubmit={handleSubmit}>
            <Dialog.Body py={6}>
              <VStack gap={4} align="stretch">
                {/* Nombre */}
                <Field.Root>
                  <Field.Label color="fg" fontWeight="600">
                    Nombre
                  </Field.Label>
                  <Input
                    name="name"
                    placeholder="Juan"
                    value={formData.name}
                    onChange={handleChange}
                    bg="bg.subtle"
                    borderColor="border"
                    _focus={{
                      borderColor: 'brand.500',
                      boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                    }}
                  />
                </Field.Root>

                {/* Apellido */}
                <Field.Root>
                  <Field.Label color="fg" fontWeight="600">
                    Apellido
                  </Field.Label>
                  <Input
                    name="lastname"
                    placeholder="Pérez"
                    value={formData.lastname}
                    onChange={handleChange}
                    bg="bg.subtle"
                    borderColor="border"
                    _focus={{
                      borderColor: 'brand.500',
                      boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                    }}
                  />
                </Field.Root>

                {/* Email */}
                <Field.Root>
                  <Field.Label color="fg" fontWeight="600">
                    Email
                  </Field.Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="juan@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    bg="bg.subtle"
                    borderColor="border"
                    _focus={{
                      borderColor: 'brand.500',
                      boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                    }}
                  />
                </Field.Root>

                {/* Curso */}
                <Field.Root>
                  <Field.Label color="fg" fontWeight="600">
                    Curso
                  </Field.Label>
                  <select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      borderWidth: '1px',
                      borderColor: 'var(--chakra-colors-border)',
                      backgroundColor: 'var(--chakra-colors-bg-subtle)',
                      color: formData.courseId ? 'var(--chakra-colors-fg)' : 'var(--chakra-colors-fg-muted)',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">Selecciona un curso</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.name}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </Field.Root>
              </VStack>
            </Dialog.Body>

            <Dialog.Footer borderTopWidth="1px" borderColor="border">
              <HStack gap={3}>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                  colorScheme="gray"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  colorScheme="brand"
                  loading={isLoading}
                  loadingText="Actualizando..."
                >
                  Actualizar Usuario
                </Button>
              </HStack>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
