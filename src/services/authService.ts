import apiClient from '@/lib/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  user_type: 'client' | 'trainer';
  trainer?: any; // Информация о тренере для клиентов
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
};