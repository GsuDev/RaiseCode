import { Table, Badge, Text, HStack } from "@chakra-ui/react";
import type { RankingUser } from "../services/ranking.service";

interface RankingRowProps {
  user: RankingUser;
  isCurrentUser: boolean;
}

export const RankingRow = ({ user, isCurrentUser }: RankingRowProps) => {
  const renderPosition = (position: number) => {
    switch (position) {
      case 1: return <Text fontSize="2xl">🥇</Text>;
      case 2: return <Text fontSize="2xl">🥈</Text>;
      case 3: return <Text fontSize="2xl">🥉</Text>;
      default: return <Text fontWeight="medium" color="fg.muted" ml={2}>{position}</Text>;
    }
  };

  return (
    <Table.Row 
      bg={isCurrentUser ? "blue.50" : "transparent"} 
      _dark={{ bg: isCurrentUser ? "blue.950" : "transparent" }}
      transition="background 0.2s"
    >
      <Table.Cell textAlign="center" width="80px">
        {renderPosition(user.position)}
      </Table.Cell>
      
      <Table.Cell>
        <HStack gap={3}>
          <Text fontWeight={isCurrentUser ? "bold" : "normal"}>
            {user.username}
            {isCurrentUser && (
              <Badge ml={2} colorPalette="blue" variant="solid" size="sm">
                TÚ
              </Badge>
            )}
          </Text>
        </HStack>
      </Table.Cell>

      <Table.Cell textAlign="right">
        <Text fontWeight="bold" color="blue.600" _dark={{ color: "blue.400" }}>
          {user.xp ?? 0} XP
        </Text>
      </Table.Cell>

      <Table.Cell textAlign="right">
        <Badge variant="outline" colorPalette="green">
          {user.completedCount} retos
        </Badge>
      </Table.Cell>
    </Table.Row>
  );
};