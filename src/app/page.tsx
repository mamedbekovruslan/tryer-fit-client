'use client';

import { useEffect, useRef } from 'react';
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

// Функция для получения типа пользователя из токена
function getUserTypeFromToken(token: string | null): string | null {
  if (!token) return null;

  try {
    // Разбиваем токен на части (header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null; // Некорректный формат токена
    }

    // Декодируем payload (вторая часть)
    const payload = JSON.parse(atob(parts[1]));

    // Возвращаем тип пользователя из токена
    return payload.user_type || payload.type || null;
  } catch (error) {
    console.error('Ошибка при получении типа пользователя из токена:', error);
    return null;
  }
}

export default function HomePage() {
  const router = useRouter();
  const hasRedirected = useRef(false); // Используем ref, чтобы избежать повторных перенаправлений

  useEffect(() => {
    if (hasRedirected.current) return; // Если уже произошло перенаправление, выходим

    // Проверяем, есть ли токен в localStorage и действителен ли он
    const token = localStorage.getItem('token');

    if (token && isTokenValid(token)) {
      // Получаем тип пользователя из токена
      const userType = getUserTypeFromToken(token);

      // Если токен есть и действителен, перенаправляем на соответствующую страницу
      if (userType === 'trainer') {
        hasRedirected.current = true;
        router.push('/admin');
      } else {
        // Для клиентов и других типов пользователей перенаправляем на /home
        hasRedirected.current = true;
        router.push('/home');
      }
    } else {
      // Если токена нет или он недействителен, перенаправляем на страницу аутентификации
      hasRedirected.current = true;
      router.push('/auth');
    }
  }, [router]);

  return null; // Пока ничего не отображаем, так как происходит перенаправление
}