import { Box, Input, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface RegisterInputProps {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
}

/**
 * Input reutilizable para el formulario de registro.
 * Acepta icono izquierdo y elemento derecho (ej: botón mostrar contraseña).
 */
export const RegisterInput = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  leftIcon,
  rightElement,
}: RegisterInputProps) => {
  return (
    <Box>
      <Text mb="2" fontSize="sm" fontWeight="medium" color="fg">
        {label}
      </Text>
      <Box position="relative">
        {leftIcon && (
          <Box
            position="absolute"
            left="3"
            top="50%"
            transform="translateY(-50%)"
            color="fg.muted"
            zIndex="1"
            pointerEvents="none"
          >
            {leftIcon}
          </Box>
        )}
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          pl={leftIcon ? '10' : '3'}
          pr={rightElement ? '10' : '3'}
          bg="bg.subtle"
          border="1px solid"
          borderColor="border"
          color="fg"
          _placeholder={{ color: 'fg.muted' }}
          _focus={{ borderColor: 'brand.500', outline: 'none' }}
        />
        {rightElement && (
          <Box
            position="absolute"
            right="3"
            top="50%"
            transform="translateY(-50%)"
            color="fg.muted"
          >
            {rightElement}
          </Box>
        )}
      </Box>
    </Box>
  );
};
