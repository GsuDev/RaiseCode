import { Box, Text } from '@chakra-ui/react';
import { AlertCircle } from 'lucide-react';

interface RegisterErrorAlertProps {
  message: string;
}

/**
 * Alerta de error que se muestra cuando el registro falla.
 */
export const RegisterErrorAlert = ({ message }: RegisterErrorAlertProps) => {
  return (
    <Box
      display="flex"
      alignItems="flex-start"
      gap="2"
      p="3"
      borderRadius="md"
      bg="error.900"
      border="1px solid"
      borderColor="error.500"
      color="error.500"
    >
      <Box flexShrink={0} mt="0.5">
        <AlertCircle size={16} />
      </Box>
      <Text fontSize="sm">{message}</Text>
    </Box>
  );
};
