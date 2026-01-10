'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { clientService, ClientResponse } from '@/services/clientService';
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Check for existing token in localStorage on initial load
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      setToken(storedToken);
      // Automatically fetch user profile if token exists
      refreshUserProfile();
    }

    // Listen for storage changes (e.g. logout from another tab)
    const handleStorageChange = () => {
      const currentToken = localStorage.getItem('token');

      if (currentToken) {
        setToken(currentToken);
        // Refresh user profile if token exists
        refreshUserProfile();
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
        // Для тренеров используем базовую информацию
        const authUser: AuthUser = {
          id: userProfile.id,
          email: userProfile.email,
          username: userProfile.username,
          user_type: userProfile.user_type,
        };
        setUser(authUser);
        localStorage.setItem('user', JSON.stringify(authUser));
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
    return !!token;
  };

  const isAuthenticated = !!token;

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