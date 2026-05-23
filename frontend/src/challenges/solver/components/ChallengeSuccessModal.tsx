import { Box, Button, Text, VStack, HStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { Trophy } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ChallengeSuccessModal = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <Box
      position="fixed" inset="0" zIndex="modal"
      bg="blackAlpha.700" backdropFilter="blur(4px)"
      display="flex" alignItems="center" justifyContent="center"
      p="4"
    >
      <Box
        bg="bg.panel"
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="border"
        p="10"
        maxW="md"
        w="full"
        textAlign="center"
        onClick={(e) => e.stopPropagation()}
      >
        <VStack gap="6">
          <Box color="brand.500">
            <Trophy size={56} strokeWidth={1.5} />
          </Box>

          <VStack gap="2">
            <Text fontSize="2xl" fontWeight="bold" fontFamily="heading">
              ¡Reto completado!
            </Text>
            <Text color="fg.muted" fontSize="md">
              Has resuelto el reto correctamente. ¡Buen trabajo!
            </Text>
          </VStack>

          <HStack gap="3" w="full">
            <Button
              flex="1"
              variant="outline"
              borderColor="border"
              onClick={() => navigate('/')}
            >
              Ir al inicio
            </Button>
            <Button
              flex="1"
              bg="primary.solid"
              color="primary.contrast"
              _hover={{ opacity: 0.9 }}
              onClick={() => navigate('/perfil')}
            >
              Ver mi perfil
            </Button>
          </HStack>

          <Text
            fontSize="sm"
            color="fg.muted"
            cursor="pointer"
            _hover={{ color: 'fg.DEFAULT' }}
            onClick={onClose}
          >
            Seguir practicando
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};
