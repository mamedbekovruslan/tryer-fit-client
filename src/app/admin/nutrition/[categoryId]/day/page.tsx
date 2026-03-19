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
  LoadingOverlay,
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  ActionIcon,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { FiArrowLeft, FiPlus, FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { nutritionService, NutritionDay, Meal, CreateMealRequest } from '@/services/nutritionService';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { useForm } from '@mantine/form';

export default function NutritionDayDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const categoryId = Number(params.categoryId);
  const dayId = Number(params.dayId);

  const [day, setDay] = useState<NutritionDay | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [mealsLoading, setMealsLoading] = useState(false);
  const [addMealModalOpened, setAddMealModalOpened] = useState(false);
  const [editMealModalOpened, setEditMealModalOpened] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);

  const mealForm = useForm({
    initialValues: {
      name: '',
      description: '',
      nutritionDayId: dayId,
    },
    validate: {
      name: (value) => (value.trim().length < 2 ? 'Название должно содержать минимум 2 символа' : null),
    },
  });

  useEffect(() => {
    if (dayId) {
      loadDay();
      loadMeals();
    }
  }, [dayId]);

  const loadDay = async () => {
    try {
      setLoading(true);
      const data = await nutritionService.getNutritionDayById(dayId);
      setDay(data);
    } catch (error) {
      notifications.show({
        title: 'Ошибка загрузки',
        message: 'Не удалось загрузить день питания',
        color: 'red',
      });
      router.back(); // Вернуться на предыдущую страницу
    } finally {
      setLoading(false);
    }
  };

  const loadMeals = async () => {
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

  const handleGoBack = () => {
    router.push(`/admin/nutrition/${categoryId}`);
  };

  const handleAddMeal = () => {
    mealForm.setValues({
      name: '',
      description: '',
      nutritionDayId: dayId,
    });
    setAddMealModalOpened(true);
  };

  const handleCreateMeal = async (values: CreateMealRequest) => {
    try {
      await nutritionService.createMeal(values);
      notifications.show({
        title: 'Успешно',
        message: 'Прием пищи добавлен',
        color: 'green',
      });

      loadMeals();

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

      loadMeals();

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

      loadMeals();
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

          <Flex justify="flex-start" mb="xl">
            <Button
              leftSection={<FiArrowLeft size={16} />}
              onClick={handleGoBack}
              variant="outline"
            >
              Назад к дням
            </Button>
          </Flex>

          {day ? (
            <Stack gap="xl">
              <Flex justify="space-between" align="center">
                <Title order={1}>{day.name}</Title>
                <Badge variant="filled" color="blue">День питания</Badge>
              </Flex>

              {day.description && (
                <Paper p="md" withBorder>
                  <Text size="lg">{day.description}</Text>
                </Paper>
              )}

              <Grid gutter="xl">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Title order={3} mb="md">Информация о дне</Title>

                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text fw={500}>ID:</Text>
                        <Text>{day.id}</Text>
                      </Group>

                      <Group justify="space-between">
                        <Text fw={500}>Категория:</Text>
                        <Text>{day.nutritionCategoryId}</Text>
                      </Group>

                      <Group justify="space-between">
                        <Text fw={500}>Дата создания:</Text>
                        <Text>{new Date(day.createdAt).toLocaleString()}</Text>
                      </Group>

                      <Group justify="space-between">
                        <Text fw={500}>Дата обновления:</Text>
                        <Text>{new Date(day.updatedAt).toLocaleString()}</Text>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Flex justify="space-between" align="center" mb="md">
                      <Title order={3}>Приемы пищи</Title>
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
                      <Text c="dimmed" ta="center">
                        Приемы пищи отсутствуют
                      </Text>
                    ) : null}
                  </Card>
                </Grid.Col>
              </Grid>
            </Stack>
          ) : !loading ? (
            <Paper p="xl" radius="md" withBorder ta="center">
              <Text size="lg">День питания не найден</Text>
              <Button mt="md" onClick={handleGoBack}>
                Назад к дням
              </Button>
            </Paper>
          ) : null}
        </Paper>

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