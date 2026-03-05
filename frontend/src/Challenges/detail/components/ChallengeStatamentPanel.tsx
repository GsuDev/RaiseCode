import { Box, Card, Heading } from '@chakra-ui/react';

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
    >
      <Card.Header pb="2">
        <Heading size="md" color="fg">Enunciado del Reto</Heading>
      </Card.Header>
      <Card.Body>
        {/* Placeholder hasta integrar react-markdown */}
        <Box 
          fontFamily="mono" 
          whiteSpace="pre-wrap" 
          color="fg.muted"
          fontSize="md"
          lineHeight="tall"
        >
          {statement}
        </Box>
      </Card.Body>
    </Card.Root>
  );
};