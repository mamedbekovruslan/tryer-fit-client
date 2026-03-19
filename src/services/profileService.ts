import apiClient from '@/lib/api';
import { Client } from './clientService';
import { normalizeAuthUser, normalizeClient } from './modelAdapters';

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  user_type: 'client' | 'trainer';
  userType?: 'client' | 'trainer';
  trainer?: any;
}

export interface ClientWithTrainer extends Client {
  trainer?: any;
}

export const profileService = {
  getMyProfile: async (): Promise<UserProfile> => {
    try {
      const response = await apiClient.get('/auth/profile');
      return normalizeAuthUser(response.data) as UserProfile;
    } catch (error) {
      throw error;
    }
  },

  getClientWithTrainer: async (clientId: number): Promise<ClientWithTrainer> => {
    try {
      const response = await apiClient.get(`/clients/${clientId}`);
      return normalizeClient(response.data) as ClientWithTrainer;
    } catch (error) {
      throw error;
    }
  },
};
