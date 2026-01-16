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
  List,
  ListItem,
} from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Типы данных
interface ClientNutritionPlan {
  id: number;
  client_id: number;
  day_id: number;
  category_id: number;
  subcategory_id: number;
  assigned_at: string;
  day: {
    id: number;
    name: string;
    description: string;
    subcategory_id: number;
  };
  category: {
    id: number;
    name: string;
    description: string;
  };
  subcategory: {
    id: number;
    name: string;
    description: string;
    category_id: number;
  };
}

export default function ClientNutritionPlansPage() {
  const { id: clientId } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  // Состояния для данных
  const [nutritionPlans, setNutritionPlans] = useState<ClientNutritionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Загрузка планов питания клиента
  useEffect(() => {
    // Пока используем моковые данные до реализации API
    const fetchNutritionPlans = async () => {
      try {
        setLoading(true);

        // Имитация задержки сети
        await new Promise(resolve => setTimeout(resolve, 300));

        // Моковые данные
        const mockPlans: ClientNutritionPlan[] = [
          {
            id: 1,
            client_id: Number(clientId),
            day_id: 1,
            category_id: 1,
            subcategory_id: 1,
            assigned_at: '2024-01-15T10:30:00Z',
            day: {
              id: 1,
              name: 'День 1',
              description: 'Начало программы похудения с высоким содержанием белка',
              subcategory_id: 1
            },
            category: {
              id: 1,
              name: 'Похудение',
              description: 'Планы питания для снижения веса'
            },
            subcategory: {
              id: 1,
              name: 'Белковая диета',
              description: 'Высокое содержание белка',
              category_id: 1
            }
          },
          {
            id: 2,
            client_id: Number(clientId),
            day_id: 2,
            category_id: 1,
            subcategory_id: 1,
            assigned_at: '2024-01-16T14:20:00Z',
            day: {
              id: 2,
              name: 'День 2',
              description: 'Продолжение программы похудения с акцентом на овощи',
              subcategory_id: 1
            },
            category: {
              id: 1,
              name: 'Похудение',
              description: 'Планы питания для снижения веса'
            },
            subcategory: {
              id: 1,
              name: 'Белковая диета',
              description: 'Высокое содержание белка',
              category_id: 1
            }
          }
        ];

        setNutritionPlans(mockPlans);
      } catch (err) {
        setError('Ошибка загрузки планов питания: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchNutritionPlans();
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

  return (
    <UserTypeProtectedRoute allowedUserTypes={['trainer']}>
      <Container size="lg" py="xl">
        <Paper shadow="md" p="xl" radius="md">
          <Title order={1} ta="center" mb="xl">Планы питания клиента #{clientId}</Title>

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

                {loading ? (
                  <Text ta="center" py="xl">Загрузка планов питания...</Text>
                ) : nutritionPlans.length > 0 ? (
                  <Stack gap="md">
                    {nutritionPlans.map(plan => (
                      <Card key={plan.id} shadow="xs" padding="md" radius="sm" withBorder>
                        <Group justify="space-between" mb="sm">
                          <Title order={4}>{plan.day.name}</Title>
                          <Badge variant="light" color="blue">
                            {plan.category.name}
                          </Badge>
                        </Group>
                        
                        <Text size="sm" c="dimmed" mb="sm">
                          Подкатегория: {plan.subcategory.name}
                        </Text>
                        
                        <Text size="sm" mb="md">
                          {plan.day.description || 'Описание дня питания отсутствует'}
                        </Text>
                        
                        <Text size="xs" c="gray">
                          Назначен: {new Date(plan.assigned_at).toLocaleDateString('ru-RU')}
                        </Text>
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <Text ta="center" py="xl">
                    У клиента пока нет назначенных планов питания.
                    <br />
                    <Link href={`/admin/client/${clientId}/add-nutrition`} passHref>
                      <Button variant="subtle" size="compact-sm" mt="sm">
                        Назначить первый план
                      </Button>
                    </Link>
                  </Text>
                )}
                
                <Group justify="center" mt="xl">
                  <Link href={`/admin/client/${clientId}`} passHref>
                    <Button variant="outline" size="lg">
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