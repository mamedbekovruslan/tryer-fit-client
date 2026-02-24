'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Paper,
  Text,
  Stack,
  Card,
  Badge,
  LoadingOverlay,
  Accordion,
  Group,
  Box,
  Divider,
} from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { workoutService, ClientWorkoutProgram, WorkoutDay, Exercise } from '@/services/workoutService';
import { FaDumbbell } from 'react-icons/fa';

export default function WorkoutPage() {
  const { user } = useAuth();
  const [clientWorkoutPrograms, setClientWorkoutPrograms] = useState<ClientWorkoutProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.id) {
      loadWorkoutPrograms();
    }
  }, [user]);

  const loadWorkoutPrograms = async () => {
    try {
      setLoading(true);
      if (user && user.id) {
        // Загружаем активные программы клиента
        const programs = await workoutService.getActiveClientWorkoutPrograms(user.id);
        setClientWorkoutPrograms(programs);
      }
    } catch (error) {
      console.error('Error loading workout programs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <UserTypeProtectedRoute allowedUserTypes={['client']}>
        <Container size="md" py="xl">
          <Paper shadow="md" p="xl" radius="md">
            <Text ta="center">Загрузка...</Text>
          </Paper>
        </Container>
      </UserTypeProtectedRoute>
    );
  }

  return (
    <UserTypeProtectedRoute allowedUserTypes={['client']}>
      <Container size="lg" py="xl">
        <Paper shadow="md" p="xl" radius="md">
          <LoadingOverlay visible={loading} overlayProps={{ radius: 'sm', blur: 2 }} />

          <Group justify="space-between" mb="xl">
            <Title order={1}>Мои тренировки</Title>
            <Badge variant="outline" color="blue">
              Активных программ: {clientWorkoutPrograms.length}
            </Badge>
          </Group>

          {clientWorkoutPrograms.length > 0 ? (
            <Stack gap="xl">
              {clientWorkoutPrograms.map((plan) => (
                <Card key={plan.id} shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <div>
                      <Title order={2}>{plan.workoutProgram.name}</Title>
                      <Text c="dimmed" size="sm">
                        Назначено: {new Date(plan.assignedAt).toLocaleDateString()}
                      </Text>
                    </div>
                    <Badge color="green" variant="light">
                      Активная
                    </Badge>
                  </Group>

                  {plan.workoutProgram.description && (
                    <Paper p="md" withBorder mb="md">
                      <Text size="lg">{plan.workoutProgram.description}</Text>
                    </Paper>
                  )}

                  <WorkoutProgramDetails workoutProgram={plan.workoutProgram} />
                </Card>
              ))}
            </Stack>
          ) : !loading ? (
            <Paper p="xl" radius="md" withBorder ta="center">
              <FaDumbbell size={48} color="#999" />
              <Text size="lg" mt="md">У вас пока нет активной программы тренировок</Text>
              <Text c="dimmed" mt="sm">Обратитесь к вашему тренеру для получения программы</Text>
            </Paper>
          ) : null}
        </Paper>
      </Container>
    </UserTypeProtectedRoute>
  );
}

// Компонент для отображения деталей программы тренировок
function WorkoutProgramDetails({ workoutProgram }: { workoutProgram: any }) {
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [exercisesByDay, setExercisesByDay] = useState<{ [key: number]: Exercise[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgramDetails();
  }, [workoutProgram]);

  const loadProgramDetails = async () => {
    try {
      setLoading(true);

      // Загружаем дни программы
      const days = await workoutService.getWorkoutDaysByProgram(workoutProgram.id);
      setWorkoutDays(days);

      // Загружаем упражнения для каждого дня
      const exercisesData: { [key: number]: Exercise[] } = {};
      for (const day of days) {
        try {
          exercisesData[day.id] = await workoutService.getExercisesByDay(day.id);
        } catch (error) {
          exercisesData[day.id] = [];
        }
      }
      setExercisesByDay(exercisesData);
    } catch (error) {
      console.error('Error loading program details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <Accordion defaultValue="days" variant="contained">
      <Accordion.Item value="days">
        <Accordion.Control>Дни тренировок</Accordion.Control>
        <Accordion.Panel>
          <Stack gap="md">
            {workoutDays.map((day) => (
              <Card key={day.id} shadow="xs" padding="md" radius="sm" withBorder>
                <Group mb="sm">
                  <Badge variant="light" size="lg">День {day.dayOrder}</Badge>
                  <Title order={4}>{day.name}</Title>
                </Group>

                {day.description && (
                  <Text c="dimmed" size="sm" mb="md">{day.description}</Text>
                )}

                {exercisesByDay[day.id] && exercisesByDay[day.id].length > 0 ? (
                  <Stack gap="sm">
                    {exercisesByDay[day.id].map((exercise, index) => (
                      <Card key={exercise.id} padding="sm" radius="sm" withBorder bg="gray.0">
                        <Group justify="space-between">
                          <Group>
                            <Text fw={500}>{exercise.exerciseOrder || index + 1}.</Text>
                            <div>
                              <Text fw={500}>{exercise.name}</Text>
                              {exercise.description && (
                                <Text size="sm" c="dimmed">{exercise.description}</Text>
                              )}
                              <Group gap="xs" mt="xs">
                                {exercise.sets && (
                                  <Badge size="sm" color="blue">{exercise.sets} подходов</Badge>
                                )}
                                {exercise.reps && (
                                  <Badge size="sm" color="green">{exercise.reps} повторов</Badge>
                                )}
                                {exercise.weight && (
                                  <Badge size="sm" color="orange">{exercise.weight}</Badge>
                                )}
                                {exercise.restTime && (
                                  <Badge size="sm" color="gray">
                                    Отдых: {exercise.restTime}
                                  </Badge>
                                )}
                              </Group>
                            </div>
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
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
