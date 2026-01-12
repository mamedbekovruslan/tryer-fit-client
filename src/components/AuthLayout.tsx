'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppShell } from '@mantine/core';
import { HeaderContent } from '@/components/Header/Header';
import { useAuth } from '@/providers/AuthProvider';

interface AuthLayoutProps {
  children: ReactNode;
}

// Список защищенных маршрутов
const protectedRoutes = ['/home', '/profile'];

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [shouldRenderLayout, setShouldRenderLayout] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем, является ли текущий маршрут защищенным
    const isProtectedRoute = protectedRoutes.some(route =>
      pathname.startsWith(route)
    );

    // Проверяем статус аутентификации
    const authenticated = checkAuthStatus();

    if (isProtectedRoute) {
      if (authenticated) {
        setShouldRenderLayout(true);
      } else {
        // Если пользователь на защищенном маршруте, но не аутентифицирован, перенаправляем на страницу входа
        router.push('/auth');
      }
    } else {
      // Для незащищенных маршрутов (например, /auth) не отображаем AppLayout
      setShouldRenderLayout(false);
    }

    setLoading(false);
  }, [checkAuthStatus, router, pathname]);

  // Если идет загрузка, можно показать лоадер
  if (loading) {
    return <>{children}</>;
  }

  // Если маршрут защищенный и пользователь аутентифицирован, отображаем AppLayout
  if (shouldRenderLayout && isAuthenticated) {
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