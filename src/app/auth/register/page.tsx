'use client';

import { Title, Container, Paper, Group } from '@mantine/core';
import { default as RegisterForm } from '@/features/auth/ui/RegisterForm/RegisterForm';
import ThemeToggle from '@/shared/ui/ThemeToggle';

export default function RegisterPage() {
  return (
    <>
      <Group justify="flex-end" style={{ position: 'fixed', right: '20px', top: '20px', zIndex: 1000 }}>
        <ThemeToggle />
      </Group>
      <Container size="sm" fluid style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
        <Paper radius="md" p="xl" withBorder shadow="md" w={500}>
          <Title order={2} ta="center" mb="lg">
            Tryer Fit - Регистрация
          </Title>

          <RegisterForm onSwitchToLogin={() => window.location.href = '/auth/login'} />
        </Paper>
      </Container>
    </>
  );
}