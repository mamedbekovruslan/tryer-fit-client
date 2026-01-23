import apiClient from '@/lib/api';

// Типы данных
export interface Client {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
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
  trainer?: any; // Тренер, связан с клиентом
  // другие поля клиента
}

export interface ClientNutritionPlan {
  id: number;
  client_id: number;
  day_id: number;
  category_id: number;
  subcategory_id: number;
  assigned_at: string;
  day: {
    id: number;
    name: string;
    description: string;
    subcategory_id: number;
  };
  category: {
    id: number;
    name: string;
    description: string;
  };
  subcategory: {
    id: number;
    name: string;
    description: string;
    category_id: number;
  };
}

export interface AssignNutritionPlanRequest {
  day_id: number;
  category_id: number;
  subcategory_id: number;
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

export const clientService = {
  // Получение профиля текущего клиента
  getMyProfile: async (): Promise<Client> => {
    try {
      const response = await apiClient.get('/clients/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching client profile:', error);
      throw error;
    }
  },

  // Обновление профиля текущего клиента
  updateProfile: async (profileData: UpdateClientProfileRequest): Promise<Client> => {
    try {
      const response = await apiClient.put('/clients/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating client profile:', error);
      throw error;
    }
  },

  // Назначение плана питания клиенту
  assignNutritionPlan: async (clientId: number, planData: AssignNutritionPlanRequest): Promise<ClientNutritionPlan> => {
    // Пока используем моковые данные до реализации API
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockPlan: ClientNutritionPlan = {
          id: Date.now(), // простая генерация ID
          client_id: clientId,
          day_id: planData.day_id,
          category_id: planData.category_id,
          subcategory_id: planData.subcategory_id,
          assigned_at: new Date().toISOString(),
          day: {
            id: planData.day_id,
            name: `День ${planData.day_id}`,
            description: 'Описание дня питания',
            subcategory_id: planData.subcategory_id
          },
          category: {
            id: planData.category_id,
            name: `Категория ${planData.category_id}`,
            description: 'Описание категории'
          },
          subcategory: {
            id: planData.subcategory_id,
            name: `Подкатегория ${planData.subcategory_id}`,
            description: 'Описание подкатегории',
            category_id: planData.category_id
          }
        };
        resolve(mockPlan);
      }, 500); // Имитация задержки сети
    });

    // В реальной реализации:
    // try {
    //   const response = await apiClient.post(`/clients/${clientId}/nutrition-plan`, planData);
    //   return response.data;
    // } catch (error) {
    //   console.error(`Error assigning nutrition plan to client ${clientId}:`, error);
    //   throw error;
    // }
  },

  // Получение назначенных планов питания для клиента
  getNutritionPlans: async (clientId: number): Promise<ClientNutritionPlan[]> => {
    // Пока используем моковые данные до реализации API
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockPlans: ClientNutritionPlan[] = [
          {
            id: 1,
            client_id: clientId,
            day_id: 1,
            category_id: 1,
            subcategory_id: 1,
            assigned_at: '2024-01-15T10:30:00Z',
            day: {
              id: 1,
              name: 'День 1',
              description: 'Начало программы похудения',
              subcategory_id: 1
            },
            category: {
              id: 1,
              name: 'Похудение',
              description: 'Планы питания для снижения веса'
            },
            subcategory: {
              id: 1,
              name: 'Белковая диета',
              description: 'Высокое содержание белка',
              category_id: 1
            }
          },
          {
            id: 2,
            client_id: clientId,
            day_id: 2,
            category_id: 1,
            subcategory_id: 1,
            assigned_at: '2024-01-16T14:20:00Z',
            day: {
              id: 2,
              name: 'День 2',
              description: 'Продолжение программы похудения',
              subcategory_id: 1
            },
            category: {
              id: 1,
              name: 'Похудение',
              description: 'Планы питания для снижения веса'
            },
            subcategory: {
              id: 1,
              name: 'Белковая диета',
              description: 'Высокое содержание белка',
              category_id: 1
            }
          }
        ];
        resolve(mockPlans);
      }, 300); // Имитация задержки сети
    });

    // В реальной реализации:
    // try {
    //   const response = await apiClient.get(`/clients/${clientId}/nutrition-plans`);
    //   return response.data;
    // } catch (error) {
    //   console.error(`Error fetching nutrition plans for client ${clientId}:`, error);
    //   throw error;
    // }
  },
};