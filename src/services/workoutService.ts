import apiClient from '@/lib/api';

export interface WorkoutCategory {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutDay {
  id: number;
  name: string;
  description?: string;
  dayOrder: number;
  workoutProgramId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutProgram {
  id: number;
  name: string;
  description?: string;
  workoutCategoryId: number;
  createdAt: Date;
  updatedAt: Date;
  workoutCategory?: WorkoutCategory;
}

export interface Exercise {
  id: number;
  name: string;
  description?: string;
  sets?: number;
  reps?: string;
  weight?: string;
  restTime?: string;
  exerciseOrder: number;
  workoutDayId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientWorkoutProgram {
  id: number;
  client: {
    id: number;
    username: string;
    email: string;
  };
  workoutProgram: WorkoutProgram;
  isActive: boolean;
  assignedAt: Date;
  updatedAt: Date;
}

export interface CreateWorkoutCategoryRequest {
  name: string;
  description?: string;
}

export interface CreateWorkoutDayRequest {
  name: string;
  description?: string;
  dayOrder?: number;
  workoutProgramId: number;
}

export interface CreateWorkoutProgramRequest {
  name: string;
  description?: string;
  workoutCategoryId: number;
}

export interface CreateExerciseRequest {
  name: string;
  description?: string;
  sets?: number;
  reps?: string;
  weight?: string;
  restTime?: string;
  exerciseOrder?: number;
  workoutDayId: number;
}

export const workoutService = {
  // Workout Categories
  getWorkoutCategories: async (): Promise<WorkoutCategory[]> => {
    try {
      const response = await apiClient.get<WorkoutCategory[]>('/trainer/workout/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching workout categories:', error);
      throw error;
    }
  },

  createWorkoutCategory: async (
    categoryData: CreateWorkoutCategoryRequest
  ): Promise<WorkoutCategory> => {
    try {
      const response = await apiClient.post<WorkoutCategory>(
        '/trainer/workout/categories',
        categoryData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating workout category:', error);
      throw error;
    }
  },

  updateWorkoutCategory: async (
    id: number,
    categoryData: Partial<CreateWorkoutCategoryRequest>
  ): Promise<WorkoutCategory> => {
    try {
      const response = await apiClient.put<WorkoutCategory>(
        `/trainer/workout/categories/${id}`,
        categoryData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating workout category:', error);
      throw error;
    }
  },

  deleteWorkoutCategory: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/trainer/workout/categories/${id}`);
    } catch (error) {
      console.error('Error deleting workout category:', error);
      throw error;
    }
  },

  // Workout Programs
  getWorkoutProgramsByCategory: async (categoryId: number): Promise<WorkoutProgram[]> => {
    try {
      const response = await apiClient.get<WorkoutProgram[]>(
        `/trainer/workout/categories/${categoryId}/programs`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching workout programs:', error);
      throw error;
    }
  },

  getAllWorkoutPrograms: async (): Promise<WorkoutProgram[]> => {
    try {
      const response = await apiClient.get<WorkoutProgram[]>('/trainer/workout/programs');
      return response.data;
    } catch (error) {
      console.error('Error fetching all workout programs:', error);
      throw error;
    }
  },

  createWorkoutProgram: async (
    planData: CreateWorkoutProgramRequest
  ): Promise<WorkoutProgram> => {
    try {
      const response = await apiClient.post<WorkoutProgram>(
        '/trainer/workout/programs',
        planData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating workout program:', error);
      throw error;
    }
  },

  getWorkoutProgramById: async (id: number): Promise<WorkoutProgram> => {
    try {
      const response = await apiClient.get<WorkoutProgram>(`/trainer/workout/programs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching workout program:', error);
      throw error;
    }
  },

  updateWorkoutProgram: async (
    id: number,
    planData: Partial<CreateWorkoutProgramRequest>
  ): Promise<WorkoutProgram> => {
    try {
      const response = await apiClient.put<WorkoutProgram>(
        `/trainer/workout/programs/${id}`,
        planData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating workout program:', error);
      throw error;
    }
  },

  deleteWorkoutProgram: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/trainer/workout/programs/${id}`);
    } catch (error) {
      console.error('Error deleting workout program:', error);
      throw error;
    }
  },

  // Workout Days
  getWorkoutDaysByProgram: async (programId: number): Promise<WorkoutDay[]> => {
    try {
      const response = await apiClient.get<WorkoutDay[]>(
        `/trainer/workout/programs/${programId}/days`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching workout days:', error);
      throw error;
    }
  },

  createWorkoutDay: async (
    dayData: CreateWorkoutDayRequest
  ): Promise<WorkoutDay> => {
    try {
      const response = await apiClient.post<WorkoutDay>(
        '/trainer/workout/days',
        dayData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating workout day:', error);
      throw error;
    }
  },

  getWorkoutDayById: async (id: number): Promise<WorkoutDay> => {
    try {
      const response = await apiClient.get<WorkoutDay>(`/trainer/workout/days/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching workout day:', error);
      throw error;
    }
  },

