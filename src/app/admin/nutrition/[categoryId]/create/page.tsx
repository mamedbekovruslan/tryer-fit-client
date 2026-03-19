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
  Group,
  Alert,
  Accordion,
  ActionIcon,
  Flex,
} from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiPlus, FiTrash } from 'react-icons/fi';

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

export default function CreateNutritionDayPage() {
  const { categoryId } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  
  const [dayData, setDayData] = useState({
    name: '',
    description: ''
  });
  
  const [meals, setMeals] = useState<Meal[]>([
    { id: 1, name: 'Завтрак', description: '' },
    { id: 2, name: 'Обед', description: '' },
    { id: 3, name: 'Ужин', description: '' }
  ]);
  
  const [nextMealId, setNextMealId] = useState(4);
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setDayData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMealChange = (mealId: number, field: keyof Meal, value: string) => {
    setMeals(prev => 
      prev.map(meal => 
        meal.id === mealId ? { ...meal, [field]: value } : meal
      )
    );
  };

  const addMeal = () => {
    const newMeal: Meal = {
      id: nextMealId,
      name: `Прием пищи ${nextMealId}`,
      description: ''
    };
    
    setMeals([...meals, newMeal]);
    setNextMealId(nextMealId + 1);
  };

  const removeMeal = (mealId: number) => {
    if (meals.length <= 1) {
      setError('Должен быть хотя бы один прием пищи');
      return;
    }
    
    setMeals(meals.filter(meal => meal.id !== mealId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dayData.name.trim()) {
      setError('Название дня обязательно');
      return;
    }
    
    const emptyMeals = meals.filter(meal => !meal.name.trim() || !meal.description.trim());
    if (emptyMeals.length > 0) {
      setError('Все приемы пищи должны иметь название и описание');
      return;
    }
    
    
    setSuccess(true);
    setError('');
    
    setTimeout(() => {
      router.push(`/admin/nutrition/${categoryId}`);
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
          <Title order={1} ta="center" mb="xl">Создать день питания: {categoryId}</Title>
          
          {success && (
            <Alert title="Успех!" color="green" mb="md">
              День питания успешно создан!
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
                      label="Название дня"
                      placeholder="Например: День 1, День интенсивной тренировки"
                      value={dayData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                    
                    <TextInput
                      label="Описание (необязательно)"
                      placeholder="Краткое описание дня питания..."
                      value={dayData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                  </Stack>
                </Card>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Stack gap="md">
                    <Flex justify="space-between" align="center">
                      <Title order={3}>Приемы пищи</Title>
                      <Button 
                        variant="outline" 
                        size="compact-sm"
                        leftSection={<FiPlus size={14} />}
                        onClick={addMeal}
                      >
                        Добавить прием
                      </Button>
                    </Flex>
                    
                    <Accordion chevronPosition="right" variant="contained">
                      {meals.map((meal, index) => (
                        <Accordion.Item key={meal.id} value={`meal-${meal.id}`}>
                          <Accordion.Control>
                            <Flex justify="space-between" align="center" w="100%">
                              <Text fw={500}>
                                {meal.name || `Прием пищи ${index + 1}`}
                              </Text>
                              {meals.length > 1 && (
                                <ActionIcon 
                                  variant="subtle" 
                                  color="red" 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeMeal(meal.id);
                                  }}
                                >
                                  <FiTrash size={14} />
                                </ActionIcon>
                              )}
                            </Flex>
                          </Accordion.Control>
                          <Accordion.Panel>
                            <TextInput
                              label="Название приема пищи"
                              placeholder="Например: Завтрак, Обед, Полдник"
                              value={meal.name}
                              onChange={(e) => handleMealChange(meal.id, 'name', e.target.value)}
                              required
                            />
                            <TextInput
                              label="Описание"
                              placeholder="Что нужно съесть в этом приеме пищи..."
                              value={meal.description}
                              onChange={(e) => handleMealChange(meal.id, 'description', e.target.value)}
                              mt="sm"
                              required
                            />
                          </Accordion.Panel>
                        </Accordion.Item>
                      ))}
                    </Accordion>
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
                {success ? 'Создание...' : 'Создать день питания'}
              </Button>
              
              <Link href={`/admin/nutrition/${categoryId}`} passHref>
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