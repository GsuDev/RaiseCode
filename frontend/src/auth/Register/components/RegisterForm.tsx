import { useState } from 'react';
import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { Check, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useRegisterUser } from '../hooks/useRegisterUser';
import { RegisterInput } from './RegisterInput';
import { RegisterSubmitButton } from './RegisterSubmitButton';
import { RegisterErrorAlert } from './RegisterErrorAlert'; 

/**
 * Formulario de registro completo.
 * Gestiona el estado del formulario, validaciones visuales y envío al backend.
 */
export const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useRegisterUser();

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    cycle: '',
    password: '',
    passwordConfirm: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Requisitos visuales de la contraseña
  const passwordRequirements = [
    { label: 'Al menos 8 caracteres', met: formData.password.length >= 8 },
    { label: 'Una letra mayúscula', met: /[A-Z]/.test(formData.password) },
    { label: 'Una letra minúscula', met: /[a-z]/.test(formData.password) },
    { label: 'Un número', met: /[0-9]/.test(formData.password) },
  ];

  const passwordsMatch =
    formData.password === formData.passwordConfirm && formData.passwordConfirm.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await register(formData);
    if (result) {
      // TODO: Persistir el token cuando se implemente la HU de login (localStorage / contexto de auth)
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap="4" align="stretch">

        {/* Alerta de error del servidor */}
        {error && <RegisterErrorAlert message={error} />}

        {/* Nombre */}
        <RegisterInput
          label="Nombre"
          placeholder="Tu nombre"
          value={formData.nombre}
          onChange={(v) => handleChange('nombre', v)}
          leftIcon={<User size={16} />}
        />

        {/* Apellidos */}
        <RegisterInput
          label="Apellidos"
          placeholder="Tus apellidos"
          value={formData.apellidos}
          onChange={(v) => handleChange('apellidos', v)}
          leftIcon={<User size={16} />}
        />

        {/* Email */}
        <RegisterInput
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={(v) => handleChange('email', v)}
          leftIcon={<Mail size={16} />}
        />

        {/* Ciclo formativo */}
        <Box>
          <Text mb="2" fontSize="sm" fontWeight="medium" color="fg">
            Ciclo formativo
          </Text>
          <Box
            as="select"
            w="full"
            h="10"
            px="3"
            borderRadius="md"
            bg="bg.subtle"
            border="1px solid"
            borderColor="border"
            color={formData.cycle ? 'fg' : 'fg.muted'}
            value={formData.cycle}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleChange('cycle', e.target.value)
            }
            _focus={{ borderColor: 'brand.500', outline: 'none' }}
          >
            <option value="">Selecciona tu ciclo</option>
            <option value="DAW">DAW - Desarrollo de Aplicaciones Web</option>
            <option value="DAM">DAM - Desarrollo de Aplicaciones Multiplataforma</option>
            <option value="ASIR">ASIR - Administración de Sistemas</option>
            {/* TODO: Gestionar el rol "profesor" cuando se implemente en el backend */}
          </Box>
        </Box>

        {/* Contraseña */}
        <Box>
          <RegisterInput
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            placeholder="********"
            value={formData.password}
            onChange={(v) => handleChange('password', v)}
            leftIcon={<Lock size={16} />}
            rightElement={
              <Box
                as="button"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                _hover={{ color: 'fg' }}
                display="flex"
                alignItems="center"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Box>
            }
          />
          {/* Indicador de requisitos de contraseña */}
          {formData.password.length > 0 && (
            <VStack mt="2" gap="1" align="stretch">
              {passwordRequirements.map((req) => (
                <HStack key={req.label} gap="2">
                  <Flex
                    h="4"
                    w="4"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="full"
                    bg={req.met ? 'brand.500' : 'bg.subtle'}
                    flexShrink={0}
                  >
                    {req.met && <Check size={10} color="white" />}
                  </Flex>
                  <Text fontSize="xs" color={req.met ? 'brand.500' : 'fg.muted'}>
                    {req.label}
                  </Text>
                </HStack>
              ))}
            </VStack>
          )}
        </Box>

        {/* Confirmar contraseña */}
        <Box>
          <RegisterInput
            label="Confirmar contraseña"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="********"
            value={formData.passwordConfirm}
            onChange={(v) => handleChange('passwordConfirm', v)}
            leftIcon={<Lock size={16} />}
            rightElement={
              <Box
                as="button"
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                _hover={{ color: 'fg' }}
                display="flex"
                alignItems="center"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Box>
            }
          />
          {formData.passwordConfirm.length > 0 && (
            <Text fontSize="xs" mt="1" color={passwordsMatch ? 'brand.500' : 'error.500'}>
              {passwordsMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
            </Text>
          )}
        </Box>

        <RegisterSubmitButton loading={loading} />

      </VStack>
    </form>
  );
};
