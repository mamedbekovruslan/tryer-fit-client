import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  ClientWorkoutProgram,
  Exercise,
  WorkoutCategory,
  WorkoutDay,
  WorkoutProgram,
} from '@/services/workoutService';

const {
  getWorkoutCategoriesMock,
  getAllWorkoutProgramsMock,
  getWorkoutProgramByIdMock,
  getWorkoutDaysByProgramMock,
  getExercisesByDayMock,
  getClientWorkoutProgramsMock,
  getMyTrainerProfileMock,
  getClientsByTrainerIdMock,
} = vi.hoisted(() => ({
  getWorkoutCategoriesMock: vi.fn(),
  getAllWorkoutProgramsMock: vi.fn(),
  getWorkoutProgramByIdMock: vi.fn(),
  getWorkoutDaysByProgramMock: vi.fn(),
  getExercisesByDayMock: vi.fn(),
  getClientWorkoutProgramsMock: vi.fn(),
  getMyTrainerProfileMock: vi.fn(),
  getClientsByTrainerIdMock: vi.fn(),
}));

vi.mock('@/services/workoutService', () => ({
  workoutService: {
    getWorkoutCategories: getWorkoutCategoriesMock,
    getAllWorkoutPrograms: getAllWorkoutProgramsMock,
    getWorkoutProgramById: getWorkoutProgramByIdMock,
    getWorkoutDaysByProgram: getWorkoutDaysByProgramMock,
    getExercisesByDay: getExercisesByDayMock,
    getClientWorkoutPrograms: getClientWorkoutProgramsMock,
  },
}));

vi.mock('@/services/trainerService', () => ({
  trainerService: {
    getMyTrainerProfile: getMyTrainerProfileMock,
    getClientsByTrainerId: getClientsByTrainerIdMock,
  },
}));

import { useTrainerWorkoutStore } from '@/stores/trainerWorkoutStore';

describe('trainerWorkoutStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useTrainerWorkoutStore.setState(useTrainerWorkoutStore.getInitialState(), true);
  });

  it('loadTrainerWorkspace stores categories programs clients', async () => {
    const categories: WorkoutCategory[] = [
      createCategory({ id: 1, name: 'Strength' }),
    ];
    const programs: WorkoutProgram[] = [
      createProgram({ id: 10, name: 'Upper Lower', workoutCategoryId: 1 }),
    ];
    const clients = [
      {
        id: 100,
        username: 'client_1',
        email: 'client_1@test.dev',
      },
    ];
    const clientPrograms: ClientWorkoutProgram[] = [
      createClientWorkoutProgram({
        id: 501,
        client: {
          id: 100,
          username: 'client_1',
          email: 'client_1@test.dev',
        },
        workoutProgram: programs[0],
        isActive: true,
      }),
    ];

    getWorkoutCategoriesMock.mockResolvedValue(categories);
    getAllWorkoutProgramsMock.mockResolvedValue(programs);
    getMyTrainerProfileMock.mockResolvedValue({
      id: 77,
      username: 'trainer_77',
      email: 'trainer@test.dev',
    });
    getClientsByTrainerIdMock.mockResolvedValue(clients);
    getClientWorkoutProgramsMock.mockResolvedValue(clientPrograms);

    await useTrainerWorkoutStore.getState().loadTrainerWorkspace(5);

    expect(getWorkoutCategoriesMock).toHaveBeenCalledTimes(1);
    expect(getAllWorkoutProgramsMock).toHaveBeenCalledTimes(1);
    expect(getMyTrainerProfileMock).toHaveBeenCalledTimes(1);
    expect(getClientsByTrainerIdMock).toHaveBeenCalledWith(77);
    expect(getClientWorkoutProgramsMock).toHaveBeenCalledWith(100);
    expect(useTrainerWorkoutStore.getState()).toMatchObject({
      loading: false,
      categories,
      programs,
      clients,
      activeProgramsByClientId: {
        100: clientPrograms,
      },
      trainerId: 77,
    });
  });

  it('loadProgramDetails stores program days and exercises', async () => {
    const program = createProgram({ id: 10, name: 'Push Pull Legs' });
    const days: WorkoutDay[] = [
      createDay({ id: 1, name: 'Push', workoutProgramId: 10 }),
      createDay({ id: 2, name: 'Pull', workoutProgramId: 10 }),
    ];
    const exercisesDay1: Exercise[] = [
      createExercise({ id: 101, name: 'Bench Press', workoutDayId: 1 }),
    ];
    const exercisesDay2: Exercise[] = [
      createExercise({ id: 201, name: 'Barbell Row', workoutDayId: 2 }),
    ];

    getWorkoutProgramByIdMock.mockResolvedValue(program);
    getWorkoutDaysByProgramMock.mockResolvedValue(days);
    getExercisesByDayMock
      .mockResolvedValueOnce(exercisesDay1)
      .mockResolvedValueOnce(exercisesDay2);

    const result = await useTrainerWorkoutStore.getState().loadProgramDetails(10);

    expect(result).toEqual(program);
    expect(getWorkoutProgramByIdMock).toHaveBeenCalledWith(10);
    expect(getWorkoutDaysByProgramMock).toHaveBeenCalledWith(10);
    expect(getExercisesByDayMock).toHaveBeenNthCalledWith(1, 1);
    expect(getExercisesByDayMock).toHaveBeenNthCalledWith(2, 2);
    expect(useTrainerWorkoutStore.getState()).toMatchObject({
      loading: false,
      program,
      days,
      exercisesByDay: {
        1: exercisesDay1,
        2: exercisesDay2,
      },
    });
  });

  it('loadProgramDetails falls back to empty list when day exercises request fails', async () => {
    const program = createProgram({ id: 15, name: 'Fallback Program' });
    const days: WorkoutDay[] = [createDay({ id: 3, name: 'Mixed Day' })];

    getWorkoutProgramByIdMock.mockResolvedValue(program);
    getWorkoutDaysByProgramMock.mockResolvedValue(days);
    getExercisesByDayMock.mockRejectedValue(new Error('network'));

    await useTrainerWorkoutStore.getState().loadProgramDetails(15);

    expect(useTrainerWorkoutStore.getState().exercisesByDay).toEqual({
      3: [],
    });
  });

  it('clearProgramDetails and clear reset state', () => {
    useTrainerWorkoutStore.setState(
      {
        ...useTrainerWorkoutStore.getInitialState(),
        loading: true,
        categories: [createCategory({ id: 1 })],
        programs: [createProgram({ id: 10 })],
        clients: [{ id: 100, username: 'client', email: 'client@test.dev' }],
        activeProgramsByClientId: {
          100: [createClientWorkoutProgram()],
        },
        trainerId: 55,
        program: createProgram({ id: 11, name: 'Temp Program' }),
        days: [createDay({ id: 1 })],
        exercisesByDay: { 1: [createExercise({ id: 1 })] },
      },
      true,
    );

    useTrainerWorkoutStore.getState().clearProgramDetails();
    expect(useTrainerWorkoutStore.getState()).toMatchObject({
      program: null,
      days: [],
      exercisesByDay: {},
      categories: [{ id: 1 }],
      programs: [{ id: 10 }],
      activeProgramsByClientId: {
        100: [expect.objectContaining({ id: 1 })],
      },
    });

    useTrainerWorkoutStore.getState().clear();
    expect(useTrainerWorkoutStore.getState()).toMatchObject({
      loading: false,
      categories: [],
      programs: [],
      clients: [],
      activeProgramsByClientId: {},
      trainerId: null,
      program: null,
      days: [],
      exercisesByDay: {},
      activeTab: 'categories',
    });
  });
});

