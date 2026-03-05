import { Button } from '@chakra-ui/react';
import { LogIn } from 'lucide-react';

interface LoginSubmitButtonProps {
  loading: boolean;
}

export const LoginSubmitButton = ({ loading }: LoginSubmitButtonProps) => {
  return (
    <Button
      type="submit"
      bg="brand.500"
      color="bg"
      w="full"
      loading={loading}
      loadingText="Iniciando sesión..."
      _hover={{ bg: 'brand.600' }}
    >
      <LogIn size={16} />
      Iniciar Sesión
    </Button>
  );
};
