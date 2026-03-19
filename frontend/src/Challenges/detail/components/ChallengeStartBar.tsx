import { Box, Button, Container, Flex, Text, VStack } from '@chakra-ui/react';
import { Play } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../auth/context/AuthContext';

export const ChallengeStartBar = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  

  const isLoggedIn = !!user; 

  const handleStart = () => {
    if (isLoggedIn) {
      navigate(`/retos/${id}/resolver`);
    } else {
      // Si no está logueado, se le envia al login
      navigate('/login');
    }
  };

  return (
    <Box
      w="full"
      bg="bg.panel"
      borderTopWidth="1px"
      borderColor="bg.subtle"
      py="4"
      boxShadow="0 -4px 12px rgba(0,0,0,0.05)"
      flexShrink={0}
    >
      <Container maxW="7xl">
        <Flex
          justify="space-between"
          align="center"
          direction={{ base: 'column', sm: 'row' }}
          gap={{ base: '3', sm: '0' }}
        >
          <VStack align={{ base: 'center', sm: 'start' }} gap="0">
            <Text fontWeight="bold" fontSize="lg">¿Listo para el desafío?</Text>
            <Text fontSize="sm" color="fg.muted" textAlign={{ base: 'center', sm: 'left' }}>
              {isLoggedIn
                ? 'Demuestra tus habilidades y gana 100 puntos.'
                : 'Inicia sesión para poder resolver este reto.'}
            </Text>
          </VStack>
          <Button
            colorPalette="green"
            size="lg"
            px="8"
            borderRadius="full"
            w={{ base: 'full', sm: 'auto' }}
            onClick={handleStart}
          >
            <Box as="span" display="inline-flex" mr="2">
              <Play size={18} fill="currentColor" />
            </Box>
            {isLoggedIn ? 'Comenzar Reto' : 'Iniciar sesión para jugar'}
          </Button>
        </Flex>
      </Container>
    </Box>
  );
};