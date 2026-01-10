'use client';

import { Flex, Text, Anchor, Group } from '@mantine/core';
import Link from 'next/link';
import { UserProfileDropdown } from '../UserProfileDropdown/UserProfileDropdown';

export const HeaderContent = () => {
  return (
    <Flex justify="space-between" align="center" h="100%">
      {/* Left side - Navigation */}
      <Group>
        <Anchor component={Link} href="/home" fw={500} c="white">
          Главная
        </Anchor>
      </Group>

      {/* Right side - User profile */}
      <Group>
        <UserProfileDropdown />
      </Group>
    </Flex>
  );
};