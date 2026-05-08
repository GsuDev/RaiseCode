import { useState, useEffect } from "react";
import {
  Dialog,
  Button,
  Input,
  Textarea,
  VStack,
  Text,
  HStack,
} from "@chakra-ui/react";

interface EditChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  challenge: any;
}

export const EditChallengeModal = ({
  isOpen,
  onClose,
  onConfirm,
  challenge,
}: EditChallengeModalProps) => {
  const [title, setTitle] = useState("");
  const [statement, setStatement] = useState("");

  useEffect(() => {
    if (challenge) {
      setTitle(challenge.title ?? "");
      setStatement(challenge.statement ?? "");
    }
  }, [challenge]);

  const handleConfirm = () => {
    onConfirm({ title, statement });
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose} size="md">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content bg="bg.panel" borderColor="border">
          <Dialog.Header borderBottomWidth="1px" borderColor="border">
            <Dialog.Title>Editar Reto</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body py={6}>
            <VStack align="stretch" gap={4}>
              <Text fontWeight="medium" fontSize="sm">
                Título
              </Text>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título del reto"
                bg="bg.subtle"
                borderColor="border"
              />
              <Text fontWeight="medium" fontSize="sm">
                Enunciado
              </Text>
              <Textarea
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                placeholder="Enunciado del reto"
                rows={6}
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
              <Button onClick={handleConfirm}>Guardar cambios</Button>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
