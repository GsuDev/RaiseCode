import { useState } from 'react';
import { type ChallengeFormState, EMPTY_FORM } from '../types';

/**
 * Hook que gestiona el estado completo del formulario multistep.
 * Se instancia en CreateChallengePage y se pasa como props a cada step.
 */
export const useChallengeForm = () => {
  const [form, setForm] = useState<ChallengeFormState>(EMPTY_FORM);

  const updateField = <K extends keyof ChallengeFormState>(
    field: K,
    value: ChallengeFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const reset = () => setForm(EMPTY_FORM);

  return { form, updateField, reset };
};
