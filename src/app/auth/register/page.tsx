'use client';

import { useState } from 'react';
import { Title, Container, Paper, Button } from '@mantine/core';
import { default as RegisterForm } from '@/features/auth/ui/RegisterForm/RegisterForm';

export default function RegisterPage() {
  const [, setIsLoginView] = useState(false);

  return (
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
  );
}
