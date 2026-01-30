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
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { FiPlus } from 'react-icons/fi';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { useParams, useRouter } from 'next/navigation';
import { nutritionService, NutritionDay } from '@/services/nutritionService';

export default function NutritionCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const categoryId = Number(params.categoryId);
  const [days, setDays] = useState<NutritionDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<NutritionDay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryId) {
      loadDays();
    }
  }, [categoryId]);

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

  const handleDayClick = (day: NutritionDay) => {
    setSelectedDay(day);
  };

  const handleAddDay = () => {
    router.push(`/admin/nutrition/${categoryId}/add-day`);
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
                          <Text fw={500}>{day.name}</Text>
                          <Badge variant="light">День</Badge>
                        </Flex>
                        <Text size="sm" c="dimmed" mt="xs">
                          Создан: {new Date(day.createdAt).toLocaleDateString()}
                        </Text>
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
                        <Title order={4}>Приемы пищи</Title>
                        <Text mt="sm" c="dimmed">Функционал добавления приемов пищи будет реализован в следующей версии</Text>

                        <Stack mt="md">
                          <Button variant="outline">
                            Добавить прием пищи
                          </Button>
                        </Stack>
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
      </Container>
    </UserTypeProtectedRoute>
  );
}