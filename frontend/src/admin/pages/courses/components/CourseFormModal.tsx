import { useState, useEffect } from "react";
import { Dialog, Button, Input, VStack, Text, HStack } from "@chakra-ui/react";

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  course?: any;
}

export const CourseFormModal = ({
  isOpen,
  onClose,
  onConfirm,
  course,
}: CourseFormModalProps) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (course) {
      setName(course.name ?? "");
    } else {
      setName("");
    }
  }, [course, isOpen]);

  const handleConfirm = () => {
    if (!name.trim()) return;
    onConfirm(name);
    onClose();
  };

  const isEditing = !!course;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose} size="md">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content bg="bg.panel" borderColor="border">
          <Dialog.Header borderBottomWidth="1px" borderColor="border">
            <Dialog.Title>
              {isEditing ? "Editar Ciclo" : "Nuevo Ciclo"}
            </Dialog.Title>
          </Dialog.Header>
          <Dialog.Body py={6}>
            <VStack align="stretch" gap={4}>
              <Text fontWeight="medium" fontSize="sm">
                Nombre
              </Text>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: DAW, DAM, ASIR..."
                bg="bg.subtle"
                borderColor="border"
              />
            </VStack>
          </Dialog.Body>
          <Dialog.Footer borderTopWidth="1px" borderColor="border">
            <HStack gap={3}>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleConfirm}>
                {isEditing ? "Guardar cambios" : "Crear ciclo"}
              </Button>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
