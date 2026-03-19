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
  Modal,
  TextInput,
  Flex,
  Badge,
  Group,
  LoadingOverlay,
  Accordion,
  Box,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { nutritionService, NutritionPlan, CreateNutritionPlanRequest } from '@/services/nutritionService';

interface NutritionPlanFormValues {
  name: string;
  description?: string;
  nutritionCategoryId: number;
}

export default function NutritionPlanManager() {
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [editingPlan, setEditingPlan] = useState<NutritionPlan | null>(null);
  const [formData, setFormData] = useState<NutritionPlanFormValues>({
    name: '',
    description: '',
    nutritionCategoryId: 1 // по умолчанию
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await nutritionService.getAllNutritionPlans();
      setPlans(data);
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

  const handleAddPlan = async () => {
    if (formData.name.trim()) {
      try {
        const newPlan = await nutritionService.createNutritionPlan(formData);
        setPlans([...plans, newPlan]);
        setFormData({
          name: '',
          description: '',
          nutritionCategoryId: 1
        });
        setOpened(false);
        
        notifications.show({
          title: 'Успешно',
          message: 'План питания создан',
          color: 'green',
        });
      } catch (error) {
        notifications.show({
          title: 'Ошибка',
          message: 'Не удалось создать план питания',
          color: 'red',
        });
      }
    }
  };

  const handleUpdatePlan = async () => {
    if (editingPlan && formData.name.trim()) {
      try {
        const updatedPlan = await nutritionService.updateNutritionPlan(editingPlan.id, formData);
        setPlans(plans.map(p => p.id === editingPlan.id ? updatedPlan : p));
        setFormData({
          name: '',
          description: '',
          nutritionCategoryId: 1
        });
        setEditingPlan(null);
        setOpened(false);
        
        notifications.show({
          title: 'Успешно',
          message: 'План питания обновлен',
          color: 'green',
        });
      } catch (error) {
        notifications.show({
          title: 'Ошибка',
          message: 'Не удалось обновить план питания',
          color: 'red',
        });
      }
    }
  };

  const handleEdit = (plan: NutritionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || '',
      nutritionCategoryId: plan.nutritionCategoryId ?? 1
    });
    setOpened(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот план питания?')) {
      try {
        await nutritionService.deleteNutritionPlan(id);
        setPlans(plans.filter(p => p.id !== id));
        
        notifications.show({
          title: 'Успешно',
          message: 'План питания удален',
          color: 'green',
        });
      } catch (error) {
        notifications.show({
          title: 'Ошибка',
          message: 'Не удалось удалить план питания',
          color: 'red',
        });
      }
    }
  };

  const handleSubmit = () => {
    if (editingPlan) {
      handleUpdatePlan();
    } else {
      handleAddPlan();
    }
  };

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <LoadingOverlay visible={loading} overlayProps={{ radius: 'sm', blur: 2 }} />
        
        <Flex justify="space-between" align="center" mb="xl">
          <Title order={1}>Планы питания</Title>
          <Button
            leftSection={<FiPlus size={16} />}
            onClick={() => {
              setEditingPlan(null);
              setFormData({
                name: '',
                description: '',
                nutritionCategoryId: 1
              });
              setOpened(true);
            }}
            size="lg"
          >
            Добавить план
          </Button>
        </Flex>

        {plans.length > 0 ? (
          <Grid gutter="xl">
            {plans.map(plan => (
              <Grid.Col key={plan.id} span={{ base: 12, sm: 6, md: 4 }}>
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{ height: '100%' }}
                >
                  <Stack gap="sm">
                    <Flex justify="space-between" align="flex-start">
                      <Title order={3}>{plan.name}</Title>
                      <Group>
                        <Button 
                          variant="subtle" 
                          color="blue" 
                          size="compact-sm"
                          onClick={() => handleEdit(plan)}
                        >
                          <FiEdit size={16} />
                        </Button>
                        <Button 
                          variant="subtle" 
                          color="red" 
                          size="compact-sm"
                          onClick={() => handleDelete(plan.id)}
                        >
                          <FiTrash2 size={16} />
                        </Button>
                      </Group>
                    </Flex>
                    
                    {plan.description && (
                      <Text c="dimmed" size="sm">
                        {plan.description}
                      </Text>
                    )}

                    <Group justify="space-between" mt="auto">
                      <Text size="xs" c="dimmed">
                        Категория: {plan.nutritionCategoryId}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Создан: {new Date(plan.createdAt).toLocaleDateString()}
                      </Text>
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        ) : !loading ? (
          <Paper p="xl" radius="md" withBorder ta="center">
            <Text size="lg">Планы питания отсутствуют</Text>
            <Text c="dimmed" mt="sm">Нажмите "Добавить план", чтобы создать первый план</Text>
          </Paper>
        ) : null}
      </Paper>

      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          setEditingPlan(null);
          setFormData({
            name: '',
            description: '',
            nutritionCategoryId: 1
          });
        }}
        title={editingPlan ? 'Редактировать план питания' : 'Добавить новый план питания'}
        centered
        size="lg"
      >
        <Stack>
          <TextInput
            label="Название плана"
            placeholder="Введите название плана (например: 7-дневный план похудения)"
            value={formData.name}
            onChange={(event) => setFormData({...formData, name: event.currentTarget.value})}
            required
          />
          
          <TextInput
            label="Описание плана"
            placeholder="Введите описание плана (необязательно)"
            value={formData.description || ''}
            onChange={(event) => setFormData({...formData, description: event.currentTarget.value})}
          />
          
          <TextInput
            label="ID категории питания"
            placeholder="Введите ID категории питания"
            type="number"
            value={formData.nutritionCategoryId.toString()}
            onChange={(event) => setFormData({
              ...formData, 
              nutritionCategoryId: parseInt(event.currentTarget.value) || 1
            })}
            required
          />

          <Group justify="right" mt="md">
            <Button
              variant="outline"
              onClick={() => {
                setOpened(false);
                setEditingPlan(null);
                setFormData({
                  name: '',
                  description: '',
                  nutritionCategoryId: 1
                });
              }}
            >
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.name.trim()}
            >
              {editingPlan ? 'Обновить' : 'Создать'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
