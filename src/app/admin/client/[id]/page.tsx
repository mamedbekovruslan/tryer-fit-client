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
  Avatar,
  Select,
  Checkbox,
  Pagination,
  Modal,
  TextInput,
  Textarea,
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
import {
  ProgressReport,
  ProgressReportComment,
  progressReportService,
} from '@/services/progressReportService';

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

function getClientPhotoSrc(client: Client | null): string | null {
  const first = client?.photo_urls?.[0];
  if (first && first.trim()) return first;
  return null;
}

export default function ClientProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [reports, setReports] = useState<ProgressReport[]>([]);
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
    const loadClientData = async () => {
      try {
        setLoading(true);
        setError(null);

        const clientId = Number(id);
        const [clientData, progressReports] = await Promise.all([
          clientService.getClientById(clientId),
          progressReportService.getTrainerClientProgressReports(clientId),
        ]);

        setClient(clientData);
        setReports(progressReports);
        setProgressData(
          progressReports
            .slice()
            .reverse()
            .map((report) => ({
              date: new Date(report.date).toLocaleDateString('ru-RU'),
              weight: report.weight,
              measurements: {
                chest: report.chest,
                waist: report.waist,
                hips: report.hips,
                arms: report.arms,
                thighs: report.thighs,
              },
            })),
        );
      } catch (err) {
        setError('Ошибка загрузки данных клиента: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadClientData();
    }
  }, [id]);

  const latestReport = reports[0] ?? null;
  const latestComments = latestReport?.comments ?? [];
  const handleAddComment = async () => {
    if (!commentText.trim() || !reportIdForComment) {
      return;
    }

    try {
      const createdComment = await progressReportService.addProgressReportComment(reportIdForComment, {
        comment: commentText.trim(),
      });

      setReports((currentReports) =>
        currentReports.map((report) =>
          report.id === reportIdForComment
            ? { ...report, comments: [createdComment, ...(report.comments ?? [])] }
            : report,
        ),
      );
      setCommentText('');
      setAddCommentModalOpen(false);
      setReportIdForComment(null);
      setCurrentPage(1);
    } catch (err) {
      setError('Ошибка добавления комментария: ' + (err as Error).message);
    }
  };

  const filteredComments = latestComments;
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
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Flex justify="center" mb="md">
                    <Avatar
                      src={getClientPhotoSrc(client)}
                      alt={client.username}
                      radius="xl"
                      size="xl"
                    >
                      {(client.first_name?.charAt(0) || '') + (client.last_name?.charAt(0) || '')}
                    </Avatar>
                  </Flex>

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

            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack gap="xl">
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={3} mb="md">Последний отчет с фото</Title>
                  {latestReport ? (
                    <div>
                      <Text mb="sm">
                        Дата: {new Date(latestReport.date).toLocaleDateString('ru-RU')}
                      </Text>
                      <img
                        src={latestReport.photoUrls?.[0] || 'https://placehold.co/300x300?text=Фото+отсутствует'}
                        alt="Отчет клиента"
                        style={{ width: '100%', maxWidth: '300px', borderRadius: '8px' }}
                      />
                      <Text mt="sm">
                        {latestReport.notes || 'Комментарий клиента к отчету отсутствует'}
                      </Text>

                      <Button
                        variant="outline"
                        mt="md"
                        onClick={() => {
                          setReportIdForComment(latestReport.id);
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

                <Flex justify="center">
                  <Button variant="outline" size="lg" component={Link} href="/progress">
                    Все отчеты
                  </Button>
                </Flex>

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={3} mb="md">Комментарии к отчету</Title>

                  <Stack gap="sm">
                    {paginatedComments.length > 0 ? (
                      paginatedComments.map(comment => (
                        <Card key={comment.id} shadow="xs" padding="sm" radius="sm" withBorder>
                          <Flex justify="space-between" align="flex-start">
                            <div>
                              <Text fw={500}>
                                {`${comment.trainer.first_name || ''} ${comment.trainer.last_name || ''}`.trim() ||
                                  comment.trainer.username}
                              </Text>
                              <Text>{comment.comment}</Text>
                            </div>
                            <Text size="xs" c="dimmed">
                              {new Date(comment.createdAt).toLocaleString('ru-RU')}
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
                        value={currentPage}
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

      <Modal
        opened={addCommentModalOpen}
        onClose={() => {
          setAddCommentModalOpen(false);
          setCommentText('');
          setReportIdForComment(null);
        }}
        title="Добавить комментарий к отчету"
      >
        <Textarea
          label="Комментарий"
          placeholder="Введите ваш комментарий..."
          value={commentText}
          onChange={(event) => setCommentText(event.currentTarget.value)}
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
