'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Paper, Stack, Card, Badge, SimpleGrid, Avatar, Flex, Button, Notification } from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import Link from 'next/link';
import { clientService } from '@/services/clientService';

export default function ProfilePage() {
  const { user, refreshUserProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<{ visible: boolean; message: string; color: string }>({
    visible: false,
    message: '',
    color: 'green'
  });
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    fitness_goal: user?.fitness_goal || '',
    expected_result: user?.expected_result || '',
    limitations: user?.limitations || '',
    diseases: user?.diseases || '',
    training_experience: user?.training_experience || '',
    waist_circumference: user?.waist_circumference || undefined,
    chest_circumference: user?.chest_circumference || undefined,
    hip_circumference: user?.hip_circumference || undefined,
    arm_circumference: user?.arm_circumference || undefined,
    leg_circumference: user?.leg_circumference || undefined,
    current_diet: user?.current_diet || '',
  });

  const handleSave = async () => {
    try {
      // Отправляем обновленные данные на бэкенд
      await clientService.updateProfile(formData);

      // Обновляем профиль пользователя
      await refreshUserProfile();

      // Показываем уведомление об успешном сохранении
      setNotification({
        visible: true,
        message: 'Профиль успешно обновлен!',
        color: 'green'
      });

      // Выходим из режима редактирования
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка при сохранении профиля:', error);
      setNotification({
        visible: true,
        message: 'Ошибка при сохранении профиля. Попробуйте еще раз.',
        color: 'red'
      });
    }

    // Скрываем уведомление через 3 секунды
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

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
        {notification.visible && (
          <Notification
            title="Уведомление"
            color={notification.color}
            onClose={() => setNotification({...notification, visible: false})}
            style={{ marginBottom: '1rem' }}
          >
            {notification.message}
          </Notification>
        )}
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
                    {isEditing ? (
                      <>
                        <div>
                          <Text size="sm" c="dimmed">Имя</Text>
                          <input
                            type="text"
                            value={formData.first_name}
                            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                        </div>

                        <div>
                          <Text size="sm" c="dimmed">Фамилия</Text>
                          <input
                            type="text"
                            value={formData.last_name}
                            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                        </div>

                        <div>
                          <Text size="sm" c="dimmed">Цель тренировок</Text>
                          <input
                            type="text"
                            value={formData.fitness_goal}
                            onChange={(e) => setFormData({...formData, fitness_goal: e.target.value})}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                        </div>

                        <div>
                          <Text size="sm" c="dimmed">Ожидаемый результат</Text>
                          <input
                            type="text"
                            value={formData.expected_result}
                            onChange={(e) => setFormData({...formData, expected_result: e.target.value})}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                        </div>

                        <div>
                          <Text size="sm" c="dimmed">Ограничения</Text>
                          <input
                            type="text"
                            value={formData.limitations}
                            onChange={(e) => setFormData({...formData, limitations: e.target.value})}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                        </div>

                        <div>
                          <Text size="sm" c="dimmed">Болезни</Text>
                          <input
                            type="text"
                            value={formData.diseases}
                            onChange={(e) => setFormData({...formData, diseases: e.target.value})}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                        </div>

                        <div>
                          <Text size="sm" c="dimmed">Опыт тренировок</Text>
                          <input
                            type="text"
                            value={formData.training_experience}
                            onChange={(e) => setFormData({...formData, training_experience: e.target.value})}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                        </div>

                        <div>
                          <Text size="sm" c="dimmed">Обхват талии</Text>
                          <input
                            type="number"
                            value={formData.waist_circumference || ''}
                            onChange={(e) => setFormData({...formData, waist_circumference: e.target.value ? parseFloat(e.target.value) : undefined})}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                        </div>

                        <div>
                          <Text size="sm" c="dimmed">Обхват груди</Text>
                          <input
                            type="number"
                            value={formData.chest_circumference || ''}
                            onChange={(e) => setFormData({...formData, chest_circumference: e.target.value ? parseFloat(e.target.value) : undefined})}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                        </div>

                        <div>
                          <Text size="sm" c="dimmed">Обхват бедер</Text>
                          <input
                            type="number"
                            value={formData.hip_circumference || ''}
                            onChange={(e) => setFormData({...formData, hip_circumference: e.target.value ? parseFloat(e.target.value) : undefined})}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                        </div>

                        <div>
                          <Text size="sm" c="dimmed">Обхват руки</Text>
                          <input
                            type="number"
                            value={formData.arm_circumference || ''}
                            onChange={(e) => setFormData({...formData, arm_circumference: e.target.value ? parseFloat(e.target.value) : undefined})}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                        </div>

                        <div>
                          <Text size="sm" c="dimmed">Обхват ноги</Text>
                          <input
                            type="number"
                            value={formData.leg_circumference || ''}
                            onChange={(e) => setFormData({...formData, leg_circumference: e.target.value ? parseFloat(e.target.value) : undefined})}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                        </div>

                        <div>
                          <Text size="sm" c="dimmed">Текущая диета</Text>
                          <input
                            type="text"
                            value={formData.current_diet}
                            onChange={(e) => setFormData({...formData, current_diet: e.target.value})}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                        </div>
                      </>
                    ) : (
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

                        {/* Дополнительные поля профиля */}
                        {user.waist_circumference !== undefined && (
                          <div>
                            <Text size="sm" c="dimmed">Обхват талии</Text>
                            <Text fw={500}>{user.waist_circumference} см</Text>
                          </div>
                        )}

                        {user.chest_circumference !== undefined && (
                          <div>
                            <Text size="sm" c="dimmed">Обхват груди</Text>
                            <Text fw={500}>{user.chest_circumference} см</Text>
                          </div>
                        )}

                        {user.hip_circumference !== undefined && (
                          <div>
                            <Text size="sm" c="dimmed">Обхват бедер</Text>
                            <Text fw={500}>{user.hip_circumference} см</Text>
                          </div>
                        )}

                        {user.arm_circumference !== undefined && (
                          <div>
                            <Text size="sm" c="dimmed">Обхват руки</Text>
                            <Text fw={500}>{user.arm_circumference} см</Text>
                          </div>
                        )}

                        {user.leg_circumference !== undefined && (
                          <div>
                            <Text size="sm" c="dimmed">Обхват ноги</Text>
                            <Text fw={500}>{user.leg_circumference} см</Text>
                          </div>
                        )}

                        {user.current_diet && (
                          <div>
                            <Text size="sm" c="dimmed">Текущая диета</Text>
                            <Text fw={500}>{user.current_diet}</Text>
                          </div>
                        )}

                        {user.photo_urls && user.photo_urls.length > 0 && (
                          <div>
                            <Text size="sm" c="dimmed">Фотографии</Text>
                            <Flex mt="xs" gap="xs">
                              {user.photo_urls.map((url, index) => (
                                <Avatar
                                  key={index}
                                  src={url}
                                  alt={`Фото ${index + 1}`}
                                  radius="md"
                                  size="md"
                                />
                              ))}
                            </Flex>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
                {user.user_type === 'client' && (
                  <Flex justify="flex-end" gap="sm" mt="md">
                    {!isEditing ? (
                      <Button
                        onClick={() => {
                          // При переходе в режим редактирования обновляем formData текущими данными
                          setFormData({
                            first_name: user?.first_name || '',
                            last_name: user?.last_name || '',
                            fitness_goal: user?.fitness_goal || '',
                            expected_result: user?.expected_result || '',
                            limitations: user?.limitations || '',
                            diseases: user?.diseases || '',
                            training_experience: user?.training_experience || '',
                            waist_circumference: user?.waist_circumference || undefined,
                            chest_circumference: user?.chest_circumference || undefined,
                            hip_circumference: user?.hip_circumference || undefined,
                            arm_circumference: user?.arm_circumference || undefined,
                            leg_circumference: user?.leg_circumference || undefined,
                            current_diet: user?.current_diet || '',
                          });
                          setIsEditing(true);
                        }}
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