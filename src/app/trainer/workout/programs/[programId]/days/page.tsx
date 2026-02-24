'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Paper,
  Text,
  Button,
  Group,
  Stack,
  Card,
  Modal,
  TextInput,
  Textarea,
  ActionIcon,
  Tooltip,
  LoadingOverlay,
  NumberInput,
  Box,
  Divider,
  Badge,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { workoutService, WorkoutDay, Exercise, WorkoutProgram } from '@/services/workoutService';
import { useRouter, useParams } from 'next/navigation';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaDumbbell } from 'react-icons/fa';

export default function WorkoutProgramDaysPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const programId = parseInt(params.programId as string);
  
  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState<WorkoutProgram | null>(null);
  const [days, setDays] = useState<WorkoutDay[]>([]);
  const [exercisesByDay, setExercisesByDay] = useState<{ [key: number]: Exercise[] }>({});
  
  // Modal states
  const [dayModalOpen, setDayModalOpen] = useState(false);
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<WorkoutDay | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [selectedDayForExercise, setSelectedDayForExercise] = useState<number | null>(null);
  
  const [dayForm, setDayForm] = useState({ name: '', description: '', dayOrder: 0 });
  const [exerciseForm, setExerciseForm] = useState({
    name: '',
    description: '',
    sets: undefined as number | undefined,
    reps: '',
    weight: '',
    restTime: '',
    exerciseOrder: 0,
  });

  useEffect(() => {
    if (user && user.id) {
      loadData();
    }
  }, [user, programId]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Загружаем программу
      try {
        const prog = await workoutService.getWorkoutProgramById(programId);
        setProgram(prog);
      } catch (e) {
        notifications.show({
          title: 'Ошибка',
          message: 'Программа не найдена',
          color: 'red',
        });
        router.push('/trainer/workout');
        return;
      }
      
      // Загружаем дни
      const daysData = await workoutService.getWorkoutDaysByProgram(programId);
      setDays(daysData);
      
      // Загружаем упражнения для каждого дня
      const exercisesData: { [key: number]: Exercise[] } = {};
      for (const day of daysData) {
        try {
          exercisesData[day.id] = await workoutService.getExercisesByDay(day.id);
        } catch (e) {
          exercisesData[day.id] = [];
        }
      }
      setExercisesByDay(exercisesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Day handlers
  const handleCreateDay = async () => {
    try {
      await workoutService.createWorkoutDay({
        ...dayForm,
        workoutProgramId: programId,
      });
      notifications.show({
        title: 'Успешно',
        message: 'День тренировки создан',
        color: 'green',
      });
      setDayModalOpen(false);
      setDayForm({ name: '', description: '', dayOrder: 0 });
      loadData();
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось создать день тренировки',
        color: 'red',
      });
    }
  };

  const handleUpdateDay = async () => {
    if (!editingDay) return;
    try {
      await workoutService.updateWorkoutDay(editingDay.id, dayForm);
      notifications.show({
        title: 'Успешно',
        message: 'День тренировки обновлен',
        color: 'green',
      });
      setDayModalOpen(false);
      setEditingDay(null);
      setDayForm({ name: '', description: '', dayOrder: 0 });
      loadData();
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить день тренировки',
        color: 'red',
      });
    }
  };

  const handleDeleteDay = async (id: number) => {
    if (!confirm('Вы уверены? Это удалит все упражнения этого дня.')) return;
    try {
      await workoutService.deleteWorkoutDay(id);
      notifications.show({
        title: 'Успешно',
        message: 'День тренировки удален',
        color: 'green',
      });
      loadData();
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось удалить день тренировки',
        color: 'red',
      });
    }
  };

  const openEditDay = (day: WorkoutDay) => {
    setEditingDay(day);
    setDayForm({ 
      name: day.name, 
      description: day.description || '', 
      dayOrder: day.dayOrder 
    });
    setDayModalOpen(true);
  };

  // Exercise handlers
  const handleCreateExercise = async () => {
    if (!selectedDayForExercise) {
      notifications.show({
        title: 'Ошибка',
        message: 'Выберите день тренировки',
        color: 'red',
      });
      return;
    }
    try {
      await workoutService.createExercise({
        ...exerciseForm,
        workoutDayId: selectedDayForExercise,
      });
      notifications.show({
        title: 'Успешно',
        message: 'Упражнение создано',
        color: 'green',
      });
      setExerciseModalOpen(false);
      setExerciseForm({
        name: '',
        description: '',
        sets: undefined,
        reps: '',
        weight: '',
        restTime: '',
        exerciseOrder: 0,
      });
      setSelectedDayForExercise(null);
      loadData();
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось создать упражнение',
        color: 'red',
      });
    }
  };

  const handleUpdateExercise = async () => {
    if (!editingExercise) return;
    try {
      await workoutService.updateExercise(editingExercise.id, exerciseForm);
      notifications.show({
        title: 'Успешно',
        message: 'Упражнение обновлено',
        color: 'green',
      });
      setExerciseModalOpen(false);
      setEditingExercise(null);
      setExerciseForm({
        name: '',
        description: '',
        sets: undefined,
        reps: '',
        weight: '',
        restTime: '',
        exerciseOrder: 0,
      });
      loadData();
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить упражнение',
        color: 'red',
      });
    }
  };

  const handleDeleteExercise = async (id: number) => {
    try {
      await workoutService.deleteExercise(id);
      notifications.show({
        title: 'Успешно',
        message: 'Упражнение удалено',
        color: 'green',
      });
      loadData();
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось удалить упражнение',
        color: 'red',
      });
    }
  };

  const openEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setExerciseForm({
      name: exercise.name,
      description: exercise.description || '',
      sets: exercise.sets,
      reps: exercise.reps || '',
      weight: exercise.weight || '',
      restTime: exercise.restTime || '',
      exerciseOrder: exercise.exerciseOrder,
    });
    setExerciseModalOpen(true);
  };

  if (!program) {
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
      <Container size="xl" py="xl">
        <LoadingOverlay visible={loading} overlayProps={{ radius: 'sm', blur: 2 }} />

        <Paper shadow="md" p="xl" radius="md">
          <Group mb="xl">
            <ActionIcon variant="subtle" onClick={() => router.push('/trainer/workout')}>
              <FaArrowLeft />
            </ActionIcon>
            <div>
              <Title order={2}>{program.name}</Title>
              {program.description && <Text c="dimmed">{program.description}</Text>}
            </div>
            <Badge ml="auto" variant="light">{program.workoutCategory?.name}</Badge>
          </Group>

          <Group justify="space-between" mb="lg">
            <Title order={4}>Дни тренировки</Title>
            <Button 
              leftSection={<FaPlus />} 
              onClick={() => {
                setEditingDay(null);
                setDayForm({ name: '', description: '', dayOrder: days.length + 1 });
                setDayModalOpen(true);
              }}
            >
              Добавить день
            </Button>
          </Group>

          <Stack gap="lg">
            {days.map((day, index) => (
              <Card key={day.id} shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Group>
                    <Badge variant="light" size="lg">День {day.dayOrder || index + 1}</Badge>
                    <Title order={5}>{day.name}</Title>
                  </Group>
                  <Group gap="xs">
                    <Button 
                      variant="outline" 
                      size="compact-sm"
                      leftSection={<FaDumbbell />}
                      onClick={() => {
                        setSelectedDayForExercise(day.id);
                        setExerciseForm({
                          name: '',
                          description: '',
                          sets: undefined,
                          reps: '',
                          weight: '',
                          restTime: '',
                          exerciseOrder: 0,
                        });
                        setExerciseModalOpen(true);
                      }}
                    >
                      Упражнение
                    </Button>
                    <Tooltip label="Редактировать">
                      <ActionIcon variant="subtle" color="blue" onClick={() => openEditDay(day)}>
                        <FaEdit />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Удалить">
                      <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteDay(day.id)}>
                        <FaTrash />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>

                {day.description && (
                  <Text c="dimmed" size="sm" mb="md">{day.description}</Text>
                )}

                <Divider mb="md" />

                {exercisesByDay[day.id] && exercisesByDay[day.id].length > 0 ? (
                  <Stack gap="sm">
                    {exercisesByDay[day.id].map((exercise, exIndex) => (
                      <Card key={exercise.id} padding="sm" radius="sm" withBorder bg="gray.0">
                        <Group justify="space-between">
                          <Group>
                            <Text fw={500}>{exercise.exerciseOrder || exIndex + 1}.</Text>
                            <div>
                              <Text fw={500}>{exercise.name}</Text>
                              {exercise.description && (
                                <Text size="sm" c="dimmed">{exercise.description}</Text>
                              )}
                              <Group gap="xs" mt="xs">
                                {exercise.sets && <Badge size="sm">{exercise.sets} подходов</Badge>}
                                {exercise.reps && <Badge size="sm">{exercise.reps} повторов</Badge>}
                                {exercise.weight && <Badge size="sm">{exercise.weight}</Badge>}
                                {exercise.restTime && <Badge size="sm" color="gray">Отдых: {exercise.restTime}</Badge>}
                              </Group>
                            </div>
                          </Group>
                          <Group gap="xs">
                            <Tooltip label="Редактировать">
                              <ActionIcon variant="subtle" color="blue" onClick={() => openEditExercise(exercise)}>
                                <FaEdit />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Удалить">
                              <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteExercise(exercise.id)}>
                                <FaTrash />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Group>
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <Text c="dimmed" size="sm">Нет упражнений</Text>
                )}
              </Card>
            ))}
            {days.length === 0 && (
              <Text ta="center" c="dimmed">Дни тренировки не добавлены</Text>
            )}
          </Stack>
        </Paper>

        {/* Day Modal */}
        <Modal
          opened={dayModalOpen}
          onClose={() => {
            setDayModalOpen(false);
            setEditingDay(null);
            setDayForm({ name: '', description: '', dayOrder: 0 });
          }}
          title={editingDay ? 'Редактировать день' : 'Новый день тренировки'}
        >
          <Stack>
            <TextInput
              label="Название"
              value={dayForm.name}
              onChange={(e) => setDayForm({ ...dayForm, name: e.target.value })}
            />
            <Textarea
              label="Описание"
              value={dayForm.description}
              onChange={(e) => setDayForm({ ...dayForm, description: e.target.value })}
            />
            <NumberInput
              label="Порядковый номер"
              value={dayForm.dayOrder}
              onChange={(val) => setDayForm({ ...dayForm, dayOrder: val as number })}
              min={1}
            />
            <Group justify="flex-end">
              <Button variant="outline" onClick={() => setDayModalOpen(false)}>Отмена</Button>
              <Button onClick={editingDay ? handleUpdateDay : handleCreateDay}>
                {editingDay ? 'Сохранить' : 'Создать'}
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* Exercise Modal */}
        <Modal
          opened={exerciseModalOpen}
          onClose={() => {
            setExerciseModalOpen(false);
            setEditingExercise(null);
            setExerciseForm({
              name: '',
              description: '',
              sets: undefined,
              reps: '',
              weight: '',
              restTime: '',
              exerciseOrder: 0,
            });
            setSelectedDayForExercise(null);
          }}
          title={editingExercise ? 'Редактировать упражнение' : 'Новое упражнение'}
        >
          <Stack>
            <TextInput
              label="Название упражнения"
              value={exerciseForm.name}
              onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
            />
            <Textarea
              label="Описание"
              value={exerciseForm.description}
              onChange={(e) => setExerciseForm({ ...exerciseForm, description: e.target.value })}
            />
            <Group grow>
              <NumberInput
                label="Подходы"
                value={exerciseForm.sets}
                onChange={(val) => setExerciseForm({ ...exerciseForm, sets: val as number })}
                min={1}
              />
              <TextInput
                label="Повторения"
                placeholder="например: 10-12"
                value={exerciseForm.reps}
                onChange={(e) => setExerciseForm({ ...exerciseForm, reps: e.target.value })}
              />
            </Group>
            <Group grow>
              <TextInput
                label="Вес"
                placeholder="например: 50 кг"
                value={exerciseForm.weight}
                onChange={(e) => setExerciseForm({ ...exerciseForm, weight: e.target.value })}
              />
              <TextInput
                label="Отдых"
                placeholder="например: 60 сек"
                value={exerciseForm.restTime}
                onChange={(e) => setExerciseForm({ ...exerciseForm, restTime: e.target.value })}
              />
            </Group>
            <NumberInput
              label="Порядковый номер"
              value={exerciseForm.exerciseOrder}
              onChange={(val) => setExerciseForm({ ...exerciseForm, exerciseOrder: val as number })}
              min={1}
            />
            <Group justify="flex-end">
              <Button variant="outline" onClick={() => setExerciseModalOpen(false)}>Отмена</Button>
              <Button onClick={editingExercise ? handleUpdateExercise : handleCreateExercise}>
                {editingExercise ? 'Сохранить' : 'Создать'}
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Container>
    </UserTypeProtectedRoute>
  );
}
