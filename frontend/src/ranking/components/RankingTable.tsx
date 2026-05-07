import { Table, Box, Text, Center, VStack } from "@chakra-ui/react";
import { RankingRow } from "./rankingRow.tsx";
import type { RankingUser } from "../services/ranking.service";

interface RankingTableProps {
  ranking: RankingUser[];
  currentUserId?: number;
}

export const RankingTable = ({ ranking, currentUserId }: RankingTableProps) => {
  if (ranking.length === 0) {
    return (
      <Center py={20} border="2px dashed" borderColor="gray.200" borderRadius="lg">
        <VStack gap={2}>
          <Text fontSize="lg" fontWeight="medium" color="fg.muted">
            Aún no hay usuarios en el ranking.
          </Text>
          <Text color="blue.500" fontWeight="bold">
            ¡Sé el primero!
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box overflowX="auto" border="1px solid" borderColor="border.subtle" borderRadius="xl">
      <Table.Root variant="line" interactive>
        <Table.Header>
          <Table.Row bg="gray.50" _dark={{ bg: "whiteAlpha.50" }}>
            <Table.ColumnHeader textAlign="center">Posición</Table.ColumnHeader>
            <Table.ColumnHeader>Usuario</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Experiencia</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right">Completados</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {ranking.map((user) => (
            <RankingRow 
              key={user.userId} 
              user={user} 
              isCurrentUser={user.userId === currentUserId} 
            />
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};