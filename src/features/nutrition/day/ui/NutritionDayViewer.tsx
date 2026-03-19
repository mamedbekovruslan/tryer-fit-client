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
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { FiPlus } from 'react-icons/fi';
import { nutritionService, NutritionDay, CreateNutritionDayRequest } from '@/services/nutritionService';
import { useParams, useRouter } from 'next/navigation';

interface NutritionDayFormValues {
  name: string;
  description?: string;
  nutritionCategoryId: number;
}

export default function NutritionDayViewer() {
  const params = useParams();
  const router = useRouter();
  const categoryId = Number(params.categoryId);
  
  const [days, setDays] = useState<NutritionDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [selectedDay, setSelectedDay] = useState<NutritionDay | null>(null);
  const [formData, setFormData] = useState<NutritionDayFormValues>({
    name: '',
    description: '',
    nutritionCategoryId: categoryId
  });

  useEffect(() => {
    if (categoryId) {
      loadDays();
    }
  }, [categoryId]);

  const loadDays = async () => {
    try {
      setLoading(true);
      const data = await nutritionService.getNutritionDaysByCategory(categoryId);
      setDays(data);
    } catch (error) {
      notifications.show({
        title: 'Ошибка загрузки',
        message: 'Не удалось загрузить дни питания',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDay = async () => {
    if (formData.name.trim()) {
      try {
        const newDay = await nutritionService.createNutritionDay(formData);
        setDays([...days, newDay]);
        setFormData({
          name: '',
          description: '',
          nutritionCategoryId: categoryId
        });
        setOpened(false);
        
        notifications.show({
          title: 'Успешно',
          message: 'День питания создан',
          color: 'green',
        });
      } catch (error) {
        notifications.show({
          title: 'Ошибка',
          message: 'Не удалось создать день питания',
          color: 'red',
        });
      }
    }
  };

  const handleDayClick = (day: NutritionDay) => {
    router.push(`/admin/nutrition/${categoryId}/day/${day.id}`);
  };

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <LoadingOverlay visible={loading} overlayProps={{ radius: 'sm', blur: 2 }} />
        
        <Flex justify="space-between" align="center" mb="xl">
          <Title order={1}>Дни питания</Title>
          <Button
            leftSection={<FiPlus size={16} />}
            onClick={() => setOpened(true)}
            size="lg"
          >
            Добавить день
          </Button>
        </Flex>

        {days.length > 0 ? (
          <Grid gutter="xl">
            {days.map(day => (
              <Grid.Col key={day.id} span={{ base: 12, sm: 6, md: 4 }}>
                <div 
                  style={{ cursor: 'pointer', textDecoration: 'none' }}
                  onClick={() => handleDayClick(day)}
                >
                  <Card
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                    style={{ transition: 'transform 0.2s', height: '100%' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Stack gap="sm">
                      <Title order={3}>{day.name}</Title>

                      {day.description && (
                        <Text c="dimmed" size="sm">
                          {day.description}
                        </Text>
                      )}

                      <Group justify="space-between" mt="auto">
                        <Text size="xs" c="dimmed">
                          Создан: {new Date(day.createdAt).toLocaleDateString()}
                        </Text>
                        <Badge variant="light">День</Badge>
                      </Group>
                    </Stack>
                  </Card>
                </div>
              </Grid.Col>
            ))}
          </Grid>
        ) : !loading ? (
          <Paper p="xl" radius="md" withBorder ta="center">
            <Text size="lg">Дни питания отсутствуют</Text>
            <Text c="dimmed" mt="sm">Нажмите "Добавить день", чтобы создать первый день</Text>
          </Paper>
        ) : null}
      </Paper>

      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          setFormData({
            name: '',
            description: '',
            nutritionCategoryId: categoryId
          });
        }}
        title="Добавить новый день питания"
        centered
      >
        <Stack>
          <TextInput
            label="Название дня"
            placeholder="Введите название дня (например: День 1, Понедельник)"
            value={formData.name}
            onChange={(event) => setFormData({...formData, name: event.currentTarget.value})}
            required
          />
          
          <TextInput
            label="Описание дня"
            placeholder="Введите описание дня (необязательно)"
            value={formData.description || ''}
            onChange={(event) => setFormData({...formData, description: event.currentTarget.value})}
          />

          <Group justify="right" mt="md">
            <Button
              variant="outline"
              onClick={() => {
                setOpened(false);
                setFormData({
                  name: '',
                  description: '',
                  nutritionCategoryId: categoryId
                });
              }}
            >
              Отмена
            </Button>
            <Button
              onClick={handleAddDay}
              disabled={!formData.name.trim()}
            >
              Создать
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}