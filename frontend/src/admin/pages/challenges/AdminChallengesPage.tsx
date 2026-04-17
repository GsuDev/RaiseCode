import { useState } from "react";
import { Box, Heading, Text, VStack, Spinner, Center, useDisclosure } from "@chakra-ui/react";
import { usePendingChallenges } from "./hooks/usePendingChallenges";
import { PendingChallengesTable } from "./components/PendingChallengesTable";
import { ValidationModal } from "./components/ValidationModal";

export const AdminChallengesPage = () => {
  const { challenges, loading, error, handleValidate } = usePendingChallenges();

  // Estado para el modal
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const { open, onOpen, onClose } = useDisclosure();

  const openModal = (challenge: any, type: "approve" | "reject") => {
    if (!challenge) return;
    setSelectedChallenge(challenge);
    setActionType(type);
    onOpen();
  };

  const onConfirmValidation = async (comment: string) => {
    if (selectedChallenge) {
      const isApprove = actionType === "approve";
      await handleValidate(selectedChallenge.id, isApprove, comment);
    }
  };

  if (loading) {
    return (
      <Center h="200px">
        <Spinner size="xl" color="purple.500" />
      </Center>
    );
  }

  return (
    <VStack align="stretch" gap={6} w="full">
      <Box>
        <Heading size="lg" mb={1}>Validación de Retos</Heading>
        <Text color="gray.500">
          Revisa y gestiona los retos enviados por la comunidad.
        </Text>
      </Box>

      {error && (
        <Box p={4} bg="red.50" color="red.500" borderRadius="md">
          {error}
        </Box>
      )}

      {challenges.length === 0 ? (
        <Center p={10} bg="gray.50" borderRadius="lg" border="1px dashed" borderColor="gray.200">
          <Text fontWeight="medium" color="gray.500">
            No hay retos pendientes de validación. ¡Todo al día!
          </Text>
        </Center>
      ) : (
        <PendingChallengesTable
          challenges={challenges}
          onApprove={(id) => {
            const found = challenges.find((c: any) => c.id === id);
            if (found) openModal(found, "approve");
          }}
          onReject={(id) => {
            const found = challenges.find((c: any) => c.id === id);
            if (found) openModal(found, "reject");
          }}
        />
      )}

      {/* El Modal de Validación */}
      {selectedChallenge && (
        <ValidationModal
          isOpen={open}
          onClose={onClose}
          onConfirm={onConfirmValidation}
          actionType={actionType}
          challengeTitle={selectedChallenge.title}
        />
      )}
    </VStack>
  );
};