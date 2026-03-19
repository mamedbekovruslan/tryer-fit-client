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
import { nutritionService, CreateMealRequest } from '@/services/nutritionService';
import { useForm } from '@mantine/form';

export default function AddMealPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const planId = Number(params.planId);
  const dayId = Number(params.dayId);
  const [loading, setLoading] = useState(false);

  const mealForm = useForm({
    initialValues: {
      name: '',
      description: '',
      nutritionDayId: dayId,
    },
    validate: {
      name: (value) => (value.trim().length < 2 ? 'Название должно содержать минимум 2 символа' : null),
      nutritionDayId: (value) => (!value ? 'ID дня питания обязателен' : null),
    },
  });

  useEffect(() => {
    mealForm.setFieldValue('nutritionDayId', dayId);
  }, [dayId]);

  const handleCreateMeal = async (values: CreateMealRequest) => {
    try {
      setLoading(true);
      await nutritionService.createMeal(values);
      notifications.show({
        title: 'Успешно',
        message: 'Прием пищи добавлен',
        color: 'green',
      });

      router.back();
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось добавить прием пищи',
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

          <Title order={1} mb="xl">Добавить прием пищи</Title>

          <form onSubmit={mealForm.onSubmit(handleCreateMeal)}>
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

              <input 
                type="hidden" 
                {...mealForm.getInputProps('nutritionDayId')} 
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
                  Добавить прием пищи
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Container>
    </UserTypeProtectedRoute>
  );
}