'use client';

import { useState } from 'react';
import { Container, Title, Text, Paper, Button, Group } from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function HomePage() {
  const { user, logout } = useAuth();
  const [logoutRequested, setLogoutRequested] = useState(false);

  const handleLogout = () => {
    setLogoutRequested(true);
    logout();
  };

  // Показываем защищенное содержимое только если пользователь аутентифицирован
  return (
    <ProtectedRoute>
      <Container size="md" py="xl">
        <Paper shadow="md" p="xl" radius="md">
          <Title order={1} ta="center" mb="xl">Добро пожаловать в Tryer Fit!</Title>

          <Text size="lg" mb="lg">
            Здравствуйте, <strong>{user?.username}</strong>!
            Вы успешно вошли в систему как <strong>{user?.user_type}</strong>.
          </Text>

          <Text size="md" mb="xl">
            Это защищенная главная страница. Только авторизованные пользователи могут получить к ней доступ.
          </Text>

          <Group justify="center">
            <Button onClick={handleLogout} color="red">
              Выйти
            </Button>
          </Group>
        </Paper>
      </Container>
    </ProtectedRoute>
  );
}