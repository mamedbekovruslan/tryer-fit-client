'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Проверяем, есть ли токен в localStorage и действителен ли он
    const token = localStorage.getItem('token');

    if (token && isTokenValid(token)) {
      // Если токен есть и действителен, перенаправляем на защищенную главную страницу
      router.push('/home');
    } else {
      // Если токена нет или он недействителен, перенаправляем на страницу аутентификации
      router.push('/auth');
    }
  }, [router]);

  return null; // Пока ничего не отображаем, так как происходит перенаправление
}