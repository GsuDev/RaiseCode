import { useState } from 'react';
import { VStack, Box } from '@chakra-ui/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router';
import { RegisterInput } from '../../Register/components/RegisterInput'; 
import { RegisterSubmitButton } from '../../Register/components/RegisterSubmitButton'; 
import { RegisterErrorAlert } from '../../Register/components/RegisterErrorAlert'; 
import { useLogin } from '../hooks/useLogin';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(formData);
    if (result) {
      localStorage.setItem('token', result.access_token);
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap="4" align="stretch">
        {error && <RegisterErrorAlert message={error} />}
        
        <RegisterInput
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={(v) => setFormData({ ...formData, email: v })}
          leftIcon={<Mail size={16} />}
        />

        <Box>
          <RegisterInput
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            placeholder="********"
            value={formData.password}
            onChange={(v) => setFormData({ ...formData, password: v })}
            leftIcon={<Lock size={16} />}
            rightElement={
              <Box as="button" type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Box>
            }
          />
        </Box>

        <RegisterSubmitButton loading={loading} />
      </VStack>
    </form>
  );
};