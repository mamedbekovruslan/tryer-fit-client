'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Paper, Stack, Card, Badge, SimpleGrid, Avatar, Flex, Grid, Button, TextInput, NumberInput, Select, Group, FileInput } from '@mantine/core';
import { FiPlus, FiX } from 'react-icons/fi';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { trainerService, Trainer } from '@/services/trainerService';
import { chatService, ChatUser } from '@/services/chatService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Типы данных
interface ExtendedClient {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  photo_urls?: string[];
  is_favorite: boolean; // поле "звездочка"
  trainer?: {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
  }; // информация о привязанном тренере
}

function getClientPhotoSrc(client: ExtendedClient): string | null {
  const first = client.photo_urls?.[0];
  if (first && first.trim()) return first;
  return null;
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
  const [clientsInWork, setClientsInWork] = useState<ExtendedClient[]>([]);
  const [newClients, setNewClients] = useState<ExtendedClient[]>([]);
  const [chatClients, setChatClients] = useState<ChatUser[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    gender: '',
    height: undefined as number | undefined,
    weight: undefined as number | undefined,
    phone: '',
    birth_date: '',
    education: '',
    institution: '',
    degree: '',
    specialization: '',
    certificate_number: '',
    photo_urls: [] as string[],
  });

  useEffect(() => {
    // Загружаем данные тренера и клиентов
    const loadTrainerData = async () => {
      if (user && user.user_type === 'trainer') {
        try {
          // Получаем данные профиля текущего тренера с бэкенда
          const trainerData = await trainerService.getMyTrainerProfile();
          setTrainer(trainerData);

          // Загружаем клиентов, привязанных к тренеру
          const clientsInWorkData = await trainerService.getClientsByTrainerId(trainerData.id);
          setClientsInWork(clientsInWorkData);

          // Загружаем клиентов, которые не привязаны к тренеру
          const newClientsData = await trainerService.getUnassignedClients();
          setNewClients(newClientsData);

        } catch (error) {
          console.error('Error loading trainer data:', error);
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

      setLoading(false);
    };

    loadTrainerData();
  }, [user]);

  // Загрузка данных чата отдельно
  useEffect(() => {
    if (trainer) {
      const loadChatData = async () => {
        try {
          const chats = await chatService.getUserChats();
          console.log('Chat clients loaded:', chats);
          setChatClients(chats);
        } catch (error) {
          console.error('Error loading chat data:', error);
        }
      };

      loadChatData();
    }
  }, [trainer]);

  const handleSave = async () => {
    if (trainer) {
      try {
        // Отправляем обновленные данные на бэкенд
        const updatedTrainer = await trainerService.updateTrainer(trainer.id, formData);

        // Обновляем локальное состояние
        setTrainer(updatedTrainer);

        // Выходим из режима редактирования
        setIsEditing(false);
      } catch (error) {
        console.error('Error saving trainer data:', error);
      }
    }
  };

  const handleProfilePhotoChange = async (file: File | null) => {
    if (!file) {
      setFormData((prev) => ({ ...prev, photo_urls: [] }));
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });

    setFormData((prev) => ({ ...prev, photo_urls: [dataUrl] }));
  };

  // Обновляем formData при переходе в режим редактирования
  useEffect(() => {
    if (trainer && isEditing) {
      setFormData({
        first_name: trainer.first_name || '',
        last_name: trainer.last_name || '',
        middle_name: trainer.middle_name || '',
        gender: trainer.gender || '',
        height: trainer.height,
        weight: trainer.weight,
        phone: trainer.phone || '',
        birth_date: trainer.birth_date || '',
        education: trainer.education || '',
        institution: trainer.institution || '',
        degree: trainer.degree || '',
        specialization: trainer.specialization || '',
        certificate_number: trainer.certificate_number || '',
        photo_urls: trainer.photo_urls || [],
      });
    }
  }, [isEditing, trainer]);

  const handleAddClient = async (clientId: number) => {
    // Реализация добавления клиента через API
    if (!user || !trainer) return;

    try {
      // Вызываем API для привязки клиента к тренеру
      const assignedClient = await trainerService.assignClientToTrainer(trainer.id, clientId);

      // Удаляем клиента из списка новых клиентов
      const updatedNewClients = newClients.filter(client => client.id !== clientId);

      // Добавляем клиента в список клиентов в работе
      const updatedClientsInWork = [...clientsInWork, assignedClient];

      // Обновляем состояние
      setNewClients(updatedNewClients);
      setClientsInWork(updatedClientsInWork);
    } catch (error) {
      console.error('Error assigning client to trainer:', error);
    }
  };

  const handleRemoveClient = async (clientId: number) => {
    // Реализация удаления клиента через API
    if (!user || !trainer) return;

    try {
      // Вызываем API для отвязки клиента от тренера
      const unassignedClient = await trainerService.unassignClientFromTrainer(trainer.id, clientId);

      // Удаляем клиента из списка клиентов в работе
      const updatedClientsInWork = clientsInWork.filter(client => client.id !== clientId);

      // Добавляем клиента в список новых клиентов
      const updatedNewClients = [...newClients, unassignedClient];

      // Обновляем состояние
      setClientsInWork(updatedClientsInWork);
      setNewClients(updatedNewClients);
    } catch (error) {
      console.error('Error unassigning client from trainer:', error);
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
          <Group justify="space-between" mb="xl">
            <Title order={1}>Панель управления тренера</Title>
            <Group>
              <Button component={Link} href="/admin/nutrition" variant="outline">
                Питание
              </Button>
              <Button component={Link} href="/trainer/workout" variant="outline">
                Тренировки
              </Button>
            </Group>
          </Group>

          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Flex justify="center" mb="md">
                    <Avatar
                      src={isEditing ? formData.photo_urls?.[0] || trainer.photo_urls?.[0] || null : trainer.photo_urls?.[0] || null}
                      alt={trainer.username}
                      radius="xl"
                      size="xl"
                    >
                      {trainer.username?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Flex>

                  <Title order={3} ta="center">Информация о тренере</Title>

                  {isEditing ? (
                    <>
                      <div>
                        <Text size="sm" c="dimmed">Фото профиля</Text>
                        <FileInput
                          placeholder="Выберите изображение"
                          accept="image/*"
                          clearable
                          onChange={handleProfilePhotoChange}
                        />
                        {formData.photo_urls[0] && (
                          <Group mt="xs">
                            <Avatar src={formData.photo_urls[0]} radius="xl" size="md" />
                            <Button
                              size="xs"
                              variant="light"
                              color="red"
                              onClick={() => setFormData({ ...formData, photo_urls: [] })}
                            >
                              Удалить фото
                            </Button>
                          </Group>
                        )}
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Имя</Text>
                        <TextInput
                          value={formData.first_name}
                          onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                        />
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Фамилия</Text>
                        <TextInput
                          value={formData.last_name}
                          onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                        />
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Отчество</Text>
                        <TextInput
                          value={formData.middle_name}
                          onChange={(e) => setFormData({...formData, middle_name: e.target.value})}
                        />
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Пол</Text>
                        <Select
                          value={formData.gender}
                          onChange={(value) => setFormData({...formData, gender: value || ''})}
                          data={[
                            { value: 'male', label: 'Мужской' },
                            { value: 'female', label: 'Женский' },
                            { value: 'other', label: 'Другое' },
                          ]}
                        />
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Рост (см)</Text>
                        <NumberInput
                          value={formData.height}
                          onChange={(value) => setFormData({...formData, height: value || undefined})}
                          precision={2}
                          min={0}
                        />
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Вес (кг)</Text>
                        <NumberInput
                          value={formData.weight}
                          onChange={(value) => setFormData({...formData, weight: value || undefined})}
                          precision={2}
                          min={0}
                        />
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Телефон</Text>
                        <TextInput
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Дата рождения</Text>
                        <TextInput
                          type="date"
                          value={formData.birth_date}
                          onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                        />
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Образование</Text>
                        <TextInput
                          value={formData.education}
                          onChange={(e) => setFormData({...formData, education: e.target.value})}
                        />
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Учреждение</Text>
                        <TextInput
                          value={formData.institution}
                          onChange={(e) => setFormData({...formData, institution: e.target.value})}
                        />
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Степень</Text>
                        <TextInput
                          value={formData.degree}
                          onChange={(e) => setFormData({...formData, degree: e.target.value})}
                        />
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Специализация</Text>
                        <TextInput
                          value={formData.specialization}
                          onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                        />
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Номер сертификата</Text>
                        <TextInput
                          value={formData.certificate_number}
                          onChange={(e) => setFormData({...formData, certificate_number: e.target.value})}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <Text size="sm" c="dimmed">Имя</Text>
                        <Text fw={500}>{trainer.first_name || 'Не указано'}</Text>
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Фамилия</Text>
                        <Text fw={500}>{trainer.last_name || 'Не указана'}</Text>
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Отчество</Text>
                        <Text fw={500}>{trainer.middle_name || 'Не указано'}</Text>
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Пол</Text>
                        <Text fw={500}>{trainer.gender || 'Не указан'}</Text>
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Рост</Text>
                        <Text fw={500}>{trainer.height ? `${trainer.height} см` : 'Не указан'}</Text>
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Вес</Text>
                        <Text fw={500}>{trainer.weight ? `${trainer.weight} кг` : 'Не указан'}</Text>
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Телефон</Text>
                        <Text fw={500}>{trainer.phone || 'Не указан'}</Text>
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Дата рождения</Text>
                        <Text fw={500}>{trainer.birth_date || 'Не указана'}</Text>
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Образование</Text>
                        <Text fw={500}>{trainer.education || 'Не указано'}</Text>
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Учреждение</Text>
                        <Text fw={500}>{trainer.institution || 'Не указано'}</Text>
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Степень</Text>
                        <Text fw={500}>{trainer.degree || 'Не указана'}</Text>
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Специализация</Text>
                        <Text fw={500}>{trainer.specialization || 'Не указана'}</Text>
                      </div>

                      <div>
                        <Text size="sm" c="dimmed">Номер сертификата</Text>
                        <Text fw={500}>{trainer.certificate_number || 'Не указан'}</Text>
                      </div>
                    </>
                  )}
                  <Flex justify="flex-end" gap="sm" mt="md">
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                      >
                        Редактировать
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>Отменить</Button>
                        <Button onClick={() => handleSave()}>Сохранить</Button>
                      </>
                    )}
                  </Flex>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 8 }}>
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mb="xl">
                {/* Клиенты в работе */}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={3} mb="md">Клиенты в работе</Title>
                  {clientsInWork.map(client => (
                    <div
                      key={client.id}
                      style={{ marginBottom: '10px', cursor: 'pointer' }}
                      onClick={() => router.push(`/admin/client/${client.id}`)}
                    >
                      <Flex justify="space-between" align="center">
                        <Flex align="center" gap="sm" style={{ flex: 1, minWidth: 0 }}>
                          <Avatar size="sm" radius="xl" src={getClientPhotoSrc(client)}>
                            {(client.first_name?.charAt(0) || '') + (client.last_name?.charAt(0) || '')}
                          </Avatar>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <Text fw={500} truncate="end">
                              {client.first_name} {client.last_name} ({client.username})
                            </Text>
                          </div>
                        </Flex>
                        <Button
                          variant="outline"
                          color="red"
                          size="compact-sm"
                          w={32}
                          h={32}
                          p={0}
                          miw={32}
                          style={{ flex: '0 0 auto' }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering parent click
                            handleRemoveClient(client.id);
                          }}
                        >
                          <FiX size={16} />
                        </Button>
                      </Flex>
                    </div>
                  ))}
                </Card>

                {/* Новые клиенты */}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={3} mb="md">Новые клиенты</Title>
                  {newClients.map(client => (
                    <div
                      key={client.id}
                      style={{ marginBottom: '10px', cursor: 'pointer' }}
                      onClick={() => router.push(`/admin/client/${client.id}`)}
                    >
                      <Flex justify="space-between" align="center">
                        <Flex align="center" gap="sm" style={{ flex: 1, minWidth: 0 }}>
                          <Avatar size="sm" radius="xl" src={getClientPhotoSrc(client)}>
                            {(client.first_name?.charAt(0) || '') + (client.last_name?.charAt(0) || '')}
                          </Avatar>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <Text fw={500} truncate="end">
                              {client.first_name} {client.last_name} ({client.username})
                            </Text>
                          </div>
                        </Flex>
                        <Button
                          variant="outline"
                          color="green"
                          size="compact-sm"
                          w={32}
                          h={32}
                          p={0}
                          miw={32}
                          style={{ flex: '0 0 auto' }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering parent click
                            handleAddClient(client.id);
                          }}
                        >
                          <FiPlus size={16} />
                        </Button>
                      </Flex>
                    </div>
                  ))}
                </Card>
              </SimpleGrid>

              {/* Чат с клиентами */}
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={3} mb="md">Чат с клиентами</Title>
                {chatClients.length > 0 ? (
                  chatClients
                    .map(client => (
                      <div
                        key={client.userId}
                        style={{ marginBottom: '10px', cursor: 'pointer' }}
                        onClick={() => router.push(`/chat?clientId=${client.userId}`)}
                      >
                        <Flex justify="space-between" align="center">
                          <Flex align="center" gap="sm" style={{ flex: 1, minWidth: 0 }}>
                            <Avatar size="sm" radius="xl" src={client.photo_urls?.[0] || null}>
                              {client.username.charAt(0).toUpperCase()}
                            </Avatar>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <Text fw={500} truncate="end">
                                {client.username}
                              </Text>
                              {client.lastMessage && (
                                <Text size="xs" c="dimmed" truncate="end">
                                  {client.lastMessage.message}
                                </Text>
                              )}
                            </div>
                          </Flex>
                          {client.unreadCount > 0 && (
                            <Badge color="red">{client.unreadCount}</Badge>
                          )}
                        </Flex>
                      </div>
                    ))
                ) : (
                  <Text c="dimmed" size="sm">Нет активных чатов</Text>
                )}
              </Card>
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>

    </UserTypeProtectedRoute>
  );
}
