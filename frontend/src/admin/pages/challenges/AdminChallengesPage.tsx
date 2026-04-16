import { Box, Heading, Text, VStack, Spinner, Center } from "@chakra-ui/react";
import { usePendingChallenges } from "./hooks/usePendingChallenges";
import { PendingChallengesTable } from "./components/PendingChallengesTable";

export const AdminChallengesPage = () => {
  const { challenges, loading, error, handleValidate } = usePendingChallenges();

  // Función para manejar la aprobación
  const onApprove = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres aprobar este reto?")) {
      await handleValidate(id, true);
    }
  };

  // Función para manejar el rechazo
  const onReject = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres rechazar este reto?")) {
      await handleValidate(id, false);
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
          onApprove={onApprove}
          onReject={onReject}
        />
      )}
    </VStack>
  );
};