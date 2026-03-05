import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import { Eye } from 'lucide-react';
import { useAuth } from '@/auth/context/AuthContext';
import { useChallengeForm } from './hooks/useChallengeForm';
import { useChallengeOptions } from './hooks/useChallengeOptions';
import { useCreateChallenge } from './hooks/useCreateChallenge';
import { ChallengeStepIndicator } from './components/ChallengeStepIndicator';
import { StepBasicInfo } from './components/steps/StepBasicInfo';
import { StepStatement } from './components/steps/StepStatement';
import { StepTests } from './components/steps/StepTests';
import { ChallengePreview } from './components/preview/ChallengePreview';

/**
 * Página de creación de reto en 3 pasos.
 * Ruta: /crear-reto
 * Protegida: redirige a /login si el usuario no está autenticado.
 */
export const CreateChallengePage = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
  }, [isLoggedIn, navigate]);

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [completedUpTo, setCompletedUpTo] = useState(1);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { form, updateField } = useChallengeForm();
  const { options, loading: optionsLoading } = useChallengeOptions();
  const { submit, loading: submitLoading } = useCreateChallenge();

  const goToStep = (step: 1 | 2 | 3) => setCurrentStep(step);

  const handleNext = (from: 1 | 2) => {
    const next = (from + 1) as 2 | 3;
    setCurrentStep(next);
    if (next > completedUpTo) setCompletedUpTo(next);
  };

  const handleSubmit = async () => {
    await submit(form);
  };

  if (!isLoggedIn) return null;

  return (
    <Box minH="calc(100vh - 4rem)" bg="bg.canvas" p={{ base: '4', md: '8' }}>
      <Box maxW="4xl" mx="auto">
        {/* Cabecera de la página */}
        <Flex align="flex-start" justify="space-between" mb="6">
          <Box>
            <Text fontWeight="bold" fontSize="3xl" color="fg">
              Crear Nuevo Reto
            </Text>
            <Text color="fg.muted" mt="1">
              Crea un reto de programación para la comunidad.
            </Text>
          </Box>
          <Button
            variant="outline"
            borderColor="border"
            color="fg"
            onClick={() => setPreviewOpen(true)}
            _hover={{ bg: 'bg.subtle' }}
          >
            <Eye size={16} />
            Vista Previa
          </Button>
        </Flex>

        {/* Indicador de pasos */}
        <Box mb="4">
          <ChallengeStepIndicator
            currentStep={currentStep}
            onGoTo={goToStep}
            completedUpTo={completedUpTo}
          />
        </Box>

        {/* Panel del step activo */}
        <Box
          border="1px solid"
          borderColor="border"
          borderRadius="xl"
          bg="bg.panel"
          overflow="hidden"
          minH="500px"
        >
          {currentStep === 1 && (
            <StepBasicInfo
              form={form}
              updateField={updateField}
              languages={options.languages}
              subjects={options.subjects}
              difficulties={options.difficulties}
              optionsLoading={optionsLoading}
              onNext={() => handleNext(1)}
            />
          )}
          {currentStep === 2 && (
            <StepStatement
              form={form}
              updateField={updateField}
              onBack={() => goToStep(1)}
              onNext={() => handleNext(2)}
            />
          )}
          {currentStep === 3 && (
            <StepTests
              form={form}
              updateField={updateField}
              onBack={() => goToStep(2)}
              onPreview={() => setPreviewOpen(true)}
              onSubmit={handleSubmit}
              submitLoading={submitLoading}
            />
          )}
        </Box>
      </Box>

      {/* Modal de vista previa */}
      <ChallengePreview
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        languages={options.languages}
        subjects={options.subjects}
        difficulties={options.difficulties}
        submitLoading={submitLoading}
      />
    </Box>
  );
};
