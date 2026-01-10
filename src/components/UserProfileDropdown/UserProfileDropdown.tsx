'use client';

import { Avatar, Menu, Text, Divider } from '@mantine/core';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';

export const UserProfileDropdown = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  if (!user) {
    return null; // Don't show the dropdown if user is not authenticated
  }

  return (
    <Menu shadow="md" width={220}>
      <Menu.Target>
        <Avatar
          src={null} // Placeholder for user avatar
          alt={user.username}
          radius="xl"
          size="md"
          style={{ cursor: 'pointer', backgroundColor: 'white', color: 'black' }}
        >
          {user.username?.charAt(0)?.toUpperCase()}
        </Avatar>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>
          <Text size="sm">{user.username}</Text>
        </Menu.Label>

        <Divider />

        <Menu.Item
          leftSection={<FiLogOut size={16} />}
          onClick={handleLogout}
          color="red"
        >
          Выйти
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};