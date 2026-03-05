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
      borderColor="bg.subtle" 
      borderRadius="xl" 
      w="full"
      shadow="sm"
    >
      <Card.Header pb="2">
        <Heading size="md" color="fg">Enunciado del Reto</Heading>
      </Card.Header>
      <Card.Body>
        <Box 
          color="fg.muted"
          fontSize="md"
          lineHeight="relaxed"
          className="markdown-container"
        >
          {/* Aquí ocurre la magia del Markdown */}
          <ReactMarkdown>{statement}</ReactMarkdown>
        </Box>
      </Card.Body>
    </Card.Root>
  );
};