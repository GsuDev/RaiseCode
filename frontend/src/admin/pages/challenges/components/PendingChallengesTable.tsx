import { 
  Table, 
  Badge, 
  Button, 
  HStack,
  Text 
} from "@chakra-ui/react";

interface PendingChallengesTableProps {
  challenges: any[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

export const PendingChallengesTable = ({ 
  challenges, 
  onApprove, 
  onReject 
}: PendingChallengesTableProps) => {
  return (
    <Table.Root variant="line" stickyHeader>
      <Table.Header bg="gray.50">
        <Table.Row>
          <Table.ColumnHeader>Título</Table.ColumnHeader>
          <Table.ColumnHeader>Asignatura</Table.ColumnHeader>
          <Table.ColumnHeader>Dificultad</Table.ColumnHeader>
          <Table.ColumnHeader>Creador</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="end">Acciones</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {challenges.map((challenge) => (
          <Table.Row key={challenge.id}>
            <Table.Cell fontWeight="medium">{challenge.title}</Table.Cell>
            <Table.Cell>
              <Badge colorScheme="purple">{challenge.subject?.name}</Badge>
            </Table.Cell>
            <Table.Cell>
              <Badge colorScheme="orange">{challenge.dificulty?.name}</Badge>
            </Table.Cell>
            <Table.Cell>
              <Text fontSize="sm">
                {challenge.creator?.name} {challenge.creator?.lastname}
              </Text>
            </Table.Cell>
            <Table.Cell textAlign="end">
              <HStack justify="flex-end" gap={2}>
                <Button 
                  size="sm" 
                  colorScheme="green" 
                  onClick={() => onApprove(challenge.id)}
                >
                  Aprobar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  colorScheme="red" 
                  onClick={() => onReject(challenge.id)}
                >
                  Rechazar
                </Button>
              </HStack>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};