'use client';

import { ReactNode, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { AppShell } from '@mantine/core';
import { HeaderContent } from '@/components/Header/Header';
import { useAuth } from '@/providers/AuthProvider';

interface AuthLayoutProps {
  children: ReactNode;
}

// Список защищенных маршрутов
const protectedRoutes = ['/home', '/profile', '/admin', '/chat', '/nutrition', '/progress', '/me', '/trainer', '/workout'];

// Маршруты с ограничением по типу пользователя
const userTypeRestrictedRoutes: { [key: string]: string[] } = {
  '/profile': ['client'],    // Только клиенты могут получить доступ к профилю
  '/admin': ['trainer'],     // Только тренеры могут получить доступ к админке
  '/chat': ['trainer'],      // Только тренеры могут получить доступ к чату
  '/progress': ['client'],   // Только клиенты могут получить доступ к прогрессу
  '/nutrition': ['client'],  // Только клиенты могут получить доступ к питанию
  '/me': ['client'],         // Только клиенты могут получить доступ к личным данным
  '/trainer': ['client'],    // Только клиенты могут получить доступ к чату с тренером
  '/workout': ['client'],    // Только клиенты могут получить доступ к тренировкам
  '/trainer/workout': ['trainer'], // Только тренеры могут получить доступ к управлению тренировками
};

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Определяем, является ли текущий маршрут защищенным
  const isProtectedRoute = useMemo(() => {
    return protectedRoutes.some(route => pathname.startsWith(route));
  }, [pathname]);

  // Проверяем, соответствует ли тип пользователя требованиям маршрута
  const isUserTypeAllowed = useMemo(() => {
    const requiredUserTypes = userTypeRestrictedRoutes[pathname];
    if (requiredUserTypes && user) {
      return requiredUserTypes.includes(user.user_type);
    }
    return true; // Если нет ограничений по типу, разрешаем доступ
  }, [pathname, user]);

  // Определяем, нужно ли отображать AppLayout
  const shouldRenderLayout = isProtectedRoute && isAuthenticated && isUserTypeAllowed;

  // Если маршрут защищенный, пользователь аутентифицирован и имеет разрешенный тип, отображаем AppLayout
  if (shouldRenderLayout) {
    return (
      <AppShell
        header={{ height: 60 }}
        padding="md"
      >
        <AppShell.Header h={60} bg="blue" px="md">
          <HeaderContent />
        </AppShell.Header>
        <AppShell.Main p="md">
          {children}
        </AppShell.Main>
      </AppShell>
    );
  }

  // Для всех остальных случаев возвращаем детей без AppLayout
  return <>{children}</>;
};