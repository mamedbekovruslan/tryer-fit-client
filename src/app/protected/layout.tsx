'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, Text, Burger, useMantineTheme, Container, NavLink, Loader, Center } from '@mantine/core';
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
  const { user, isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    if (isInitializing) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [router, isAuthenticated, isInitializing]);

  if (isInitializing) {
    return (
      <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Center>
          <Loader />
        </Center>
      </Container>
    );
  }

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

        {user?.user_type === 'trainer' && (
          <>
            <Link href="/admin" passHref legacyBehavior>
              <NavLink component="a" label="Панель тренера" />
            </Link>
          </>
        )}

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
