'use client';

import { Flex, Text, Anchor, Group } from '@mantine/core';
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
      </Group>

      {/* Right side - User profile */}
      <Group>
        <UserProfileDropdown />
      </Group>
    </Flex>
  );
};