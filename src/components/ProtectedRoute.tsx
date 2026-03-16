'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Loader, Center, Container } from '@mantine/core';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode; // Компонент, который отображается при отсутствии аутентификации
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isInitializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitializing) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router, isInitializing]);

  if (isInitializing) {
    return (
      <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Center>
          <Loader />
        </Center>
      </Container>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return null;
}
