'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Paper,
  Stack,
  Button,
  Group,
  Text,
  LoadingOverlay,
  Badge,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { FiArrowLeft, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { useParams, useRouter } from 'next/navigation';
import { nutritionService, Meal } from '@/services/nutritionService';

export default function MealDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const planId = Number(params.planId);
  const dayId = Number(params.dayId);
  const mealId = Number(params.mealId);
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeal();
  }, [mealId]);

  const loadMeal = async () => {
    try {
      setLoading(true);
      const data = await nutritionService.getMealById(mealId);
      setMeal(data);
    } catch (error) {
      notifications.show({
        title: 'Ошибка загрузки',
        message: 'Не удалось загрузить прием пищи',
        color: 'red',
      });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeal = async () => {
    try {
      setLoading(true);
      await nutritionService.deleteMeal(mealId);
      notifications.show({
        title: 'Успешно',
        message: 'Прием пищи удален',
        color: 'green',
      });

      // Возвращаемся к странице дня питания
      router.back();
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось удалить прием пищи',
        color: 'red',
      });
    } finally {
      setLoading(false);
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
      <Container size="md" py="xl">
        <Paper shadow="md" p="xl" radius="md">
          <LoadingOverlay visible={loading} overlayProps={{ radius: 'sm', blur: 2 }} />

          <Group justify="apart" mb="xl">
            <Title order={1}>Детали приема пищи</Title>
            <Button
              leftSection={<FiArrowLeft size={16} />}
              variant="outline"
              onClick={() => router.back()}
            >
              Назад
            </Button>
          </Group>

          {meal ? (
            <Stack>
              <Paper p="md" withBorder>
                <Text size="lg" fw={500} mb="sm">{meal.name}</Text>
                
                {meal.description && (
                  <Text mb="md">{meal.description}</Text>
                )}

                <Group mt="md">
                  <Badge variant="outline">ID: {meal.id}</Badge>
                  <Badge variant="outline">День: {dayId}</Badge>
                  <Badge variant="outline">Создан: {new Date(meal.createdAt).toLocaleDateString()}</Badge>
                  <Badge variant="outline">Обновлен: {new Date(meal.updatedAt).toLocaleDateString()}</Badge>
                </Group>
              </Paper>

              <Group justify="center" mt="xl">
                <Button
                  leftSection={<FiEdit2 size={16} />}
                  onClick={() => router.push(`/admin/nutrition/plans/${planId}/days/${dayId}/meals/${meal.id}/edit`)}
                >
                  Редактировать
                </Button>
                <Button
                  leftSection={<FiTrash2 size={16} />}
                  color="red"
                  onClick={handleDeleteMeal}
                >
                  Удалить
                </Button>
              </Group>
            </Stack>
          ) : (
            <Text ta="center">Загрузка...</Text>
          )}
        </Paper>
      </Container>
    </UserTypeProtectedRoute>
  );
}