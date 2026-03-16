import apiClient from '@/lib/api';

const TRAINER_WORKOUT_BASE = '/trainer/workout';
const CLIENT_WORKOUT_BASE = '/workout';

export interface WorkoutCategory {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

type WorkoutProgramApiResponse = {
  id: number;
  name: string;
  description?: string;
  workoutCategory?: WorkoutCategory;
  createdAt: Date;
  updatedAt: Date;
};

export interface WorkoutProgram {
  id: number;
  name: string;
  description?: string;
  workoutCategoryId?: number;
  createdAt: Date;
  updatedAt: Date;
  workoutCategory?: WorkoutCategory;
}

type WorkoutDayApiResponse = {
  id: number;
  name: string;
  description?: string;
  dayOrder: number;
  exercises?: ExerciseApiResponse[];
  createdAt: Date;
  updatedAt: Date;
};

export interface WorkoutDay {
  id: number;
  name: string;
  description?: string;
  dayOrder: number;
  workoutProgramId?: number;
  exercises?: Exercise[];
  createdAt: Date;
  updatedAt: Date;
}

type ExerciseApiResponse = {
  id: number;
  name: string;
  description?: string;
  sets?: number;
  reps?: string;
  weight?: string;
  restTime?: string;
  exerciseOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export interface Exercise {
  id: number;
  name: string;
  description?: string;
  sets?: number;
  reps?: string;
  weight?: string;
  restTime?: string;
  exerciseOrder: number;
  workoutDayId?: number;
  createdAt: Date;
  updatedAt: Date;
}

type ClientWorkoutProgramApiResponse = {
  id: number;
  client: {
    id: number;
    username: string;
    email: string;
  };
  workoutProgram?: WorkoutProgramApiResponse;
  isActive: boolean;
  assignedAt: Date;
  updatedAt: Date;
};

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

function normalizeWorkoutProgram(program: WorkoutProgramApiResponse): WorkoutProgram {
  return {
    ...program,
    workoutCategoryId: program.workoutCategory?.id,
    workoutCategory: program.workoutCategory,
  };
}

function normalizeExercise(exercise: ExerciseApiResponse, workoutDayId?: number): Exercise {
  return {
    ...exercise,
    workoutDayId,
  };
}

function normalizeWorkoutDay(day: WorkoutDayApiResponse, workoutProgramId?: number): WorkoutDay {
  return {
    ...day,
    workoutProgramId,
    exercises: day.exercises?.map((exercise) => normalizeExercise(exercise, day.id)),
  };
}

function normalizeClientWorkoutProgram(
  program: ClientWorkoutProgramApiResponse,
): ClientWorkoutProgram {
  return {
    id: program.id,
    client: program.client,
    workoutProgram: program.workoutProgram
      ? normalizeWorkoutProgram(program.workoutProgram)
      : {
          id: 0,
          name: '',
          createdAt: program.assignedAt,
          updatedAt: program.updatedAt,
        },
    isActive: program.isActive,
    assignedAt: program.assignedAt,
    updatedAt: program.updatedAt,
  };
}

export const workoutService = {
  getWorkoutCategories: async (): Promise<WorkoutCategory[]> => {
    const response = await apiClient.get<WorkoutCategory[]>(`${TRAINER_WORKOUT_BASE}/categories`);
    return response.data;
  },

  createWorkoutCategory: async (
    categoryData: CreateWorkoutCategoryRequest,
  ): Promise<WorkoutCategory> => {
    const response = await apiClient.post<WorkoutCategory>(
      `${TRAINER_WORKOUT_BASE}/categories`,
      categoryData,
    );
    return response.data;
  },

  updateWorkoutCategory: async (
    id: number,
    categoryData: Partial<CreateWorkoutCategoryRequest>,
  ): Promise<WorkoutCategory> => {
    const response = await apiClient.put<WorkoutCategory>(
      `${TRAINER_WORKOUT_BASE}/categories/${id}`,
      categoryData,
    );
    return response.data;
  },

  deleteWorkoutCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`${TRAINER_WORKOUT_BASE}/categories/${id}`);
  },

  getWorkoutProgramsByCategory: async (categoryId: number): Promise<WorkoutProgram[]> => {
    const response = await apiClient.get<WorkoutProgramApiResponse[]>(
      `${TRAINER_WORKOUT_BASE}/categories/${categoryId}/programs`,
    );
    return response.data.map(normalizeWorkoutProgram);
  },

  getAllWorkoutPrograms: async (): Promise<WorkoutProgram[]> => {
    const response = await apiClient.get<WorkoutProgramApiResponse[]>(
      `${TRAINER_WORKOUT_BASE}/programs`,
    );
    return response.data.map(normalizeWorkoutProgram);
  },

  createWorkoutProgram: async (
    programData: CreateWorkoutProgramRequest,
  ): Promise<WorkoutProgram> => {
    const response = await apiClient.post<WorkoutProgramApiResponse>(
      `${TRAINER_WORKOUT_BASE}/programs`,
      programData,
    );
    return normalizeWorkoutProgram(response.data);
  },

