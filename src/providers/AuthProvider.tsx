'use client';

import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearUser();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [clearUser]);

  return children;
};

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);
  const refreshUserProfile = useAuthStore((state) => state.refreshUserProfile);

  return {
    user,
    login,
    logout,
    isInitializing,
    isAuthenticated,
    checkAuthStatus,
    refreshUserProfile,
  };
};
