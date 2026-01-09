'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode; // Компонент, который отображается при отсутствии аутентификации
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем статус аутентификации при монтировании компонента
    if (!checkAuthStatus()) {
      // Если пользователь не аутентифицирован, перенаправляем на страницу входа
      router.push('/auth');
    } else {
      setLoading(false);
    }
  }, [checkAuthStatus, router]);

  // Если идет проверка аутентификации, можно показать лоадер
  if (loading) {
    return <div>Проверка аутентификации...</div>;
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