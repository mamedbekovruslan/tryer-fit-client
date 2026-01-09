import apiClient from '@/lib/api';

export interface RegisterTrainerData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  gender?: string;
  height?: number;
  weight?: number;
  phone?: string;
  birth_date?: string; // ISO string format
  // Данные профиля тренера
  education?: string;
  institution?: string;
  degree?: string;
  specialization?: string;
  certificate_number?: string;
  photo_urls?: string[];
}

export interface TrainerResponse {
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
  birth_date?: string; // ISO string format
  // Поля профиля тренера
  education?: string;
  institution?: string;
  degree?: string;
  specialization?: string;
  certificate_number?: string;
  photo_urls?: string[];
  created_at: string;
  updated_at: string;
}

export const trainerService = {
  register: async (trainerData: RegisterTrainerData): Promise<TrainerResponse> => {
    try {
      const response = await apiClient.post('/trainers/register', trainerData);
      return response.data;
    } catch (error) {
      console.error('Trainer registration error:', error);
      throw error;
    }
  },
};