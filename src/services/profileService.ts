import apiClient from '@/lib/api';
import { Client } from './clientService';

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  user_type: 'client' | 'trainer';
  trainer?: any;
}

export interface ClientWithTrainer extends Client {
  trainer?: any;
}

export const profileService = {
  getMyProfile: async (): Promise<UserProfile> => {
    try {
      const response = await apiClient.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  getClientWithTrainer: async (clientId: number): Promise<ClientWithTrainer> => {
    try {
      const response = await apiClient.get(`/clients/${clientId}`);
      return response.data;
    } catch (error) {
      console.error('Get client with trainer error:', error);
      throw error;
    }
  },
};