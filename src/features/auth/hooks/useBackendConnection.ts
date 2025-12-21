import { useEffect, useState } from 'react';
import { appService } from '@/services/appService';

interface BackendConnectionState {
  message: string | null;
  loading: boolean;
  error: string | null;
}

export const useBackendConnection = (): BackendConnectionState => {
  const [state, setState] = useState<BackendConnectionState>({
    message: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const response = await appService.getHello();
        setState({
          message: response.message,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error('Failed to fetch data from backend:', err);
        setState({
          message: null,
          loading: false,
          error: 'Failed to connect to backend service',
        });
      }
    };

    fetchBackendData();
  }, []);

  return state;
};