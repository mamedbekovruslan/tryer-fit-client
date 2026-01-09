'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, Header, Navbar, Text, MediaQuery, Burger, useMantineTheme, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '@/providers/AuthProvider';

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
        <Text>Навигация</Text>
        {/* Add navigation items here */}
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}