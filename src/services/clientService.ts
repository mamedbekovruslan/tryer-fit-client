import apiClient from '@/lib/api';
import { normalizeClient } from './modelAdapters';

export interface Client {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  firstName?: string;
  lastName?: string;
  waist_circumference?: number;
  chest_circumference?: number;
  hip_circumference?: number;
  arm_circumference?: number;
  leg_circumference?: number;
  waistCircumference?: number;
  chestCircumference?: number;
  hipCircumference?: number;
  armCircumference?: number;
  legCircumference?: number;
  fitness_goal?: string;
  expected_result?: string;
  contraindications?: string;
  diseases?: string;
  limitations?: string;
  training_experience?: string;
  current_diet?: string;
  photo_urls?: string[];
  fitnessGoal?: string;
  expectedResult?: string;
  trainingExperience?: string;
  currentDiet?: string;
  photoUrls?: string[];
  trainer?: any; // Тренер, связан с клиентом
}

export type ClientResponse = Client;

export interface ClientNutritionPlan {
  id: number;
  client: {
    id: number;
    username: string;
    email: string;
  };
  nutritionPlan: {
    id: number;
    name: string;
    description?: string;
    nutritionCategory?: {
      id: number;
      name: string;
      description?: string;
    };
  };
  isActive: boolean;
  assignedAt: string;
  updatedAt: string;
}

export interface AssignNutritionPlanRequest {
  nutritionPlanId: number;
  isActive?: boolean;
}

export interface UpdateClientProfileRequest {
  first_name?: string;
  last_name?: string;
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

export interface CreateClientRequest {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
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

export const clientService = {
  register: async (clientData: CreateClientRequest): Promise<Client> => {
    try {
      const response = await apiClient.post('/clients/register', clientData);
      return normalizeClient(response.data) as Client;
    } catch (error) {
      throw error;
    }
  },

  getMyProfile: async (): Promise<Client> => {
    try {
      const response = await apiClient.get('/clients/profile');
      return normalizeClient(response.data) as Client;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (profileData: UpdateClientProfileRequest): Promise<Client> => {
    try {
      const response = await apiClient.put('/clients/profile', profileData);
      return normalizeClient(response.data) as Client;
    } catch (error) {
      throw error;
    }
  },

  assignNutritionPlan: async (clientId: number, planData: AssignNutritionPlanRequest): Promise<ClientNutritionPlan> => {
    try {
      const response = await apiClient.post('/client-nutrition-plans', {
        clientId,
        nutritionPlanId: planData.nutritionPlanId,
        isActive: planData.isActive ?? true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getClientById: async (clientId: number): Promise<Client> => {
    try {
      const response = await apiClient.get(`/clients/${clientId}`);
      return normalizeClient(response.data) as Client;
    } catch (error) {
      throw error;
    }
  },

  getNutritionPlans: async (clientId: number): Promise<ClientNutritionPlan[]> => {
    try {
      const response = await apiClient.get(`/client-nutrition-plans/client/${clientId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
