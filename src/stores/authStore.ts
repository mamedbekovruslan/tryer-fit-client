'use client';

import { create } from 'zustand';
import { clientService } from '@/services/clientService';
import { trainerService } from '@/services/trainerService';
import { authService, type AuthUser } from '@/services/authService';
import { profileService } from '@/services/profileService';
import { useChatStore } from '@/stores/chatStore';
import { useTrainerWorkoutStore } from '@/stores/trainerWorkoutStore';
import {
  clearStoredAuthToken,
  setStoredAuthToken,
} from '@/lib/authToken';

interface AuthStoreState {
  user: AuthUser | null;
  isInitializing: boolean;
  isAuthenticated: boolean;
  initialized: boolean;
  initializeAuth: () => Promise<void>;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  checkAuthStatus: () => boolean;
  refreshUserProfile: () => Promise<void>;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: null,
  isInitializing: true,
  isAuthenticated: false,
  initialized: false,

  initializeAuth: async () => {
    if (get().initialized) {
      return;
    }

    set({ isInitializing: true });

    try {
      await get().refreshUserProfile();
    } catch {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isInitializing: false, initialized: true });
    }
  },

  login: (_token, user) => {
    setStoredAuthToken(_token);
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    useChatStore.getState().clear();
    useTrainerWorkoutStore.getState().clear();
    clearStoredAuthToken();
    set({ user: null, isAuthenticated: false });
    void authService.logout().catch(() => {});
  },

  checkAuthStatus: () => Boolean(get().user),

  refreshUserProfile: async () => {
    try {
      const userProfile = await profileService.getMyProfile();

      if (userProfile.user_type === 'client') {
        try {
          const clientWithTrainer = await clientService.getMyProfile();
          const authUser: AuthUser = {
            id: clientWithTrainer.id,
            email: clientWithTrainer.email,
            username: clientWithTrainer.username,
            user_type: userProfile.user_type,
            first_name: clientWithTrainer.first_name,
            last_name: clientWithTrainer.last_name,
            waist_circumference: clientWithTrainer.waist_circumference,
            chest_circumference: clientWithTrainer.chest_circumference,
            hip_circumference: clientWithTrainer.hip_circumference,
            arm_circumference: clientWithTrainer.arm_circumference,
            leg_circumference: clientWithTrainer.leg_circumference,
            fitness_goal: clientWithTrainer.fitness_goal,
            expected_result: clientWithTrainer.expected_result,
            contraindications: clientWithTrainer.contraindications,
            diseases: clientWithTrainer.diseases,
            limitations: clientWithTrainer.limitations,
            training_experience: clientWithTrainer.training_experience,
            current_diet: clientWithTrainer.current_diet,
            photo_urls: clientWithTrainer.photo_urls,
            trainer: clientWithTrainer.trainer,
          };
          set({ user: authUser, isAuthenticated: true });
          return;
        } catch {
          const authUser: AuthUser = {
            id: userProfile.id,
            email: userProfile.email,
            username: userProfile.username,
            user_type: userProfile.user_type,
          };
          set({ user: authUser, isAuthenticated: true });
          return;
        }
      }

      try {
        const trainerProfile = await trainerService.getMyTrainerProfile();
        const authUser: AuthUser = {
          id: trainerProfile.id,
          email: trainerProfile.email,
          username: trainerProfile.username,
          user_type: userProfile.user_type,
          first_name: trainerProfile.first_name,
          last_name: trainerProfile.last_name,
          photo_urls: trainerProfile.photo_urls,
        };
        set({ user: authUser, isAuthenticated: true });
      } catch {
        const authUser: AuthUser = {
          id: userProfile.id,
          email: userProfile.email,
          username: userProfile.username,
          user_type: userProfile.user_type,
        };
        set({ user: authUser, isAuthenticated: true });
      }
    } catch (error: unknown) {
      set({ user: null, isAuthenticated: false });
    }
  },

  clearUser: () => {
    useChatStore.getState().clear();
    useTrainerWorkoutStore.getState().clear();
    clearStoredAuthToken();
    set({ user: null, isAuthenticated: false });
  },
}));
