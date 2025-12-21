'use client';

import { TextInput, PasswordInput, Button, Text, Anchor, Group } from '@mantine/core';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <TextInput
        label="Электронная почта"
        placeholder="your@email.com"
        required
      />

      <PasswordInput
        label="Пароль"
        placeholder="Ваш пароль"
        required
        mt="md"
      />

      <Group justify="space-between" mt="lg">
        <Anchor component="button" type="button" c="dimmed" size="sm">
          Забыли пароль?
        </Anchor>
      </Group>

      <Button fullWidth mt="xl" type="submit">
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