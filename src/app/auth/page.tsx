'use client';

import { useState } from 'react';
import { Title, Container, Paper, Group, Button } from '@mantine/core';
import LoginForm from '@/features/auth/login/ui/LoginForm';
import { default as RegisterForm } from '@/features/auth/ui/RegisterForm/RegisterForm';

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <>
      <Container size="sm" fluid style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
        <Paper radius="md" p="xl" withBorder shadow="md" w={500}>
          <Title order={2} ta="center" mb="lg">
            {isLoginView ? 'Tryer Fit - Вход' : 'Tryer Fit - Регистрация'}
          </Title>

          {isLoginView ? (
            <LoginForm onSwitchToRegister={() => setIsLoginView(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLoginView(true)} />
          )}
        </Paper>
      </Container>
    </>
  );
}