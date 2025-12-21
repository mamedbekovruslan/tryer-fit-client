import apiClient from '@/lib/api';

export interface AppResponse {
  message: string;
}

export const appService = {
  getHello: async (): Promise<AppResponse> => {
    try {
      const response = await apiClient.get('/');
      return { message: response.data };
    } catch (error) {
      console.error('Error calling getHello:', error);
      throw error;
    }
  },
};