  updateWorkoutDay: async (
    id: number,
    dayData: Partial<CreateWorkoutDayRequest>
  ): Promise<WorkoutDay> => {
    try {
      const response = await apiClient.put<WorkoutDay>(
        `/trainer/workout/days/${id}`,
        dayData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating workout day:', error);
      throw error;
    }
  },

  deleteWorkoutDay: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/trainer/workout/days/${id}`);
    } catch (error) {
      console.error('Error deleting workout day:', error);
      throw error;
    }
  },

  // Exercises
  getExercisesByDay: async (dayId: number): Promise<Exercise[]> => {
    try {
      const response = await apiClient.get<Exercise[]>(
        `/trainer/workout/days/${dayId}/exercises`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  },

  getAllExercises: async (): Promise<Exercise[]> => {
    try {
      const response = await apiClient.get<Exercise[]>('/trainer/workout/exercises');
      return response.data;
    } catch (error) {
      console.error('Error fetching all exercises:', error);
      throw error;
    }
  },

  createExercise: async (
    exerciseData: CreateExerciseRequest
  ): Promise<Exercise> => {
    try {
      const response = await apiClient.post<Exercise>(
        '/trainer/workout/exercises',
        exerciseData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating exercise:', error);
      throw error;
    }
  },

  getExerciseById: async (id: number): Promise<Exercise> => {
    try {
      const response = await apiClient.get<Exercise>(`/trainer/workout/exercises/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exercise:', error);
      throw error;
    }
  },

  updateExercise: async (
    id: number,
    exerciseData: Partial<CreateExerciseRequest>
  ): Promise<Exercise> => {
    try {
      const response = await apiClient.put<Exercise>(
        `/trainer/workout/exercises/${id}`,
        exerciseData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating exercise:', error);
      throw error;
    }
  },

  deleteExercise: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/trainer/workout/exercises/${id}`);
    } catch (error) {
      console.error('Error deleting exercise:', error);
      throw error;
    }
  },

  // Client Workout Programs
  getClientWorkoutPrograms: async (clientId: number): Promise<ClientWorkoutProgram[]> => {
    try {
      const response = await apiClient.get<ClientWorkoutProgram[]>(
        `/trainer/workout/clients/${clientId}/programs`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching client workout programs:', error);
      throw error;
    }
  },

  getActiveClientWorkoutPrograms: async (clientId: number): Promise<ClientWorkoutProgram[]> => {
    try {
      const response = await apiClient.get<ClientWorkoutProgram[]>(
        `/workout/clients/${clientId}/active`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching active client workout programs:', error);
      throw error;
    }
  },

  assignWorkoutProgramToClient: async (clientId: number, programId: number): Promise<ClientWorkoutProgram> => {
    try {
      const response = await apiClient.post<ClientWorkoutProgram>(
        `/trainer/workout/client-programs`,
        {
          clientId: clientId,
          workoutProgramId: programId,
          isActive: true
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error assigning workout program to client:', error);
      throw error;
    }
  },

  updateClientWorkoutProgram: async (id: number, data: Partial<{ isActive: boolean }>): Promise<ClientWorkoutProgram> => {
    try {
      const response = await apiClient.put<ClientWorkoutProgram>(
        `/trainer/workout/client-programs/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error updating client workout program:', error);
      throw error;
    }
  },
};
