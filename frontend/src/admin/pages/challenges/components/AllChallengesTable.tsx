import { Table, Badge, Button, HStack, Text } from "@chakra-ui/react";
import { Pencil, Trash2 } from "lucide-react";

interface AllChallengesTableProps {
  challenges: any[];
  onEdit: (challenge: any) => void;
  onDelete: (id: number) => void;
}

export const AllChallengesTable = ({
  challenges,
  onEdit,
  onDelete,
}: AllChallengesTableProps) => {
  return (
    <Table.Root variant="line" stickyHeader>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Título</Table.ColumnHeader>
          <Table.ColumnHeader>Estado</Table.ColumnHeader>
          <Table.ColumnHeader>Lenguaje</Table.ColumnHeader>
          <Table.ColumnHeader>Asignatura</Table.ColumnHeader>
          <Table.ColumnHeader>Dificultad</Table.ColumnHeader>
          <Table.ColumnHeader>Autor</Table.ColumnHeader>
          <Table.ColumnHeader>Envíos</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="end">Acciones</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {challenges.map((challenge) => (
          <Table.Row key={challenge.id}>
            <Table.Cell fontWeight="medium">{challenge.title}</Table.Cell>
            <Table.Cell>
              <Badge colorPalette={challenge.validate ? "green" : "orange"}>
                {challenge.validate ? "Validado" : "Pendiente"}
              </Badge>
            </Table.Cell>
            <Table.Cell>{challenge.language?.name}</Table.Cell>
            <Table.Cell>{challenge.subject?.name}</Table.Cell>
            <Table.Cell>{challenge.dificulty?.name}</Table.Cell>
            <Table.Cell>
              <Text fontSize="sm">{challenge.author}</Text>
            </Table.Cell>
            <Table.Cell>{challenge.submissionsCount}</Table.Cell>
            <Table.Cell textAlign="end">
              <HStack justify="flex-end" gap={2}>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(challenge)}
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(challenge.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </HStack>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
