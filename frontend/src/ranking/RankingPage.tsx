import { 
  Container, 
  Heading, 
  Text, 
  VStack, 
  Box, 
  Spinner, 
  Center,
  HStack,
  Button,
  IconButton
} from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from "../auth/context/AuthContext";
import { useRanking } from "./hooks/useRanking";
import { RankingTable } from "./components/RankingTable";
import { SubjectSelector } from "./components/SubjectSelector";

const RankingPage = () => {
  const { user } = useAuth();
  const { 
    ranking, 
    isLoading, 
    error, 
    selectedSubjectId, 
    setSelectedSubjectId,
    pagination,
    setPagination
  } = useRanking();

  
  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handlePreviousPage = () => {
    if (pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  return (
    <Container maxW="container.lg" py={10}>
      <VStack gap={8} align="stretch">
        <Box textAlign="center">
          <Heading size="2xl" mb={2}>Ranking de la Comunidad</Heading>
          <Text color="fg.muted">
            Compite con otros desarrolladores y sube en el ranking de XP.
          </Text>
        </Box>

        <SubjectSelector 
          selectedId={selectedSubjectId} 
          onSelect={setSelectedSubjectId} 
        />

        {isLoading ? (
          <Center py={20}>
            <VStack gap={4}>
              <Spinner size="xl" color="blue.500" />
              <Text>Cargando clasificación...</Text>
            </VStack>
          </Center>
        ) : error ? (
          <Center py={20}>
            <Text color="red.500">{error}</Text>
          </Center>
        ) : (
          <>
            <RankingTable 
              ranking={ranking} 
              currentUserId={user?.id} 
            />

            {/* Controles de Paginación */}
            {ranking.length > 0 && (
              <VStack gap={4} align="center" mt={4}>
                <HStack gap={2} wrap="wrap" justify="center">
                  <Text fontSize="sm" color="fg.muted">
                    Mostrar
                  </Text>
                  <HStack gap={1}>
                    {[5, 10, 15, 50].map((limit) => (
                      <Button
                        key={limit}
                        size="sm"
                        variant={pagination.limit === limit ? 'solid' : 'outline'}
                        colorScheme={pagination.limit === limit ? 'brand' : 'gray'}
                        onClick={() => handleLimitChange(limit)}
                      >
                        {limit}
                      </Button>
                    ))}
                  </HStack>
                  <Text fontSize="sm" color="fg.muted">
                    por página
                  </Text>
                </HStack>

                <Text fontSize="sm" color="fg.muted" textAlign={{ base: 'center', md: 'left' }}>
                  {`${(pagination.page - 1) * pagination.limit + 1}-${Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )} de ${pagination.total} usuarios`}
                </Text>

                <HStack gap={2} justify="center">
                  <IconButton
                    aria-label="Página anterior"
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft size={18} />
                  </IconButton>
                  <Text fontSize="sm" color="fg.muted" minW="120px" textAlign="center">
                    Página {pagination.page} de {pagination.totalPages || 1}
                  </Text>
                  <IconButton
                    aria-label="Página siguiente"
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    <ChevronRight size={18} />
                  </IconButton>
                </HStack>
              </VStack>
            )}
          </>
        )}
      </VStack>
    </Container>
  );
};

export { RankingPage };