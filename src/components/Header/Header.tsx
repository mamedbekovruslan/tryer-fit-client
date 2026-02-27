'use client';

import { Flex, Text, Anchor, Group, Badge } from '@mantine/core';
import Link from 'next/link';
import { UserProfileDropdown } from '../UserProfileDropdown/UserProfileDropdown';
import { useAuth } from '@/providers/AuthProvider';

export const HeaderContent = () => {
  const { user } = useAuth();

  // Определяем текст ссылки в зависимости от типа пользователя
  const navText = user?.user_type === 'trainer' ? 'Админ' : 'Главная';
  const navHref = user?.user_type === 'trainer' ? '/admin' : '/home';

  return (
    <Flex justify="space-between" align="center" h="100%">
      {/* Left side - Navigation */}
      <Group>
        <Anchor component={Link} href={navHref} fw={500} c="white">
          {navText}
        </Anchor>
        {/* Показываем ссылку "Прогресс" только для клиентов */}
        {user?.user_type === 'client' && (
          <Anchor component={Link} href="/progress" fw={500} c="white">
            Прогресс
          </Anchor>
        )}
        {/* Показываем ссылку "Питание" для клиентов */}
        {user?.user_type === 'client' && (
          <Anchor component={Link} href="/nutrition" fw={500} c="white">
            Питание
          </Anchor>
        )}
        {/* Показываем ссылку "Тренировки" для клиентов */}
        {user?.user_type === 'client' && (
          <Anchor component={Link} href="/workout" fw={500} c="white">
            Тренировки
          </Anchor>
        )}
        {/* Показываем ссылку "Питание" только для тренеров */}
        {user?.user_type === 'trainer' && (
          <Anchor component={Link} href="/admin/nutrition" fw={500} c="white">
            Питание
          </Anchor>
        )}
        {/* Показываем ссылку "Тренировки" только для тренеров */}
        {user?.user_type === 'trainer' && (
          <Anchor component={Link} href="/trainer/workout" fw={500} c="white">
            Тренировки
          </Anchor>
        )}
        {/* Ссылка на чат для всех пользователей */}
        <Anchor component={Link} href="/chat" fw={500} c="white">
          Чат
        </Anchor>
      </Group>

      {/* Right side - User profile */}
      <Group>
        {user?.user_type === 'client' && (
          <Anchor component={Link} href="/chat" fw={500} c="white">
            Чат с тренером
          </Anchor>
        )}
        <UserProfileDropdown />
      </Group>
    </Flex>
  );
};