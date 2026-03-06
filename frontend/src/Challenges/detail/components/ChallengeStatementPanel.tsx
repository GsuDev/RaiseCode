import { Card, Heading, Box } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

interface Props {
  statement: string;
}

export const ChallengeStatementPanel = ({ statement }: Props) => {
  return (
    <Card.Root 
      bg="bg.panel" 
      borderWidth="1px" 
      borderColor="border" 
      borderRadius="xl" 
      w="full"
      shadow="sm"
    >
      <Card.Header pb="2">
        <Heading size="md">Enunciado del Reto</Heading>
      </Card.Header>
      <Card.Body>
        <Box 
          color="fg.muted"
          fontSize="md"
          lineHeight="tall"
          css={{
            // Estilos para que el Markdown se vea bien dentro de Chakra
            "& p": { marginBottom: "1rem" },
            "& h2, & h3": { color: "fg", fontWeight: "bold", marginTop: "1rem", marginBottom: "0.5rem" },
            "& code": { bg: "bg.subtle", px: "1", borderRadius: "sm", fontFamily: "mono" },
            "& pre": { bg: "black", p: "4", borderRadius: "md", overflowX: "auto", my: "4" },
            "& ul": { marginLeft: "1.5rem", marginBottom: "1rem" }
          }}
        >
          {/* Aquí es donde pasamos el texto a la librería */}
          <ReactMarkdown>{statement}</ReactMarkdown>
        </Box>
      </Card.Body>
    </Card.Root>
  );
};