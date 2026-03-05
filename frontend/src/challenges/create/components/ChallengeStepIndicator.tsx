import { Button, HStack } from '@chakra-ui/react';
import { FileText, Code2, FlaskConical } from 'lucide-react';

interface Props {
  currentStep: 1 | 2 | 3;
  onGoTo: (step: 1 | 2 | 3) => void;
  completedUpTo: number; // máximo step al que se puede navegar
}

const STEPS = [
  { id: 1 as const, label: 'Info Básica',  icon: FileText },
  { id: 2 as const, label: 'Enunciado',    icon: Code2 },
  { id: 3 as const, label: 'Tests',        icon: FlaskConical },
];

/**
 * Barra de progreso de 3 pasos.
 * - Paso activo: fondo verde, texto blanco.
 * - Paso completado (< currentStep y <= completedUpTo): borde verde, texto verde, clickable.
 * - Paso pendiente (> completedUpTo): gris, deshabilitado.
 */
export const ChallengeStepIndicator = ({ currentStep, onGoTo, completedUpTo }: Props) => {
  return (
    <HStack gap="2" w="full">
      {STEPS.map(({ id, label, icon: Icon }) => {
        const isActive    = id === currentStep;
        const isCompleted = id < currentStep && id <= completedUpTo;
        const isDisabled  = id > completedUpTo;

        return (
          <Button
            key={id}
            flex="1"
            size="md"
            onClick={() => !isDisabled && onGoTo(id)}
            disabled={isDisabled}
            bg={isActive ? 'brand.500' : 'transparent'}
            color={isActive ? 'white' : isCompleted ? 'brand.500' : 'fg.muted'}
            border="1px solid"
            borderColor={isActive ? 'brand.500' : isCompleted ? 'brand.500' : 'border'}
            _hover={isDisabled ? {} : { bg: isActive ? 'brand.600' : 'bg.subtle' }}
            cursor={isDisabled ? 'not-allowed' : 'pointer'}
          >
            <Icon size={16} />
            {label}
          </Button>
        );
      })}
    </HStack>
  );
};
