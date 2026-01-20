'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Paper, Button, Group, Card, Image, Badge } from '@mantine/core';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

// Типы данных
interface ProgressReport {
  id: number;
  date: string;
  weight: number;
  waist: number;
  hips: number;
  chest?: number;
  arms?: number;
  thighs?: number;
  bodyFat?: number;
  muscleMass?: number;
  photos: string[];
  notes?: string;
  createdAt: string;
}

// Моковые данные
const mockReport: ProgressReport = {
  id: 1,
  date: '2024-04-25',
  weight: 77,
  waist: 81.5,
  hips: 92,
  chest: 103,
  arms: 36.5,
  thighs: 53.5,
  bodyFat: 17,
  muscleMass: 36.5,
  photos: [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    'https://images.unsplash.com/photo-1571019614242-c5c6fc46496c?w=400'
  ],
  notes: 'Хороший прогресс за последний месяц! Вес снижается, как и планировалось.',
  createdAt: '2024-04-25T10:30:00Z'
};

export default function ReportDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const reportId = params.id as string;
  
  const [report, setReport] = useState<ProgressReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // В реальном приложении здесь будет запрос к API для получения данных отчета
    // Сейчас используем моковые данные
    setTimeout(() => {
      setReport(mockReport);
      setLoading(false);
    }, 500);
  }, [reportId]);

  if (loading) {
    return (
      <Container size="md" py="xl">
        <Paper shadow="md" p="xl" radius="md" style={{ textAlign: 'center' }}>
          <Text>Загрузка отчета...</Text>
        </Paper>
      </Container>
    );
  }

  if (!report) {
    return (
      <Container size="md" py="xl">
        <Paper shadow="md" p="xl" radius="md" style={{ textAlign: 'center' }}>
          <Text>Отчет не найден</Text>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Group justify="space-between" mb="lg">
          <Title order={2}>Отчет от {report.date}</Title>
          <Badge color="blue" size="lg">
            {report.date}
          </Badge>
        </Group>

        <Group grow mb="lg">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="sm" c="dimmed">Вес</Text>
            <Text fw={500} size="lg">{report.weight} кг</Text>
          </Card>
          
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="sm" c="dimmed">Талия</Text>
            <Text fw={500} size="lg">{report.waist} см</Text>
          </Card>
          
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="sm" c="dimmed">Бедра</Text>
            <Text fw={500} size="lg">{report.hips} см</Text>
          </Card>
        </Group>

        {(report.chest || report.arms || report.thighs) && (
          <Group grow mb="lg">
            {report.chest && (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size="sm" c="dimmed">Грудь</Text>
                <Text fw={500} size="lg">{report.chest} см</Text>
              </Card>
            )}
            
            {report.arms && (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size="sm" c="dimmed">Руки</Text>
                <Text fw={500} size="lg">{report.arms} см</Text>
              </Card>
            )}
            
            {report.thighs && (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size="sm" c="dimmed">Бедра (ноги)</Text>
                <Text fw={500} size="lg">{report.thighs} см</Text>
              </Card>
            )}
          </Group>
        )}

        {(report.bodyFat || report.muscleMass) && (
          <Group grow mb="lg">
            {report.bodyFat && (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size="sm" c="dimmed">Процент жира</Text>
                <Text fw={500} size="lg">{report.bodyFat}%</Text>
              </Card>
            )}
            
            {report.muscleMass && (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size="sm" c="dimmed">Мышечная масса</Text>
                <Text fw={500} size="lg">{report.muscleMass} кг</Text>
              </Card>
            )}
          </Group>
        )}

        {report.photos && report.photos.length > 0 && (
          <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
            <Text fw={500} mb="sm">Фотоотчеты</Text>
            <Group>
              {report.photos.map((photo, index) => (
                <Image
                  key={index}
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

        {report.notes && (
          <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
            <Text fw={500} mb="sm">Комментарии</Text>
            <Text>{report.notes}</Text>
          </Card>
        )}

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