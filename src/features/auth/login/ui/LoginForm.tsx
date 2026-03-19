'use client';

import { useState } from 'react';
import { TextInput, PasswordInput, Button, Text, Anchor, Group, Alert } from '@mantine/core';
import { useLogin } from '../hooks/useLogin';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { handleLogin, loading, error } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(email, password, (user) => {
      if (user.user_type === 'trainer') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/home';
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="Электронная почта"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        required
      />

      <PasswordInput
        label="Пароль"
        placeholder="Ваш пароль"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        required
        mt="md"
      />

      {error && (
        <Alert title="Ошибка входа" color="red" mt="md">
          {error}
        </Alert>
      )}

      <Group justify="space-between" mt="lg">
        <Anchor component="button" type="button" c="dimmed" size="sm">
          Забыли пароль?
        </Anchor>
      </Group>

      <Button fullWidth mt="xl" type="submit" loading={loading}>
        Войти
      </Button>

      <Text ta="center" mt="md">
        Нет аккаунта?{' '}
        <Anchor
          component="button"
          type="button"
          fw={500}
          onClick={onSwitchToRegister}
        >
          Зарегистрироваться
        </Anchor>
      </Text>
    </form>
  );
}