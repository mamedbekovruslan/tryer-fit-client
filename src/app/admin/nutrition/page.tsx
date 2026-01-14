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
  Modal, 
  TextInput,
  Flex,
  Badge,
  Group
} from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import Link from 'next/link';

// Типы данных
interface NutritionCategory {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export default function NutritionPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<NutritionCategory[]>([
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
  ]);
  
  const [opened, setOpened] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creating, setCreating] = useState(false);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      setCreating(true);
      
      // Имитация API запроса
      setTimeout(() => {
        const newCategory: NutritionCategory = {
          id: categories.length + 1,
          name: newCategoryName.trim(),
          description: `Правила питания для ${newCategoryName.trim()}`,
          created_at: new Date().toISOString().split('T')[0]
        };
        
        setCategories([...categories, newCategory]);
        setNewCategoryName('');
        setCreating(false);
        setOpened(false);
      }, 500);
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
          <Flex justify="space-between" align="center" mb="xl">
            <Title order={1}>Категории питания</Title>
            <Button 
              onClick={() => setOpened(true)} 
              size="lg"
            >
              Добавить категорию
            </Button>
          </Flex>

          {categories.length > 0 ? (
            <Grid gutter="xl">
              {categories.map(category => (
                <Grid.Col key={category.id} span={{ base: 12, sm: 6, md: 4 }}>
                  <Link href={`/admin/nutrition/${category.id}`} passHref legacyBehavior>
                    <a style={{ textDecoration: 'none' }}>
                      <Card 
                        shadow="sm" 
                        padding="lg" 
                        radius="md" 
                        withBorder
                        style={{ cursor: 'pointer', transition: 'transform 0.2s', height: '100%' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <Stack gap="sm">
                          <Title order={3}>{category.name}</Title>
                          
                          {category.description && (
                            <Text c="dimmed" size="sm">
                              {category.description}
                            </Text>
                          )}
                          
                          <Group justify="space-between" mt="auto">
                            <Text size="xs" c="dimmed">
                              Создана: {category.created_at}
                            </Text>
                            <Badge variant="light">Категория</Badge>
                          </Group>
                        </Stack>
                      </Card>
                    </a>
                  </Link>
                </Grid.Col>
              ))}
            </Grid>
          ) : (
            <Paper p="xl" radius="md" withBorder ta="center">
              <Text size="lg">Категории питания отсутствуют</Text>
              <Text c="dimmed" mt="sm">Нажмите "Добавить категорию", чтобы создать первую категорию</Text>
            </Paper>
          )}
        </Paper>
      </Container>

      {/* Модальное окно для добавления новой категории */}
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          setNewCategoryName('');
        }}
        title="Добавить новую категорию питания"
        centered
      >
        <Stack>
          <TextInput
            label="Название категории"
            placeholder="Введите название категории (например: Похудение, Набор массы)"
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.currentTarget.value)}
            required
          />
          
          <Group justify="right" mt="md">
            <Button 
              variant="outline" 
              onClick={() => {
                setOpened(false);
                setNewCategoryName('');
              }}
            >
              Отмена
            </Button>
            <Button 
              onClick={handleAddCategory} 
              loading={creating}
              disabled={!newCategoryName.trim()}
            >
              Создать
            </Button>
          </Group>
        </Stack>
      </Modal>
    </UserTypeProtectedRoute>
  );
}