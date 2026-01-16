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
  Select,
  Alert,
  Text,
  Group,
  Box,
  LoadingOverlay,
} from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Типы данных
interface NutritionCategory {
  id: number;
  name: string;
  description: string;
}

interface NutritionSubcategory {
  id: number;
  name: string;
  description: string;
  category_id: number;
}

interface NutritionDay {
  id: number;
  name: string;
  description: string;
  subcategory_id: number;
}

interface SelectedPlan {
  day: NutritionDay;
  category: NutritionCategory;
  subcategory: NutritionSubcategory;
}

export default function AddNutritionToClientPage() {
  const { id: clientId } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  // Моковые данные
  const mockCategories: NutritionCategory[] = [
    { id: 1, name: 'Похудение', description: 'Планы питания для снижения веса' },
    { id: 2, name: 'Набор массы', description: 'Планы питания для набора мышечной массы' },
    { id: 3, name: 'Поддержание формы', description: 'Планы питания для поддержания текущего веса' },
  ];

  const mockSubcategories: NutritionSubcategory[] = [
    { id: 1, name: 'Белковая диета', description: 'Высокое содержание белка', category_id: 1 },
    { id: 2, name: 'Низкоуглеводная', description: 'Ограниченное количество углеводов', category_id: 1 },
    { id: 3, name: 'Кето', description: 'Высокое содержание жиров, низкое - углеводов', category_id: 1 },
    { id: 4, name: 'Объем', description: 'Высокая калорийность для набора массы', category_id: 2 },
    { id: 5, name: 'Сушка', description: 'Низкая калорийность для сушки', category_id: 2 },
    { id: 6, name: 'Сбалансированная', description: 'Сбалансированное питание', category_id: 3 },
  ];

  const mockDays: NutritionDay[] = [
    { id: 1, name: 'День 1', description: 'Начало программы', subcategory_id: 1 },
    { id: 2, name: 'День 2', description: 'Продолжение программы', subcategory_id: 1 },
    { id: 3, name: 'День 3', description: 'Средина программы', subcategory_id: 1 },
    { id: 4, name: 'День 1', description: 'Начало программы', subcategory_id: 2 },
    { id: 5, name: 'День 2', description: 'Продолжение программы', subcategory_id: 2 },
    { id: 6, name: 'День 1', description: 'Начало программы', subcategory_id: 3 },
    { id: 7, name: 'День 2', description: 'Продолжение программы', subcategory_id: 3 },
  ];

  // Состояния для данных
  const [categories, setCategories] = useState<NutritionCategory[]>(mockCategories);
  const [subcategories, setSubcategories] = useState<NutritionSubcategory[]>([]);
  const [days, setDays] = useState<NutritionDay[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);

  // Состояния для выбранных значений
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  // Состояния для загрузки и ошибок
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);

  // Загрузка категорий при монтировании компонента (уже загружены как мок)
  useEffect(() => {
    setLoading(false);
  }, []);

  // Загрузка подкатегорий при выборе категории
  useEffect(() => {
    if (!selectedCategoryId) {
      setSubcategories([]);
      setSelectedSubcategoryId(null);
      setDays([]);
      setSelectedDayId(null);
      return;
    }

    // Фильтруем подкатегории по выбранной категории
    const filteredSubcategories = mockSubcategories.filter(
      sub => sub.category_id === Number(selectedCategoryId)
    );
    setSubcategories(filteredSubcategories);
    setSelectedSubcategoryId(null);
    setDays([]);
    setSelectedDayId(null);
  }, [selectedCategoryId]);

  // Загрузка дней при выборе подкатегории
  useEffect(() => {
    if (!selectedSubcategoryId) {
      setDays([]);
      setSelectedDayId(null);
      return;
    }

    // Фильтруем дни по выбранной подкатегории
    const filteredDays = mockDays.filter(
      day => day.subcategory_id === Number(selectedSubcategoryId)
    );
    setDays(filteredDays);
    setSelectedDayId(null);
  }, [selectedSubcategoryId]);

  // Обработка выбора категории
  const handleCategoryChange = (value: string | null) => {
    setSelectedCategoryId(value);
    setSelectedSubcategoryId(null);
    setSelectedDayId(null);
    setSelectedPlan(null);
  };

  // Обработка выбора подкатегории
  const handleSubcategoryChange = (value: string | null) => {
    setSelectedSubcategoryId(value);
    setSelectedDayId(null);
    setSelectedPlan(null);
  };

  // Обработка выбора дня
  const handleDayChange = (value: string | null) => {
    if (!value) {
      setSelectedDayId(null);
      setSelectedPlan(null);
      return;
    }

    setSelectedDayId(value);
    
    // Найти соответствующие данные для отображения плана
    const selectedDay = days.find(d => d.id.toString() === value);
    const selectedCategory = categories.find(c => c.id === Number(selectedCategoryId));
    const selectedSubcategory = subcategories.find(sc => sc.id === Number(selectedSubcategoryId));
    
    if (selectedDay && selectedCategory && selectedSubcategory) {
      setSelectedPlan({
        day: selectedDay,
        category: selectedCategory,
        subcategory: selectedSubcategory
      });
    }
  };

  // Обработка публикации плана
  const handlePublishPlan = async () => {
    if (!selectedPlan) {
      setError('Выберите день питания перед публикацией');
      return;
    }

    try {
      setLoading(true);

      // В реальной реализации здесь будет вызов API
      // await clientService.assignNutritionPlan(Number(clientId), {
      //   day_id: selectedPlan.day.id,
      //   category_id: selectedPlan.category.id,
      //   subcategory_id: selectedPlan.subcategory.id
      // });

      // Имитация успешной публикации
      console.log(`План питания опубликован для клиента ${clientId}:`, {
        day_id: selectedPlan.day.id,
        category_id: selectedPlan.category.id,
        subcategory_id: selectedPlan.subcategory.id
      });

      setSuccess(true);
      setError('');

      // Через 2 секунды перенаправляем обратно
      setTimeout(() => {
        router.push(`/admin/client/${clientId}/nutrition`);
      }, 2000);
    } catch (err) {
      setError('Ошибка публикации плана: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
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
        <LoadingOverlay visible={loadingPlan} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        
        <Paper shadow="md" p="xl" radius="md">
          <Title order={1} ta="center" mb="xl">Добавить план питания клиенту #{clientId}</Title>

          {success && (
            <Alert title="Успех!" color="green" mb="md">
              План питания успешно опубликован для клиента!
            </Alert>
          )}

          {error && (
            <Alert title="Ошибка" color="red" mb="md">
              {error}
            </Alert>
          )}

          <Grid gutter="xl">
            {/* Левая колонка - селекторы */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Title order={3}>Выбор плана питания</Title>

                  <Select
                    label="Категория питания"
                    placeholder="Выберите категорию"
                    data={categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))}
                    value={selectedCategoryId}
                    onChange={handleCategoryChange}
                    disabled={loading}
                    searchable
                    nothingFoundMessage="Категории не найдены"
                  />

                  <Select
                    label="Подкатегория"
                    placeholder={selectedCategoryId ? "Выберите подкатегорию" : "Сначала выберите категорию"}
                    data={subcategories.map(sub => ({ value: sub.id.toString(), label: sub.name }))}
                    value={selectedSubcategoryId}
                    onChange={handleSubcategoryChange}
                    disabled={!selectedCategoryId || loading}
                    searchable
                    nothingFoundMessage="Подкатегории не найдены"
                  />

                  <Select
                    label="День питания"
                    placeholder={selectedSubcategoryId ? "Выберите день" : "Сначала выберите подкатегорию"}
                    data={days.map(day => ({ value: day.id.toString(), label: day.name }))}
                    value={selectedDayId}
                    onChange={handleDayChange}
                    disabled={!selectedSubcategoryId || loading}
                    searchable
                    nothingFoundMessage="Дни не найдены"
                  />

                  <Group justify="center" mt="xl">
                    <Button
                      variant="filled"
                      size="lg"
                      onClick={handlePublishPlan}
                      disabled={!selectedPlan || success}
                      loading={loading}
                    >
                      {success ? 'План опубликован' : 'Опубликовать план'}
                    </Button>

                    <Link href={`/admin/client/${clientId}`} passHref>
                      <Button variant="outline" size="lg">
                        Отмена
                      </Button>
                    </Link>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>

            {/* Правая колонка - предпросмотр плана */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Title order={3}>Предварительный просмотр плана</Title>

                  {selectedPlan ? (
                    <Box>
                      <Text size="lg" fw={500} mb="sm">
                        {selectedPlan.day.name}
                      </Text>
                      
                      <Text size="sm" c="dimmed" mb="md">
                        Категория: {selectedPlan.category.name}
                      </Text>
                      
                      <Text size="sm" c="dimmed" mb="md">
                        Подкатегория: {selectedPlan.subcategory.name}
                      </Text>
                      
                      <Text size="sm" mb="md">
                        {selectedPlan.day.description || 'Описание дня питания отсутствует'}
                      </Text>
                      
                      <Alert title="Информация" color="blue" mt="md">
                        После публикации клиент получит доступ к этому плану питания.
                      </Alert>
                    </Box>
                  ) : (
                    <Box ta="center" py="xl">
                      <Text c="dimmed">Выберите день питания для просмотра плана</Text>
                    </Box>
                  )}
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>
    </UserTypeProtectedRoute>
  );
}