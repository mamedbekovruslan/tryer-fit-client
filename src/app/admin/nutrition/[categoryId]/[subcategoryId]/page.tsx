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
  Select,
  Flex,
  Badge,
  Group,
  Alert
} from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Типы данных
interface NutritionDayPlan {
  id: number;
  day_name: string;
  title: string;
  description: string;
  meals: {
    name: string;
    foods: string[];
  }[];
  created_at: string;
}

export default function NutritionDayPlansPage() {
  const { categoryId, subcategoryId } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  
  const [dayPlans, setDayPlans] = useState<NutritionDayPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<NutritionDayPlan | null>(null);
  const [loading, setLoading] = useState(true);

  // Моковые данные для демонстрации
  const mockDayPlans: NutritionDayPlan[] = [
    {
      id: 1,
      day_name: 'Понедельник',
      title: 'План питания на понедельник',
      description: 'Фокус на белках и овощах',
      meals: [
        {
          name: 'Завтрак',
          foods: ['Овсянка с ягодами', 'Греческий йогурт', 'Орехи']
        },
        {
          name: 'Обед',
          foods: ['Куриная грудка', 'Брокколи', 'Бурый рис']
        },
        {
          name: 'Ужин',
          foods: ['Запеченная рыба', 'Салат с овощами', 'Авокадо']
        }
      ],
      created_at: '2024-12-01'
    },
    {
      id: 2,
      day_name: 'Вторник',
      title: 'План питания на вторник',
      description: 'Углеводный день',
      meals: [
        {
          name: 'Завтрак',
          foods: ['Творог с медом', 'Фрукты', 'Цельнозерновой хлеб']
        },
        {
          name: 'Обед',
          foods: ['Говядина', 'Картофель', 'Салат']
        },
        {
          name: 'Ужин',
          foods: ['Макароны', 'Овощи', 'Соус']
        }
      ],
      created_at: '2024-12-02'
    },
    {
      id: 3,
      day_name: 'Среда',
      title: 'План питания на среду',
      description: 'Баланс белков и жиров',
      meals: [
        {
          name: 'Завтрак',
          foods: ['Яичница', 'Авокадо', 'Овощи']
        },
        {
          name: 'Обед',
          foods: ['Лосось', 'Киноа', 'Овощи на пару']
        },
        {
          name: 'Ужин',
          foods: ['Творожная запеканка', 'Ягоды', 'Орехи']
        }
      ],
      created_at: '2024-12-03'
    }
  ];

  useEffect(() => {
    // Загружаем данные планов питания
    const loadDayPlans = async () => {
      // В реальной реализации здесь будет вызов API
      setDayPlans(mockDayPlans);
      setLoading(false);
    };

    loadDayPlans();
  }, [categoryId, subcategoryId]);

  useEffect(() => {
    // Когда выбираем план, устанавливаем его в состояние
    if (selectedPlanId) {
      const plan = dayPlans.find(plan => plan.id.toString() === selectedPlanId);
      setSelectedPlan(plan || null);
    } else {
      setSelectedPlan(null);
    }
  }, [selectedPlanId, dayPlans]);

  const handleAddPlan = () => {
    router.push(`/admin/nutrition/${categoryId}/${subcategoryId}/create`);
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
          <Flex justify="space-between" align="center" mb="xl">
            <div>
              <Title order={1}>Планы питания: {categoryId} / {subcategoryId}</Title>
              <Text c="dimmed" mt="xs">Управление планами питания по дням</Text>
            </div>
            <Button 
              onClick={handleAddPlan} 
              size="lg"
            >
              Добавить план
            </Button>
          </Flex>

          <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
            <Select
              label="Выберите день"
              placeholder="Выберите план питания на день"
              data={dayPlans.map(plan => ({
                value: plan.id.toString(),
                label: `${plan.day_name} - ${plan.title}`
              }))}
              value={selectedPlanId}
              onChange={setSelectedPlanId}
              mb="md"
            />

            {selectedPlan && (
              <Card shadow="xs" padding="lg" radius="sm" withBorder mt="md">
                <Group justify="space-between" mb="md">
                  <Title order={3}>{selectedPlan.title}</Title>
                  <Badge variant="light">Создан: {selectedPlan.created_at}</Badge>
                </Group>
                
                <Text mb="md">{selectedPlan.description}</Text>
                
                <Stack gap="md">
                  {selectedPlan.meals.map((meal, index) => (
                    <Card key={index} shadow="none" padding="md" radius="sm" withBorder>
                      <Title order={4}>{meal.name}</Title>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {meal.foods.map((food, foodIndex) => (
                          <li key={foodIndex}>{food}</li>
                        ))}
                      </ul>
                    </Card>
                  ))}
                </Stack>
              </Card>
            )}
          </Card>

          {!selectedPlanId && dayPlans.length > 0 && (
            <Alert title="Подсказка" color="blue">
              Выберите день из списка, чтобы посмотреть детальный план питания
            </Alert>
          )}

          {dayPlans.length === 0 && (
            <Paper p="xl" radius="md" withBorder ta="center">
              <Text size="lg">Планы питания отсутствуют</Text>
              <Text c="dimmed" mt="sm">Нажмите "Добавить план", чтобы создать первый план питания на день</Text>
            </Paper>
          )}
        </Paper>
      </Container>
    </UserTypeProtectedRoute>
  );
}