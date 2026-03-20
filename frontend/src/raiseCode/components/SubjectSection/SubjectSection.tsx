import { useState } from 'react';
import { Box, Button, Flex, Grid, HStack, Input, Skeleton, Text, VStack } from '@chakra-ui/react';
import { Filter } from 'lucide-react';
import { SubjectCard } from './components/SubjectCard';
import { useSubjects } from './hooks/useSubjects';

interface Props {
  initialCycle?: 'ALL' | 'DAW' | 'DAM' | 'ASIR';
}

const CYCLE_COLORS: Record<string, string> = {
  DAW:  '#f59e0b',
  DAM:  '#22c55e',
  ASIR: '#06b6d4',
};

export const SubjectSection = ({ initialCycle = 'ALL' }: Props) => {
  const { subjects, loading } = useSubjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCycle, setSelectedCycle] = useState<'ALL' | 'DAW' | 'DAM' | 'ASIR'>(initialCycle);

  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCycle = selectedCycle === 'ALL' || subject.courses.some((c) => c.name === selectedCycle);
    return matchesSearch && matchesCycle;
  });

  return (
    <VStack gap="8" w="full" align="stretch">
      <Flex direction={{ base: 'column', lg: 'row' }} gap="4" w="full" justify="space-between" align="center">
        <Box flex="1" w="full">
          <Input
            placeholder="Buscar asignatura..."
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
          {(['ALL', 'DAW', 'DAM', 'ASIR'] as const).map((cycle) => {
            const color = CYCLE_COLORS[cycle];
            const isSelected = selectedCycle === cycle;
            return (
              <Button
                key={cycle}
                size="sm"
                onClick={() => setSelectedCycle(cycle)}
                borderRadius="full"
                px="4"
                border="1px solid"
                borderColor={isSelected && color ? color : 'bg.subtle'}
                bg={isSelected ? (color ? `${color}22` : 'bg.subtle') : 'transparent'}
                color={isSelected && color ? color : 'fg.muted'}
                fontWeight={isSelected ? 'bold' : 'normal'}
                _hover={{ borderColor: color ?? 'border', bg: color ? `${color}15` : 'bg.subtle' }}
              >
                {cycle === 'ALL' && <Box as="span" display="inline-flex" mr="2"><Filter size={14} /></Box>}
                {cycle === 'ALL' ? 'Todos' : cycle}
              </Button>
            );
          })}
        </HStack>
      </Flex>

      {loading ? (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} h="200px" borderRadius="xl" />
          ))}
        </Grid>
      ) : filteredSubjects.length === 0 ? (
        <Text color="fg.muted" textAlign="center" py="12">
          No se encontraron asignaturas.
        </Text>
      ) : (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="6">
          {filteredSubjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </Grid>
      )}
    </VStack>
  );
};
