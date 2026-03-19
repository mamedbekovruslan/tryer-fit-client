import apiClient from '@/lib/api';
import { normalizeTrainer } from './modelAdapters';

export interface Trainer {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: string;
  height?: number;
  weight?: number;
  phone?: string;
  birth_date?: string;
  birthDate?: string;
  education?: string;
  institution?: string;
  degree?: string;
  specialization?: string;
  certificate_number?: string;
  photo_urls?: string[];
  certificateNumber?: string;
  photoUrls?: string[];
  created_at: string;
  updated_at: string;
  createdAt?: string;
  updatedAt?: string;
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
      return normalizeTrainer(response.data) as Trainer;
    } catch (error) {
      throw error;
    }
  },

  getMyTrainerProfile: async (): Promise<Trainer> => {
    try {
      const response = await apiClient.get('/trainers/profile');
      return normalizeTrainer(response.data) as Trainer;
    } catch (error) {
      throw error;
    }
  },

  getTrainerById: async (id: number): Promise<Trainer> => {
    try {
      const response = await apiClient.get(`/trainers/${id}`);
      return normalizeTrainer(response.data) as Trainer;
    } catch (error) {
      throw error;
    }
  },

  updateTrainer: async (id: number, data: UpdateTrainerData): Promise<Trainer> => {
    try {
      const response = await apiClient.put(`/trainers/${id}`, data);
      return normalizeTrainer(response.data) as Trainer;
    } catch (error) {
      throw error;
    }
  },

  updateTrainerField: async (id: number, field: string, value: any): Promise<Trainer> => {
    try {
      const data: Partial<UpdateTrainerData> = {};
      data[field as keyof UpdateTrainerData] = value;

      const response = await apiClient.patch(`/trainers/${id}`, data);
      return normalizeTrainer(response.data) as Trainer;
    } catch (error) {
      throw error;
    }
  },

  getClientsByTrainerId: async (trainerId: number): Promise<any[]> => {
    try {
      const response = await apiClient.get(`/trainers/${trainerId}/clients`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUnassignedClients: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get('/trainers/unassigned-clients');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  assignClientToTrainer: async (trainerId: number, clientId: number): Promise<any> => {
    try {
      const response = await apiClient.put(`/trainers/${trainerId}/assign-client/${clientId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  unassignClientFromTrainer: async (trainerId: number, clientId: number): Promise<any> => {
    try {
      const response = await apiClient.delete(`/trainers/${trainerId}/unassign-client/${clientId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
