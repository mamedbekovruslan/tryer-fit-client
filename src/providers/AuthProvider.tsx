'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { clientService } from '@/services/clientService';
import { trainerService } from '@/services/trainerService';
import { AuthUser } from '@/services/authService';
import { authService } from '@/services/authService';
import { profileService } from '@/services/profileService';

interface AuthContextType {
  user: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  isInitializing: boolean;
  isAuthenticated: boolean;
  checkAuthStatus: () => boolean;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshUserProfile();
      } catch {
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    void initializeAuth();
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = (_token: string, user: AuthUser) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    void authService.logout().catch((error) => {
      console.error('Failed to clear auth cookie:', error);
    });
  };

  const refreshUserProfile = async () => {
    try {
      const userProfile = await profileService.getMyProfile();

      // Если пользователь - клиент, получаем дополнительную информацию с тренером
      if (userProfile.user_type === 'client') {
        try {
          const clientWithTrainer = await clientService.getMyProfile();
          const authUser: AuthUser = {
            id: clientWithTrainer.id,
            email: clientWithTrainer.email,
            username: clientWithTrainer.username,
            user_type: userProfile.user_type,
            // Поля профиля клиента
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
          setUser(authUser);
        } catch (clientError) {
          // Если не удалось получить информацию о клиенте, используем базовую информацию
          console.error('Could not fetch client profile with trainer:', clientError);
          const authUser: AuthUser = {
            id: userProfile.id,
            email: userProfile.email,
            username: userProfile.username,
            user_type: userProfile.user_type,
          };
          setUser(authUser);
        }
      } else {
        // Для тренеров получаем полную информацию о тренере
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
          setUser(authUser);
        } catch (trainerError) {
          // Если не удалось получить информацию о тренере, используем базовую информацию
          console.error('Could not fetch trainer profile:', trainerError);
          const authUser: AuthUser = {
            id: userProfile.id,
            email: userProfile.email,
            username: userProfile.username,
            user_type: userProfile.user_type,
          };
          setUser(authUser);
        }
      }
    } catch (error) {
      const status = (error as any)?.response?.status;
      setUser(null);
      if (status && status !== 401) {
        console.error('Failed to refresh user profile:', error);
      }
    }
  };

  const checkAuthStatus = () => Boolean(user);

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isInitializing, isAuthenticated, checkAuthStatus, refreshUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
