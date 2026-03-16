import apiClient from '@/lib/api';

const TRAINER_NUTRITION_BASE = '/trainer/nutrition';
const NUTRITION_CATEGORIES_BASE = '/nutrition-categories';
const NUTRITION_DAYS_BASE = '/nutrition-days';
const NUTRITION_PLANS_BASE = '/nutrition-plans';
const MEALS_BASE = '/meals';
const CLIENT_NUTRITION_PLANS_BASE = '/client-nutrition-plans';

export interface NutritionCategory {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

type NutritionPlanApiResponse = {
  id: number;
  name: string;
  description?: string;
  nutritionCategory?: NutritionCategory;
  trainer?: {
    id: number;
    username: string;
  };
  createdAt: Date;
  updatedAt: Date;
};

export interface NutritionPlan {
  id: number;
  name: string;
  description?: string;
  nutritionCategoryId?: number;
  nutritionCategory?: NutritionCategory;
  createdAt: Date;
  updatedAt: Date;
}

type NutritionDayApiResponse = {
  id: number;
  name: string;
  description?: string;
  nutritionCategoryId?: number;
  nutritionPlan?: NutritionPlanApiResponse;
  meals?: MealApiResponse[];
  createdAt: Date;
  updatedAt: Date;
};

export interface NutritionDay {
  id: number;
  name: string;
  description?: string;
  nutritionCategoryId?: number;
  nutritionPlanId?: number;
  nutritionPlan?: NutritionPlan;
  meals?: Meal[];
  createdAt: Date;
  updatedAt: Date;
}

type MealApiResponse = {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface Meal {
  id: number;
  name: string;
  description?: string;
  nutritionDayId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMealRequest {
  name: string;
  description?: string;
  nutritionDayId: number;
}

type ClientNutritionPlanApiResponse = {
  id: number;
  client: {
    id: number;
    username: string;
    email: string;
  };
  nutritionPlan?: NutritionPlanApiResponse;
  isActive?: boolean;
  is_active?: boolean;
  assignedAt: Date;
  updatedAt: Date;
};

export interface ClientNutritionPlan {
  id: number;
  client: {
    id: number;
    username: string;
    email: string;
  };
  nutritionPlan: NutritionPlan;
  isActive: boolean;
  assignedAt: Date;
  updatedAt: Date;
}

export interface CreateNutritionCategoryRequest {
  name: string;
  description?: string;
}

export interface CreateNutritionDayRequest {
  name: string;
  description?: string;
  nutritionCategoryId?: number;
  nutritionPlanId?: number;
}

export interface CreateNutritionPlanRequest {
  name: string;
  description?: string;
  nutritionCategoryId: number;
}

function normalizeNutritionPlan(plan: NutritionPlanApiResponse): NutritionPlan {
  return {
    ...plan,
    nutritionCategoryId: plan.nutritionCategory?.id,
    nutritionCategory: plan.nutritionCategory,
  };
}

function normalizeMeal(meal: MealApiResponse, nutritionDayId?: number): Meal {
  return {
    ...meal,
    nutritionDayId,
  };
}

function normalizeNutritionDay(day: NutritionDayApiResponse): NutritionDay {
  return {
    ...day,
    nutritionPlanId: day.nutritionPlan?.id,
    nutritionPlan: day.nutritionPlan ? normalizeNutritionPlan(day.nutritionPlan) : undefined,
    meals: day.meals?.map((meal) => normalizeMeal(meal, day.id)),
  };
}

function normalizeClientNutritionPlan(plan: ClientNutritionPlanApiResponse): ClientNutritionPlan {
  return {
    id: plan.id,
    client: plan.client,
    nutritionPlan: plan.nutritionPlan
      ? normalizeNutritionPlan(plan.nutritionPlan)
      : {
          id: 0,
          name: '',
          createdAt: plan.assignedAt,
          updatedAt: plan.updatedAt,
        },
    isActive: plan.isActive ?? plan.is_active ?? false,
    assignedAt: plan.assignedAt,
    updatedAt: plan.updatedAt,
  };
}

export const nutritionService = {
  getNutritionCategories: async (): Promise<NutritionCategory[]> => {
    const response = await apiClient.get<NutritionCategory[]>(NUTRITION_CATEGORIES_BASE);
    return response.data;
  },

  createNutritionCategory: async (
    categoryData: CreateNutritionCategoryRequest,
  ): Promise<NutritionCategory> => {
    const response = await apiClient.post<NutritionCategory>(
      `${TRAINER_NUTRITION_BASE}/categories`,
      categoryData,
    );
    return response.data;
  },

  updateNutritionCategory: async (
    id: number,
    categoryData: Partial<CreateNutritionCategoryRequest>,
  ): Promise<NutritionCategory> => {
    const response = await apiClient.put<NutritionCategory>(
      `${TRAINER_NUTRITION_BASE}/categories/${id}`,
      categoryData,
    );
    return response.data;
  },

  deleteNutritionCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`${TRAINER_NUTRITION_BASE}/categories/${id}`);
  },

  getNutritionDaysByCategory: async (categoryId: number): Promise<NutritionDay[]> => {
    const response = await apiClient.get<NutritionDayApiResponse[]>(
      `${NUTRITION_DAYS_BASE}/category/${categoryId}`,
    );
    return response.data.map(normalizeNutritionDay);
  },

  getNutritionDaysByPlan: async (planId: number): Promise<NutritionDay[]> => {
    const response = await apiClient.get<NutritionDayApiResponse[]>(
      `${NUTRITION_DAYS_BASE}/plan/${planId}`,
    );
    return response.data.map(normalizeNutritionDay);
  },

  getAllNutritionDays: async (): Promise<NutritionDay[]> => {
    const response = await apiClient.get<NutritionDayApiResponse[]>(NUTRITION_DAYS_BASE);
    return response.data.map(normalizeNutritionDay);
  },

  createNutritionDay: async (
    dayData: CreateNutritionDayRequest,
  ): Promise<NutritionDay> => {
    const response = await apiClient.post<NutritionDayApiResponse>(
      `${TRAINER_NUTRITION_BASE}/days`,
      dayData,
    );
    return normalizeNutritionDay(response.data);
  },

  getNutritionDayById: async (id: number): Promise<NutritionDay> => {
    const response = await apiClient.get<NutritionDayApiResponse>(`${NUTRITION_DAYS_BASE}/${id}`);
    return normalizeNutritionDay(response.data);
  },

  updateNutritionDay: async (
    id: number,
    dayData: Partial<CreateNutritionDayRequest>,
  ): Promise<NutritionDay> => {
    const response = await apiClient.put<NutritionDayApiResponse>(
      `${TRAINER_NUTRITION_BASE}/days/${id}`,
      dayData,
    );
    return normalizeNutritionDay(response.data);
  },

  deleteNutritionDay: async (id: number): Promise<void> => {
    await apiClient.delete(`${TRAINER_NUTRITION_BASE}/days/${id}`);
  },

  getNutritionPlansByCategory: async (categoryId: number): Promise<NutritionPlan[]> => {
    const response = await apiClient.get<NutritionPlanApiResponse[]>(
      `${NUTRITION_PLANS_BASE}/category/${categoryId}`,
    );
    return response.data.map(normalizeNutritionPlan);
  },

  getAllNutritionPlans: async (): Promise<NutritionPlan[]> => {
    const response = await apiClient.get<NutritionPlanApiResponse[]>(NUTRITION_PLANS_BASE);
    return response.data.map(normalizeNutritionPlan);
  },

  createNutritionPlan: async (
    planData: CreateNutritionPlanRequest,
  ): Promise<NutritionPlan> => {
    const response = await apiClient.post<NutritionPlanApiResponse>(
      `${TRAINER_NUTRITION_BASE}/plans`,
      planData,
    );
    return normalizeNutritionPlan(response.data);
  },

  getNutritionPlanById: async (id: number): Promise<NutritionPlan> => {
    const response = await apiClient.get<NutritionPlanApiResponse>(`${NUTRITION_PLANS_BASE}/${id}`);
    return normalizeNutritionPlan(response.data);
  },

  updateNutritionPlan: async (
    id: number,
    planData: Partial<CreateNutritionPlanRequest>,
  ): Promise<NutritionPlan> => {
    const response = await apiClient.put<NutritionPlanApiResponse>(
      `${TRAINER_NUTRITION_BASE}/plans/${id}`,
      planData,
    );
    return normalizeNutritionPlan(response.data);
  },

  deleteNutritionPlan: async (id: number): Promise<void> => {
    await apiClient.delete(`${TRAINER_NUTRITION_BASE}/plans/${id}`);
  },

  getMealsByNutritionDay: async (nutritionDayId: number): Promise<Meal[]> => {
    const response = await apiClient.get<MealApiResponse[]>(`${MEALS_BASE}/day/${nutritionDayId}`);
    return response.data.map((meal) => normalizeMeal(meal, nutritionDayId));
  },

  getAllMeals: async (): Promise<Meal[]> => {
    const response = await apiClient.get<MealApiResponse[]>(MEALS_BASE);
    return response.data.map((meal) => normalizeMeal(meal));
  },

  createMeal: async (mealData: CreateMealRequest): Promise<Meal> => {
    const response = await apiClient.post<MealApiResponse>(MEALS_BASE, mealData);
    return normalizeMeal(response.data, mealData.nutritionDayId);
  },

  getMealById: async (id: number): Promise<Meal> => {
    const response = await apiClient.get<MealApiResponse>(`${MEALS_BASE}/${id}`);
    return normalizeMeal(response.data);
  },

  updateMeal: async (
    id: number,
    mealData: Partial<CreateMealRequest>,
  ): Promise<Meal> => {
    const response = await apiClient.put<MealApiResponse>(`${MEALS_BASE}/${id}`, mealData);
    return normalizeMeal(response.data, mealData.nutritionDayId);
  },

  deleteMeal: async (id: number): Promise<void> => {
    await apiClient.delete(`${MEALS_BASE}/${id}`);
  },

  getClientNutritionPlans: async (clientId: number): Promise<ClientNutritionPlan[]> => {
    const response = await apiClient.get<ClientNutritionPlanApiResponse[]>(
      `${CLIENT_NUTRITION_PLANS_BASE}/client/${clientId}`,
    );
    return response.data.map(normalizeClientNutritionPlan);
  },

  getActiveClientNutritionPlans: async (clientId: number): Promise<ClientNutritionPlan[]> => {
    const response = await apiClient.get<ClientNutritionPlanApiResponse[]>(
      `${CLIENT_NUTRITION_PLANS_BASE}/client/${clientId}/active`,
    );
    return response.data.map(normalizeClientNutritionPlan);
  },

  assignNutritionPlanToClient: async (
    clientId: number,
    planId: number,
  ): Promise<ClientNutritionPlan> => {
    const response = await apiClient.post<ClientNutritionPlanApiResponse>(
      CLIENT_NUTRITION_PLANS_BASE,
      {
        clientId,
        nutritionPlanId: planId,
        isActive: true,
      },
    );
    return normalizeClientNutritionPlan(response.data);
  },

  getNutritionPlansByTrainer: async (trainerId: number): Promise<NutritionPlan[]> => {
    const response = await apiClient.get<NutritionPlanApiResponse[]>(
      `${NUTRITION_PLANS_BASE}/trainer/${trainerId}`,
    );
    return response.data.map(normalizeNutritionPlan);
  },

  getNutritionDaysByPlanForTrainer: async (planId: number): Promise<NutritionDay[]> => {
    const response = await apiClient.get<NutritionDayApiResponse[]>(
      `${TRAINER_NUTRITION_BASE}/plans/${planId}/days`,
    );
    return response.data.map(normalizeNutritionDay);
  },

  updateClientNutritionPlan: async (
    id: number,
    data: Partial<{ isActive: boolean }>,
  ): Promise<ClientNutritionPlan> => {
    const response = await apiClient.put<ClientNutritionPlanApiResponse>(
      `${CLIENT_NUTRITION_PLANS_BASE}/${id}`,
      data,
    );
    return normalizeClientNutritionPlan(response.data);
  },
};
