import { Table, Button, HStack } from "@chakra-ui/react";
import { Pencil, Trash2 } from "lucide-react";

interface CoursesTableProps {
  courses: any[];
  onEdit: (course: any) => void;
  onDelete: (id: number) => void;
}

export const CoursesTable = ({
  courses,
  onEdit,
  onDelete,
}: CoursesTableProps) => {
  return (
    <Table.Root variant="line" stickyHeader>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Nombre</Table.ColumnHeader>
          <Table.ColumnHeader>Asignaturas</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="end">Acciones</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {courses.map((course) => (
          <Table.Row key={course.id}>
            <Table.Cell fontWeight="medium">{course.name}</Table.Cell>
            <Table.Cell>{course.subjectCount}</Table.Cell>
            <Table.Cell textAlign="end">
              <HStack justify="flex-end" gap={2}>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(course)}
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(course.id)}
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
