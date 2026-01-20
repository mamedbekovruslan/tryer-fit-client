'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Paper, Card, Button, Group, Pagination, Select, Image, Badge } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';

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
const mockReports: ProgressReport[] = [
  {
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
    photos: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200'],
    notes: 'Хороший прогресс за последний месяц!',
    createdAt: '2024-04-25T10:30:00Z'
  },
  {
    id: 2,
    date: '2024-04-20',
    weight: 77.2,
    waist: 81.8,
    hips: 92.2,
    chest: 102.8,
    arms: 36.3,
    thighs: 53.7,
    bodyFat: 17.2,
    muscleMass: 36.4,
    photos: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200', 'https://images.unsplash.com/photo-1571019614242-c5c6fc46496c?w=200'],
    notes: 'Фото выглядят отлично',
    createdAt: '2024-04-20T10:30:00Z'
  },
  {
    id: 3,
    date: '2024-04-15',
    weight: 77.4,
    waist: 82.1,
    hips: 92.5,
    chest: 102.5,
    arms: 36.1,
    thighs: 53.9,
    bodyFat: 17.4,
    muscleMass: 36.3,
    photos: [],
    notes: 'Небольшая задержка воды',
    createdAt: '2024-04-15T10:30:00Z'
  },
  {
    id: 4,
    date: '2024-04-10',
    weight: 77.6,
    waist: 82.4,
    hips: 92.8,
    chest: 102.2,
    arms: 35.9,
    thighs: 54.1,
    bodyFat: 17.6,
    muscleMass: 36.2,
    photos: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200'],
    notes: 'Хороший прогресс',
    createdAt: '2024-04-10T10:30:00Z'
  },
  {
    id: 5,
    date: '2024-04-05',
    weight: 77.8,
    waist: 82.7,
    hips: 93.1,
    chest: 101.9,
    arms: 35.7,
    thighs: 54.3,
    bodyFat: 17.8,
    muscleMass: 36.1,
    photos: [],
    notes: 'Продолжаю следовать плану',
    createdAt: '2024-04-05T10:30:00Z'
  },
  {
    id: 6,
    date: '2024-03-25',
    weight: 78,
    waist: 83,
    hips: 93.4,
    chest: 101.6,
    arms: 35.5,
    thighs: 54.5,
    bodyFat: 18,
    muscleMass: 36,
    photos: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200'],
    notes: 'Вес продолжает снижаться',
    createdAt: '2024-03-25T10:30:00Z'
  },
  {
    id: 7,
    date: '2024-03-20',
    weight: 78.2,
    waist: 83.3,
    hips: 93.7,
    chest: 101.3,
    arms: 35.3,
    thighs: 54.7,
    bodyFat: 18.2,
    muscleMass: 35.9,
    photos: [],
    notes: 'Питание в порядке',
    createdAt: '2024-03-20T10:30:00Z'
  },
  {
    id: 8,
    date: '2024-03-15',
    weight: 78.4,
    waist: 83.6,
    hips: 94,
    chest: 101,
    arms: 35.1,
    thighs: 54.9,
    bodyFat: 18.4,
    muscleMass: 35.8,
    photos: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200'],
    notes: 'Тренировки идут хорошо',
    createdAt: '2024-03-15T10:30:00Z'
  },
  {
    id: 9,
    date: '2024-03-10',
    weight: 78.6,
    waist: 83.9,
    hips: 94.3,
    chest: 100.7,
    arms: 34.9,
    thighs: 55.1,
    bodyFat: 18.6,
    muscleMass: 35.7,
    photos: [],
    notes: 'Первый месяц тренировок',
    createdAt: '2024-03-10T10:30:00Z'
  },
  {
    id: 10,
    date: '2024-03-05',
    weight: 78.8,
    waist: 84.2,
    hips: 94.6,
    chest: 100.4,
    arms: 34.7,
    thighs: 55.3,
    bodyFat: 18.8,
    muscleMass: 35.6,
    photos: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200'],
    notes: 'Начал программу',
    createdAt: '2024-03-05T10:30:00Z'
  }
];

