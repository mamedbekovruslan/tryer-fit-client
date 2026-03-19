'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  TextInput,
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Textarea,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { useParams, useRouter } from 'next/navigation';
import { nutritionService, CreateNutritionDayRequest } from '@/services/nutritionService';

export default function AddNutritionDayPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const categoryId = Number(params.categoryId);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleInputChange = (field: keyof CreateNutritionDayRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      notifications.show({
        title: 'Ошибка',
        message: 'Название дня обязательно',
        color: 'red',
      });
      return;
    }

    setLoading(true);
    try {
      await nutritionService.createNutritionDay({
        name: formData.name,
        description: formData.description || undefined,
        nutritionCategoryId: categoryId
      });

      notifications.show({
        title: 'Успешно',
        message: 'День питания создан',
        color: 'green',
      });

      router.push(`/admin/nutrition/${categoryId}`);
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось создать день питания',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/admin/nutrition/${categoryId}`);
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
          
          <Flex justify="flex-start" mb="xl">
            <Button
              leftSection={<FiArrowLeft size={16} />}
              onClick={handleCancel}
              variant="outline"
            >
              Назад к дням
            </Button>
          </Flex>
          
          <Title order={1} mb="xl">Добавить день питания</Title>
          
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Название дня"
              placeholder="Введите название дня (например: День 1, Понедельник)"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              mb="md"
            />
            
            <Textarea
              label="Описание дня"
              placeholder="Введите описание дня (необязательно)"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              mb="xl"
            />
            
            <Group justify="flex-end">
              <Button variant="outline" onClick={handleCancel}>
                Отмена
              </Button>
              <Button type="submit">
                Создать день
              </Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </UserTypeProtectedRoute>
  );
}