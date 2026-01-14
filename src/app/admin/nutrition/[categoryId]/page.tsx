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
  Accordion,
  ActionIcon,
  Divider
} from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { useParams } from 'next/navigation';
import { FiPlus, FiTrash, FiEdit } from 'react-icons/fi';

// Типы данных
interface NutritionCategory {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

interface NutritionRule {
  id: number;
  category_id: number;
  title: string;
  content: string;
  created_at: string;
}

export default function NutritionCategoryPage() {
  const { categoryId } = useParams();
  const { user } = useAuth();
  const [category, setCategory] = useState<NutritionCategory | null>(null);
  const [rules, setRules] = useState<NutritionRule[]>([]);
  const [opened, setOpened] = useState(false);
  const [newRule, setNewRule] = useState({ title: '', content: '' });
  const [editingRule, setEditingRule] = useState<NutritionRule | null>(null);
  const [creating, setCreating] = useState(false);

  // Моковые данные для демонстрации
  const mockCategories: NutritionCategory[] = [
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
  ];

  const mockRules: NutritionRule[] = [
    {
      id: 1,
      category_id: Number(categoryId),
      title: 'Контроль калорийности',
      content: 'Для похудения необходимо создать дефицит калорий. Рассчитайте свою норму и потребляйте на 300-500 ккал меньше.',
      created_at: '2024-11-16'
    },
    {
      id: 2,
      category_id: Number(categoryId),
      title: 'Белки',
      content: 'Потребляйте 1.6-2.2 г белка на кг веса тела для сохранения мышечной массы во время похудения.',
      created_at: '2024-11-17'
    },
    {
      id: 3,
      category_id: Number(categoryId),
      title: 'Углеводы',
      content: 'Предпочитайте сложные углеводы: овсянка, бурый рис, овощи. Исключите простые сахара.',
      created_at: '2024-11-18'
    }
  ];

  useEffect(() => {
    // Загружаем данные категории
    const loadCategoryData = async () => {
      const foundCategory = mockCategories.find(cat => cat.id === Number(categoryId));
      setCategory(foundCategory || null);
      setRules(mockRules);
    };

    loadCategoryData();
  }, [categoryId]);

  const handleAddRule = () => {
    if (newRule.title.trim() && newRule.content.trim()) {
      setCreating(true);
      
      // Имитация API запроса
      setTimeout(() => {
        const newRuleObj: NutritionRule = {
          id: rules.length + 1,
          category_id: Number(categoryId),
          title: newRule.title.trim(),
          content: newRule.content.trim(),
          created_at: new Date().toISOString().split('T')[0]
        };
        
        setRules([...rules, newRuleObj]);
        setNewRule({ title: '', content: '' });
        setCreating(false);
        setOpened(false);
      }, 500);
    }
  };

  const handleUpdateRule = () => {
    if (editingRule && editingRule.title.trim() && editingRule.content.trim()) {
      setCreating(true);
      
      // Имитация API запроса
      setTimeout(() => {
        const updatedRules = rules.map(rule => 
          rule.id === editingRule.id ? editingRule : rule
        );
        
        setRules(updatedRules);
        setEditingRule(null);
        setCreating(false);
        setOpened(false);
      }, 500);
    }
  };

  const handleDeleteRule = (ruleId: number) => {
    // Имитация API запроса
    setTimeout(() => {
      const updatedRules = rules.filter(rule => rule.id !== ruleId);
      setRules(updatedRules);
    }, 300);
  };

  const startEditingRule = (rule: NutritionRule) => {
    setEditingRule(rule);
    setOpened(true);
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

  if (!category) {
    return (
      <UserTypeProtectedRoute allowedUserTypes={['trainer']}>
        <Container size="md" py="xl">
          <Paper shadow="md" p="xl" radius="md">
            <Text ta="center">Категория не найдена</Text>
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
            <div>
              <Title order={1}>{category.name}</Title>
              {category.description && (
                <Text c="dimmed" mt="xs">{category.description}</Text>
              )}
            </div>
            <Button
              onClick={() => {
                setEditingRule(null);
                setNewRule({ title: '', content: '' });
                setOpened(true);
              }}
              leftSection={<FiPlus size={16} />}
              size="lg"
            >
              Добавить правило
            </Button>
          </Flex>

          {rules.length > 0 ? (
            <Accordion chevronPosition="right" variant="contained">
              {rules.map(rule => (
                <Accordion.Item key={rule.id} value={rule.title}>
                  <Accordion.Control>
                    <Flex justify="space-between" align="center">
                      <Text fw={500}>{rule.title}</Text>
                      <Group>
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditingRule(rule);
                          }}
                        >
                          <FiEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRule(rule.id);
                          }}
                        >
                          <FiTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Flex>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text>{rule.content}</Text>
                    <Divider mt="sm" />
                    <Text size="xs" c="dimmed" ta="right" mt="sm">
                      Добавлено: {rule.created_at}
                    </Text>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          ) : (
            <Paper p="xl" radius="md" withBorder ta="center">
              <Text size="lg">Правила питания отсутствуют</Text>
              <Text c="dimmed" mt="sm">Нажмите "Добавить правило", чтобы создать первое правило</Text>
            </Paper>
          )}
        </Paper>
      </Container>

      {/* Модальное окно для добавления/редактирования правила */}
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          setNewRule({ title: '', content: '' });
          setEditingRule(null);
        }}
        title={editingRule ? "Редактировать правило" : "Добавить новое правило"}
        size="lg"
        centered
      >
        <Stack>
          <TextInput
            label="Заголовок правила"
            placeholder="Введите заголовок правила"
            value={editingRule ? editingRule.title : newRule.title}
            onChange={(event) => {
              if (editingRule) {
                setEditingRule({ ...editingRule, title: event.currentTarget.value });
              } else {
                setNewRule({ ...newRule, title: event.currentTarget.value });
              }
            }}
            required
          />
          
          <TextInput
            label="Содержание правила"
            placeholder="Введите подробное описание правила питания"
            value={editingRule ? editingRule.content : newRule.content}
            onChange={(event) => {
              if (editingRule) {
                setEditingRule({ ...editingRule, content: event.currentTarget.value });
              } else {
                setNewRule({ ...newRule, content: event.currentTarget.value });
              }
            }}
            multiline
            rows={4}
            required
          />
          
          <Group justify="right" mt="md">
            <Button 
              variant="outline" 
              onClick={() => {
                setOpened(false);
                setNewRule({ title: '', content: '' });
                setEditingRule(null);
              }}
            >
              Отмена
            </Button>
            <Button 
              onClick={editingRule ? handleUpdateRule : handleAddRule} 
              loading={creating}
              disabled={
                !(editingRule 
                  ? editingRule.title.trim() && editingRule.content.trim()
                  : newRule.title.trim() && newRule.content.trim())
              }
            >
              {editingRule ? "Сохранить изменения" : "Создать правило"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </UserTypeProtectedRoute>
  );
}