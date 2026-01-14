'use client';

import { useState } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Paper, 
  Stack, 
  Card, 
  Grid, 
  Button, 
  TextInput,
  Textarea,
  Select,
  MultiSelect,
  Group,
  Alert,
  NumberInput
} from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Типы данных
interface Meal {
  name: string;
  foods: string[];
}

interface NutritionDayPlan {
  id: number;
  day_name: string;
  title: string;
  description: string;
  meals: Meal[];
  created_at: string;
}

export default function CreateNutritionDayPlanPage() {
  const { categoryId, subcategoryId } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  
  const [planData, setPlanData] = useState({
    day_name: '',
    title: '',
    description: '',
    meals: [
      { name: 'Завтрак', foods: [] },
      { name: 'Обед', foods: [] },
      { name: 'Ужин', foods: [] },
      { name: 'Перекус', foods: [] }
    ]
  });
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Моковые данные для еды
  const foodOptions = [
    { value: 'oatmeal_with_fruits', label: 'Овсянка с фруктами' },
    { value: 'greek_yogurt', label: 'Греческий йогурт' },
    { value: 'scrambled_eggs', label: 'Яичница' },
    { value: 'protein_smoothie', label: 'Протеиновый коктейль' },
    { value: 'chicken_breast', label: 'Куриная грудка' },
    { value: 'grilled_fish', label: 'Запеченная рыба' },
    { value: 'brown_rice', label: 'Бурый рис' },
    { value: 'quinoa', label: 'Киноа' },
    { value: 'broccoli', label: 'Брокколи' },
    { value: 'mixed_salad', label: 'Смешанный салат' },
    { value: 'sweet_potato', label: 'Сладкий картофель' },
    { value: 'avocado', label: 'Авокадо' },
    { value: 'nuts', label: 'Орехи' },
    { value: 'berries', label: 'Ягоды' },
    { value: 'cottage_cheese', label: 'Творог' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setPlanData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMealFoodChange = (mealIndex: number, foods: string[]) => {
    const updatedMeals = [...planData.meals];
    updatedMeals[mealIndex].foods = foods;
    setPlanData(prev => ({
      ...prev,
      meals: updatedMeals
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!planData.day_name.trim()) {
      setError('Название дня обязательно');
      return;
    }
    
    if (!planData.title.trim()) {
      setError('Название плана обязательно');
      return;
    }
    
    // Здесь будет вызов API для сохранения плана питания
    console.log('Сохраняем план питания:', planData);
    
    // Имитация успешного сохранения
    setSuccess(true);
    setError('');
    
    // Через 2 секунды перенаправляем обратно к списку планов
    setTimeout(() => {
      router.push(`/admin/nutrition/${categoryId}/${subcategoryId}`);
    }, 2000);
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
          <Title order={1} ta="center" mb="xl">Создать план питания на день: {categoryId} / {subcategoryId}</Title>
          
          {success && (
            <Alert title="Успех!" color="green" mb="md">
              План питания успешно создан!
            </Alert>
          )}
          
          {error && (
            <Alert title="Ошибка" color="red" mb="md">
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Grid gutter="xl">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Stack gap="md">
                    <Title order={3}>Основная информация</Title>
                    
                    <Select
                      label="День недели"
                      placeholder="Выберите день недели"
                      data={[
                        { value: 'Понедельник', label: 'Понедельник' },
                        { value: 'Вторник', label: 'Вторник' },
                        { value: 'Среда', label: 'Среда' },
                        { value: 'Четверг', label: 'Четверг' },
                        { value: 'Пятница', label: 'Пятница' },
                        { value: 'Суббота', label: 'Суббота' },
                        { value: 'Воскресенье', label: 'Воскресенье' }
                      ]}
                      value={planData.day_name}
                      onChange={(value) => handleInputChange('day_name', value)}
                      required
                    />
                    
                    <TextInput
                      label="Название плана"
                      placeholder="Например: План на понедельник для похудения"
                      value={planData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                    
                    <Textarea
                      label="Описание плана"
                      placeholder="Краткое описание плана питания на этот день..."
                      value={planData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      minRows={3}
                    />
                  </Stack>
                </Card>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Stack gap="md">
                    <Title order={3}>Приемы пищи</Title>
                    
                    {planData.meals.map((meal, index) => (
                      <Card key={index} shadow="xs" padding="md" radius="sm" withBorder>
                        <Text fw={500} mb="sm">{meal.name}</Text>
                        
                        <MultiSelect
                          data={foodOptions}
                          value={meal.foods}
                          onChange={(value) => handleMealFoodChange(index, value)}
                          placeholder={`Выберите продукты для ${meal.name.toLowerCase()}...`}
                          searchable
                        />
                      </Card>
                    ))}
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
            
            <Group justify="center" mt="xl">
              <Button 
                type="submit" 
                size="lg"
                disabled={success}
              >
                {success ? 'Создание...' : 'Создать план питания'}
              </Button>
              
              <Link href={`/admin/nutrition/${categoryId}/${subcategoryId}`} passHref>
                <Button variant="outline" size="lg">
                  Отмена
                </Button>
              </Link>
            </Group>
          </form>
        </Paper>
      </Container>
    </UserTypeProtectedRoute>
  );
}