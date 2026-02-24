'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  Card,
  Grid,
  Button,
  Flex,
  Badge,
  Group,
  ScrollArea,
  Divider,
  LoadingOverlay,
  Modal,
  TextInput,
  Textarea,
  ActionIcon,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { FiPlus, FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { useParams, useRouter } from 'next/navigation';
import { nutritionService, NutritionDay, Meal, CreateMealRequest, CreateNutritionDayRequest } from '@/services/nutritionService';
import { useForm } from '@mantine/form';

export default function NutritionPlanDaysPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const planId = Number(params.planId);
  const [days, setDays] = useState<NutritionDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<NutritionDay | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [mealsLoading, setMealsLoading] = useState(false);
  const [addDayModalOpened, setAddDayModalOpened] = useState(false);
  const [editDayModalOpened, setEditDayModalOpened] = useState(false);
  const [editingDay, setEditingDay] = useState<NutritionDay | null>(null);

  // Форма для добавления/редактирования дня питания
  const dayForm = useForm({
    initialValues: {
      name: '',
      description: '',
      nutritionPlanId: planId,
    },
    validate: {
      name: (value) => (value.trim().length < 2 ? 'Название должно содержать минимум 2 символа' : null),
    },
  });

  useEffect(() => {
    if (planId) {
      loadDays();
    }
  }, [planId]);

  useEffect(() => {
    if (selectedDay) {
      loadMealsForDay(selectedDay.id);
    }
  }, [selectedDay]);

  const loadDays = async () => {
    try {
      setLoading(true);
      const data = await nutritionService.getNutritionDaysByPlanForTrainer(planId);
      setDays(data);

      // Устанавливаем первый день как выбранный по умолчанию
      if (data.length > 0) {
        setSelectedDay(data[0]);
      }
    } catch (error) {
      notifications.show({
        title: 'Ошибка загрузки',
        message: 'Не удалось загрузить дни питания',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMealsForDay = async (dayId: number) => {
    try {
      setMealsLoading(true);
      const data = await nutritionService.getMealsByNutritionDay(dayId);
      setMeals(data);
    } catch (error) {
      notifications.show({
        title: 'Ошибка загрузки',
        message: 'Не удалось загрузить приемы пищи',
        color: 'red',
      });
    } finally {
      setMealsLoading(false);
    }
  };

  const handleDayClick = (day: NutritionDay) => {
    setSelectedDay(day);
  };

  const handleAddDay = () => {
    dayForm.setValues({
      name: '',
      description: '',
      nutritionPlanId: planId,
    });
    setAddDayModalOpened(true);
  };

  const handleAddMeal = () => {
    if (selectedDay) {
      router.push(`/admin/nutrition/plans/${planId}/days/${selectedDay.id}/add-meal`);
    } else {
      notifications.show({
        title: 'Ошибка',
        message: 'Выберите день питания для добавления приема пищи',
        color: 'red',
      });
    }
  };

  const handleDeleteDay = async (dayId: number) => {
    try {
      await nutritionService.deleteNutritionDay(dayId);
      notifications.show({
        title: 'Успешно',
        message: 'День питания удален',
        color: 'green',
      });

      // Обновляем список дней
      loadDays();

      // Если удаляемый день был выбран, сбрасываем выбор
      if (selectedDay && selectedDay.id === dayId) {
        setSelectedDay(null);
        setMeals([]); // Очищаем список приемов пищи
      }
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось удалить день питания',
        color: 'red',
      });
    }
  };

  const handleCreateDay = async (values: CreateNutritionDayRequest) => {
    try {
      await nutritionService.createNutritionDay(values);
      notifications.show({
        title: 'Успешно',
        message: 'День питания добавлен',
        color: 'green',
      });

      // Обновляем список дней
      loadDays();

      setAddDayModalOpened(false);
      dayForm.reset();
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось добавить день питания',
        color: 'red',
      });
    }
  };

  const handleEditDay = (day: NutritionDay) => {
    setEditingDay(day);
    dayForm.setValues({
      name: day.name,
      description: day.description || '',
      nutritionPlanId: day.nutritionPlanId,
    });
    setEditDayModalOpened(true);
  };

  const handleUpdateDay = async (values: CreateNutritionDayRequest) => {
    if (!editingDay) return;

    try {
      await nutritionService.updateNutritionDay(editingDay.id, values);
      notifications.show({
        title: 'Успешно',
        message: 'День питания обновлен',
        color: 'green',
      });

      // Обновляем список дней
      loadDays();

      setEditDayModalOpened(false);
      setEditingDay(null);
      dayForm.reset();
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить день питания',
        color: 'red',
      });
    }
  };

  const handleEditMeal = (meal: Meal) => {
    router.push(`/admin/nutrition/plans/${planId}/days/${selectedDay?.id}/meals/${meal.id}/edit`);
  };

  const handleDeleteMeal = async (mealId: number) => {
    try {
      await nutritionService.deleteMeal(mealId);
      notifications.show({
        title: 'Успешно',
        message: 'Прием пищи удален',
        color: 'green',
      });

      // Обновляем список приемов пищи
      if (selectedDay) {
        loadMealsForDay(selectedDay.id);
      }
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось удалить прием пищи',
        color: 'red',
      });
    }
  };

  if (!user) {
    return (
      <UserTypeProtectedRoute allowedUserTypes={['trainer']}>
        <Container size="md" py="xl">
          <Paper shadow="md" p="xl" radius="md">
            <Text ta="center">Загрузка...</Text>
          </Paper>
        </Container>
      </UserTypeProtectedRoute>
    );
  }

  return (
    <UserTypeProtectedRoute allowedUserTypes={['trainer']}>
      <Container size="lg" py="xl">
        <Paper shadow="md" p="xl" radius="md">
          <LoadingOverlay visible={loading} overlayProps={{ radius: 'sm', blur: 2 }} />

          <Flex justify="space-between" align="center" mb="xl">
            <Title order={1}>Дни питания</Title>
            <Button
              leftSection={<FiPlus size={16} />}
              onClick={handleAddDay}
              size="lg"
            >
              Добавить день
            </Button>
          </Flex>

          <Grid gutter="xl">
            {/* Левая колонка - список дней */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={3} mb="md">Дни питания</Title>

                <ScrollArea h={400} offsetScrollbars>
                  <Stack gap="sm">
                    {days.map(day => (
                      <Card
                        key={day.id}
                        shadow="xs"
                        padding="md"
                        radius="sm"
                        withBorder
                        style={{
                          cursor: 'pointer',
                          backgroundColor: selectedDay?.id === day.id ? '#f0f7ff' : 'inherit'
                        }}
                        onClick={() => handleDayClick(day)}
                      >
                        <Flex justify="space-between" align="center">
                          <div>
                            <Text fw={500}>{day.name}</Text>
                            <Text size="sm" c="dimmed" mt="xs">
                              Создан: {new Date(day.createdAt).toLocaleDateString()}
                            </Text>
                          </div>
                          <Group>
                            <ActionIcon
                              variant="subtle"
                              color="blue"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditDay(day);
                              }}
                              aria-label="Редактировать день"
                            >
                              <FiEdit2 size={16} />
                            </ActionIcon>
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              onClick={(e) => {
                                e.stopPropagation(); // Останавливаем всплытие события, чтобы не срабатывал onClick карточки
                                handleDeleteDay(day.id);
                              }}
                              aria-label="Удалить день"
                            >
                              <FiTrash2 size={16} />
                            </ActionIcon>
                          </Group>
                        </Flex>
                      </Card>
                    ))}
                  </Stack>
                </ScrollArea>

                {days.length === 0 && !loading && (
                  <Text c="dimmed" ta="center" mt="lg">
                    Дни питания отсутствуют
                  </Text>
                )}
              </Card>
            </Grid.Col>

            {/* Правая колонка - детали выбранного дня */}
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                {selectedDay ? (
                  <>
                    <Flex justify="space-between" align="center" mb="md">
                      <Title order={2}>{selectedDay.name}</Title>
                      <Badge variant="outline">Создан: {new Date(selectedDay.createdAt).toLocaleDateString()}</Badge>
                    </Flex>

                    <Divider mb="md" />

                    {selectedDay.description && (
                      <Paper p="md" withBorder mb="md">
                        <Text size="lg">{selectedDay.description}</Text>
                      </Paper>
                    )}

                    <Stack gap="md">
                      <Card shadow="none" padding="md" radius="sm" withBorder>
                        <Flex justify="space-between" align="center" mb="md">
                          <Title order={4}>Приемы пищи</Title>
                          <Button
                            leftSection={<FiPlus size={16} />}
                            onClick={handleAddMeal}
                            variant="outline"
                          >
                            Добавить прием пищи
                          </Button>
                        </Flex>

                        <LoadingOverlay visible={mealsLoading} overlayProps={{ radius: 'sm', blur: 2 }} />

                        {meals.length > 0 ? (
                          <Stack gap="sm">
                            {meals.map(meal => (
                              <Card key={meal.id} shadow="xs" padding="md" radius="sm" withBorder>
                                <Flex justify="space-between" align="center">
                                  <Text fw={500}>{meal.name}</Text>
                                  <Group>
                                    <ActionIcon
                                      variant="subtle"
                                      color="blue"
                                      onClick={() => handleEditMeal(meal)}
                                      aria-label="Редактировать"
                                    >
                                      <FiEdit2 size={16} />
                                    </ActionIcon>
                                    <ActionIcon
                                      variant="subtle"
                                      color="red"
                                      onClick={() => handleDeleteMeal(meal.id)}
                                      aria-label="Удалить"
                                    >
                                      <FiTrash2 size={16} />
                                    </ActionIcon>
                                  </Group>
                                </Flex>

                                {meal.description && (
                                  <Text size="sm" c="dimmed" mt="xs">
                                    {meal.description}
                                  </Text>
                                )}
                              </Card>
                            ))}
                          </Stack>
                        ) : !mealsLoading ? (
                          <Text c="dimmed" ta="center" mt="md">
                            Приемы пищи отсутствуют
                          </Text>
                        ) : null}
                      </Card>
                    </Stack>
                  </>
                ) : !loading ? (
                  <Text c="dimmed" ta="center">
                    Выберите день из списка для просмотра деталей
                  </Text>
                ) : null}
              </Card>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Модальное окно для добавления дня питания */}
        <Modal
          opened={addDayModalOpened}
          onClose={() => setAddDayModalOpened(false)}
          title="Добавить день питания"
          size="lg"
        >
          <form onSubmit={dayForm.onSubmit(handleCreateDay)}>
            <Stack>
              <TextInput
                label="Название дня питания"
                placeholder="Например: Понедельник"
                {...dayForm.getInputProps('name')}
              />

              <Textarea
                label="Описание"
                placeholder="Дополнительная информация о дне питания"
                {...dayForm.getInputProps('description')}
              />

              <input type="hidden" {...dayForm.getInputProps('nutritionPlanId')} />

              <Group justify="right" mt="md">
                <Button
                  variant="outline"
                  onClick={() => setAddDayModalOpened(false)}
                  leftSection={<FiX size={16} />}
                >
                  Отмена
                </Button>
                <Button type="submit">Добавить день питания</Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* Модальное окно для редактирования дня питания */}
        <Modal
          opened={editDayModalOpened}
          onClose={() => {
            setEditDayModalOpened(false);
            setEditingDay(null);
          }}
          title="Редактировать день питания"
          size="lg"
        >
          <form onSubmit={dayForm.onSubmit(handleUpdateDay)}>
            <Stack>
              <TextInput
                label="Название дня питания"
                placeholder="Например: Понедельник"
                {...dayForm.getInputProps('name')}
              />

              <Textarea
                label="Описание"
                placeholder="Дополнительная информация о дне питания"
                {...dayForm.getInputProps('description')}
              />

              <input type="hidden" {...dayForm.getInputProps('nutritionPlanId')} />

              <Group justify="right" mt="md">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditDayModalOpened(false);
                    setEditingDay(null);
                  }}
                  leftSection={<FiX size={16} />}
                >
                  Отмена
                </Button>
                <Button type="submit">Сохранить изменения</Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Container>
    </UserTypeProtectedRoute>
  );
}