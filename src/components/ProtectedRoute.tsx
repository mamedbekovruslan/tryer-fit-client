'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Loader, Center, Container } from '@mantine/core';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode; // Компонент, который отображается при отсутствии аутентификации
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

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, checkAuthStatus, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Проверяем, не истек ли токен
    if (!isTokenValid(token)) {
      // Если токен истек, выполняем logout
      logout();
      router.push('/auth');
      setLoading(false);
      return;
    }

    // Проверяем статус аутентификации при монтировании компонента
    if (!checkAuthStatus()) {
      // Если пользователь не аутентифицирован, перенаправляем на страницу входа
      router.push('/auth');
    } else {
      setLoading(false);
    }
  }, [checkAuthStatus, router, logout]);

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

  // Если пользователь аутентифицирован, отображаем защищенные дети
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Если указан fallback и пользователь не аутентифицирован, отображаем его
  if (fallback) {
    return <>{fallback}</>;
  }

  // По умолчанию возвращаем null, если пользователь не аутентифицирован и нет fallback
  return null;
}