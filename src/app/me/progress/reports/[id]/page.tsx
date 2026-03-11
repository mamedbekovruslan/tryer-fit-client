'use client';

import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useParams, useRouter } from 'next/navigation';
import { progressReportService, ProgressReport } from '@/services/progressReportService';

function formatTrainerName(report: ProgressReport['comments'][number]['trainer']) {
  return `${report.first_name || ''} ${report.last_name || ''}`.trim() || report.username;
}

export default function ReportDetailPage() {
  const router = useRouter();
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
        console.error('Ошибка загрузки отчета:', err);
        setError('Не удалось загрузить отчет');
        setReport(null);
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

  if (loading) {
    return (
      <Container size="md" py="xl">
        <Paper shadow="md" p="xl" radius="md">
          <Text ta="center">Загрузка отчета...</Text>
        </Paper>
      </Container>
    );
  }

  if (!report) {
    return (
      <Container size="md" py="xl">
        <Paper shadow="md" p="xl" radius="md">
          <Text ta="center">{error || 'Отчет не найден'}</Text>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Group justify="space-between" mb="lg">
          <Title order={2}>
            Отчет от {new Date(report.date).toLocaleDateString('ru-RU')}
          </Title>
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
            <Text size="sm" c="dimmed">Талия</Text>
            <Text fw={500} size="lg">{report.waist ?? '-'} см</Text>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="sm" c="dimmed">Бедра</Text>
            <Text fw={500} size="lg">{report.hips ?? '-'} см</Text>
          </Card>
        </Group>

        {(report.chest || report.arms || report.thighs) && (
          <Group grow mb="lg">
            {report.chest !== undefined && (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size="sm" c="dimmed">Грудь</Text>
                <Text fw={500} size="lg">{report.chest} см</Text>
              </Card>
            )}

            {report.arms !== undefined && (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size="sm" c="dimmed">Руки</Text>
                <Text fw={500} size="lg">{report.arms} см</Text>
              </Card>
            )}

            {report.thighs !== undefined && (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size="sm" c="dimmed">Бедра (ноги)</Text>
                <Text fw={500} size="lg">{report.thighs} см</Text>
              </Card>
            )}
          </Group>
        )}

        {(report.bodyFat || report.muscleMass) && (
          <Group grow mb="lg">
            {report.bodyFat !== undefined && (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size="sm" c="dimmed">Процент жира</Text>
                <Text fw={500} size="lg">{report.bodyFat}%</Text>
              </Card>
            )}

            {report.muscleMass !== undefined && (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size="sm" c="dimmed">Мышечная масса</Text>
                <Text fw={500} size="lg">{report.muscleMass} кг</Text>
              </Card>
            )}
          </Group>
        )}

        {report.photoUrls && report.photoUrls.length > 0 && (
          <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
            <Text fw={500} mb="sm">Фото прогресса</Text>
            <Group>
              {report.photoUrls.map((photo, index) => (
                <Image
                  key={`${report.id}-${index}`}
                  src={photo}
                  alt={`Фото отчета ${report.id}-${index + 1}`}
                  width={200}
                  height={200}
                  fit="cover"
                  radius="md"
                />
              ))}
            </Group>
          </Card>
        )}

        <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
          <Text fw={500} mb="sm">Комментарий пользователя</Text>
          <Text>{report.notes || 'Комментарий отсутствует'}</Text>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
          <Text fw={500} mb="sm">Комментарии тренера</Text>
          {report.comments && report.comments.length > 0 ? (
            <Stack gap="sm">
              {report.comments.map((comment) => (
                <Card key={comment.id} shadow="xs" padding="sm" radius="sm" withBorder>
                  <Group justify="space-between" align="flex-start">
                    <div>
                      <Text fw={500}>{formatTrainerName(comment.trainer)}</Text>
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
          <Button onClick={() => router.push('/me/progress/reports')}>
            Назад ко всем отчетам
          </Button>
          <Button onClick={() => router.push('/me/progress/new-report')} variant="outline">
            Добавить новый отчет
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}
