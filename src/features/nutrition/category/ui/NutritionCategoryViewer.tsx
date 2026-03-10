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
  ActionIcon,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { nutritionService, NutritionCategory } from '@/services/nutritionService';
import Link from 'next/link';

export default function NutritionCategoryViewer() {
  const [categories, setCategories] = useState<NutritionCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<NutritionCategory | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await nutritionService.getNutritionCategories();
      setCategories(data);
    } catch (error) {
      notifications.show({
        title: 'Ошибка загрузки',
        message: 'Не удалось загрузить категории питания',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      setCreating(true);

      try {
        const newCategory = await nutritionService.createNutritionCategory({
          name: newCategoryName.trim(),
          description: newCategoryDescription.trim() || undefined
        });
        
        setCategories([...categories, newCategory]);
        setNewCategoryName('');
        setNewCategoryDescription('');
        setCreating(false);
        setOpened(false);
        
        notifications.show({
          title: 'Успешно',
          message: 'Категория питания создана',
          color: 'green',
        });
      } catch (error) {
        notifications.show({
          title: 'Ошибка',
          message: 'Не удалось создать категорию питания',
          color: 'red',
        });
        setCreating(false);
      }
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) {
      return;
    }

    setDeletingCategoryId(categoryToDelete.id);

    try {
      await nutritionService.deleteNutritionCategory(categoryToDelete.id);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryToDelete.id)
      );
      notifications.show({
        title: 'Успешно',
        message: 'Категория питания удалена',
        color: 'green',
      });
      setCategoryToDelete(null);
    } catch (error) {
      notifications.show({
        title: 'Ошибка удаления',
        message: 'Не удалось удалить категорию питания',
        color: 'red',
      });
    } finally {
      setDeletingCategoryId(null);
    }
  };

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Flex justify="space-between" align="center" mb="xl">
          <Title order={1}>Категории питания</Title>
          <Button
            leftSection={<FiPlus size={16} />}
            onClick={() => setOpened(true)}
            size="lg"
          >
            Добавить категорию
          </Button>
        </Flex>

        {!loading && categories.length > 0 ? (
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
                            Создана: {new Date(category.createdAt).toLocaleDateString()}
                          </Text>
                          <Group gap="xs">
                            <Badge variant="light">Категория</Badge>
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              aria-label={`Удалить категорию ${category.name}`}
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                setCategoryToDelete(category);
                              }}
                            >
                              <FiTrash2 size={16} />
                            </ActionIcon>
                          </Group>
                        </Group>
                      </Stack>
                    </Card>
                  </a>
                </Link>
              </Grid.Col>
            ))}
          </Grid>
        ) : loading ? (
          <Paper p="xl" radius="md" withBorder ta="center">
            <Text size="lg">Загрузка...</Text>
          </Paper>
        ) : (
          <Paper p="xl" radius="md" withBorder ta="center">
            <Text size="lg">Категории питания отсутствуют</Text>
            <Text c="dimmed" mt="sm">Нажмите "Добавить категорию", чтобы создать первую категорию</Text>
          </Paper>
        )}
      </Paper>

      {/* Модальное окно для добавления новой категории */}
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          setNewCategoryName('');
          setNewCategoryDescription('');
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
          
          <TextInput
            label="Описание категории"
            placeholder="Введите описание категории (необязательно)"
            value={newCategoryDescription}
            onChange={(event) => setNewCategoryDescription(event.currentTarget.value)}
          />

          <Group justify="right" mt="md">
            <Button
              variant="outline"
              onClick={() => {
                setOpened(false);
                setNewCategoryName('');
                setNewCategoryDescription('');
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

      <Modal
        opened={categoryToDelete !== null}
        onClose={() => {
          if (deletingCategoryId === null) {
            setCategoryToDelete(null);
          }
        }}
        title="Удалить категорию"
        centered
      >
        <Stack>
          <Text>
            Удалить категорию{' '}
            <Text span fw={700}>
              {categoryToDelete?.name}
            </Text>
            ?
          </Text>
          <Text size="sm" c="dimmed">
            Действие удалит запись из базы данных.
          </Text>

          <Group justify="right" mt="md">
            <Button
              variant="outline"
              onClick={() => setCategoryToDelete(null)}
              disabled={deletingCategoryId !== null}
            >
              Отмена
            </Button>
            <Button
              color="red"
              onClick={handleDeleteCategory}
              loading={deletingCategoryId !== null}
            >
              Удалить
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
