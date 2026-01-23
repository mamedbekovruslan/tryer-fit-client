'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { clientService, ClientResponse } from '@/services/clientService';
import { trainerService } from '@/services/trainerService';
import { AuthUser } from '@/services/authService';
import { profileService, UserProfile } from '@/services/profileService';

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
  checkAuthStatus: () => boolean;
  refreshUserProfile: () => Promise<void>;
}

// Функция для проверки валидности JWT токена
function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  try {
    // Разбиваем токен на части (header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false; // Некорректный формат токена
    }

    // Декодируем payload (вторая часть)
    const payload = JSON.parse(atob(parts[1]));

    // Проверяем, не истек ли токен (exp - время истечения в секундах)
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (error) {
    console.error('Ошибка при проверке токена:', error);
    return false;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Check for existing token in localStorage on initial load
    const storedToken = localStorage.getItem('token');

    // Проверяем, не истек ли токен
    if (storedToken && isTokenValid(storedToken)) {
      setToken(storedToken);
      // Automatically fetch user profile if token exists
      refreshUserProfile();
    } else if (storedToken) {
      // Если токен существует, но истек, удаляем его
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }

    // Listen for storage changes (e.g. logout from another tab)
    const handleStorageChange = () => {
      const currentToken = localStorage.getItem('token');

      if (currentToken && isTokenValid(currentToken)) {
        setToken(currentToken);
        // Refresh user profile if token exists
        refreshUserProfile();
      } else if (currentToken) {
        // Если токен существует, но истек, удаляем его
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } else {
        setToken(null);
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Убрали user из зависимостей, чтобы useEffect не запускался при каждом изменении пользователя

  const login = (token: string, user: AuthUser) => {
    // Проверяем, не истек ли токен перед входом
    if (!isTokenValid(token)) {
      console.error('Попытка входа с истекшим токеном');
      return;
    }

    console.log('Logging in user in provider:', user); // Логируем информацию о пользователе
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const refreshUserProfile = async () => {
    const currentToken = localStorage.getItem('token');

    // Проверяем, не истек ли токен перед обновлением профиля
    if (!isTokenValid(currentToken)) {
      logout();
      return;
    }

    try {
      // Получаем информацию о пользователе из токена
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
          localStorage.setItem('user', JSON.stringify(authUser));
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
          localStorage.setItem('user', JSON.stringify(authUser));
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
          };
          setUser(authUser);
          localStorage.setItem('user', JSON.stringify(authUser));
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
          localStorage.setItem('user', JSON.stringify(authUser));
        }
      }
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
      // If refresh fails, clear the user data
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    return isTokenValid(token);
  };

  const isAuthenticated = !!token && isTokenValid(token);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated, checkAuthStatus, refreshUserProfile }}>
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