import { Button } from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';

interface RegisterSubmitButtonProps {
  loading: boolean;
}

/**
 * Botón de envío del formulario de registro.
 * Muestra estado de carga mientras se procesa la petición.
 */
export const RegisterSubmitButton = ({ loading }: RegisterSubmitButtonProps) => {
  return (
    <Button
      type="submit"
      bg="brand.500"
      color="bg"
      w="full"
      loading={loading}
      loadingText="Creando cuenta..."
      _hover={{ bg: 'brand.600' }}
    >
      Crear Cuenta
      <ArrowRight size={16} />
    </Button>
  );
};
