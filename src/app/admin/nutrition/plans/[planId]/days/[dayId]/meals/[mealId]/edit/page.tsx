'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Paper,
  Stack,
  Button,
  Group,
  TextInput,
  Textarea,
  LoadingOverlay,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { FiX, FiSave } from 'react-icons/fi';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { useParams, useRouter } from 'next/navigation';
import { nutritionService, Meal } from '@/services/nutritionService';
import { useForm } from '@mantine/form';

export default function EditMealPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const planId = Number(params.planId);
  const dayId = Number(params.dayId);
  const mealId = Number(params.mealId);
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);

  const mealForm = useForm({
    initialValues: {
      name: '',
      description: '',
    },
    validate: {
      name: (value) => (value.trim().length < 2 ? 'Название должно содержать минимум 2 символа' : null),
    },
  });

  useEffect(() => {
    loadMeal();
  }, [mealId]);

  const loadMeal = async () => {
    try {
      setLoading(true);
      const data = await nutritionService.getMealById(mealId);
      setMeal(data);
      mealForm.setValues({
        name: data.name,
        description: data.description || '',
      });
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

  const handleUpdateMeal = async (values: { name: string; description?: string }) => {
    try {
      setLoading(true);
      await nutritionService.updateMeal(mealId, {
        name: values.name,
        description: values.description,
        nutritionDayId: dayId,
      });
      notifications.show({
        title: 'Успешно',
        message: 'Прием пищи обновлен',
        color: 'green',
      });

      router.back();
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить прием пищи',
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

          <Title order={1} mb="xl">Редактировать прием пищи</Title>

          {meal ? (
            <form onSubmit={mealForm.onSubmit(handleUpdateMeal)}>
              <Stack>
                <TextInput
                  label="Название приема пищи"
                  placeholder="Например: Завтрак"
                  {...mealForm.getInputProps('name')}
                />

                <Textarea
                  label="Описание"
                  placeholder="Описание приема пищи"
                  {...mealForm.getInputProps('description')}
                />

                <Group justify="right" mt="md">
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    leftSection={<FiX size={16} />}
                  >
                    Отмена
                  </Button>
                  <Button type="submit" leftSection={<FiSave size={16} />}>
                    Сохранить изменения
                  </Button>
                </Group>
              </Stack>
            </form>
          ) : (
            <Text ta="center">Загрузка...</Text>
          )}
        </Paper>
      </Container>
    </UserTypeProtectedRoute>
  );
}