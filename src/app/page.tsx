'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export default function HomePage() {
  const router = useRouter();
  const hasRedirected = useRef(false); // Используем ref, чтобы избежать повторных перенаправлений
  const { user, isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    if (hasRedirected.current || isInitializing) return;

    if (!isAuthenticated || !user) {
      hasRedirected.current = true;
      router.push('/auth');
      return;
    }

    hasRedirected.current = true;
    router.push(user.user_type === 'trainer' ? '/admin' : '/home');
  }, [router, user, isAuthenticated, isInitializing]);

  return null; // Пока ничего не отображаем, так как происходит перенаправление
}
