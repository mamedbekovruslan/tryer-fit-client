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
  NumberInput,
  Group,
  Alert
} from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddNutritionPlanPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  
  // Состояния для формы
  const [nutritionPlan, setNutritionPlan] = useState({
    title: '',
    description: '',
    duration: 30, // дней
    meals: [
      { name: 'Завтрак', foods: [] },
      { name: 'Обед', foods: [] },
      { name: 'Ужин', foods: [] },
      { name: 'Перекус', foods: [] }
    ],
    restrictions: [],
    supplements: []
  });
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Моковые данные для демонстрации
  const mealOptions = [
    { value: 'oatmeal', label: 'Овсянка с ягодами' },
    { value: 'protein_shake', label: 'Протеиновый коктейль' },
    { value: 'chicken_salad', label: 'Салат с курицей' },
    { value: 'grilled_fish', label: 'Запеченная рыба с овощами' },
    { value: 'greek_yogurt', label: 'Греческий йогурт с орехами' },
    { value: 'quinoa_bowl', label: 'Булгур с киноа и овощами' }
  ];

  const restrictionOptions = [
    { value: 'dairy_free', label: 'Без молочных продуктов' },
    { value: 'gluten_free', label: 'Без глютена' },
    { value: 'sugar_free', label: 'Без сахара' },
    { value: 'low_carb', label: 'Низкоуглеводная' },
    { value: 'high_protein', label: 'Высокобелковая' }
  ];

  const supplementOptions = [
    { value: 'multivitamin', label: 'Мультивитамины' },
    { value: 'omega3', label: 'Омега-3' },
    { value: 'probiotics', label: 'Пробиотики' },
    { value: 'vitamin_d', label: 'Витамин D' },
    { value: 'magnesium', label: 'Магний' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setNutritionPlan(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMealChange = (mealIndex: number, foods: string[]) => {
    const updatedMeals = [...nutritionPlan.meals];
    updatedMeals[mealIndex].foods = foods;
    setNutritionPlan(prev => ({
      ...prev,
      meals: updatedMeals
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!nutritionPlan.title.trim()) {
      setError('Название плана питания обязательно');
      return;
    }
    
    // Здесь будет вызов API для сохранения плана питания
    console.log('Сохраняем план питания:', nutritionPlan);
    
    // Имитация успешного сохранения
    setSuccess(true);
    setError('');
    
    // Через 2 секунды перенаправляем обратно к профилю клиента
    setTimeout(() => {
      router.push(`/admin/client/${id}`);
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
          <Title order={1} ta="center" mb="xl">Добавить план питания для клиента #{id}</Title>
          
          {success && (
            <Alert title="Успех!" color="green" mb="md">
              План питания успешно добавлен для клиента!
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
                    
                    <TextInput
                      label="Название плана питания"
                      placeholder="Например: План похудения на 30 дней"
                      value={nutritionPlan.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                    
                    <Textarea
                      label="Описание плана"
                      placeholder="Подробное описание плана питания..."
                      value={nutritionPlan.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      minRows={3}
                    />
                    
                    <NumberInput
                      label="Длительность (дни)"
                      value={nutritionPlan.duration}
                      onChange={(value) => handleInputChange('duration', value)}
                      min={1}
                      max={365}
                    />
                    
                    <MultiSelect
                      label="Ограничения и предпочтения"
                      data={restrictionOptions}
                      value={nutritionPlan.restrictions}
                      onChange={(value) => handleInputChange('restrictions', value)}
                      placeholder="Выберите ограничения..."
                    />
                    
                    <MultiSelect
                      label="Рекомендуемые добавки"
                      data={supplementOptions}
                      value={nutritionPlan.supplements}
                      onChange={(value) => handleInputChange('supplements', value)}
                      placeholder="Выберите добавки..."
                    />
                  </Stack>
                </Card>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Stack gap="md">
                    <Title order={3}>Приемы пищи</Title>
                    
                    {nutritionPlan.meals.map((meal, index) => (
                      <Card key={index} shadow="xs" padding="md" radius="sm" withBorder>
                        <Text fw={500} mb="sm">{meal.name}</Text>
                        
                        <MultiSelect
                          data={mealOptions}
                          value={meal.foods}
                          onChange={(value) => handleMealChange(index, value)}
                          placeholder={`Выберите блюда для ${meal.name.toLowerCase()}...`}
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
                {success ? 'Сохранение...' : 'Создать план питания'}
              </Button>
              
              <Link href={`/admin/client/${id}`} passHref>
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