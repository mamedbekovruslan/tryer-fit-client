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
  Accordion,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { nutritionService, ClientNutritionPlan, NutritionDay, Meal } from '@/services/nutritionService';

export default function NutritionPage() {
  const { user } = useAuth();
  const [clientNutritionPlans, setClientNutritionPlans] = useState<ClientNutritionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.id) {
      loadNutritionPlans();
    }
  }, [user]);

  const loadNutritionPlans = async () => {
    try {
      setLoading(true);
      if (user && user.id) {
        const plans = await nutritionService.getActiveClientNutritionPlans(user.id);
        setClientNutritionPlans(plans);
      }
    } catch (error) {
      notifications.show({
        title: 'Ошибка загрузки',
        message: 'Не удалось загрузить планы питания',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <UserTypeProtectedRoute allowedUserTypes={['client']}>
        <Container size="md" py="xl">
          <Paper shadow="md" p="xl" radius="md">
            <Text ta="center">Загрузка...</Text>
          </Paper>
        </Container>
      </UserTypeProtectedRoute>
    );
  }

  return (
    <UserTypeProtectedRoute allowedUserTypes={['client']}>
      <Container size="lg" py="xl">
        <Paper shadow="md" p="xl" radius="md">
          <LoadingOverlay visible={loading} overlayProps={{ radius: 'sm', blur: 2 }} />

          <Flex justify="space-between" align="center" mb="xl">
            <Title order={1}>Планы питания</Title>
            <Badge variant="outline" color="green">
              Активные планы: {clientNutritionPlans.length}
            </Badge>
          </Flex>

          {clientNutritionPlans.length > 0 ? (
            <Stack gap="xl">
              {clientNutritionPlans.map((plan) => (
                <Card key={plan.id} shadow="sm" padding="lg" radius="md" withBorder>
                  <Flex justify="space-between" align="center" mb="md">
                    <div>
                      <Title order={2}>{plan.nutritionPlan.name}</Title>
                      <Text c="dimmed" size="sm">
                        Назначен: {new Date(plan.assignedAt).toLocaleDateString()}
                      </Text>
                    </div>
                    <Badge color="green" variant="light">
                      Активный
                    </Badge>
                  </Flex>

                  {plan.nutritionPlan.description && (
                    <Paper p="md" withBorder mb="md">
                      <Text size="lg">{plan.nutritionPlan.description}</Text>
                    </Paper>
                  )}

                  <Accordion defaultValue="days" variant="contained">
                    <Accordion.Item value="days">
                      <Accordion.Control>Дни питания</Accordion.Control>
                      <Accordion.Panel>
                        <NutritionPlanDetails nutritionPlan={plan.nutritionPlan} />
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>

                </Card>
              ))}
            </Stack>
          ) : !loading ? (
            <Paper p="xl" radius="md" withBorder ta="center">
              <Text size="lg">У вас пока нет активных планов питания</Text>
              <Text c="dimmed" mt="sm">Обратитесь к вашему тренеру для получения плана питания</Text>
            </Paper>
          ) : null}
        </Paper>
      </Container>
    </UserTypeProtectedRoute>
  );
}

// Компонент для отображения деталей плана питания
function NutritionPlanDetails({ nutritionPlan }: { nutritionPlan: any }) {
  const [nutritionDays, setNutritionDays] = useState<NutritionDay[]>([]);
  const [mealsByDay, setMealsByDay] = useState<{[key: number]: Meal[]}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlanDetails();
  }, [nutritionPlan]);

  const loadPlanDetails = async () => {
    try {
      setLoading(true);

      const days = await nutritionService.getNutritionDaysByPlan(nutritionPlan.id);

      setNutritionDays(days);

      // Загрузим приемы пищи для каждого дня
      const mealsData: {[key: number]: Meal[]} = {};
      for (const day of days) {
        try {
          const meals = await nutritionService.getMealsByNutritionDay(day.id);
          mealsData[day.id] = meals;
        } catch (error) {
          // Если дня нет, пропускаем
          mealsData[day.id] = [];
        }
      }
      setMealsByDay(mealsData);
    } catch (error) {
      console.error('Error loading plan details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <Stack gap="md">
      {nutritionDays.map((day) => (
        <Card key={day.id} shadow="xs" padding="md" radius="sm" withBorder>
          <Title order={4} mb="sm">{day.name}</Title>

          {mealsByDay[day.id] && mealsByDay[day.id].length > 0 ? (
            <Stack gap="sm">
              {mealsByDay[day.id].map((meal) => (
                <Card key={meal.id} padding="sm" radius="sm" withBorder>
                  <Flex justify="space-between" align="center">
                    <Text fw={500}>{meal.name}</Text>
                  </Flex>

                  {meal.description && (
                    <Text size="sm" c="dimmed">
                      {meal.description}
                    </Text>
                  )}
                </Card>
              ))}
            </Stack>
          ) : (
            <Text c="dimmed" size="sm">Нет приемов пищи</Text>
          )}
        </Card>
      ))}
    </Stack>
  );
}
