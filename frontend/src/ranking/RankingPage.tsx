import { Container, Heading, Text, VStack, Box, Spinner, Center } from "@chakra-ui/react";
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
    setSelectedSubjectId 
  } = useRanking();

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
          <RankingTable 
            ranking={ranking} 
            currentUserId={user?.id} 
          />
        )}
      </VStack>
    </Container>
  );
};

export default RankingPage;