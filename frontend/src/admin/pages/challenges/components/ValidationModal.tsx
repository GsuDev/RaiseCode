import { useState } from "react";
import { 
  DialogRoot as Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogActionTrigger,
  Button, 
  Textarea, 
  Text,
  VStack
} from "@chakra-ui/react";

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
  actionType: "approve" | "reject";
  challengeTitle: string;
}

export const ValidationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  actionType,
  challengeTitle 
}: ValidationModalProps) => {
  const [comment, setComment] = useState("");

  const handleConfirm = () => {
    onConfirm(comment);
    setComment(""); // Limpiar para la próxima vez
    onClose();
  };

  const isApprove = actionType === "approve";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isApprove ? "Aprobar Reto" : "Rechazar Reto"}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <VStack align="stretch" gap={4}>
            <Text>
              ¿Estás seguro de que deseas {isApprove ? "aprobar" : "rechazar"} el reto: 
              <strong> {challengeTitle}</strong>?
            </Text>
            <Textarea
              placeholder="Añade un comentario opcional para el creador..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              size="sm"
            />
          </VStack>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
          </DialogActionTrigger>
          <Button 
            colorScheme={isApprove ? "green" : "red"} 
            onClick={handleConfirm}
          >
            Confirmar {isApprove ? "Aprobación" : "Rechazo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};