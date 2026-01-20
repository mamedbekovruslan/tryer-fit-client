'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Loader, Center, Container } from '@mantine/core';

interface UserTypeProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes: ('client' | 'trainer')[];
  fallback?: React.ReactNode; // Компонент, который отображается при отсутствии доступа
}

export default function UserTypeProtectedRoute({
  children,
  allowedUserTypes,
  fallback
}: UserTypeProtectedRouteProps) {
  const { user, isAuthenticated, checkAuthStatus } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем статус аутентификации при монтировании компонента
    if (!checkAuthStatus()) {
      // Если пользователь не аутентифицирован, перенаправляем на страницу входа
      router.push('/auth');
    } else if (user && !allowedUserTypes.includes(user.user_type)) {
      // Если пользователь аутентифицирован, но не имеет разрешенного типа, перенаправляем на домашнюю страницу
      router.push('/home');
    } else {
      setLoading(false);
    }
  }, [checkAuthStatus, router, user, allowedUserTypes]);

  // Если идет проверка аутентификации, можно показать лоадер
  if (loading) {
    return (
      <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Center>
          <Loader />
        </Center>
      </Container>
    );
  }

  // Если пользователь аутентифицирован и имеет разрешенный тип, отображаем защищенные дети
  if (isAuthenticated && user && allowedUserTypes.includes(user.user_type)) {
    return <>{children}</>;
  }

  // Если указан fallback и пользователь не имеет доступа, отображаем его
  if (fallback) {
    return <>{fallback}</>;
  }

  // По умолчанию возвращаем null, если пользователь не имеет доступа и нет fallback
  return null;
}