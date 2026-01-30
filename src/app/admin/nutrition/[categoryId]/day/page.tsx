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
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { FiArrowLeft } from 'react-icons/fi';
import { nutritionService, NutritionDay } from '@/services/nutritionService';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';

export default function NutritionDayDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const categoryId = Number(params.categoryId);
  const dayId = Number(params.dayId);
  
  const [day, setDay] = useState<NutritionDay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dayId) {
      loadDay();
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

  const handleGoBack = () => {
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
                    <Title order={3} mb="md">Приемы пищи</Title>
                    
                    <Text c="dimmed">Функционал добавления приемов пищи будет реализован в следующей версии</Text>
                    
                    <Stack mt="md">
                      <Button variant="outline">
                        Добавить прием пищи
                      </Button>
                    </Stack>
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
      </Container>
    </UserTypeProtectedRoute>
  );
}