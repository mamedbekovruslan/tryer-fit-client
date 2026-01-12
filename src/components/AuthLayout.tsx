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
const protectedRoutes = ['/home', '/profile'];

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Определяем, является ли текущий маршрут защищенным
  const isProtectedRoute = useMemo(() => {
    return protectedRoutes.some(route => pathname.startsWith(route));
  }, [pathname]);

  // Определяем, нужно ли отображать AppLayout
  const shouldRenderLayout = isProtectedRoute && isAuthenticated;

  // Если маршрут защищенный и пользователь аутентифицирован, отображаем AppLayout
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