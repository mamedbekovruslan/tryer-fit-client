'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Paper,
  Stack,
  Card,
  Grid,
  Button,
  Alert,
  Text,
  Group,
  Badge,
  LoadingOverlay,
  ActionIcon,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { nutritionService, ClientNutritionPlan } from '@/services/nutritionService';
import { FiEdit2, FiToggleRight, FiToggleLeft } from 'react-icons/fi';

export default function ClientNutritionPlansPage() {
  const { id: clientId } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  // Состояния для данных
  const [clientNutritionPlans, setClientNutritionPlans] = useState<ClientNutritionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Загрузка назначенных планов питания клиента
  useEffect(() => {
    const fetchClientNutritionPlans = async () => {
      try {
        setLoading(true);
        // Загружаем все назначенные планы питания для клиента
        const plans = await nutritionService.getClientNutritionPlans(Number(clientId));
        setClientNutritionPlans(plans);
      } catch (err) {
        setError('Ошибка загрузки назначенных планов питания: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchClientNutritionPlans();
    }
  }, [clientId]);

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

  // Функция для переключения статуса плана
  const togglePlanStatus = async (planId: number, newStatus: boolean) => {
    try {
      setLoading(true);
      // Обновляем статус плана
      await nutritionService.updateClientNutritionPlan(planId, { isActive: newStatus });

      // Обновляем локальный список планов
      setClientNutritionPlans(prevPlans =>
        prevPlans.map(plan =>
          plan.id === planId ? { ...plan, isActive: newStatus } : plan
        )
      );

      notifications.show({
        title: 'Успешно',
        message: `План питания ${newStatus ? 'активирован' : 'деактивирован'}`,
        color: 'green',
      });
    } catch (err) {
      setError('Ошибка изменения статуса плана: ' + (err as Error).message);
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось изменить статус плана питания',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserTypeProtectedRoute allowedUserTypes={['trainer']}>
      <Container size="lg" py="xl">
        <Paper shadow="md" p="xl" radius="md">
          <Title order={1} ta="center" mb="xl">Назначенные планы питания клиента #{clientId}</Title>

          {error && (
            <Alert title="Ошибка" color="red" mb="md">
              {error}
            </Alert>
          )}

          <Grid gutter="xl">
            <Grid.Col span={12}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Title order={3}>Назначенные планы</Title>

                  <Link href={`/admin/client/${clientId}/add-nutrition`} passHref>
                    <Button variant="filled">
                      Добавить новый план
                    </Button>
                  </Link>
                </Group>

                <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />

                {!loading && clientNutritionPlans.length > 0 ? (
                  <Stack gap="md">
                    {clientNutritionPlans.map(plan => (
                      <Card key={plan.id} shadow="xs" padding="md" radius="sm" withBorder>
                        <Group justify="space-between" mb="sm">
                          <Title order={4}>{plan.nutritionPlan.name}</Title>
                          <Group>
                            <Badge variant="light" color={plan.isActive ? "green" : "red"}>
                              {plan.isActive ? "Активный" : "Неактивный"}
                            </Badge>
                            <ActionIcon
                              variant="subtle"
                              color={plan.isActive ? "green" : "red"}
                              onClick={() => togglePlanStatus(plan.id, !plan.isActive)}
                              title={plan.isActive ? "Сделать неактивным" : "Сделать активным"}
                            >
                              {plan.isActive ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                            </ActionIcon>
                          </Group>
                        </Group>

                        <Text size="sm" c="dimmed" mb="sm">
                          Категория: {plan.nutritionPlan.nutritionCategory?.name || 'Категория не указана'}
                        </Text>

                        <Text size="sm" mb="md">
                          {plan.nutritionPlan.description || 'Описание плана питания отсутствует'}
                        </Text>

                        <Text size="xs" c="gray">
                          Назначен: {new Date(plan.assignedAt).toLocaleDateString('ru-RU')}
                          {plan.updatedAt && plan.updatedAt !== plan.assignedAt && (
                            <span>, обновлен: {new Date(plan.updatedAt).toLocaleDateString('ru-RU')}</span>
                          )}
                        </Text>
                      </Card>
                    ))}
                  </Stack>
                ) : !loading ? (
                  <Text ta="center" py="xl">
                    У клиента пока нет назначенных планов питания.
                    <br />
                    <Link href={`/admin/client/${clientId}/add-nutrition`} passHref>
                      <Button variant="subtle" size="compact-sm" mt="sm">
                        Назначить первый план
                      </Button>
                    </Link>
                  </Text>
                ) : null}

                <Group justify="center" mt="xl">
                  <Link href={`/admin/client/${clientId}`} passHref>
                    <Button variant="outline" size="md">
                      Назад к профилю клиента
                    </Button>
                  </Link>
                </Group>
              </Card>
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>
    </UserTypeProtectedRoute>
  );
}