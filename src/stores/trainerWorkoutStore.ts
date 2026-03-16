'use client';

import { create } from 'zustand';
import { workoutService, type WorkoutCategory, type WorkoutProgram, type WorkoutDay, type Exercise } from '@/services/workoutService';
import { type Client } from '@/services/clientService';
import { trainerService } from '@/services/trainerService';

interface TrainerWorkoutStoreState {
  loading: boolean;
  categories: WorkoutCategory[];
  programs: WorkoutProgram[];
  clients: Client[];
  activeTab: string | null;
  trainerId: number | null;
  program: WorkoutProgram | null;
  days: WorkoutDay[];
  exercisesByDay: Record<number, Exercise[]>;
  setActiveTab: (activeTab: string | null) => void;
  loadTrainerWorkspace: (userId: number) => Promise<void>;
  loadProgramDetails: (programId: number) => Promise<WorkoutProgram | null>;
  clearProgramDetails: () => void;
  clear: () => void;
}

export const useTrainerWorkoutStore = create<TrainerWorkoutStoreState>(
  (set, get) => ({
    loading: false,
    categories: [],
    programs: [],
    clients: [],
    activeTab: 'programs',
    trainerId: null,
    program: null,
    days: [],
    exercisesByDay: {},

    setActiveTab: (activeTab) => {
      set({ activeTab });
    },

    loadTrainerWorkspace: async (userId) => {
      set({ loading: true });

      try {
        const [categories, programs, trainerProfile] = await Promise.all([
          workoutService.getWorkoutCategories(),
          workoutService.getAllWorkoutPrograms(),
          trainerService.getMyTrainerProfile(),
        ]);

        const resolvedTrainerId = trainerProfile.id || get().trainerId || userId;
        const clients = await trainerService.getClientsByTrainerId(resolvedTrainerId);

        set({
          categories,
          programs,
          clients,
          trainerId: resolvedTrainerId,
        });
      } finally {
        set({ loading: false });
      }
    },

    loadProgramDetails: async (programId) => {
      set({ loading: true });

      try {
        const program = await workoutService.getWorkoutProgramById(programId);
        const days = await workoutService.getWorkoutDaysByProgram(programId);
        const exercisesByDay: Record<number, Exercise[]> = {};

        await Promise.all(
          days.map(async (day) => {
            try {
              exercisesByDay[day.id] = await workoutService.getExercisesByDay(day.id);
            } catch {
              exercisesByDay[day.id] = [];
            }
          }),
        );

        set({ program, days, exercisesByDay });
        return program;
      } finally {
        set({ loading: false });
      }
    },

    clearProgramDetails: () => {
      set({
        program: null,
        days: [],
        exercisesByDay: {},
      });
    },

    clear: () => {
      set({
        loading: false,
        categories: [],
        programs: [],
        clients: [],
        activeTab: 'programs',
        trainerId: null,
        program: null,
        days: [],
        exercisesByDay: {},
      });
    },
  }),
);
