import { useState } from 'react';
import { adminUsersService } from '../service/adminUsers.service';
import type { GeneratedUserCredentials } from '../service/adminUsers.service';
import { createToaster } from '@chakra-ui/react';

const toaster = createToaster({
  placement: 'top-end',
  duration: 4000,
});

interface UseBulkUserCreationState {
  credentials: GeneratedUserCredentials[];
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export const useBulkUserCreation = () => {
  const [state, setState] = useState<UseBulkUserCreationState>({
    credentials: [],
    isLoading: false,
    error: null,
    success: false,
  });

  const createBulkUsers = async (prefix: string, count: number) => {
    setState({
      credentials: [],
      isLoading: true,
      error: null,
      success: false,
    });

    try {
      const result = await adminUsersService.createBulkGenericUsers(
        prefix,
        count
      );

      setState({
        credentials: result,
        isLoading: false,
        error: null,
        success: true,
      });

      toaster.create({
        title: 'Éxito',
        description: `${result.length} usuarios generados correctamente`,
        type: 'success',
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';

      setState({
        credentials: [],
        isLoading: false,
        error: errorMessage,
        success: false,
      });

      toaster.create({
        title: 'Error',
        description: errorMessage,
        type: 'error',
      });
    }
  };

  const clearCredentials = () => {
    setState({
      credentials: [],
      isLoading: false,
      error: null,
      success: false,
    });
  };

  return {
    ...state,
    createBulkUsers,
    clearCredentials,
  };
};
