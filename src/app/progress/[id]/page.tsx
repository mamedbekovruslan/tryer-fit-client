'use client';

import { useEffect, useState } from 'react';
import { Badge, Button, Card, Container, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useParams } from 'next/navigation';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { progressReportService, ProgressReport } from '@/services/progressReportService';

function trainerName(comment: NonNullable<ProgressReport['comments']>[number]) {
  return `${comment.trainer.first_name || ''} ${comment.trainer.last_name || ''}`.trim() || comment.trainer.username;
}

export default function ReportDetailPage() {
  const params = useParams();
  const reportId = Number(params.id);

  const [report, setReport] = useState<ProgressReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await progressReportService.getProgressReportById(reportId);
        setReport(data);
      } catch (err) {
        setError('Не удалось загрузить отчет');
      } finally {
        setLoading(false);
      }
    };

    if (Number.isFinite(reportId)) {
      void loadReport();
    } else {
      setLoading(false);
      setError('Некорректный идентификатор отчета');
    }
  }, [reportId]);

  return (
    <UserTypeProtectedRoute allowedUserTypes={['client']}>
      <Container size="lg" py="xl">
        <Paper shadow="md" p="xl" radius="md">
          {loading ? (
            <Text ta="center">Загрузка отчета...</Text>
          ) : !report ? (
            <Text ta="center">{error || 'Отчет не найден'}</Text>
          ) : (
            <>
              <Group justify="space-between" mb="lg">
                <Title order={2}>Отчет о прогрессе от {new Date(report.date).toLocaleDateString('ru-RU')}</Title>
                <Badge color="blue" size="lg">
                  {new Date(report.date).toLocaleDateString('ru-RU')}
                </Badge>
              </Group>

              <Group grow mb="lg">
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Text size="sm" c="dimmed">Вес</Text>
                  <Text fw={500} size="lg">{report.weight ?? '-'} кг</Text>
                </Card>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Text size="sm" c="dimmed">Процент жира</Text>
                  <Text fw={500} size="lg">{report.bodyFat ?? '-'}%</Text>
                </Card>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Text size="sm" c="dimmed">Мышечная масса</Text>
                  <Text fw={500} size="lg">{report.muscleMass ?? '-'} кг</Text>
                </Card>
              </Group>

              <Title order={3} mb="md">Измерения</Title>
              <Group grow mb="lg">
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Text size="sm" c="dimmed">Грудь</Text>
                  <Text fw={500} size="lg">{report.chest ?? '-'} см</Text>
                </Card>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Text size="sm" c="dimmed">Талия</Text>
                  <Text fw={500} size="lg">{report.waist ?? '-'} см</Text>
                </Card>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Text size="sm" c="dimmed">Бедра</Text>
                  <Text fw={500} size="lg">{report.hips ?? '-'} см</Text>
                </Card>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Text size="sm" c="dimmed">Руки</Text>
                  <Text fw={500} size="lg">{report.arms ?? '-'} см</Text>
                </Card>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Text size="sm" c="dimmed">Бедра (ноги)</Text>
                  <Text fw={500} size="lg">{report.thighs ?? '-'} см</Text>
                </Card>
              </Group>

              <Title order={3} mb="md">Комментарии</Title>
              <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
                <Text fw={500} mb="sm">Мои заметки:</Text>
                <Text>{report.notes || 'Нет комментариев'}</Text>
              </Card>

              <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
                <Text fw={500} mb="sm">Комментарии тренера:</Text>
                {report.comments && report.comments.length > 0 ? (
                  <Stack gap="sm">
                    {report.comments.map((comment) => (
                      <Card key={comment.id} shadow="xs" padding="sm" radius="sm" withBorder>
                        <Group justify="space-between" align="flex-start">
                          <div>
                            <Text fw={500}>{trainerName(comment)}</Text>
                            <Text>{comment.comment}</Text>
                          </div>
                          <Text size="xs" c="dimmed">
                            {new Date(comment.createdAt).toLocaleString('ru-RU')}
                          </Text>
                        </Group>
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <Text>Комментариев от тренера пока нет</Text>
                )}
              </Card>

              <Group justify="space-between" mt="xl">
                <Button component="a" href="/me/progress/reports">
                  Назад к отчетам
                </Button>
                <Button component="a" href={`/progress/${report.id}/edit`} variant="outline">
                  Редактировать отчет
                </Button>
              </Group>
            </>
          )}
        </Paper>
      </Container>
    </UserTypeProtectedRoute>
  );
}
