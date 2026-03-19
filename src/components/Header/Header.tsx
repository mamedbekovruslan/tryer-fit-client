'use client';

import { Flex, Text, Anchor, Group, Badge } from '@mantine/core';
import Link from 'next/link';
import { UserProfileDropdown } from '../UserProfileDropdown/UserProfileDropdown';
import { useAuth } from '@/providers/AuthProvider';

export const HeaderContent = () => {
  const { user } = useAuth();

  const navText = user?.user_type === 'trainer' ? 'Админ' : 'Главная';
  const navHref = user?.user_type === 'trainer' ? '/admin' : '/home';

  return (
    <Flex justify="space-between" align="center" h="100%">
      <Group>
        <Anchor component={Link} href={navHref} fw={500} c="white">
          {navText}
        </Anchor>
        {user?.user_type === 'client' && (
          <Anchor component={Link} href="/progress" fw={500} c="white">
            Прогресс
          </Anchor>
        )}
        {user?.user_type === 'client' && (
          <Anchor component={Link} href="/nutrition" fw={500} c="white">
            Питание
          </Anchor>
        )}
        {user?.user_type === 'client' && (
          <Anchor component={Link} href="/workout" fw={500} c="white">
            Тренировки
          </Anchor>
        )}
        {user?.user_type === 'trainer' && (
          <Anchor component={Link} href="/admin/nutrition" fw={500} c="white">
            Питание
          </Anchor>
        )}
        {user?.user_type === 'trainer' && (
          <><Anchor component={Link} href="/trainer/workout" fw={500} c="white">
            Тренировки
          </Anchor>
            <Anchor component={Link} href="/chat" fw={500} c="white">
              Чат
            </Anchor></>
        )}

      </Group>

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