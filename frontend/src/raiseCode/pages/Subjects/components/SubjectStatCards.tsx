import { Box, Grid, Text, VStack } from '@chakra-ui/react';
import { Code2, Trophy } from 'lucide-react';
import type { SubjectDetail } from '../../../components/SubjectSection/types';

interface Props {
  stats: SubjectDetail['stats'];
}

const cards = [
  { label: 'Retos totales', key: 'total' as const, icon: Code2,  color: 'brand.500'  },
  { label: 'Fáciles',       key: 'easy'  as const, icon: Trophy, color: 'green.500'  },
  { label: 'Medios',        key: 'medium'as const, icon: Trophy, color: 'orange.400' },
  { label: 'Difíciles',     key: 'hard'  as const, icon: Trophy, color: 'red.500'    },
];

export const SubjectStatCards = ({ stats }: Props) => (
  <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap="4">
    {cards.map(({ label, key, icon: Icon, color }) => (
      <Box key={key} bg="bg.subtle" borderRadius="xl" p="4" textAlign="center">
        <VStack gap="1">
          <Box color={color}>
            <Icon size={20} />
          </Box>
          <Text fontSize="2xl" fontWeight="bold">{stats[key]}</Text>
          <Text fontSize="xs" color="fg.muted">{label}</Text>
        </VStack>
      </Box>
    ))}
  </Grid>
);
