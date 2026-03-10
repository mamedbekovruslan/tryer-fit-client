import apiClient from '@/lib/api';

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

export interface UpdateTrainerData {
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
}

export interface CreateTrainerRequest {
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
  birth_date?: string;
  education?: string;
  institution?: string;
  degree?: string;
  specialization?: string;
  certificate_number?: string;
  photo_urls?: string[];
}

export const trainerService = {
  register: async (trainerData: CreateTrainerRequest): Promise<Trainer> => {
    try {
      const response = await apiClient.post('/trainers/register', trainerData);
      return response.data;
    } catch (error) {
      console.error('Error registering trainer:', error);
      throw error;
    }
  },

  getMyTrainerProfile: async (): Promise<Trainer> => {
    try {
      // Используем эндпоинт /trainers/profile, который должен возвращать полную информацию о текущем тренере
      // Этот эндпоинт нужно реализовать на бэкенде по аналогии с /clients/profile
      const response = await apiClient.get('/trainers/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching trainer profile:', error);
      throw error;
    }
  },

  getTrainerById: async (id: number): Promise<Trainer> => {
    try {
      const response = await apiClient.get(`/trainers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trainer:', error);
      throw error;
    }
  },

  updateTrainer: async (id: number, data: UpdateTrainerData): Promise<Trainer> => {
    try {
      const response = await apiClient.put(`/trainers/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating trainer:', error);
      throw error;
    }
  },

  updateTrainerField: async (id: number, field: string, value: any): Promise<Trainer> => {
    try {
      const data: Partial<UpdateTrainerData> = {};
      data[field as keyof UpdateTrainerData] = value;

      const response = await apiClient.patch(`/trainers/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating trainer field ${field}:`, error);
      throw error;
    }
  },

  // Получить клиентов, привязанных к тренеру
  getClientsByTrainerId: async (trainerId: number): Promise<any[]> => {
    try {
      const response = await apiClient.get(`/trainers/${trainerId}/clients`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trainer clients:', error);
      throw error;
    }
  },

  // Получить клиентов, которые не привязаны ни к какому тренеру
  getUnassignedClients: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get('/trainers/unassigned-clients');
      return response.data;
    } catch (error) {
      console.error('Error fetching unassigned clients:', error);
      throw error;
    }
  },

  // Привязать клиента к тренеру
  assignClientToTrainer: async (trainerId: number, clientId: number): Promise<any> => {
    try {
      const response = await apiClient.put(`/trainers/${trainerId}/assign-client/${clientId}`);
      return response.data;
    } catch (error) {
      console.error('Error assigning client to trainer:', error);
      throw error;
    }
  },

  // Отвязать клиента от тренера
  unassignClientFromTrainer: async (trainerId: number, clientId: number): Promise<any> => {
    try {
      const response = await apiClient.delete(`/trainers/${trainerId}/unassign-client/${clientId}`);
      return response.data;
    } catch (error) {
      console.error('Error unassigning client from trainer:', error);
      throw error;
    }
  },
};
