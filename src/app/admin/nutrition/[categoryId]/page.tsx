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
  Divider
} from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// Типы данных
interface NutritionCategory {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

interface Meal {
  id: number;
  name: string;
  description: string;
}

interface NutritionDay {
  id: number;
  name: string;
  category_id: number;
  meals: Meal[];
  created_at: string;
}

export default function NutritionCategoryPage() {
  const { categoryId } = useParams();
  const { user } = useAuth();
  const [category, setCategory] = useState<NutritionCategory | null>(null);
  const [days, setDays] = useState<NutritionDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<NutritionDay | null>(null);

  // Моковые данные для демонстрации
  const mockCategories: NutritionCategory[] = [
    {
      id: 1,
      name: 'Похудение',
      description: 'Правила питания для снижения веса',
      created_at: '2024-11-15'
    },
    {
      id: 2,
      name: 'Набор массы',
      description: 'Правила питания для набора мышечной массы',
      created_at: '2024-11-20'
    },
    {
      id: 3,
      name: 'Спортивное питание',
      description: 'Правила спортивного питания для атлетов',
      created_at: '2024-12-01'
    },
    {
      id: 4,
      name: 'Вегетарианское питание',
      description: 'Правила вегетарианского и веганского питания',
      created_at: '2024-12-10'
    }
  ];

  const mockDays: NutritionDay[] = [
    {
      id: 1,
      name: 'День 1',
      category_id: Number(categoryId),
      meals: [
        {
          id: 1,
          name: 'Завтрак',
          description: 'Овсянка с ягодами и орехами'
        },
        {
          id: 2,
          name: 'Обед',
          description: 'Куриная грудка с овощами и бурый рис'
        },
        {
          id: 3,
          name: 'Ужин',
          description: 'Запеченная рыба с салатом'
        }
      ],
      created_at: '2024-12-01'
    },
    {
      id: 2,
      name: 'День 2',
      category_id: Number(categoryId),
      meals: [
        {
          id: 1,
          name: 'Завтрак',
          description: 'Творог с медом и фруктами'
        },
        {
          id: 2,
          name: 'Обед',
          description: 'Говядина с картофелем и овощами'
        },
        {
          id: 3,
          name: 'Ужин',
          description: 'Овощное рагу с яйцом'
        }
      ],
      created_at: '2024-12-02'
    },
    {
      id: 3,
      name: 'День 3',
      category_id: Number(categoryId),
      meals: [
        {
          id: 1,
          name: 'Завтрак',
          description: 'Яичница с авокадо и цельнозерновым хлебом'
        },
        {
          id: 2,
          name: 'Обед',
          description: 'Лосось с киноа и брокколи'
        },
        {
          id: 3,
          name: 'Ужин',
          description: 'Творожная запеканка с ягодами'
        }
      ],
      created_at: '2024-12-03'
    }
  ];

  useEffect(() => {
    // Загружаем данные категории
    const loadCategoryData = async () => {
      const foundCategory = mockCategories.find(cat => cat.id === Number(categoryId));
      setCategory(foundCategory || null);
      setDays(mockDays);
      
      // Устанавливаем первый день как выбранный по умолчанию
      if (mockDays.length > 0) {
        setSelectedDay(mockDays[0]);
      }
    };

    loadCategoryData();
  }, [categoryId]);

  const handleDayClick = (day: NutritionDay) => {
    setSelectedDay(day);
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

  if (!category) {
    return (
      <UserTypeProtectedRoute allowedUserTypes={['trainer']}>
        <Container size="md" py="xl">
          <Paper shadow="md" p="xl" radius="md">
            <Text ta="center">Категория не найдена</Text>
          </Paper>
        </Container>
      </UserTypeProtectedRoute>
    );
  }

  return (
    <UserTypeProtectedRoute allowedUserTypes={['trainer']}>
      <Container size="lg" py="xl">
        <Paper shadow="md" p="xl" radius="md">
          <Flex justify="space-between" align="center" mb="xl">
            <div>
              <Title order={1}>{category.name}</Title>
              {category.description && (
                <Text c="dimmed" mt="xs">{category.description}</Text>
              )}
            </div>
            <Link href={`/admin/nutrition/${categoryId}/create`} passHref legacyBehavior>
              <Button size="lg">
                Добавить день
              </Button>
            </Link>
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
                          <Badge variant="light">{day.meals.length} приемов</Badge>
                        </Flex>
                        <Text size="sm" c="dimmed" mt="xs">
                          Создан: {day.created_at}
                        </Text>
                      </Card>
                    ))}
                  </Stack>
                </ScrollArea>
                
                {days.length === 0 && (
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
                      <Badge variant="outline">Создан: {selectedDay.created_at}</Badge>
                    </Flex>
                    
                    <Divider mb="md" />
                    
                    <Stack gap="md">
                      {selectedDay.meals.map(meal => (
                        <Card key={meal.id} shadow="none" padding="md" radius="sm" withBorder>
                          <Title order={4}>{meal.name}</Title>
                          <Text mt="sm">{meal.description}</Text>
                        </Card>
                      ))}
                    </Stack>
                  </>
                ) : (
                  <Text c="dimmed" ta="center">
                    Выберите день из списка для просмотра деталей
                  </Text>
                )}
              </Card>
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>
    </UserTypeProtectedRoute>
  );
}