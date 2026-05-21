import { useState, useEffect } from 'react';
import { registrationStatusService } from '../services/registrationStatus.service';

interface UseRegistrationStatusReturn {
  registrationEnabled: boolean;
  isLoading: boolean;
}

export const useRegistrationStatus = (): UseRegistrationStatusReturn => {
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    registrationStatusService.isEnabled().then((enabled) => {
      setRegistrationEnabled(enabled);
      setIsLoading(false);
    });
  }, []);

  return { registrationEnabled, isLoading };
};
