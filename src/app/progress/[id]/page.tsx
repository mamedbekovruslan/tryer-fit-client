'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Paper, Button, Group, Badge, Card } from '@mantine/core';
import { useParams } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/providers/AuthProvider';

// Типы данных
interface ProgressReport {
  id: number;
  date: string;
  weight: number;
  bodyFat: number;
  muscleMass: number;
  measurements: {
    chest: number;
    waist: number;
    hips: number;
    arms: number;
    thighs: number;
  };
  notes: string;
  trainerComment: string | null;
}

// Моковые данные
const mockReport: ProgressReport = {
  id: 1,
  date: '2024-04-25',
  weight: 77,
  bodyFat: 17,
  muscleMass: 36.5,
  measurements: {
    chest: 103,
    waist: 81.5,
    hips: 92,
    arms: 36.5,
    thighs: 53.5
  },
  notes: 'Хороший прогресс за последний месяц!',
  trainerComment: 'Отличные результаты! Продолжайте в том же духе перед соревнованиями.'
};

export default function ReportDetailPage() {
  const { user } = useAuth();
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
      <UserTypeProtectedRoute allowedUserTypes={['client']}>
        <Container size="md" py="xl">
          <Paper shadow="md" p="xl" radius="md" style={{ textAlign: 'center' }}>
            <Text>Загрузка отчета...</Text>
          </Paper>
        </Container>
      </UserTypeProtectedRoute>
    );
  }

  if (!report) {
    return (
      <UserTypeProtectedRoute allowedUserTypes={['client']}>
        <Container size="md" py="xl">
          <Paper shadow="md" p="xl" radius="md" style={{ textAlign: 'center' }}>
            <Text>Отчет не найден</Text>
          </Paper>
        </Container>
      </UserTypeProtectedRoute>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Group justify="space-between" mb="lg">
          <Title order={2}>Отчет о прогрессе от {report.date}</Title>
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
              <Text size="sm" c="dimmed">Процент жира</Text>
              <Text fw={500} size="lg">{report.bodyFat}%</Text>
            </Card>
            
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text size="sm" c="dimmed">Мышечная масса</Text>
              <Text fw={500} size="lg">{report.muscleMass} кг</Text>
            </Card>
          </Group>

          <Title order={3} mb="md">Измерения</Title>
          <Group grow mb="lg">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text size="sm" c="dimmed">Грудь</Text>
              <Text fw={500} size="lg">{report.measurements.chest} см</Text>
            </Card>
            
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text size="sm" c="dimmed">Талия</Text>
              <Text fw={500} size="lg">{report.measurements.waist} см</Text>
            </Card>
            
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text size="sm" c="dimmed">Бедра</Text>
              <Text fw={500} size="lg">{report.measurements.hips} см</Text>
            </Card>
            
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text size="sm" c="dimmed">Руки</Text>
              <Text fw={500} size="lg">{report.measurements.arms} см</Text>
            </Card>
            
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text size="sm" c="dimmed">Бедра (ноги)</Text>
              <Text fw={500} size="lg">{report.measurements.thighs} см</Text>
            </Card>
          </Group>

          <Title order={3} mb="md">Комментарии</Title>
          <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
            <Text fw={500} mb="sm">Мои заметки:</Text>
            <Text>{report.notes || 'Нет комментариев'}</Text>
          </Card>
          
          {report.trainerComment && (
            <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
              <Text fw={500} mb="sm">Комментарий тренера:</Text>
              <Text>{report.trainerComment}</Text>
            </Card>
          )}

          <Group justify="space-between" mt="xl">
            <Button component="a" href="/me/progress/reports">
              Назад к отчетам
            </Button>
            <Button component="a" href={`/progress/${report.id}/edit`} variant="outline">
              Редактировать отчет
            </Button>
          </Group>
        </Paper>
      </Container>
  );
}