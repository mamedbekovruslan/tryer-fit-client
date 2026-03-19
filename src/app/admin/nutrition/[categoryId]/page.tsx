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
  Divider,
  LoadingOverlay,
  Modal,
  TextInput,
  Textarea,
  ActionIcon,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { FiPlus, FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { useParams, useRouter } from 'next/navigation';
import { nutritionService, NutritionPlan, CreateNutritionPlanRequest } from '@/services/nutritionService';
import { useForm } from '@mantine/form';

export default function NutritionCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const categoryId = Number(params.categoryId);
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<NutritionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [addPlanModalOpened, setAddPlanModalOpened] = useState(false);
  const [editPlanModalOpened, setEditPlanModalOpened] = useState(false);
  const [editingPlan, setEditingPlan] = useState<NutritionPlan | null>(null);

  const planForm = useForm({
    initialValues: {
      name: '',
      description: '',
      nutritionCategoryId: categoryId,
    },
    validate: {
      name: (value) => (value.trim().length < 2 ? 'Название должно содержать минимум 2 символа' : null),
    },
  });

  useEffect(() => {
    if (categoryId) {
      loadPlans();
    }
  }, [categoryId]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await nutritionService.getNutritionPlansByCategory(categoryId);
      setPlans(data);

      if (data.length > 0) {
        setSelectedPlan(data[0]);
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

  const handlePlanClick = (plan: NutritionPlan) => {
    setSelectedPlan(plan);
  };

  const handleAddPlan = () => {
    planForm.setValues({
      name: '',
      description: '',
      nutritionCategoryId: categoryId,
    });
    setAddPlanModalOpened(true);
  };

  const handleViewDays = (planId: number) => {
    router.push(`/admin/nutrition/plans/${planId}/days`);
  };

  const handleDeletePlan = async (planId: number) => {
    try {
      await nutritionService.deleteNutritionPlan(planId);
      notifications.show({
        title: 'Успешно',
        message: 'План питания удален',
        color: 'green',
      });

      loadPlans();

      if (selectedPlan && selectedPlan.id === planId) {
        setSelectedPlan(null);
      }
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось удалить план питания',
        color: 'red',
      });
    }
  };

  const handleCreatePlan = async (values: CreateNutritionPlanRequest) => {
    try {
      await nutritionService.createNutritionPlan(values);
      notifications.show({
        title: 'Успешно',
        message: 'План питания добавлен',
        color: 'green',
      });

      loadPlans();

      setAddPlanModalOpened(false);
      planForm.reset();
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось добавить план питания',
        color: 'red',
      });
    }
  };

  const handleEditPlan = (plan: NutritionPlan) => {
    setEditingPlan(plan);
    planForm.setValues({
      name: plan.name,
      description: plan.description || '',
      nutritionCategoryId: plan.nutritionCategoryId,
    });
    setEditPlanModalOpened(true);
  };

  const handleUpdatePlan = async (values: CreateNutritionPlanRequest) => {
    if (!editingPlan) return;

    try {
      await nutritionService.updateNutritionPlan(editingPlan.id, values);
      notifications.show({
        title: 'Успешно',
        message: 'План питания обновлен',
        color: 'green',
      });

      loadPlans();

      setEditPlanModalOpened(false);
      setEditingPlan(null);
      planForm.reset();
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить план питания',
        color: 'red',
      });
    }
  };

  const handleDeleteMeal = async (planId: number) => {
    try {
      await nutritionService.deleteNutritionPlan(planId);
      notifications.show({
        title: 'Успешно',
        message: 'План питания удален',
        color: 'green',
      });

      loadPlans();
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось удалить план питания',
        color: 'red',
      });
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
        <Paper shadow="md" p="xl" radius="md">
          <LoadingOverlay visible={loading} overlayProps={{ radius: 'sm', blur: 2 }} />

          <Flex justify="space-between" align="center" mb="xl">
            <Title order={1}>Планы питания</Title>
            <Button
              leftSection={<FiPlus size={16} />}
              onClick={handleAddPlan}
              size="lg"
            >
              Добавить план
            </Button>
          </Flex>

          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={3} mb="md">Планы питания</Title>

                <ScrollArea h={400} offsetScrollbars>
                  <Stack gap="sm">
                    {plans.map(plan => (
                      <Card
                        key={plan.id}
                        shadow="xs"
                        padding="md"
                        radius="sm"
                        withBorder
                        style={{
                          cursor: 'pointer',
                          backgroundColor: selectedPlan?.id === plan.id ? '#f0f7ff' : 'inherit'
                        }}
                        onClick={() => handlePlanClick(plan)}
                      >
                        <Flex justify="space-between" align="center">
                          <div>
                            <Text fw={500}>{plan.name}</Text>
                            <Text size="sm" c="dimmed" mt="xs">
                              Создан: {new Date(plan.createdAt).toLocaleDateString()}
                            </Text>
                          </div>
                          <Group>
                            <ActionIcon
                              variant="subtle"
                              color="blue"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditPlan(plan);
                              }}
                              aria-label="Редактировать план"
                            >
                              <FiEdit2 size={16} />
                            </ActionIcon>
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              onClick={(e) => {
                                e.stopPropagation(); // Останавливаем всплытие события, чтобы не срабатывал onClick карточки
                                handleDeletePlan(plan.id);
                              }}
                              aria-label="Удалить план"
                            >
                              <FiTrash2 size={16} />
                            </ActionIcon>
                          </Group>
                        </Flex>
                      </Card>
                    ))}
                  </Stack>
                </ScrollArea>

                {plans.length === 0 && !loading && (
                  <Text c="dimmed" ta="center" mt="lg">
                    Планы питания отсутствуют
                  </Text>
                )}
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 8 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                {selectedPlan ? (
                  <>
                    <Flex justify="space-between" align="center" mb="md">
                      <Title order={2}>{selectedPlan.name}</Title>
                      <Badge variant="outline">Создан: {new Date(selectedPlan.createdAt).toLocaleDateString()}</Badge>
                    </Flex>

                    <Divider mb="md" />

                    {selectedPlan.description && (
                      <Paper p="md" withBorder mb="md">
                        <Text size="lg">{selectedPlan.description}</Text>
                      </Paper>
                    )}

                    <Card shadow="none" padding="md" radius="sm" withBorder>
                      <Flex justify="space-between" align="center" mb="md">
                        <Title order={4}>Дни питания</Title>
                        <Button
                          leftSection={<FiPlus size={16} />}
                          onClick={() => handleViewDays(selectedPlan.id)}
                          variant="outline"
                        >
                          Управление днями
                        </Button>
                      </Flex>
                      
                      <Text size="sm" c="dimmed">
                        Перейдите на страницу управления днями для добавления/редактирования дней питания в этом плане
                      </Text>
                    </Card>
                  </>
                ) : !loading ? (
                  <Text c="dimmed" ta="center">
                    Выберите план из списка для просмотра деталей
                  </Text>
                ) : null}
              </Card>
            </Grid.Col>
          </Grid>
        </Paper>

        <Modal
          opened={addPlanModalOpened}
          onClose={() => setAddPlanModalOpened(false)}
          title="Добавить план питания"
          size="lg"
        >
          <form onSubmit={planForm.onSubmit(handleCreatePlan)}>
            <Stack>
              <TextInput
                label="Название плана питания"
                placeholder="Например: Интенсивное похудение"
                {...planForm.getInputProps('name')}
              />

              <Textarea
                label="Описание"
                placeholder="Дополнительная информация о плане питания"
                {...planForm.getInputProps('description')}
              />

              <input type="hidden" {...planForm.getInputProps('nutritionCategoryId')} />

              <Group justify="right" mt="md">
                <Button
                  variant="outline"
                  onClick={() => setAddPlanModalOpened(false)}
                  leftSection={<FiX size={16} />}
                >
                  Отмена
                </Button>
                <Button type="submit">Добавить план питания</Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        <Modal
          opened={editPlanModalOpened}
          onClose={() => {
            setEditPlanModalOpened(false);
            setEditingPlan(null);
          }}
          title="Редактировать план питания"
          size="lg"
        >
          <form onSubmit={planForm.onSubmit(handleUpdatePlan)}>
            <Stack>
              <TextInput
                label="Название плана питания"
                placeholder="Например: Интенсивное похудение"
                {...planForm.getInputProps('name')}
              />

              <Textarea
                label="Описание"
                placeholder="Дополнительная информация о плане питания"
                {...planForm.getInputProps('description')}
              />

              <input type="hidden" {...planForm.getInputProps('nutritionCategoryId')} />

              <Group justify="right" mt="md">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditPlanModalOpened(false);
                    setEditingPlan(null);
                  }}
                  leftSection={<FiX size={16} />}
                >
                  Отмена
                </Button>
                <Button type="submit">Сохранить изменения</Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Container>
    </UserTypeProtectedRoute>
  );
}