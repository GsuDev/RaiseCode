import { HStack, Button, Field } from "@chakra-ui/react";
import { useSubjects } from "../../raiseCode/components/SubjectSection/hooks/useSubjects";
import type { ChangeEvent } from "react";

interface SubjectSelectorProps {
  onSelect: (subjectId: number | null) => void;
  selectedId: number | null;
}

export const SubjectSelector = ({ onSelect, selectedId }: SubjectSelectorProps) => {
  // Usamos 'loading' del hook useSubjects
  const { subjects, loading } = useSubjects();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onSelect(val ? parseInt(val) : null);
  };

  return (
    <HStack gap={4} mb={6} width="full" justify="center" alignItems="flex-end">
      <Button 
        variant={selectedId === null ? "solid" : "outline"} 
        colorPalette="blue"
        onClick={() => onSelect(null)}
        size="sm"
        height="40px"
      >
        Global
      </Button>

      <Field.Root width="250px" disabled={loading}>
        <Field.Label fontSize="xs" mb={1}>Filtrar por asignatura</Field.Label>
        <select
          value={selectedId || ""}
          onChange={handleChange}
          style={{
            width: "100%",
            height: "40px",
            padding: "0 10px",
            borderRadius: "6px",
            border: "1px solid #E2E8F0",
            backgroundColor: "white",
            color: "black",
            fontSize: "14px"
          }}
        >
          <option value="">Selecciona asignatura...</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </Field.Root>
    </HStack>
  );
};