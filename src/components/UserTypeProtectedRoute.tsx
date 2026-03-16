'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Loader, Center, Container } from '@mantine/core';
import {
  canUserAccessPath,
  getAllowedUserTypesForPath,
  getDefaultAuthorizedRedirect,
  type UserType,
} from '@/lib/routeAccess';

interface UserTypeProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: UserType[];
  fallback?: React.ReactNode; // Компонент, который отображается при отсутствии доступа
}

export default function UserTypeProtectedRoute({
  children,
  allowedUserTypes,
  fallback
}: UserTypeProtectedRouteProps) {
  const { user, isAuthenticated, isInitializing } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const allowedTypes = getAllowedUserTypesForPath(pathname) ?? allowedUserTypes ?? null;

  useEffect(() => {
    if (isInitializing) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/auth');
    } else if (
      user &&
      allowedTypes &&
      !canUserAccessPath(pathname, user.user_type)
    ) {
      router.push(getDefaultAuthorizedRedirect(user.user_type));
    }
  }, [isAuthenticated, router, user, allowedTypes, isInitializing, pathname]);

  if (isInitializing) {
    return (
      <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Center>
          <Loader />
        </Center>
      </Container>
    );
  }

  if (
    isAuthenticated &&
    user &&
    (!allowedTypes || allowedTypes.includes(user.user_type))
  ) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return null;
}
