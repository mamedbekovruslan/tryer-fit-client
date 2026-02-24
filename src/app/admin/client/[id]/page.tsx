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
  Select,
  Checkbox,
  Pagination,
  Modal,
  TextInput,
  Box,
  Group,
  LoadingOverlay
} from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { clientService, Client } from '@/services/clientService';

// Типы данных
interface Report {
  id: number;
  client_id: number;
  date: string;
  photo_url?: string;
  comment?: string;
  // другие поля отчета
}

interface Comment {
  id: number;
  report_id: number;
  trainer_id: number;
  comment: string;
  created_at: string;
  trainer_name: string;
}

interface ProgressData {
  date: string;
  weight?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
}

export default function ClientProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year' | 'custom'>('month');
  const [selectedParams, setSelectedParams] = useState<string[]>(['weight']);
  const [currentPage, setCurrentPage] = useState(1);
  const [commentText, setCommentText] = useState('');
  const [reportIdForComment, setReportIdForComment] = useState<number | null>(null);
  const [addCommentModalOpen, setAddCommentModalOpen] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Загружаем данные клиента
    const loadClientData = async () => {
      try {
        setLoading(true);
        // Загружаем информацию о клиенте из базы данных
        const clientData = await clientService.getClientById(Number(id));
        setClient(clientData);

        // Временно используем моковые данные для отчетов и прогресса
        // В реальной реализации эти данные будут получаться из соответствующих сервисов
        const mockReports: Report[] = [
          {
            id: 1,
            client_id: Number(id),
            date: '2024-12-01',
            photo_url: 'https://placehold.co/300x300?text=Фото+отчета',
            comment: 'Хороший прогресс!'
          },
          {
            id: 2,
            client_id: Number(id),
            date: '2024-12-15',
            photo_url: 'https://placehold.co/300x300?text=Фото+отчета',
            comment: 'Продолжайте в том же духе'
          },
          {
            id: 3,
            client_id: Number(id),
            date: '2025-01-01',
            photo_url: 'https://placehold.co/300x300?text=Фото+отчета',
            comment: 'Отличные результаты!'
          }
        ];

        const mockComments: Comment[] = [
          {
            id: 1,
            report_id: 1,
            trainer_id: 1,
            comment: 'Отличный старт! Продолжайте в том же духе.',
            created_at: '2024-12-02T10:30:00Z',
            trainer_name: 'Алексей Петров'
          },
          {
            id: 2,
            report_id: 1,
            trainer_id: 1,
            comment: 'Обратите внимание на питание.',
            created_at: '2024-12-03T14:15:00Z',
            trainer_name: 'Алексей Петров'
          },
          {
            id: 3,
            report_id: 2,
            trainer_id: 1,
            comment: 'Прогресс заметен!',
            created_at: '2024-12-16T09:45:00Z',
            trainer_name: 'Алексей Петров'
          },
          {
            id: 4,
            report_id: 2,
            trainer_id: 1,
            comment: 'Увеличьте нагрузку на ноги.',
            created_at: '2024-12-17T11:20:00Z',
            trainer_name: 'Алексей Петров'
          },
          {
            id: 5,
            report_id: 3,
            trainer_id: 1,
            comment: 'Отличные результаты!',
            created_at: '2025-01-02T16:30:00Z',
            trainer_name: 'Алексей Петров'
          },
          {
            id: 6,
            report_id: 3,
            trainer_id: 1,
            comment: 'Продолжайте работать над питанием.',
            created_at: '2025-01-03T12:10:00Z',
            trainer_name: 'Алексей Петров'
          }
        ];

        const mockProgressData: ProgressData[] = [
          { date: '2024-11-01', weight: 85, measurements: { chest: 100, waist: 90, hips: 105 } },
          { date: '2024-12-01', weight: 82, measurements: { chest: 98, waist: 88, hips: 103 } },
          { date: '2025-01-01', weight: 79, measurements: { chest: 96, waist: 86, hips: 101 } }
        ];

        setReports(mockReports);
        setComments(mockComments);
        setProgressData(mockProgressData);
      } catch (err) {
        setError('Ошибка загрузки данных клиента: ' + (err as Error).message);
        console.error('Error loading client data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadClientData();
    }
  }, [id]);

  const handleAddComment = () => {
    if (commentText.trim() && reportIdForComment) {
      // В реальной реализации здесь будет вызов API
      const newComment: Comment = {
        id: comments.length + 1,
        report_id: reportIdForComment,
        trainer_id: 1,
        comment: commentText,
        created_at: new Date().toISOString(),
        trainer_name: 'Алексей Петров'
      };

      setComments([...comments, newComment]);
      setCommentText('');
      setAddCommentModalOpen(false);
      setReportIdForComment(null);
    }
  };

  const filteredComments = comments.filter(comment => comment.report_id === reports[0]?.id); // Показываем комментарии к последнему отчету
  const commentsPerPage = 5;
  const totalPages = Math.ceil(filteredComments.length / commentsPerPage);
  const paginatedComments = filteredComments.slice(
    (currentPage - 1) * commentsPerPage,
    currentPage * commentsPerPage
  );

  const availableParams = [
    { value: 'weight', label: 'Вес' },
    { value: 'chest', label: 'Грудь' },
    { value: 'waist', label: 'Талия' },
    { value: 'hips', label: 'Бедра' },
    { value: 'arms', label: 'Руки' },
    { value: 'thighs', label: 'Бедра' }
  ];

  const filteredProgressData = progressData;

  if (loading) {
    return (
      <UserTypeProtectedRoute allowedUserTypes={['trainer']}>
        <Container size="lg" py="xl">
          <Paper shadow="md" p="xl" radius="md">
            <LoadingOverlay visible={true} overlayProps={{ radius: "sm", blur: 2 }} />
            <Text ta="center">Загрузка данных клиента...</Text>
          </Paper>
        </Container>
      </UserTypeProtectedRoute>
    );
  }

  if (!user || !client) {
    return (
      <UserTypeProtectedRoute allowedUserTypes={['trainer']}>
        <Container size="lg" py="xl">
          <Paper shadow="md" p="xl" radius="md">
            <Text ta="center">Не удалось загрузить данные клиента</Text>
          </Paper>
        </Container>
      </UserTypeProtectedRoute>
    );
  }

  return (
    <UserTypeProtectedRoute allowedUserTypes={['trainer']}>
      <Container size="lg" py="xl">
        <Paper shadow="md" p="xl" radius="md">
          <Title order={1} ta="center" mb="xl">Профиль клиента: {client.first_name} {client.last_name}</Title>

          {error && (
            <Text c="red" mb="md">{error}</Text>
          )}

          <Grid gutter="xl">
            {/* Информация о клиенте */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Title order={3} ta="center">Информация о клиенте</Title>

                  <div>
                    <Text size="sm" c="dimmed">Имя пользователя</Text>
                    <Text fw={500}>{client.username}</Text>
                  </div>

                  <div>
                    <Text size="sm" c="dimmed">Email</Text>
                    <Text fw={500}>{client.email}</Text>
                  </div>

                  <div>
                    <Text size="sm" c="dimmed">Имя</Text>
                    <Text fw={500}>{client.first_name || 'Не указано'}</Text>
                  </div>

                  <div>
                    <Text size="sm" c="dimmed">Фамилия</Text>
                    <Text fw={500}>{client.last_name || 'Не указано'}</Text>
                  </div>

                  <div>
                    <Text size="sm" c="dimmed">Цель в фитнесе</Text>
                    <Text fw={500}>{client.fitness_goal || 'Не указана'}</Text>
                  </div>

                  <div>
                    <Text size="sm" c="dimmed">Ожидаемый результат</Text>
                    <Text fw={500}>{client.expected_result || 'Не указан'}</Text>
                  </div>

                  <div>
                    <Text size="sm" c="dimmed">Противопоказания</Text>
                    <Text fw={500}>{client.contraindications || 'Нет'}</Text>
                  </div>

                  <div>
                    <Text size="sm" c="dimmed">Текущий рацион питания</Text>
                    <Text fw={500}>{client.current_diet || 'Не указан'}</Text>
                  </div>

                  <Link href={`/admin/client/${client.id}/add-nutrition`} passHref>
                    <Button variant="outline" fullWidth mt="md">
                      Добавить план питания
                    </Button>
                  </Link>

                  <Link href={`/admin/client/${client.id}/nutrition`} passHref>
                    <Button variant="subtle" fullWidth mt="sm">
                      Просмотреть планы питания
                    </Button>
                  </Link>
                </Stack>
              </Card>
            </Grid.Col>

            {/* Отчеты и прогресс */}
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack gap="xl">
                {/* Последний отчет с фото */}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={3} mb="md">Последний отчет с фото</Title>
                  {reports.length > 0 ? (
                    <div>
                      <Text mb="sm">Дата: {reports[0].date}</Text>
                      <img
                        src={reports[0].photo_url || 'https://placehold.co/300x300?text=Фото+отсутствует'}
                        alt="Отчет клиента"
                        style={{ width: '100%', maxWidth: '300px', borderRadius: '8px' }}
                      />
                      <Text mt="sm">{reports[0].comment || 'Комментарий отсутствует'}</Text>

                      <Button
                        variant="outline"
                        mt="md"
                        onClick={() => {
                          setReportIdForComment(reports[0].id);
                          setAddCommentModalOpen(true);
                        }}
                      >
                        Добавить комментарий к отчету
                      </Button>
                    </div>
                  ) : (
                    <Text>Отчеты отсутствуют</Text>
                  )}
                </Card>

                {/* Прогресс в виде графика */}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Flex justify="space-between" align="flex-start" mb="md">
                    <Title order={3}>Прогресс</Title>

                    <Stack gap="xs">
                      <Select
                        label="Период"
                        data={[
                          { value: 'month', label: 'Месяц' },
                          { value: 'year', label: 'Год' },
                          { value: 'custom', label: 'Свой период' }
                        ]}
                        value={selectedPeriod}
                        onChange={(value) => setSelectedPeriod(value as any)}
                        w={200}
                      />

                      {selectedPeriod === 'custom' && (
                        <Group>
                          <TextInput
                            label="Начало"
                            type="date"
                            value={customDateRange.start}
                            onChange={(e) => setCustomDateRange({...customDateRange, start: e.target.value})}
                          />
                          <TextInput
                            label="Конец"
                            type="date"
                            value={customDateRange.end}
                            onChange={(e) => setCustomDateRange({...customDateRange, end: e.target.value})}
                          />
                        </Group>
                      )}
                    </Stack>
                  </Flex>

                  <Box h={300} mb="md">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filteredProgressData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {selectedParams.includes('weight') && (
                          <Bar dataKey="weight" fill="#8884d8" name="Вес (кг)" />
                        )}
                        {selectedParams.includes('chest') && (
                          <Bar dataKey="measurements.chest" fill="#82ca9d" name="Грудь (см)" />
                        )}
                        {selectedParams.includes('waist') && (
                          <Bar dataKey="measurements.waist" fill="#ffc658" name="Талия (см)" />
                        )}
                        {selectedParams.includes('hips') && (
                          <Bar dataKey="measurements.hips" fill="#ff7f50" name="Бедра (см)" />
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>

                  <div>
                    <Text mb="sm">Выберите параметры для отображения:</Text>
                    <Group>
                      {availableParams.map(param => (
                        <Checkbox
                          key={param.value}
                          label={param.label}
                          checked={selectedParams.includes(param.value)}
                          onChange={(event) => {
                            if (event.currentTarget.checked) {
                              setSelectedParams([...selectedParams, param.value]);
                            } else {
                              setSelectedParams(selectedParams.filter(p => p !== param.value));
                            }
                          }}
                        />
                      ))}
                    </Group>
                  </div>
                </Card>

                {/* Кнопка "Все отчеты" */}
                <Flex justify="center">
                  <Button variant="outline" size="lg">
                    Все отчеты
                  </Button>
                </Flex>

                {/* Комментарии к отчетам */}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={3} mb="md">Комментарии к отчету</Title>

                  <Stack gap="sm">
                    {paginatedComments.length > 0 ? (
                      paginatedComments.map(comment => (
                        <Card key={comment.id} shadow="xs" padding="sm" radius="sm" withBorder>
                          <Flex justify="space-between" align="flex-start">
                            <div>
                              <Text fw={500}>{comment.trainer_name}</Text>
                              <Text>{comment.comment}</Text>
                            </div>
                            <Text size="xs" c="dimmed">
                              {new Date(comment.created_at).toLocaleString('ru-RU')}
                            </Text>
                          </Flex>
                        </Card>
                      ))
                    ) : (
                      <Text>Комментариев пока нет</Text>
                    )}
                  </Stack>

                  {totalPages > 1 && (
                    <Flex justify="center" mt="md">
                      <Pagination
                        total={totalPages}
                        page={currentPage}
                        onChange={setCurrentPage}
                      />
                    </Flex>
                  )}
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>

      {/* Модальное окно для добавления комментария */}
      <Modal
        opened={addCommentModalOpen}
        onClose={() => {
          setAddCommentModalOpen(false);
          setCommentText('');
          setReportIdForComment(null);
        }}
        title="Добавить комментарий к отчету"
      >
        <TextInput
          label="Комментарий"
          placeholder="Введите ваш комментарий..."
          value={commentText}
          onChange={(event) => setCommentText(event.currentTarget.value)}
          multiline
          rows={4}
        />
        <Button
          onClick={handleAddComment}
          fullWidth
          mt="md"
          disabled={!commentText.trim()}
        >
          Добавить комментарий
        </Button>
      </Modal>
    </UserTypeProtectedRoute>
  );
}