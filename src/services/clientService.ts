import apiClient from '@/lib/api';

export interface RegisterClientData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  // Данные профиля
  waist_circumference?: number;
  chest_circumference?: number;
  hip_circumference?: number;
  arm_circumference?: number;
  leg_circumference?: number;
  fitness_goal?: string;
  expected_result?: string;
  contraindications?: string;
  diseases?: string;
  limitations?: string;
  training_experience?: string;
  current_diet?: string;
  photo_urls?: string[];
}

export interface Trainer {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  gender?: string;
  height?: number;
  weight?: number;
  phone?: string;
  birth_date?: string;
  education?: string;
  institution?: string;
  degree?: string;
  specialization?: string;
  certificate_number?: string;
  photo_urls?: string[];
  created_at: string;
  updated_at: string;
}

export interface ClientResponse {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  trainer?: Trainer; // Добавляем информацию о тренере
  // Поля профиля
  waist_circumference?: number;
  chest_circumference?: number;
  hip_circumference?: number;
  arm_circumference?: number;
  leg_circumference?: number;
  fitness_goal?: string;
  expected_result?: string;
  contraindications?: string;
  diseases?: string;
  limitations?: string;
  training_experience?: string;
  current_diet?: string;
  photo_urls?: string[];
  created_at: string;
  updated_at: string;
}


export const clientService = {
  register: async (clientData: RegisterClientData): Promise<ClientResponse> => {
    try {
      const response = await apiClient.post('/clients/register', clientData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  getMyProfile: async (): Promise<ClientResponse> => {
    try {
      const response = await apiClient.get('/clients/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  getClientWithTrainer: async (clientId: number): Promise<ClientResponse> => {
    try {
      const response = await apiClient.get(`/clients/${clientId}`);
      return response.data;
    } catch (error) {
      console.error('Get client with trainer error:', error);
      throw error;
    }
  },
};