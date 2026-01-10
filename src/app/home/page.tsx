'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Paper, Stack } from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import TrainerInfoCard from '@/components/TrainerInfoCard';

export default function HomePage() {
  const { user, refreshUserProfile } = useAuth();
  const [logoutRequested, setLogoutRequested] = useState(false);

  useEffect(() => {
    // Обновляем профиль пользователя при загрузке страницы, если у нас нет информации о пользователе
    if (!user && typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        refreshUserProfile();
      }
    }
  }, [user, refreshUserProfile]);

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
            Это защищенное главная страница. Только авторизованные пользователи могут получить к ней доступ.
          </Text>

          {/* Карточка информации о тренере */}
          <Stack gap="xl" mt="xl">
            <TrainerInfoCard trainer={user?.trainer} />
          </Stack>
        </Paper>
      </Container>
    </ProtectedRoute>
  );
}