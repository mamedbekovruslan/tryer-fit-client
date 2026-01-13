'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Paper, Stack, Card, Badge, SimpleGrid, Avatar, Flex, Grid, Button, Modal, TextInput } from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { trainerService, Trainer } from '@/services/trainerService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Типы данных
interface Client {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_favorite: boolean; // поле "звездочка"
  // другие поля клиента
}

interface ChatMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  timestamp: string;
  is_read: boolean;
}

export default function AdminPage() {
  const { user, refreshUserProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [clientsInWork, setClientsInWork] = useState<Client[]>([]);
  const [newClients, setNewClients] = useState<Client[]>([]);
  const [chatClients, setChatClients] = useState<Client[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<{[key: number]: number}>({});
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [opened, setOpened] = useState(false);

  // Моковые данные для демонстрации
  const mockClientsInWork: Client[] = [
    { id: 1, username: 'client1', email: 'client1@example.com', first_name: 'Иван', last_name: 'Иванов', is_favorite: true },
    { id: 2, username: 'client2', email: 'client2@example.com', first_name: 'Мария', last_name: 'Петрова', is_favorite: false },
  ];

  const mockNewClients: Client[] = [
    { id: 3, username: 'newclient1', email: 'newclient1@example.com', first_name: 'Алексей', last_name: 'Сидоров', is_favorite: false },
    { id: 4, username: 'newclient2', email: 'newclient2@example.com', first_name: 'Елена', last_name: 'Козлова', is_favorite: true },
  ];

  const mockChatClients: Client[] = [
    { id: 1, username: 'client1', email: 'client1@example.com', first_name: 'Иван', last_name: 'Иванов', is_favorite: true },
    { id: 3, username: 'newclient1', email: 'newclient1@example.com', first_name: 'Алексей', last_name: 'Сидоров', is_favorite: false },
  ];

  const mockUnreadCounts = {
    1: 3,
    3: 1
  };

  useEffect(() => {
    // Загружаем данные тренера
    const loadTrainerData = async () => {
      if (user && user.user_type === 'trainer') {
        try {
          // Получаем данные профиля текущего тренера с бэкенда
          const trainerData = await trainerService.getMyTrainerProfile();
          setTrainer(trainerData);
        } catch (error) {
          console.error('Error loading trainer profile:', error);
          // Если эндпоинт /trainers/profile не реализован на бэкенде,
          // используем базовую информацию из объекта user
          const basicTrainerInfo = {
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            // Остальные поля могут быть пустыми или заполненными по умолчанию
            // поскольку полная информация недоступна без соответствующего эндпоинта
            specialization: '',
            education: '',
            degree: '',
            phone: '',
            photo_urls: [],
            created_at: '',
            updated_at: '',
            // Добавим другие возможные поля
            middle_name: '',
            gender: '',
            height: undefined,
            weight: undefined,
            birth_date: '',
            institution: '',
            certificate_number: '',
          };
          setTrainer(basicTrainerInfo);
        }
      }

      // Устанавливаем моковые данные для других разделов
      setClientsInWork(mockClientsInWork);
      setNewClients(mockNewClients);
      setChatClients(mockChatClients);
      setUnreadCounts(mockUnreadCounts);

      setLoading(false);
    };

    loadTrainerData();
  }, [user]);

  const handleFieldClick = (fieldName: string, currentValue: any) => {
    setEditingField(fieldName);
    setEditValue(currentValue || '');
    setOpened(true);
  };

  const handleSave = async () => {
    if (trainer && editingField) {
      try {
        // Вызов API для сохранения изменений
        const updatedTrainer = await trainerService.updateTrainerField(trainer.id, editingField, editValue);

        // Обновляем локальное состояние
        setTrainer(updatedTrainer);

        setOpened(false);
        setEditingField(null);
        setEditValue('');
      } catch (error) {
        console.error('Error saving trainer data:', error);
      }
    }
  };

  if (loading) {
    return (
      <UserTypeProtectedRoute allowedUserTypes={['trainer']}>
        <Container size="md" py="xl">
          <Paper shadow="md" p="xl" radius="md">
            <Text ta="center">Загрузка данных тренера...</Text>
          </Paper>
        </Container>
      </UserTypeProtectedRoute>
    );
  }

  if (!user || !trainer) {
    return (
      <UserTypeProtectedRoute allowedUserTypes={['trainer']}>
        <Container size="md" py="xl">
          <Paper shadow="md" p="xl" radius="md">
            <Text ta="center">Не удалось загрузить данные тренера</Text>
          </Paper>
        </Container>
      </UserTypeProtectedRoute>
    );
  }

  return (
    <UserTypeProtectedRoute allowedUserTypes={['trainer']}>
      <Container size="lg" py="xl">
        <Paper shadow="md" p="xl" radius="md">
          <Title order={1} ta="center" mb="xl">Панель управления тренера</Title>

          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Flex justify="center" mb="md">
                    <Avatar
                      src={trainer.photo_urls?.[0] || null}
                      alt={trainer.username}
                      radius="xl"
                      size="xl"
                    >
                      {trainer.username?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Flex>

                  <Title order={3} ta="center">Информация о тренере</Title>

                  <div onClick={() => handleFieldClick('first_name', trainer.first_name)}>
                    <Text size="sm" c="dimmed">Имя</Text>
                    <Text fw={500}>{trainer.first_name || 'Не указано'}</Text>
                  </div>

                  <div onClick={() => handleFieldClick('last_name', trainer.last_name)}>
                    <Text size="sm" c="dimmed">Фамилия</Text>
                    <Text fw={500}>{trainer.last_name || 'Не указана'}</Text>
                  </div>

                  <div onClick={() => handleFieldClick('specialization', trainer.specialization)}>
                    <Text size="sm" c="dimmed">Специализация</Text>
                    <Text fw={500}>{trainer.specialization || 'Не указана'}</Text>
                  </div>

                  <div onClick={() => handleFieldClick('education', trainer.education)}>
                    <Text size="sm" c="dimmed">Образование</Text>
                    <Text fw={500}>{trainer.education || 'Не указано'}</Text>
                  </div>

                  <div onClick={() => handleFieldClick('degree', trainer.degree)}>
                    <Text size="sm" c="dimmed">Степень</Text>
                    <Text fw={500}>{trainer.degree || 'Не указана'}</Text>
                  </div>

                  <div onClick={() => handleFieldClick('phone', trainer.phone)}>
                    <Text size="sm" c="dimmed">Телефон</Text>
                    <Text fw={500}>{trainer.phone || 'Не указан'}</Text>
                  </div>

                  <div onClick={() => handleFieldClick('email', trainer.email)}>
                    <Text size="sm" c="dimmed">Email</Text>
                    <Text fw={500}>{trainer.email || 'Не указан'}</Text>
                  </div>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 8 }}>
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mb="xl">
                {/* Клиенты в работе */}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={3} mb="md">Клиенты в работе</Title>
                  {clientsInWork.map(client => (
                    <div key={client.id} style={{ marginBottom: '10px', cursor: 'pointer' }}>
                      <Flex justify="space-between" align="center">
                        <Text fw={500}>
                          {client.first_name} {client.last_name} ({client.username})
                          {client.is_favorite && <Badge ml="xs" color="yellow">★</Badge>}
                        </Text>
                      </Flex>
                    </div>
                  ))}
                </Card>

                {/* Новые клиенты */}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={3} mb="md">Новые клиенты</Title>
                  {newClients.map(client => (
                    <div key={client.id} style={{ marginBottom: '10px', cursor: 'pointer' }}>
                      <Flex justify="space-between" align="center">
                        <Text fw={500}>
                          {client.first_name} {client.last_name} ({client.username})
                          {client.is_favorite && <Badge ml="xs" color="yellow">★</Badge>}
                        </Text>
                      </Flex>
                    </div>
                  ))}
                </Card>
              </SimpleGrid>

              {/* Чат с клиентами */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={3} mb="md">Чат с клиентами</Title>
                {chatClients
                  .sort((a, b) => (b.is_favorite ? 1 : 0) - (a.is_favorite ? 1 : 0)) // Сортировка по звездочке
                  .map(client => (
                    <div
                      key={client.id}
                      style={{ marginBottom: '10px', cursor: 'pointer' }}
                      onClick={() => router.push(`/chat?clientId=${client.id}`)}
                    >
                      <Flex justify="space-between" align="center">
                        <Text fw={500}>
                          {client.first_name} {client.last_name} ({client.username})
                          {client.is_favorite && <Badge ml="xs" color="yellow">★</Badge>}
                        </Text>
                        {unreadCounts[client.id] > 0 && (
                          <Badge color="red">{unreadCounts[client.id]}</Badge>
                        )}
                      </Flex>
                    </div>
                  ))}
              </Card>
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>

      {/* Модальное окно для редактирования полей */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={`Редактирование ${editingField}`}
      >
        <TextInput
          label="Значение"
          value={editValue}
          onChange={(event) => setEditValue(event.currentTarget.value)}
        />
        <Button onClick={handleSave} fullWidth mt="md">
          Сохранить
        </Button>
      </Modal>
    </UserTypeProtectedRoute>
  );
}