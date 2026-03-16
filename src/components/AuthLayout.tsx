'use client';

import { ReactNode, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { AppShell } from '@mantine/core';
import { HeaderContent } from '@/components/Header/Header';
import { useAuth } from '@/providers/AuthProvider';
import { canUserAccessPath, isProtectedPath } from '@/lib/routeAccess';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();

  const isProtectedRoute = useMemo(() => {
    return isProtectedPath(pathname);
  }, [pathname]);

  const isUserTypeAllowed = useMemo(() => {
    return canUserAccessPath(pathname, user?.user_type ?? null);
  }, [pathname, user]);

  const shouldRenderLayout = isProtectedRoute && isAuthenticated && isUserTypeAllowed;

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

  return <>{children}</>;
};
