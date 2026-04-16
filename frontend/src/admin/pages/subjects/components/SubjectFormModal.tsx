import { Box, Button, Checkbox, HStack, Input, Text, Textarea, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AdminSubject, Course, SubjectFormDto, getCourses } from '../services/adminSubjects.service';

interface Props {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialData?: AdminSubject;
  onClose: () => void;
  onSubmit: (dto: SubjectFormDto) => Promise<void>;
}

export const SubjectFormModal = ({ isOpen, mode, initialData, onClose, onSubmit }: Props) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCourses().then(setCourses).catch(() => {});
  }, []);

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name ?? '');
      setDescription(initialData?.description ?? '');
      setSelectedCourseIds(initialData?.courses.map((c) => c.id) ?? []);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const toggleCourse = (id: number) => {
    setSelectedCourseIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!name.trim() || selectedCourseIds.length === 0) return;
    setLoading(true);
    try {
      await onSubmit({ name: name.trim(), description: description.trim(), courseIds: selectedCourseIds });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      position="fixed" inset="0" zIndex="modal"
      bg="blackAlpha.700" backdropFilter="blur(4px)"
      display="flex" alignItems="center" justifyContent="center"
      p="4"
      onClick={onClose}
    >
      <Box
        bg="bg.panel"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="border"
        p="8"
        maxW="md"
        w="full"
        onClick={(e) => e.stopPropagation()}
      >
        <VStack gap={5} align="stretch">
          <Text fontSize="lg" fontWeight="bold" color="fg">
            {mode === 'create' ? 'Nueva Asignatura' : 'Editar Asignatura'}
          </Text>

          <VStack gap={1} align="stretch">
            <Text fontSize="sm" color="fg.muted">Nombre</Text>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre de la asignatura"
              borderColor="border"
              _focus={{ borderColor: 'brand.500' }}
            />
          </VStack>

          <VStack gap={1} align="stretch">
            <Text fontSize="sm" color="fg.muted">Descripción</Text>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción de la asignatura"
              borderColor="border"
              _focus={{ borderColor: 'brand.500' }}
              rows={3}
            />
          </VStack>

          {/* Checkboxes en vez de select porque una asignatura puede pertenecer a varios ciclos */}
          <VStack gap={2} align="stretch">
            <Text fontSize="sm" color="fg.muted">Ciclos</Text>
            {courses.map((c) => (
              <Checkbox.Root
                key={c.id}
                checked={selectedCourseIds.includes(c.id)}
                onCheckedChange={() => toggleCourse(c.id)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control borderColor="border" />
                <Checkbox.Label color="fg">{c.name}</Checkbox.Label>
              </Checkbox.Root>
            ))}
            {selectedCourseIds.length === 0 && (
              <Text fontSize="xs" color="red.400">Selecciona al menos un ciclo</Text>
            )}
          </VStack>

          <HStack gap={3} justify="flex-end" pt={2}>
            <Button variant="outline" borderColor="border" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              bg="brand.500"
              color="white"
              _hover={{ opacity: 0.9 }}
              onClick={handleSubmit}
              loading={loading}
              disabled={!name.trim() || selectedCourseIds.length === 0}
            >
              {mode === 'create' ? 'Crear' : 'Guardar'}
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};
