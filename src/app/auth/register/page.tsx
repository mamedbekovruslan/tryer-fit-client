'use client';

import { useState, useEffect } from 'react';
import { Title, Container, Paper, Group, Button } from '@mantine/core';
import LoginForm from '@/features/auth/login/ui/LoginForm';
import { default as RegisterForm } from '@/features/auth/ui/RegisterForm/RegisterForm';

export default function RegisterPage() {
  const [isLoginView, setIsLoginView] = useState(false);

  // Убедимся, что отображается форма регистрации
  useEffect(() => {
    setIsLoginView(false);
  }, []);

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

          <RegisterForm onSwitchToLogin={() => setIsLoginView(true)} />
          
          <Button 
            variant="subtle" 
            fullWidth 
            mt="md"
            onClick={() => setIsLoginView(true)}
          >
            Уже есть аккаунт? Войти
          </Button>
        </Paper>
      </Container>
    </>
  );
}