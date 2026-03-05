import { Container, Heading, Text, VStack } from '@chakra-ui/react';
import { SubjectSection } from '../../components/SubjectSection/SubjectSection';

/**
 * Página de Exploración de Asignaturas.
 * Muestra el catálogo de asignaturas con sus respectivos retos.
 */
export const SubjectsPage = () => {
  return (
    <Container maxW="7xl" py="10">
      <VStack align="start" gap="2" mb="10">
        <Heading as="h1" size="3xl" color="fg">
          Retos por Asignatura
        </Heading>
        <Text color="fg.muted" fontSize="lg">
          Explora los retos disponibles organizados por asignatura y ciclo formativo.
        </Text>
      </VStack>

      <SubjectSection />
    </Container>
  );
};