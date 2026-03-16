'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Title,
  Paper,
  Text,
  Button,
  Group,
  Stack,
  Card,
  Grid,
  Badge,
  Modal,
  TextInput,
  Textarea,
  ActionIcon,
  Tooltip,
  LoadingOverlay,
  Tabs,
  Divider,
  Select,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { workoutService, WorkoutCategory, WorkoutProgram } from '@/services/workoutService';
import { useRouter } from 'next/navigation';
import { FaPlus, FaEdit, FaTrash, FaDumbbell, FaUsers, FaList } from 'react-icons/fa';
import { useTrainerWorkoutStore } from '@/stores/trainerWorkoutStore';

export default function TrainerWorkoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const loading = useTrainerWorkoutStore((state) => state.loading);
  const categories = useTrainerWorkoutStore((state) => state.categories);
  const programs = useTrainerWorkoutStore((state) => state.programs);
  const clients = useTrainerWorkoutStore((state) => state.clients);
  const activeTab = useTrainerWorkoutStore((state) => state.activeTab);
  const trainerId = useTrainerWorkoutStore((state) => state.trainerId);
  const setActiveTab = useTrainerWorkoutStore((state) => state.setActiveTab);
  const loadTrainerWorkspace = useTrainerWorkoutStore(
    (state) => state.loadTrainerWorkspace,
  );
  
  // Modal states
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [programModalOpen, setProgramModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  
  // Form states
  const [editingCategory, setEditingCategory] = useState<WorkoutCategory | null>(null);
  const [editingProgram, setEditingProgram] = useState<WorkoutProgram | null>(null);
  const [selectedCategoryForProgram, setSelectedCategoryForProgram] = useState<number | null>(null);
  const [selectedProgramForAssign, setSelectedProgramForAssign] = useState<number | null>(null);
  const [selectedClientForAssign, setSelectedClientForAssign] = useState<number | null>(null);
  
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [programForm, setProgramForm] = useState({ name: '', description: '' });

  const loadData = useCallback(async () => {
    try {
      if (!user || user.user_type !== 'trainer') {
        return;
      }

      await loadTrainerWorkspace(trainerId ?? user.id);
    } catch {
      notifications.show({
        title: 'Ошибка загрузки',
        message: 'Не удалось загрузить данные',
        color: 'red',
      });
    }
  }, [loadTrainerWorkspace, trainerId, user]);

  useEffect(() => {
    if (user && user.id) {
      void loadData();
    }
  }, [activeTab, loadData, user]);

  // Category handlers
  const handleCreateCategory = async () => {
    try {
      await workoutService.createWorkoutCategory(categoryForm);
      notifications.show({
        title: 'Успешно',
        message: 'Категория создана',
        color: 'green',
      });
      setCategoryModalOpen(false);
      setCategoryForm({ name: '', description: '' });
      loadData();
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось создать категорию',
        color: 'red',
      });
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    try {
      await workoutService.updateWorkoutCategory(editingCategory.id, categoryForm);
      notifications.show({
        title: 'Успешно',
        message: 'Категория обновлена',
        color: 'green',
      });
      setCategoryModalOpen(false);
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '' });
      loadData();
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить категорию',
        color: 'red',
      });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Вы уверены? Это удалит все связанные программы.')) return;
    try {
      await workoutService.deleteWorkoutCategory(id);
      notifications.show({
        title: 'Успешно',
        message: 'Категория удалена',
        color: 'green',
      });
      loadData();
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось удалить категорию',
        color: 'red',
      });
    }
  };

  const openEditCategory = (category: WorkoutCategory) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, description: category.description || '' });
    setCategoryModalOpen(true);
  };

  // Program handlers
  const handleCreateProgram = async () => {
    if (!selectedCategoryForProgram) {
      notifications.show({
        title: 'Ошибка',
        message: 'Выберите категорию',
        color: 'red',
      });
      return;
    }
    try {
      await workoutService.createWorkoutProgram({
        ...programForm,
        workoutCategoryId: selectedCategoryForProgram,
      });
      notifications.show({
        title: 'Успешно',
        message: 'Программа создана',
        color: 'green',
      });
      setProgramModalOpen(false);
      setProgramForm({ name: '', description: '' });
      setSelectedCategoryForProgram(null);
      loadData();
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось создать программу',
        color: 'red',
      });
    }
  };

  const handleUpdateProgram = async () => {
    if (!editingProgram) return;
    try {
      await workoutService.updateWorkoutProgram(editingProgram.id, programForm);
      notifications.show({
        title: 'Успешно',
        message: 'Программа обновлена',
        color: 'green',
      });
      setProgramModalOpen(false);
      setEditingProgram(null);
      setProgramForm({ name: '', description: '' });
      loadData();
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить программу',
        color: 'red',
      });
    }
  };

  const handleDeleteProgram = async (id: number) => {
    if (!confirm('Вы уверены? Это удалит все связанные дни и упражнения.')) return;
    try {
      await workoutService.deleteWorkoutProgram(id);
      notifications.show({
        title: 'Успешно',
        message: 'Программа удалена',
        color: 'green',
      });
      loadData();
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось удалить программу',
        color: 'red',
      });
    }
  };

  const openEditProgram = (program: WorkoutProgram) => {
    setEditingProgram(program);
    setProgramForm({ name: program.name, description: program.description || '' });
    setSelectedCategoryForProgram(program.workoutCategoryId ?? null);
    setProgramModalOpen(true);
  };

  // Assign program to client
  const handleAssignProgram = async () => {
    if (!selectedClientForAssign || !selectedProgramForAssign) {
      notifications.show({
        title: 'Ошибка',
        message: 'Выберите клиента и программу',
        color: 'red',
      });
      return;
    }
    try {
      await workoutService.assignWorkoutProgramToClient(selectedClientForAssign, selectedProgramForAssign);
      notifications.show({
        title: 'Успешно',
        message: 'Программа назначена клиенту',
        color: 'green',
      });
      setAssignModalOpen(false);
      setSelectedClientForAssign(null);
      setSelectedProgramForAssign(null);
      await loadData();
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось назначить программу',
        color: 'red',
      });
    }
  };

  const openAssignModalForClient = (clientId: number) => {
    setSelectedClientForAssign(clientId);
    setSelectedProgramForAssign(null);
    setAssignModalOpen(true);
  };

  const getClientLabel = (client: Client) => {
    const fullName = `${client.first_name || ''} ${client.last_name || ''}`.trim();
    return fullName ? `${fullName} (${client.username})` : client.username;
  };

  return (
    <UserTypeProtectedRoute allowedUserTypes={['trainer']}>
      <Container size="xl" py="xl">
        <LoadingOverlay visible={loading} overlayProps={{ radius: 'sm', blur: 2 }} />

        <Paper shadow="md" p="xl" radius="md">
          <Group justify="space-between" mb="xl">
            <Title order={1}>Управление тренировками</Title>
            <Group>
              <Button leftSection={<FaPlus />} onClick={() => {
                setEditingCategory(null);
                setCategoryForm({ name: '', description: '' });
                setCategoryModalOpen(true);
              }}>
                Категория
              </Button>
              <Button leftSection={<FaPlus />} onClick={() => {
                setEditingProgram(null);
                setProgramForm({ name: '', description: '' });
                setSelectedCategoryForProgram(null);
                setProgramModalOpen(true);
              }}>
                Программа
              </Button>
              <Button leftSection={<FaUsers />} onClick={() => {
                setSelectedProgramForAssign(null);
                setSelectedClientForAssign(null);
                setAssignModalOpen(true);
              }}>
                Назначить клиенту
              </Button>
            </Group>
          </Group>

          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="programs" leftSection={<FaDumbbell />}>Программы</Tabs.Tab>
              <Tabs.Tab value="categories" leftSection={<FaList />}>Категории</Tabs.Tab>
              <Tabs.Tab value="clients" leftSection={<FaUsers />}>Клиенты</Tabs.Tab>
            </Tabs.List>

            {/* Programs Tab */}
            <Tabs.Panel value="programs" pt="xs">
              <Grid>
                {programs.map((program) => (
                  <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={program.id}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                      <Group justify="space-between" mb="md">
                        <Title order={4}>{program.name}</Title>
                        <Badge variant="light">{program.workoutCategory?.name}</Badge>
                      </Group>
                      
                      {program.description && (
                        <Text c="dimmed" size="sm" mb="md">{program.description}</Text>
                      )}
                      
                      <Divider mb="md" />
                      
                      <Group justify="space-between">
                        <Button 
                          variant="outline" 
                          size="compact-sm"
                          onClick={() => router.push(`/trainer/workout/programs/${program.id}/days`)}
                        >
                          Дни
                        </Button>
                        <Group gap="xs">
                          <Tooltip label="Редактировать">
                            <ActionIcon variant="subtle" color="blue" onClick={() => openEditProgram(program)}>
                              <FaEdit />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Удалить">
                            <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteProgram(program.id)}>
                              <FaTrash />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Group>
                    </Card>
                  </Grid.Col>
                ))}
                {programs.length === 0 && (
                  <Grid.Col span={12}>
                    <Text ta="center" c="dimmed">Нет программ тренировок</Text>
                  </Grid.Col>
                )}
              </Grid>
            </Tabs.Panel>

            {/* Categories Tab */}
            <Tabs.Panel value="categories" pt="xs">
              <Grid>
                {categories.map((category) => (
                  <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={category.id}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                      <Group justify="space-between" mb="md">
                        <Title order={4}>{category.name}</Title>
                        <Group gap="xs">
                          <Tooltip label="Редактировать">
                            <ActionIcon variant="subtle" color="blue" onClick={() => openEditCategory(category)}>
                              <FaEdit />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Удалить">
                            <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteCategory(category.id)}>
                              <FaTrash />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Group>
                      
                      {category.description && (
                        <Text c="dimmed" size="sm">{category.description}</Text>
                      )}
                      
                      <Button 
                        variant="outline" 
                        fullWidth 
                        mt="md"
                        onClick={() => {
                          setSelectedCategoryForProgram(category.id);
                          setProgramForm({ name: '', description: '' });
                          setProgramModalOpen(true);
                        }}
                      >
                        Создать программу
                      </Button>
                    </Card>
                  </Grid.Col>
                ))}
                {categories.length === 0 && (
                  <Grid.Col span={12}>
                    <Text ta="center" c="dimmed">Нет категорий тренировок</Text>
                  </Grid.Col>
                )}
              </Grid>
            </Tabs.Panel>

            {/* Clients Tab */}
            <Tabs.Panel value="clients" pt="xs">
              <Grid>
                {clients.map((client) => (
                  <Grid.Col span={{ base: 12, md: 6 }} key={client.id}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                      <Stack gap="md">
                        <Group justify="space-between" align="flex-start">
                          <div>
                            <Title order={4}>{getClientLabel(client)}</Title>
                            <Text size="sm" c="dimmed">
                              {client.email}
                            </Text>
                          </div>
                          <Badge variant="light" color="blue">
                            Клиент
                          </Badge>
                        </Group>

                        {client.fitness_goal && (
                          <Text size="sm">
                            Цель: {client.fitness_goal}
                          </Text>
                        )}

                        <Group justify="space-between">
                          <Button
                            variant="outline"
                            onClick={() => router.push(`/admin/client/${client.id}`)}
                          >
                            Открыть профиль
                          </Button>
                          <Button
                            leftSection={<FaUsers />}
                            onClick={() => openAssignModalForClient(client.id)}
                          >
                            Назначить программу
                          </Button>
                        </Group>
                      </Stack>
                    </Card>
                  </Grid.Col>
                ))}

                {clients.length === 0 && (
                  <Grid.Col span={12}>
                    <Paper p="xl" radius="md" withBorder ta="center">
                      <Text size="lg">У тренера пока нет привязанных клиентов</Text>
                      <Text c="dimmed" mt="sm">
                        Добавьте клиента в панели тренера, затем он появится здесь.
                      </Text>
                    </Paper>
                  </Grid.Col>
                )}
              </Grid>
            </Tabs.Panel>
          </Tabs>
        </Paper>

        {/* Category Modal */}
        <Modal
          opened={categoryModalOpen}
          onClose={() => {
            setCategoryModalOpen(false);
            setEditingCategory(null);
            setCategoryForm({ name: '', description: '' });
          }}
          title={editingCategory ? 'Редактировать категорию' : 'Новая категория'}
        >
          <Stack>
            <TextInput
              label="Название"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
            />
            <Textarea
              label="Описание"
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
            />
            <Group justify="flex-end">
              <Button variant="outline" onClick={() => setCategoryModalOpen(false)}>Отмена</Button>
              <Button onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}>
                {editingCategory ? 'Сохранить' : 'Создать'}
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* Program Modal */}
        <Modal
          opened={programModalOpen}
          onClose={() => {
            setProgramModalOpen(false);
            setEditingProgram(null);
            setProgramForm({ name: '', description: '' });
            setSelectedCategoryForProgram(null);
          }}
          title={editingProgram ? 'Редактировать программу' : 'Новая программа'}
        >
          <Stack>
            <Select
              label="Категория"
              placeholder="Выберите категорию"
              data={categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))}
              value={selectedCategoryForProgram?.toString() || ''}
              onChange={(value) => setSelectedCategoryForProgram(value ? parseInt(value) : null)}
              disabled={!!editingProgram}
            />
            <TextInput
              label="Название"
              value={programForm.name}
              onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })}
            />
            <Textarea
              label="Описание"
              value={programForm.description}
              onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
            />
            <Group justify="flex-end">
              <Button variant="outline" onClick={() => setProgramModalOpen(false)}>Отмена</Button>
              <Button onClick={editingProgram ? handleUpdateProgram : handleCreateProgram}>
                {editingProgram ? 'Сохранить' : 'Создать'}
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* Assign Modal */}
        <Modal
          opened={assignModalOpen}
          onClose={() => {
            setAssignModalOpen(false);
            setSelectedClientForAssign(null);
            setSelectedProgramForAssign(null);
          }}
          title="Назначить программу клиенту"
        >
          <Stack>
            <Select
              label="Клиент"
              placeholder="Выберите клиента"
              data={clients.map(client => ({ 
                value: client.id.toString(), 
                label: getClientLabel(client)
              }))}
              value={selectedClientForAssign?.toString() || ''}
              onChange={(value) => setSelectedClientForAssign(value ? parseInt(value) : null)}
            />
            <Select
              label="Программа"
              placeholder="Выберите программу"
              data={programs.map(prog => ({ value: prog.id.toString(), label: prog.name }))}
              value={selectedProgramForAssign?.toString() || ''}
              onChange={(value) => setSelectedProgramForAssign(value ? parseInt(value) : null)}
            />
            <Group justify="flex-end">
              <Button variant="outline" onClick={() => setAssignModalOpen(false)}>Отмена</Button>
              <Button onClick={handleAssignProgram}>Назначить</Button>
            </Group>
          </Stack>
        </Modal>
      </Container>
    </UserTypeProtectedRoute>
  );
}
