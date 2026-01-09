'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Проверяем, есть ли токен в localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // Если токен есть, перенаправляем на защищенную главную страницу
      router.push('/home');
    } else {
      // Если токена нет, перенаправляем на страницу аутентификации
      router.push('/auth');
    }
  }, [router]);

  return null; // Пока ничего не отображаем, так как происходит перенаправление
}