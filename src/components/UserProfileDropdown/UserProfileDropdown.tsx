'use client';

import { Avatar, Menu, Text, Divider } from '@mantine/core';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function getPhotoSrc(photoUrls?: string[]): string | null {
  if (!photoUrls || photoUrls.length === 0) return null;
  const first = photoUrls[0];
  return first && first.trim() ? first : null;
}

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
          src={getPhotoSrc(user.photo_urls)}
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

        {/* Показываем пункт "Профиль" только для клиентов */}
        {user.user_type === 'client' && (
          <Menu.Item
            leftSection={<FiUser size={16} />}
            component={Link}
            href="/profile"
          >
            Профиль
          </Menu.Item>
        )}

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
