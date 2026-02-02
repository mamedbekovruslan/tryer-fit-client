import apiClient from '@/lib/api';

export interface NutritionCategory {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionDay {
  id: number;
  name: string;
  description?: string;
  nutritionCategoryId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionPlan {
  id: number;
  name: string;
  description?: string;
  nutritionCategoryId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Meal {
  id: number;
  name: string;
  description?: string;
  nutritionDayId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMealRequest {
  name: string;
  description?: string;
  nutritionDayId: number;
}

export interface CreateNutritionCategoryRequest {
  name: string;
  description?: string;
}

export interface CreateNutritionDayRequest {
  name: string;
  description?: string;
  nutritionCategoryId: number;
}

export interface CreateNutritionPlanRequest {
  name: string;
  description?: string;
  nutritionCategoryId: number;
}

export const nutritionService = {
  // Nutrition Categories
  getNutritionCategories: async (): Promise<NutritionCategory[]> => {
    try {
      const response = await apiClient.get<NutritionCategory[]>('/nutrition-categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching nutrition categories:', error);
      throw error;
    }
  },

  createNutritionCategory: async (
    categoryData: CreateNutritionCategoryRequest
  ): Promise<NutritionCategory> => {
    try {
      const response = await apiClient.post<NutritionCategory>(
        '/nutrition-categories',
        categoryData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating nutrition category:', error);
      throw error;
    }
  },

  updateNutritionCategory: async (
    id: number,
    categoryData: Partial<CreateNutritionCategoryRequest>
  ): Promise<NutritionCategory> => {
    try {
      const response = await apiClient.put<NutritionCategory>(
        `/nutrition-categories/${id}`,
        categoryData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating nutrition category:', error);
      throw error;
    }
  },

  deleteNutritionCategory: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/nutrition-categories/${id}`);
    } catch (error) {
      console.error('Error deleting nutrition category:', error);
      throw error;
    }
  },

  // Nutrition Days
  getNutritionDaysByCategory: async (categoryId: number): Promise<NutritionDay[]> => {
    try {
      const response = await apiClient.get<NutritionDay[]>(
        `/nutrition-days/category/${categoryId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching nutrition days:', error);
      throw error;
    }
  },

  getAllNutritionDays: async (): Promise<NutritionDay[]> => {
    try {
      const response = await apiClient.get<NutritionDay[]>('/nutrition-days');
      return response.data;
    } catch (error) {
      console.error('Error fetching all nutrition days:', error);
      throw error;
    }
  },

  createNutritionDay: async (
    dayData: CreateNutritionDayRequest
  ): Promise<NutritionDay> => {
    try {
      const response = await apiClient.post<NutritionDay>(
        '/nutrition-days',
        dayData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating nutrition day:', error);
      throw error;
    }
  },

  getNutritionDayById: async (id: number): Promise<NutritionDay> => {
    try {
      const response = await apiClient.get<NutritionDay>(`/nutrition-days/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching nutrition day:', error);
      throw error;
    }
  },

  updateNutritionDay: async (
    id: number,
    dayData: Partial<CreateNutritionDayRequest>
  ): Promise<NutritionDay> => {
    try {
      const response = await apiClient.put<NutritionDay>(
        `/nutrition-days/${id}`,
        dayData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating nutrition day:', error);
      throw error;
    }
  },

  deleteNutritionDay: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/nutrition-days/${id}`);
    } catch (error) {
      console.error('Error deleting nutrition day:', error);
      throw error;
    }
  },

  // Nutrition Plans
  getNutritionPlansByCategory: async (categoryId: number): Promise<NutritionPlan[]> => {
    try {
      const response = await apiClient.get<NutritionPlan[]>(
        `/nutrition-plans/category/${categoryId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching nutrition plans:', error);
      throw error;
    }
  },

  getAllNutritionPlans: async (): Promise<NutritionPlan[]> => {
    try {
      const response = await apiClient.get<NutritionPlan[]>('/nutrition-plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching all nutrition plans:', error);
      throw error;
    }
  },

  createNutritionPlan: async (
    planData: CreateNutritionPlanRequest
  ): Promise<NutritionPlan> => {
    try {
      const response = await apiClient.post<NutritionPlan>(
        '/nutrition-plans',
        planData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating nutrition plan:', error);
      throw error;
    }
  },

  getNutritionPlanById: async (id: number): Promise<NutritionPlan> => {
    try {
      const response = await apiClient.get<NutritionPlan>(`/nutrition-plans/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching nutrition plan:', error);
      throw error;
    }
  },

  updateNutritionPlan: async (
    id: number,
    planData: Partial<CreateNutritionPlanRequest>
  ): Promise<NutritionPlan> => {
    try {
      const response = await apiClient.put<NutritionPlan>(
        `/nutrition-plans/${id}`,
        planData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating nutrition plan:', error);
      throw error;
    }
  },

  deleteNutritionPlan: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/nutrition-plans/${id}`);
    } catch (error) {
      console.error('Error deleting nutrition plan:', error);
      throw error;
    }
  },

  // Meals
  getMealsByNutritionDay: async (nutritionDayId: number): Promise<Meal[]> => {
    try {
      const response = await apiClient.get<Meal[]>(
        `/meals/day/${nutritionDayId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching meals:', error);
      throw error;
    }
  },

  getAllMeals: async (): Promise<Meal[]> => {
    try {
      const response = await apiClient.get<Meal[]>('/meals');
      return response.data;
    } catch (error) {
      console.error('Error fetching all meals:', error);
      throw error;
    }
  },

  createMeal: async (
    mealData: CreateMealRequest
  ): Promise<Meal> => {
    try {
      const response = await apiClient.post<Meal>(
        '/meals',
        mealData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating meal:', error);
      throw error;
    }
  },

  getMealById: async (id: number): Promise<Meal> => {
    try {
      const response = await apiClient.get<Meal>(`/meals/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching meal:', error);
      throw error;
    }
  },

  updateMeal: async (
    id: number,
    mealData: Partial<CreateMealRequest>
  ): Promise<Meal> => {
    try {
      const response = await apiClient.put<Meal>(
        `/meals/${id}`,
        mealData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating meal:', error);
      throw error;
    }
  },

  deleteMeal: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/meals/${id}`);
    } catch (error) {
      console.error('Error deleting meal:', error);
      throw error;
    }
  },
};