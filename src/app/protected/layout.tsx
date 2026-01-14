'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, Text, Burger, useMantineTheme, Container, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const [opened, { toggle }] = useDisclosure(false);
  const theme = useMantineTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if not authenticated
      router.push('/auth/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Text>Загрузка...</Text>
      </Container>
    );
  }

  const { user } = useAuth();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding="md"
    >
      <AppShell.Header>
        <Burger
          opened={opened}
          onClick={toggle}
          size="sm"
          hiddenFrom="sm"
          mr="xl"
        />
        <Text fw={500}>Tryer Fit - Панель управления</Text>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Text fw={500} mb="sm">Навигация</Text>

        {/* Для тренеров показываем дополнительные пункты */}
        {user?.user_type === 'trainer' && (
          <>
            <Link href="/admin" passHref legacyBehavior>
              <NavLink component="a" label="Панель тренера" />
            </Link>
          </>
        )}

        {/* Для клиентов показываем их пункты */}
        {user?.user_type === 'client' && (
          <>
            <Link href="/home" passHref legacyBehavior>
              <NavLink component="a" label="Главная" />
            </Link>
            <Link href="/profile" passHref legacyBehavior>
              <NavLink component="a" label="Профиль" />
            </Link>
          </>
        )}
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}