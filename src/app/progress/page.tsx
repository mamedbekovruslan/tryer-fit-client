'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Paper, Box, Card, Button, Group, Select, Checkbox, Pagination, DatePickerInput } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';

// Типы данных
interface ProgressDataPoint {
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
}

interface Comment {
  id: number;
  date: string;
  text: string;
}

// Моковые данные
const mockProgressData: ProgressDataPoint[] = [
  { date: '2024-01-01', weight: 80, bodyFat: 20, muscleMass: 35, measurements: { chest: 100, waist: 85, hips: 95, arms: 35, thighs: 55 } },
  { date: '2024-01-15', weight: 79.5, bodyFat: 19.5, muscleMass: 35.2, measurements: { chest: 100.5, waist: 84, hips: 94.5, arms: 35.2, thighs: 54.8 } },
  { date: '2024-02-01', weight: 79, bodyFat: 19, muscleMass: 35.5, measurements: { chest: 101, waist: 83.5, hips: 94, arms: 35.5, thighs: 54.5 } },
  { date: '2024-02-15', weight: 78.5, bodyFat: 18.5, muscleMass: 35.8, measurements: { chest: 101.5, waist: 83, hips: 93.5, arms: 35.8, thighs: 54.2 } },
  { date: '2024-03-01', weight: 78, bodyFat: 18, muscleMass: 36, measurements: { chest: 102, waist: 82.5, hips: 93, arms: 36, thighs: 54 } },
  { date: '2024-03-15', weight: 77.5, bodyFat: 17.5, muscleMass: 36.3, measurements: { chest: 102.5, waist: 82, hips: 92.5, arms: 36.3, thighs: 53.8 } },
  { date: '2024-04-01', weight: 77, bodyFat: 17, muscleMass: 36.5, measurements: { chest: 103, waist: 81.5, hips: 92, arms: 36.5, thighs: 53.5 } },
];

const mockComments: Comment[] = [
  { id: 1, date: '2024-01-10', text: 'Отличный старт! Вес снижается, как и планировалось.' },
  { id: 2, date: '2024-01-25', text: 'Продолжайте в том же духе. Обратите внимание на питание.' },
  { id: 3, date: '2024-02-10', text: 'Хороший прогресс по снижению процента жира.' },
  { id: 4, date: '2024-02-25', text: 'Рекомендую увеличить нагрузку на ноги.' },
  { id: 5, date: '2024-03-10', text: 'Отличные результаты! Продолжайте работать над мышечной массой.' },
  { id: 6, date: '2024-03-25', text: 'Небольшая задержка воды, но в целом все хорошо.' },
  { id: 7, date: '2024-04-10', text: 'Отличный прогресс за последний месяц!' },
  { id: 8, date: '2024-04-15', text: 'Рекомендую немного изменить программу тренировок.' },
  { id: 9, date: '2024-04-20', text: 'Отличные результаты на фото.' },
  { id: 10, date: '2024-04-25', text: 'Продолжайте в том же духе перед соревнованиями.' },
  { id: 11, date: '2024-05-01', text: 'Отличные результаты за последний месяц!' },
];

export default function ProgressPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<'month' | 'year' | 'custom'>('month');
  const [customDateRange, setCustomDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [displayOptions, setDisplayOptions] = useState({
    weight: true,
    bodyFat: true,
    muscleMass: true,
    measurements: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(10);
  
  // Фильтрация данных в зависимости от выбранного временного диапазона
  const filteredData = mockProgressData.filter(point => {
    const pointDate = new Date(point.date);
    
    if (timeRange === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return pointDate >= monthAgo;
    } else if (timeRange === 'year') {
      const yearAgo = new Date();
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      return pointDate >= yearAgo;
    } else if (timeRange === 'custom' && customDateRange[0] && customDateRange[1]) {
      return pointDate >= customDateRange[0] && pointDate <= customDateRange[1];
    }
    
    return true;
  });

  // Фильтрация комментариев для пагинации
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = mockComments.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(mockComments.length / commentsPerPage);

  // Обработчики изменений
  const handleTimeRangeChange = (value: string | null) => {
    if (value === 'month' || value === 'year' || value === 'custom') {
      setTimeRange(value);
    }
  };

  const handleOptionChange = (option: keyof typeof displayOptions) => {
    setDisplayOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Title order={2} mb="lg">Прогресс</Title>

        <Group mb="lg" grow>
          <Select
            label="Временной диапазон"
            placeholder="Выберите диапазон"
            value={timeRange}
            onChange={handleTimeRangeChange}
            data={[
              { value: 'month', label: 'Месяц' },
              { value: 'year', label: 'Год' },
              { value: 'custom', label: 'Указать период' }
            ]}
          />

          {timeRange === 'custom' && (
            <DatePicker
              type="range"
              label="Указать период"
              placeholder="Выберите даты"
              value={customDateRange}
              onChange={setCustomDateRange}
            />
          )}
        </Group>

        <Group mb="lg">
          <Checkbox
            label="Вес"
            checked={displayOptions.weight}
            onChange={() => handleOptionChange('weight')}
          />
          <Checkbox
            label="Процент жира"
            checked={displayOptions.bodyFat}
            onChange={() => handleOptionChange('bodyFat')}
          />
          <Checkbox
            label="Мышечная масса"
            checked={displayOptions.muscleMass}
            onChange={() => handleOptionChange('muscleMass')}
          />
          <Checkbox
            label="Измерения"
            checked={displayOptions.measurements}
            onChange={() => handleOptionChange('measurements')}
          />
        </Group>

        <Paper shadow="sm" p="md" mb="lg">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={filteredData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {displayOptions.weight && <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} />}
              {displayOptions.bodyFat && <Line type="monotone" dataKey="bodyFat" stroke="#82ca9d" />}
              {displayOptions.muscleMass && <Line type="monotone" dataKey="muscleMass" stroke="#ffc658" />}
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        <Title order={3} mb="md">Комментарии тренера</Title>

        {currentComments.map(comment => (
          <Card key={comment.id} shadow="sm" padding="lg" radius="md" withBorder mb="md">
            <Text size="sm" c="dimmed">{comment.date}</Text>
            <Text>{comment.text}</Text>
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

        <Group mt="xl">
          <Button onClick={() => router.push('/me/progress/new-report')} variant="outline">
            Добавить прогресс
          </Button>
          <Button onClick={() => router.push('/me/progress/reports')} variant="outline">
            Все отчеты
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}