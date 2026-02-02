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
  NumberInput,
  ActionIcon,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { FiPlus, FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { useParams, useRouter } from 'next/navigation';
import { nutritionService, NutritionDay, Meal, CreateMealRequest } from '@/services/nutritionService';
import { useForm } from '@mantine/form';

export default function NutritionCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const categoryId = Number(params.categoryId);
  const [days, setDays] = useState<NutritionDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<NutritionDay | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [mealsLoading, setMealsLoading] = useState(false);
  const [addMealModalOpened, setAddMealModalOpened] = useState(false);
  const [editMealModalOpened, setEditMealModalOpened] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);

  // Форма для добавления/редактирования приема пищи
  const mealForm = useForm({
    initialValues: {
      name: '',
      description: '',
      nutritionDayId: 0,
    },
    validate: {
      name: (value) => (value.trim().length < 2 ? 'Название должно содержать минимум 2 символа' : null),
    },
  });

  useEffect(() => {
    if (categoryId) {
      loadDays();
    }
  }, [categoryId]);

  useEffect(() => {
    if (selectedDay) {
      loadMealsForDay(selectedDay.id);
    }
  }, [selectedDay]);

  const loadDays = async () => {
    try {
      setLoading(true);
      const data = await nutritionService.getNutritionDaysByCategory(categoryId);
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
    router.push(`/admin/nutrition/${categoryId}/add-day`);
  };

  const handleAddMeal = () => {
    if (selectedDay) {
      mealForm.setValues({
        name: '',
        description: '',
        nutritionDayId: selectedDay.id,
      });
      setAddMealModalOpened(true);
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

  const handleCreateMeal = async (values: CreateMealRequest) => {
    try {
      await nutritionService.createMeal(values);
      notifications.show({
        title: 'Успешно',
        message: 'Прием пищи добавлен',
        color: 'green',
      });

      // Обновляем список приемов пищи
      if (selectedDay) {
        loadMealsForDay(selectedDay.id);
      }

      setAddMealModalOpened(false);
      mealForm.reset();
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось добавить прием пищи',
        color: 'red',
      });
    }
  };

  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal);
    mealForm.setValues({
      name: meal.name,
      description: meal.description || '',
      nutritionDayId: meal.nutritionDayId,
    });
    setEditMealModalOpened(true);
  };

  const handleUpdateMeal = async (values: CreateMealRequest) => {
    if (!editingMeal) return;

    try {
      await nutritionService.updateMeal(editingMeal.id, values);
      notifications.show({
        title: 'Успешно',
        message: 'Прием пищи обновлен',
        color: 'green',
      });

      // Обновляем список приемов пищи
      if (selectedDay) {
        loadMealsForDay(selectedDay.id);
      }

      setEditMealModalOpened(false);
      setEditingMeal(null);
      mealForm.reset();
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить прием пищи',
        color: 'red',
      });
    }
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

        {/* Модальное окно для добавления приема пищи */}
        <Modal
          opened={addMealModalOpened}
          onClose={() => setAddMealModalOpened(false)}
          title="Добавить прием пищи"
          size="lg"
        >
          <form onSubmit={mealForm.onSubmit(handleCreateMeal)}>
            <Stack>
              <TextInput
                label="Название приема пищи"
                placeholder="Например: Завтрак"
                {...mealForm.getInputProps('name')}
              />

              <Textarea
                label="Описание"
                placeholder="Дополнительная информация о приеме пищи"
                {...mealForm.getInputProps('description')}
              />


              <Group justify="right" mt="md">
                <Button
                  variant="outline"
                  onClick={() => setAddMealModalOpened(false)}
                  leftSection={<FiX size={16} />}
                >
                  Отмена
                </Button>
                <Button type="submit">Добавить прием пищи</Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* Модальное окно для редактирования приема пищи */}
        <Modal
          opened={editMealModalOpened}
          onClose={() => {
            setEditMealModalOpened(false);
            setEditingMeal(null);
          }}
          title="Редактировать прием пищи"
          size="lg"
        >
          <form onSubmit={mealForm.onSubmit(handleUpdateMeal)}>
            <Stack>
              <TextInput
                label="Название приема пищи"
                placeholder="Например: Завтрак"
                {...mealForm.getInputProps('name')}
              />

              <Textarea
                label="Описание"
                placeholder="Дополнительная информация о приеме пищи"
                {...mealForm.getInputProps('description')}
              />

              <Group justify="right" mt="md">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditMealModalOpened(false);
                    setEditingMeal(null);
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