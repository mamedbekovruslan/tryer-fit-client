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
import { nutritionService, NutritionPlan, NutritionCategory } from '@/services/nutritionService';

export default function AddNutritionToClientPage() {
  const { id: clientId } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  // Состояния для данных
  const [nutritionCategories, setNutritionCategories] = useState<NutritionCategory[]>([]);
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // Состояния для загрузки и ошибок
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);

  // Загрузка категорий питания при монтировании компонента
  useEffect(() => {
    if (user) {
      loadNutritionCategories();
    }
  }, [user]);

  const loadNutritionCategories = async () => {
    try {
      setLoadingCategories(true);
      // Загружаем все категории питания
      const categories = await nutritionService.getNutritionCategories();
      setNutritionCategories(categories);
    } catch (err) {
      setError('Ошибка загрузки категорий питания: ' + (err as Error).message);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadNutritionPlansByCategory = async (categoryId: number) => {
    try {
      setLoadingPlans(true);
      // Загружаем планы питания по выбранной категории
      const plans = await nutritionService.getNutritionPlansByCategory(categoryId);
      setNutritionPlans(plans);
      setSelectedPlanId(null); // Сбрасываем выбранный план при смене категории
    } catch (err) {
      setError('Ошибка загрузки планов питания: ' + (err as Error).message);
    } finally {
      setLoadingPlans(false);
    }
  };

  // Обработка выбора категории
  const handleCategoryChange = (value: string | null) => {
    setSelectedCategoryId(value);
    if (value) {
      loadNutritionPlansByCategory(Number(value));
    } else {
      setNutritionPlans([]);
      setSelectedPlanId(null);
    }
  };

  // Обработка выбора плана
  const handlePlanChange = (value: string | null) => {
    setSelectedPlanId(value);
  };

  // Обработка публикации плана
  const handlePublishPlan = async () => {
    if (!selectedPlanId) {
      setError('Выберите план питания перед публикацией');
      return;
    }

    try {
      setLoading(true);

      // Привязываем план питания к клиенту
      await nutritionService.assignNutritionPlanToClient(Number(clientId), Number(selectedPlanId));

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
        <LoadingOverlay visible={loadingCategories || loadingPlans} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

        <Paper shadow="md" p="xl" radius="md">
          <Title order={1} ta="center" mb="xl">Добавить план питания клиенту #{clientId}</Title>

          {success && (
            <Alert title="Успех!" color="green" mb="md">
              План питания успешно привязан к клиенту!
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
                    data={nutritionCategories.map(category => ({ value: category.id.toString(), label: category.name }))}
                    value={selectedCategoryId}
                    onChange={handleCategoryChange}
                    disabled={loading}
                    searchable
                    nothingFoundMessage="Категории питания не найдены"
                  />

                  <Select
                    label="План питания"
                    placeholder="Выберите план питания"
                    data={nutritionPlans.map(plan => ({ value: plan.id.toString(), label: plan.name }))}
                    value={selectedPlanId}
                    onChange={handlePlanChange}
                    disabled={loading || !selectedCategoryId}
                    searchable
                    nothingFoundMessage="Планы питания не найдены"
                  />

                  <Group justify="center" mt="xl">
                    <Button
                      variant="filled"
                      size="lg"
                      onClick={handlePublishPlan}
                      disabled={!selectedPlanId || success}
                      loading={loading}
                    >
                      {success ? 'План привязан' : 'Привязать план'}
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

                  {selectedPlanId ? (
                    <Box>
                      {(() => {
                        const selectedPlan = nutritionPlans.find(plan => plan.id.toString() === selectedPlanId);
                        return selectedPlan ? (
                          <div>
                            <Text size="lg" fw={500} mb="sm">
                              {selectedPlan.name}
                            </Text>

                            <Text size="sm" c="dimmed" mb="md">
                              Категория: {selectedPlan.nutritionCategory?.name || 'Категория не указана'}
                            </Text>

                            <Text size="sm" mb="md">
                              {selectedPlan.description || 'Описание плана отсутствует'}
                            </Text>

                            <Alert title="Информация" color="blue" mt="md">
                              После привязки клиент получит доступ к этому плану питания.
                            </Alert>
                          </div>
                        ) : (
                          <Box ta="center" py="xl">
                            <Text c="dimmed">Выберите план питания для просмотра</Text>
                          </Box>
                        );
                      })()}
                    </Box>
                  ) : (
                    <Box ta="center" py="xl">
                      <Text c="dimmed">
                        {selectedCategoryId
                          ? 'Выберите план питания из категории'
                          : 'Выберите категорию для просмотра планов'}
                      </Text>
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