import {
  Badge, Box, Button, Center, Container, Flex, Grid,
  HStack, Input, Skeleton, Spinner, Text, VStack,
} from '@chakra-ui/react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useSubjectDetail } from '../../components/SubjectSection/hooks/useSubjectDetail';
import { useSubjectChallenges } from '../../components/SubjectSection/hooks/useSubjectChallenges';
import { SubjectStatCards } from './components/SubjectStatCards';
import { SubjectChallengeCard } from './components/SubjectChallengeCard';

const CYCLE_COLORS: Record<string, string> = {
  DAW:  '#f59e0b',
  DAM:  '#22c55e',
  ASIR: '#06b6d4',
};

const DIFFICULTIES = ['ALL', 'Easy', 'Medium', 'Hard'] as const;
const DIFF_COLORS: Record<string, string> = { Easy: 'green', Medium: 'orange', Hard: 'red' };

export const SubjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const subjectId = parseInt(id ?? '0');

  const { subject, loading: subjectLoading, error: subjectError } = useSubjectDetail(subjectId);
  const {
    challenges, meta, loading: challengesLoading,
    page, setPage,
    searchTerm, setSearchTerm,
    selectedDifficulty, setSelectedDifficulty,
  } = useSubjectChallenges(subjectId);

  if (subjectLoading) {
    return (
      <Center h="70vh">
        <Spinner size="xl" color="green.500" borderWidth="4px" />
      </Center>
    );
  }

  if (subjectError || !subject) {
    return (
      <Center h="70vh">
        <Text color="red.500">{subjectError ?? 'Asignatura no encontrada.'}</Text>
      </Center>
    );
  }

  const primaryCourse = subject.courses[0]?.name ?? '';
  const primaryColor = CYCLE_COLORS[primaryCourse] ?? 'var(--chakra-colors-brand-500)';

  return (
    <Container maxW="7xl" py="8">
      {/* Volver */}
      <Button variant="ghost" color="fg.muted" mb="6" px="0" onClick={() => navigate('/asignaturas')}>
        <ArrowLeft size={16} /> Volver a asignaturas
      </Button>

      {/* Cabecera */}
      <Box bg="bg.panel" borderWidth="1px" borderColor="bg.subtle" borderRadius="2xl" p="6" mb="8">
        <VStack align="stretch" gap="4">
          <Flex align="center" gap="4" wrap="wrap">
            <Box p="3" borderRadius="xl" bg={`${primaryColor}22`} color={primaryColor} flexShrink={0}>
              <BookOpen size={28} />
            </Box>
            <Box flex="1">
              <Flex align="center" gap="3" wrap="wrap" mb="1">
                <Text fontSize="2xl" fontWeight="bold" color="fg">{subject.name}</Text>
                <HStack gap="1">
                  {subject.courses.map((c) => (
                    <Badge key={c.id} borderRadius="full" px="3" bg={CYCLE_COLORS[c.name] ?? primaryColor} color="white">
                      {c.name}
                    </Badge>
                  ))}
                </HStack>
              </Flex>
              <Text color="fg.muted" fontSize="sm">{subject.description || 'Sin descripción'}</Text>
            </Box>
          </Flex>

          <SubjectStatCards stats={subject.stats} />
        </VStack>
      </Box>

      {/* Filtros */}
      <Flex direction={{ base: 'column', md: 'row' }} gap="4" mb="6" align="center">
        <Box flex="1" w="full">
          <Input
            placeholder="Buscar reto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg="bg.panel"
            h="10"
            border="1px solid"
            borderColor="bg.subtle"
            _focus={{ borderColor: 'brand.500', outline: 'none' }}
          />
        </Box>
        <HStack gap="2" wrap="wrap">
          {DIFFICULTIES.map((diff) => {
            const isSelected = selectedDifficulty === diff;
            const color = DIFF_COLORS[diff];
            return (
              <Button
                key={diff}
                size="sm"
                borderRadius="full"
                px="4"
                border="1px solid"
                borderColor={isSelected && color ? `${color}.500` : 'bg.subtle'}
                colorPalette={isSelected && color ? color : undefined}
                variant={isSelected ? 'solid' : 'ghost'}
                onClick={() => setSelectedDifficulty(diff as typeof selectedDifficulty)}
              >
                {diff === 'ALL' ? 'Todos' : diff}
              </Button>
            );
          })}
        </HStack>
      </Flex>

      {/* Grid de retos */}
      {challengesLoading ? (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="6">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} h="200px" borderRadius="xl" />)}
        </Grid>
      ) : challenges.length === 0 ? (
        <Center py="16">
          <Text color="fg.muted">No se encontraron retos para esta asignatura.</Text>
        </Center>
      ) : (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="6">
          {challenges.map((c) => <SubjectChallengeCard key={c.id} challenge={c} />)}
        </Grid>
      )}

      {/* Paginación */}
      {meta && meta.totalPages > 1 && (
        <Flex justify="center" gap="2" mt="8">
          <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
            Anterior
          </Button>
          <Text alignSelf="center" fontSize="sm" color="fg.muted">
            {page} / {meta.totalPages}
          </Text>
          <Button size="sm" variant="outline" disabled={page === meta.totalPages} onClick={() => setPage(page + 1)}>
            Siguiente
          </Button>
        </Flex>
      )}
    </Container>
  );
};