export default function AllReportsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<ProgressReport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(5);
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month' | 'custom'>('all');
  const [customDateRange, setCustomDateRange] = useState<[Date | null, Date | null]>([null, null]);

  useEffect(() => {
    // В реальном приложении здесь будет запрос к API для получения отчетов
    // Сейчас используем моковые данные
    setReports(mockReports);
  }, []);

  useEffect(() => {
    let result = [...reports];

    // Сортировка: сперва новые
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Фильтрация по времени
    const now = new Date();
    switch (timeFilter) {
      case 'week':
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        result = result.filter(report => new Date(report.createdAt) >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        result = result.filter(report => new Date(report.createdAt) >= monthAgo);
        break;
      case 'custom':
        if (customDateRange[0] && customDateRange[1]) {
          result = result.filter(report => {
            const reportDate = new Date(report.createdAt);
            return reportDate >= customDateRange[0]! && reportDate <= customDateRange[1]!;
          });
        }
        break;
      case 'all':
      default:
        break;
    }

    setFilteredReports(result);
    setCurrentPage(1); // Сброс на первую страницу при изменении фильтров
  }, [reports, timeFilter, customDateRange]);

  // Пагинация
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const handleTimeFilterChange = (value: string | null) => {
    if (value === 'all' || value === 'week' || value === 'month' || value === 'custom') {
      setTimeFilter(value);
    }
  };

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Group justify="space-between" mb="lg">
          <Title order={2}>Все отчеты о прогрессе</Title>
          <Button onClick={() => router.push('/me/progress/new-report')}>
            Добавить новый отчет
          </Button>
        </Group>

        <Group mb="lg">
          <Select
            label="Фильтр по времени"
            placeholder="Выберите период"
            value={timeFilter}
            onChange={handleTimeFilterChange}
            data={[
              { value: 'all', label: 'Все время' },
              { value: 'week', label: 'Неделя' },
              { value: 'month', label: 'Месяц' },
              { value: 'custom', label: 'Указать период' }
            ]}
            w={200}
          />

          {timeFilter === 'custom' && (
            <DatePickerInput
              type="range"
              label="Указать период"
              placeholder="Выберите даты"
              value={customDateRange}
              onChange={setCustomDateRange}
              w={300}
            />
          )}
        </Group>

        {currentReports.length === 0 ? (
          <Text ta="center" py="xl">Нет отчетов для отображения</Text>
        ) : (
          <>
            {currentReports.map(report => (
              <Card
                key={report.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                mb="md"
                style={{ cursor: 'pointer' }}
                onClick={() => router.push(`/me/progress/reports/${report.id}`)}
              >
                <Group justify="space-between" mb="sm">
                  <Text fw={500} size="lg">{report.date}</Text>
                  <Badge color="blue">{report.weight} кг</Badge>
                </Group>

                <Group mb="sm">
                  <Text size="sm">Талия: {report.waist} см</Text>
                  <Text size="sm">Бедра: {report.hips} см</Text>
                  {report.chest && <Text size="sm">Грудь: {report.chest} см</Text>}
                </Group>

                {report.photos && report.photos.length > 0 && (
                  <Group mb="sm">
                    <Image
                      src={report.photos[0]}
                      alt={`Фото отчета ${report.id}`}
                      width={100}
                      height={100}
                      fit="cover"
                      radius="md"
                    />
                  </Group>
                )}

                {report.notes && (
                  <Text size="sm" lineClamp={2}>
                    {report.notes}
                  </Text>
                )}
              </Card>
            ))}

            {totalPages > 1 && (
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={setCurrentPage}
                mt="md"
                justify="center"
              />
            )}
          </>
        )}
      </Paper>
    </Container>
  );
}