function createCategory(
  overrides: Partial<WorkoutCategory> = {},
): WorkoutCategory {
  return {
    id: 1,
    name: 'Category',
    description: undefined,
    createdAt: new Date('2026-03-18T10:00:00.000Z'),
    updatedAt: new Date('2026-03-18T10:00:00.000Z'),
    ...overrides,
  };
}

function createProgram(
  overrides: Partial<WorkoutProgram> = {},
): WorkoutProgram {
  return {
    id: 1,
    name: 'Program',
    description: undefined,
    workoutCategoryId: undefined,
    createdAt: new Date('2026-03-18T10:00:00.000Z'),
    updatedAt: new Date('2026-03-18T10:00:00.000Z'),
    ...overrides,
  };
}

function createDay(overrides: Partial<WorkoutDay> = {}): WorkoutDay {
  return {
    id: 1,
    name: 'Day',
    description: undefined,
    dayOrder: 1,
    workoutProgramId: undefined,
    exercises: undefined,
    createdAt: new Date('2026-03-18T10:00:00.000Z'),
    updatedAt: new Date('2026-03-18T10:00:00.000Z'),
    ...overrides,
  };
}

function createExercise(
  overrides: Partial<Exercise> = {},
): Exercise {
  return {
    id: 1,
    name: 'Exercise',
    description: undefined,
    sets: undefined,
    reps: undefined,
    weight: undefined,
    restTime: undefined,
    exerciseOrder: 1,
    workoutDayId: undefined,
    createdAt: new Date('2026-03-18T10:00:00.000Z'),
    updatedAt: new Date('2026-03-18T10:00:00.000Z'),
    ...overrides,
  };
}

function createClientWorkoutProgram(
  overrides: Partial<ClientWorkoutProgram> = {},
): ClientWorkoutProgram {
  return {
    id: 1,
    client: {
      id: 100,
      username: 'client',
      email: 'client@test.dev',
    },
    workoutProgram: createProgram({ id: 10, name: 'Assigned Program' }),
    isActive: true,
    assignedAt: new Date('2026-03-18T10:00:00.000Z'),
    updatedAt: new Date('2026-03-18T10:00:00.000Z'),
    ...overrides,
  };
}
