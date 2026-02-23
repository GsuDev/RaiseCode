import { Box, Button, Flex, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import LogoSrc from 'src/assets/Logo.svg';
import { RegisterForm } from './components/RegisterForm';

/**
 * Página de registro. Contiene el header con logo, el formulario
 * y los accesos rápidos a login y registro con terceros.
 */
export const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <Flex minH="calc(100vh - 4rem)" alignItems="center" justifyContent="center" py="8">
      <Box w="full" maxW="md" px={{ base: '4', md: '0' }}>

        {/* Logo y título */}
        <VStack mb="8">
          <Flex h="14" w="14" alignItems="center" justifyContent="center" borderRadius="xl">
            <Image src={LogoSrc} alt="RaiseCode" w="full" h="full" />
          </Flex>
          <Text fontWeight="bold" fontSize="2xl" color="fg" fontFamily="var(--chakra-fonts-heading)">
            RaiseCode
          </Text>
          <Text color="fg.muted">Únete a la comunidad de programadores</Text>
        </VStack>

        {/* Tarjeta del formulario */}
        <Box
          border="1px solid"
          borderColor="border"
          borderRadius="xl"
          bg="bg.panel"
          p="6"
        >
          <VStack mb="6">
            <Text fontWeight="bold" fontSize="xl" color="fg">
              Crear Cuenta
            </Text>
            <Text color="fg.muted" fontSize="sm" textAlign="center">
              Regístrate para empezar a resolver y crear retos
            </Text>
          </VStack>

          {/* Formulario */}
          <RegisterForm />

          {/* Divisor */}
          <Flex alignItems="center" my="6">
            <Box flex="1" h="1px" bg="border" />
            <Text px="3" fontSize="xs" color="fg.muted" textTransform="uppercase">
              O regístrate con
            </Text>
            <Box flex="1" h="1px" bg="border" />
          </Flex>

          {/* TODO: Implementar registro con Google y GitHub (OAuth) en una HU posterior */}
          <HStack gap="4">
            <Button
              flex="1"
              variant="outline"
              borderColor="border"
              color="fg"
              bg="transparent"
              _hover={{ bg: 'bg.subtle' }}
              disabled
            >
              Google
            </Button>
            <Button
              flex="1"
              variant="outline"
              borderColor="border"
              color="fg"
              bg="transparent"
              _hover={{ bg: 'bg.subtle' }}
              disabled
            >
              GitHub
            </Button>
          </HStack>

          {/* Enlace a login */}
          <Text mt="6" textAlign="center" color="fg.muted" fontSize="sm">
            ¿Ya tienes una cuenta?{' '}
            <Text
              as="button"
              color="brand.500"
              fontWeight="medium"
              onClick={() => navigate('/login')}
              _hover={{ textDecoration: 'underline' }}
            >
              Inicia sesión
            </Text>
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};
