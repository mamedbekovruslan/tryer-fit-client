'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Paper, Stack, Card, Badge, SimpleGrid, Avatar, Flex } from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';

export default function ProfilePage() {
  const { user, refreshUserProfile } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Refresh user profile when the page loads
    const loadProfile = async () => {
      if (!user) {
        await refreshUserProfile();
      }
      setLoading(false);
    };

    loadProfile();
  }, [user, refreshUserProfile]);

  if (loading) {
    return (
      <UserTypeProtectedRoute allowedUserTypes={['client']}>
        <Container size="md" py="xl">
          <Paper shadow="md" p="xl" radius="md">
            <Text ta="center">Загрузка профиля...</Text>
          </Paper>
        </Container>
      </UserTypeProtectedRoute>
    );
  }

  if (!user) {
    return (
      <UserTypeProtectedRoute allowedUserTypes={['client']}>
        <Container size="md" py="xl">
          <Paper shadow="md" p="xl" radius="md">
            <Text ta="center">Не удалось загрузить данные профиля</Text>
          </Paper>
        </Container>
      </UserTypeProtectedRoute>
    );
  }

  return (
    <UserTypeProtectedRoute allowedUserTypes={['client']}>
      <Container size="lg" py="xl">
        <Paper shadow="md" p="xl" radius="md">
          <Title order={1} ta="center" mb="xl">Профиль пользователя</Title>

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <Flex justify="center" mb="md">
                  <Avatar
                    src={null} // Placeholder for user avatar
                    alt={user.username}
                    radius="xl"
                    size="xl"
                  >
                    {user.username?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </Flex>

                <Title order={3} ta="center">Личная информация</Title>

                <div>
                  <Text size="sm" c="dimmed">Имя пользователя</Text>
                  <Text fw={500}>{user.username || 'Не указано'}</Text>
                </div>

                <div>
                  <Text size="sm" c="dimmed">Email</Text>
                  <Text fw={500}>{user.email || 'Не указано'}</Text>
                </div>

                <div>
                  <Text size="sm" c="dimmed">Тип пользователя</Text>
                  <Badge variant="light" color={user.user_type === 'client' ? 'blue' : 'green'}>
                    {user.user_type === 'client' ? 'Клиент' : 'Тренер'}
                  </Badge>
                </div>

                {user.user_type === 'client' && (
                  <>
                    <div>
                      <Text size="sm" c="dimmed">Имя</Text>
                      <Text fw={500}>{user.first_name || 'Не указано'}</Text>
                    </div>

                    <div>
                      <Text size="sm" c="dimmed">Фамилия</Text>
                      <Text fw={500}>{user.last_name || 'Не указана'}</Text>
                    </div>

                    <div>
                      <Text size="sm" c="dimmed">Цель тренировок</Text>
                      <Text fw={500}>{user.fitness_goal || 'Не указана'}</Text>
                    </div>

                    <div>
                      <Text size="sm" c="dimmed">Ожидаемый результат</Text>
                      <Text fw={500}>{user.expected_result || 'Не указан'}</Text>
                    </div>

                    <div>
                      <Text size="sm" c="dimmed">Ограничения</Text>
                      <Text fw={500}>{user.limitations || 'Нет ограничений'}</Text>
                    </div>

                    <div>
                      <Text size="sm" c="dimmed">Болезни</Text>
                      <Text fw={500}>{user.diseases || 'Нет заболеваний'}</Text>
                    </div>

                    <div>
                      <Text size="sm" c="dimmed">Опыт тренировок</Text>
                      <Text fw={500}>{user.training_experience || 'Не указан'}</Text>
                    </div>
                  </>
                )}
              </Stack>
            </Card>

            {user.user_type === 'client' && user.trainer && (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Flex justify="center" mb="md">
                    <Avatar
                      src={null} // Placeholder for trainer avatar
                      alt={user.trainer.name}
                      radius="xl"
                      size="xl"
                    >
                      {user.trainer.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Flex>

                  <Title order={3} ta="center">Информация о тренере</Title>

                  <div>
                    <Text size="sm" c="dimmed">Имя тренера</Text>
                    <Text fw={500}>{user.trainer.first_name || 'Не указано'} {user.trainer.last_name || ''}</Text>
                  </div>

                  <div>
                    <Text size="sm" c="dimmed">Специализация</Text>
                    <Text fw={500}>{user.trainer.specialization || 'Не указана'}</Text>
                  </div>

                  <div>
                    <Text size="sm" c="dimmed">Степень</Text>
                    <Text fw={500}>{user.trainer.degree || 'Не указана'}</Text>
                  </div>

                  <div>
                    <Text size="sm" c="dimmed">Образование</Text>
                    <Text fw={500}>{user.trainer.education || 'Не указано'}</Text>
                  </div>

                  <div>
                    <Text size="sm" c="dimmed">Контактный телефон</Text>
                    <Text fw={500}>{user.trainer.phone || 'Не указан'}</Text>
                  </div>

                  <div>
                    <Text size="sm" c="dimmed">Email</Text>
                    <Text fw={500}>{user.trainer.email || 'Не указан'}</Text>
                  </div>
                </Stack>
              </Card>
            )}

            {user.user_type === 'client' && !user.trainer && (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={3} mb="md">Информация о тренере</Title>
                <Text>У вас пока нет назначенного тренера</Text>
              </Card>
            )}
          </SimpleGrid>
        </Paper>
      </Container>
    </UserTypeProtectedRoute>
  );
}