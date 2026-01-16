import apiClient from '@/lib/api';

// Типы данных
export interface NutritionCategory {
  id: number;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface NutritionSubcategory {
  id: number;
  name: string;
  description: string;
  category_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface NutritionDay {
  id: number;
  name: string;
  description: string;
  subcategory_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface NutritionPlanAssignment {
  id: number;
  client_id: number;
  day_id: number;
  category_id: number;
  subcategory_id: number;
  assigned_at: string;
}

// Интерфейс для создания назначения плана питания
export interface CreateNutritionPlanAssignment {
  day_id: number;
  category_id: number;
  subcategory_id: number;
}

export const nutritionService = {
  // Получение всех категорий питания
  getCategories: async (): Promise<NutritionCategory[]> => {
    // Пока используем моковые данные до реализации API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Похудение', description: 'Планы питания для снижения веса' },
          { id: 2, name: 'Набор массы', description: 'Планы питания для набора мышечной массы' },
          { id: 3, name: 'Поддержание формы', description: 'Планы питания для поддержания текущего веса' },
        ]);
      }, 300); // Имитация задержки сети
    });

    // В реальной реализации:
    // try {
    //   const response = await apiClient.get('/nutrition/categories');
    //   return response.data;
    // } catch (error) {
    //   console.error('Error fetching nutrition categories:', error);
    //   throw error;
    // }
  },

  // Получение подкатегорий по ID категории
  getSubcategories: async (categoryId: number): Promise<NutritionSubcategory[]> => {
    // Пока используем моковые данные до реализации API
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockSubcategories = [
          { id: 1, name: 'Белковая диета', description: 'Высокое содержание белка', category_id: 1 },
          { id: 2, name: 'Низкоуглеводная', description: 'Ограниченное количество углеводов', category_id: 1 },
          { id: 3, name: 'Кето', description: 'Высокое содержание жиров, низкое - углеводов', category_id: 1 },
          { id: 4, name: 'Объем', description: 'Высокая калорийность для набора массы', category_id: 2 },
          { id: 5, name: 'Сушка', description: 'Низкая калорийность для сушки', category_id: 2 },
          { id: 6, name: 'Сбалансированная', description: 'Сбалансированное питание', category_id: 3 },
        ];
        resolve(mockSubcategories.filter(sub => sub.category_id === categoryId));
      }, 300); // Имитация задержки сети
    });

    // В реальной реализации:
    // try {
    //   const response = await apiClient.get(`/nutrition/categories/${categoryId}/subcategories`);
    //   return response.data;
    // } catch (error) {
    //   console.error(`Error fetching subcategories for category ${categoryId}:`, error);
    //   throw error;
    // }
  },

  // Получение дней питания по ID подкатегории
  getDays: async (subcategory_id: number): Promise<NutritionDay[]> => {
    // Пока используем моковые данные до реализации API
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockDays = [
          { id: 1, name: 'День 1', description: 'Начало программы', subcategory_id: 1 },
          { id: 2, name: 'День 2', description: 'Продолжение программы', subcategory_id: 1 },
          { id: 3, name: 'День 3', description: 'Средина программы', subcategory_id: 1 },
          { id: 4, name: 'День 1', description: 'Начало программы', subcategory_id: 2 },
          { id: 5, name: 'День 2', description: 'Продолжение программы', subcategory_id: 2 },
          { id: 6, name: 'День 1', description: 'Начало программы', subcategory_id: 3 },
          { id: 7, name: 'День 2', description: 'Продолжение программы', subcategory_id: 3 },
          { id: 8, name: 'День 1', description: 'Начало программы', subcategory_id: 4 },
          { id: 9, name: 'День 2', description: 'Продолжение программы', subcategory_id: 4 },
          { id: 10, name: 'День 3', description: 'Средина программы', subcategory_id: 4 },
          { id: 11, name: 'День 1', description: 'Начало программы', subcategory_id: 5 },
          { id: 12, name: 'День 2', description: 'Продолжение программы', subcategory_id: 5 },
          { id: 13, name: 'День 1', description: 'Начало программы', subcategory_id: 6 },
          { id: 14, name: 'День 2', description: 'Продолжение программы', subcategory_id: 6 },
        ];
        resolve(mockDays.filter(day => day.subcategory_id === subcategory_id));
      }, 300); // Имитация задержки сети
    });

    // В реальной реализации:
    // try {
    //   const response = await apiClient.get(`/nutrition/subcategories/${subcategory_id}/days`);
    //   return response.data;
    // } catch (error) {
    //   console.error(`Error fetching days for subcategory ${subcategory_id}:`, error);
    //   throw error;
    // }
  },

  // Получение конкретного дня питания
  getDayById: async (dayId: number): Promise<NutritionDay> => {
    // Пока используем моковые данные до реализации API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const mockDays = [
          { id: 1, name: 'День 1', description: 'Начало программы', subcategory_id: 1 },
          { id: 2, name: 'День 2', description: 'Продолжение программы', subcategory_id: 1 },
          { id: 3, name: 'День 3', description: 'Средина программы', subcategory_id: 1 },
          { id: 4, name: 'День 1', description: 'Начало программы', subcategory_id: 2 },
          { id: 5, name: 'День 2', description: 'Продолжение программы', subcategory_id: 2 },
          { id: 6, name: 'День 1', description: 'Начало программы', subcategory_id: 3 },
          { id: 7, name: 'День 2', description: 'Продолжение программы', subcategory_id: 3 },
          { id: 8, name: 'День 1', description: 'Начало программы', subcategory_id: 4 },
          { id: 9, name: 'День 2', description: 'Продолжение программы', subcategory_id: 4 },
          { id: 10, name: 'День 3', description: 'Средина программы', subcategory_id: 4 },
          { id: 11, name: 'День 1', description: 'Начало программы', subcategory_id: 5 },
          { id: 12, name: 'День 2', description: 'Продолжение программы', subcategory_id: 5 },
          { id: 13, name: 'День 1', description: 'Начало программы', subcategory_id: 6 },
          { id: 14, name: 'День 2', description: 'Продолжение программы', subcategory_id: 6 },
        ];
        const day = mockDays.find(d => d.id === dayId);
        if (day) {
          resolve(day);
        } else {
          reject(new Error(`Day with id ${dayId} not found`));
        }
      }, 300); // Имитация задержки сети
    });

    // В реальной реализации:
    // try {
    //   const response = await apiClient.get(`/nutrition/days/${dayId}`);
    //   return response.data;
    // } catch (error) {
    //   console.error(`Error fetching day with id ${dayId}:`, error);
    //   throw error;
    // }
  },
};