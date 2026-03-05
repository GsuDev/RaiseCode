import { useState } from 'react';
import { Box, Button, Flex, Grid, HStack, Input, VStack } from '@chakra-ui/react';
import { Filter } from 'lucide-react'; 
import { SubjectCard, type Subject } from './components/SubjectCard';

const mockSubjects: Subject[] = [
  { id: '1', title: 'Desarrollo Web en Entorno Cliente', cycle: 'DAW', challenges: 3 },
  { id: '2', title: 'Desarrollo Web en Entorno Servidor', cycle: 'DAW', challenges: 1 },
  { id: '3', title: 'Diseño de Interfaces Web', cycle: 'DAW', challenges: 0 },
  { id: '4', title: 'Programación Multimedia y Dispositivos Móviles', cycle: 'DAM', challenges: 1 },
  { id: '5', title: 'Acceso a Datos', cycle: 'DAM', challenges: 1 },
  { id: '6', title: 'Programación de Servicios y Procesos', cycle: 'DAM', challenges: 0 },
  { id: '7', title: 'Administración de Sistemas Gestores de BD', cycle: 'ASIR', challenges: 1 },
  { id: '8', title: 'Implantación de Sistemas Operativos', cycle: 'ASIR', challenges: 1 }
];

export const SubjectSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCycle, setSelectedCycle] = useState<'ALL' | 'DAW' | 'DAM' | 'ASIR'>('ALL');

  const filteredSubjects = mockSubjects.filter(subject => {
    const matchesSearch = subject.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCycle = selectedCycle === 'ALL' || subject.cycle === selectedCycle;
    return matchesSearch && matchesCycle;
  });

  return (
    <VStack gap="8" w="full" align="stretch">
      <Flex 
        direction={{ base: 'column', lg: 'row' }} 
        gap="4" 
        w="full" 
        justify="space-between" 
        align="center"
      >
        <Box flex="1" w="full">
          <Input 
            placeholder="Buscar asignatura..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg="bg.panel" 
            h="10"
            border="1px solid"
            borderColor="bg.subtle" 
            _focus={{ borderColor: "brand.500", outline: "none" }}
          />
        </Box>

        <HStack gap="2" wrap="wrap">
          {(['ALL', 'DAW', 'DAM', 'ASIR'] as const).map((cycle) => (
            <Button
              key={cycle}
              size="sm"
              variant={selectedCycle === cycle ? 'solid' : 'outline'}
              colorPalette={selectedCycle === cycle ? 'green' : 'gray'}
              onClick={() => setSelectedCycle(cycle)}
              borderRadius="full"
              px="4"
              border="1px solid"
              borderColor="bg.subtle" 
              _hover={{ bg: "bg.subtle" }}
            >
              {cycle === 'ALL' && (
                <Box as="span" display="inline-flex" mr="2">
                  <Filter size={14} />
                </Box>
              )}
              {cycle === 'ALL' ? 'Todos' : cycle}
            </Button>
          ))}
        </HStack>
      </Flex>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="6">
        {filteredSubjects.map(subject => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </Grid>
    </VStack>
  );
};