  getWorkoutProgramById: async (id: number): Promise<WorkoutProgram> => {
    const response = await apiClient.get<WorkoutProgramApiResponse>(
      `${TRAINER_WORKOUT_BASE}/programs/${id}`,
    );
    return normalizeWorkoutProgram(response.data);
  },

  updateWorkoutProgram: async (
    id: number,
    programData: Partial<CreateWorkoutProgramRequest>,
  ): Promise<WorkoutProgram> => {
    const response = await apiClient.put<WorkoutProgramApiResponse>(
      `${TRAINER_WORKOUT_BASE}/programs/${id}`,
      programData,
    );
    return normalizeWorkoutProgram(response.data);
  },

  deleteWorkoutProgram: async (id: number): Promise<void> => {
    await apiClient.delete(`${TRAINER_WORKOUT_BASE}/programs/${id}`);
  },

  getWorkoutDaysByProgram: async (programId: number): Promise<WorkoutDay[]> => {
    const response = await apiClient.get<WorkoutDayApiResponse[]>(
      `${TRAINER_WORKOUT_BASE}/programs/${programId}/days`,
    );
    return response.data.map((day) => normalizeWorkoutDay(day, programId));
  },

  createWorkoutDay: async (
    dayData: CreateWorkoutDayRequest,
  ): Promise<WorkoutDay> => {
    const response = await apiClient.post<WorkoutDayApiResponse>(
      `${TRAINER_WORKOUT_BASE}/days`,
      dayData,
    );
    return normalizeWorkoutDay(response.data, dayData.workoutProgramId);
  },

  updateWorkoutDay: async (
    id: number,
    dayData: Partial<CreateWorkoutDayRequest>,
  ): Promise<WorkoutDay> => {
    const response = await apiClient.put<WorkoutDayApiResponse>(
      `${TRAINER_WORKOUT_BASE}/days/${id}`,
      dayData,
    );
    return normalizeWorkoutDay(response.data, dayData.workoutProgramId);
  },

  deleteWorkoutDay: async (id: number): Promise<void> => {
    await apiClient.delete(`${TRAINER_WORKOUT_BASE}/days/${id}`);
  },

  getExercisesByDay: async (dayId: number): Promise<Exercise[]> => {
    const response = await apiClient.get<ExerciseApiResponse[]>(
      `${TRAINER_WORKOUT_BASE}/days/${dayId}/exercises`,
    );
    return response.data.map((exercise) => normalizeExercise(exercise, dayId));
  },

  createExercise: async (
    exerciseData: CreateExerciseRequest,
  ): Promise<Exercise> => {
    const response = await apiClient.post<ExerciseApiResponse>(
      `${TRAINER_WORKOUT_BASE}/exercises`,
      exerciseData,
    );
    return normalizeExercise(response.data, exerciseData.workoutDayId);
  },

  updateExercise: async (
    id: number,
    exerciseData: Partial<CreateExerciseRequest>,
  ): Promise<Exercise> => {
    const response = await apiClient.put<ExerciseApiResponse>(
      `${TRAINER_WORKOUT_BASE}/exercises/${id}`,
      exerciseData,
    );
    return normalizeExercise(response.data, exerciseData.workoutDayId);
  },

  deleteExercise: async (id: number): Promise<void> => {
    await apiClient.delete(`${TRAINER_WORKOUT_BASE}/exercises/${id}`);
  },

  getClientWorkoutPrograms: async (clientId: number): Promise<ClientWorkoutProgram[]> => {
    const response = await apiClient.get<ClientWorkoutProgramApiResponse[]>(
      `${TRAINER_WORKOUT_BASE}/clients/${clientId}/programs`,
    );
    return response.data.map(normalizeClientWorkoutProgram);
  },

  getActiveClientWorkoutPrograms: async (
    clientId: number,
  ): Promise<ClientWorkoutProgram[]> => {
    const response = await apiClient.get<ClientWorkoutProgramApiResponse[]>(
      `${CLIENT_WORKOUT_BASE}/clients/${clientId}/active`,
    );
    return response.data.map(normalizeClientWorkoutProgram);
  },

  assignWorkoutProgramToClient: async (
    clientId: number,
    programId: number,
  ): Promise<ClientWorkoutProgram> => {
    const response = await apiClient.post<ClientWorkoutProgramApiResponse>(
      `${TRAINER_WORKOUT_BASE}/client-programs`,
      {
        clientId,
        workoutProgramId: programId,
        isActive: true,
      },
    );
    return normalizeClientWorkoutProgram(response.data);
  },

  updateClientWorkoutProgram: async (
    id: number,
    data: Partial<{ isActive: boolean }>,
  ): Promise<ClientWorkoutProgram> => {
    const response = await apiClient.put<ClientWorkoutProgramApiResponse>(
      `${TRAINER_WORKOUT_BASE}/client-programs/${id}`,
      data,
    );
    return normalizeClientWorkoutProgram(response.data);
  },
};
