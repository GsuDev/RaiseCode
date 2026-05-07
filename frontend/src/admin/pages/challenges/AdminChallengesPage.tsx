import { useState } from "react";
import { Box, Heading, Text, VStack, Spinner, Center, Tabs, HStack, Button } from "@chakra-ui/react";
import { usePendingChallenges } from "./hooks/usePendingChallenges";
import { useAllChallenges } from "./hooks/useAllChallenges";
import { PendingChallengesTable } from "./components/PendingChallengesTable";
import { AllChallengesTable } from "./components/AllChallengesTable";
import { ValidationModal } from "./components/ValidationModal";
import { EditChallengeModal } from "./components/EditChallengeModal";
import { toaster } from "@/components/ui/toaster";

export const AdminChallengesPage = () => {
  const { challenges: pendingChallenges, loading: pendingLoading, error: pendingError, handleValidate } = usePendingChallenges();
  const { challenges: allChallenges, loading: allLoading, error: allError, page, totalPages, setPage, handleDelete, handleUpdate } = useAllChallenges();

  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [validationOpen, setValidationOpen] = useState(false);
  const [editChallenge, setEditChallenge] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);

  const openValidationModal = (challenge: any, type: "approve" | "reject") => {
    if (!challenge) return;
    setSelectedChallenge(challenge);
    setActionType(type);
    setValidationOpen(true);
  };

  const onConfirmValidation = async (comment: string) => {
    if (selectedChallenge) {
      const isApprove = actionType === "approve";
      await handleValidate(selectedChallenge.id, isApprove, comment);
    }
  };

  const openEditModal = (challenge: any) => {
    setEditChallenge(challenge);
    setEditOpen(true);
  };

  const onConfirmEdit = async (data: any) => {
    try {
      await handleUpdate(editChallenge.id, data);
      toaster.create({ title: "Reto actualizado correctamente", type: "success", duration: 3000 });
    } catch {
      toaster.create({ title: "Error al actualizar el reto", type: "error", duration: 3000 });
    }
  };

  const onDelete = async (id: number) => {
    try {
      await handleDelete(id);
      toaster.create({ title: "Reto eliminado correctamente", type: "success", duration: 3000 });
    } catch (err: any) {
      toaster.create({ title: err.message, type: "error", duration: 3000 });
    }
  };

  return (
    <VStack align="stretch" gap={6} w="full">
      <Box>
        <Heading size="lg" mb={1}>Gestión de Retos</Heading>
        <Text color="gray.500">Revisa, edita y elimina los retos de la plataforma.</Text>
      </Box>

      <Tabs.Root defaultValue="pending">
        <Tabs.List>
          <Tabs.Trigger value="pending">Pendientes de validar</Tabs.Trigger>
          <Tabs.Trigger value="all">Todos los retos</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="pending">
          {pendingLoading ? (
            <Center h="200px"><Spinner size="xl" /></Center>
          ) : pendingError ? (
            <Box p={4} bg="red.50" color="red.500" borderRadius="md">{pendingError}</Box>
          ) : pendingChallenges.length === 0 ? (
            <Center p={10} bg="gray.50" borderRadius="lg" border="1px dashed" borderColor="gray.200">
              <Text fontWeight="medium" color="gray.500">No hay retos pendientes. ¡Todo al día!</Text>
            </Center>
          ) : (
            <PendingChallengesTable
              challenges={pendingChallenges}
              onApprove={(id) => {
                const found = pendingChallenges.find((c: any) => c.id === id);
                if (found) openValidationModal(found, "approve");
              }}
              onReject={(id) => {
                const found = pendingChallenges.find((c: any) => c.id === id);
                if (found) openValidationModal(found, "reject");
              }}
            />
          )}
        </Tabs.Content>

        <Tabs.Content value="all">
          {allLoading ? (
            <Center h="200px"><Spinner size="xl" /></Center>
          ) : allError ? (
            <Box p={4} bg="red.50" color="red.500" borderRadius="md">{allError}</Box>
          ) : (
            <>
              <AllChallengesTable
                challenges={allChallenges}
                onEdit={openEditModal}
                onDelete={onDelete}
              />
              <HStack justify="center" mt={4} gap={4}>
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
                  Anterior
                </Button>
                <Text fontSize="sm">{page} / {totalPages}</Text>
                <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                  Siguiente
                </Button>
              </HStack>
            </>
          )}
        </Tabs.Content>
      </Tabs.Root>

      <ValidationModal
        isOpen={validationOpen}
        onClose={() => setValidationOpen(false)}
        onConfirm={onConfirmValidation}
        actionType={actionType}
        challengeTitle={selectedChallenge?.title ?? ""}
      />

      <EditChallengeModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onConfirm={onConfirmEdit}
        challenge={editChallenge}
      />
    </VStack>
  );
};