'use client';

import { Title, Container, Paper, Group, Text, Alert } from '@mantine/core';
import AuthForm from '@/features/auth/AuthForm';
import ThemeToggle from '@/components/ThemeToggle';
import { useBackendConnection } from '@/features/auth/hooks/useBackendConnection';

export default function Home() {
  const { message, loading, error } = useBackendConnection();

  return (
    <>
      <Group justify="flex-end" style={{ position: 'fixed', right: '20px', top: '20px', zIndex: 1000 }}>
        <ThemeToggle />
      </Group>
      <Container size="sm" fluid style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
        <Paper radius="md" p="xl" withBorder shadow="md" w={500}>
          <Title order={2} ta="center" mb="lg">
            Tryer Fit
          </Title>

          {loading ? (
            <Text ta="center" c="dimmed" mb="md">Connecting to backend...</Text>
          ) : error ? (
            <Alert title="Connection Error" color="red" mb="md">
              {error}
            </Alert>
          ) : (
            <Alert title="Backend Connected" color="green" mb="md">
              Message from backend: {message}
            </Alert>
          )}

          <AuthForm />
        </Paper>
      </Container>
    </>
  );
}
