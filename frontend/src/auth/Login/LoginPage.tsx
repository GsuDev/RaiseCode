import { Box, Button, Flex, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import LogoSrc from 'src/assets/Logo.svg';
import { LoginForm } from './components/LoginForm';
import { useRegistrationStatus } from 'src/auth/Register/hooks/useRegistrationStatus';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { registrationEnabled } = useRegistrationStatus();

  return (
    <Flex minH="calc(100vh - 4rem)" alignItems="center" justifyContent="center" py="8">
      <Box w="full" maxW="md" px={{ base: '4', md: '0' }}>
        <VStack mb="8">
          <Flex h="14" w="14" alignItems="center" justifyContent="center">
            <Image src={LogoSrc} alt="RaiseCode" w="full" h="full" />
          </Flex>
          <Text fontWeight="bold" fontSize="2xl">RaiseCode</Text>
          <Text color="fg.muted">Bienvenido de nuevo</Text>
        </VStack>

        <Box border="1px solid" borderColor="border" borderRadius="xl" bg="bg.panel" p="6">
          <VStack mb="6">
            <Text fontWeight="bold" fontSize="xl">Iniciar Sesión</Text>
          </VStack>

          <LoginForm />

          <Flex alignItems="center" my="6">
            <Box flex="1" h="1px" bg="border" />
            <Text px="3" fontSize="xs" color="fg.muted">O CONTINÚA CON</Text>
            <Box flex="1" h="1px" bg="border" />
          </Flex>

          <HStack gap="4">
            <Button flex="1" variant="outline" disabled>Google</Button>
            <Button flex="1" variant="outline" disabled>GitHub</Button>
          </HStack>

          <Text mt="6" textAlign="center" color="fg.muted" fontSize="sm">
            ¿No tienes cuenta?{' '}
            {registrationEnabled ? (
              <Text as="button" color="brand.500" onClick={() => navigate('/registro')} _hover={{ textDecoration: 'underline' }}>
                Regístrate gratis
              </Text>
            ) : (
              <Text as="span" color="fg.subtle" fontStyle="italic">
                Registro desactivado temporalmente
              </Text>
            )}
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};