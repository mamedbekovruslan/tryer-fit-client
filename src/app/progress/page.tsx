'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Paper, Box, Card, Button, Group, Select, Checkbox, Pagination, LoadingOverlay } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { progressReportService, ProgressReport } from '@/services/progressReportService';

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

const chartLabelMap: Record<string, string> = {
  weight: 'Вес',
  bodyFat: 'Процент жира',
  muscleMass: 'Мышечная масса',
};

function formatChartDate(value: string) {
  return new Date(value).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
  });
}

function formatTooltipDate(value: string) {
  return new Date(value).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function formatTooltipValue(value: number, name: string) {
  const label = chartLabelMap[name] || name;
  return [`${value}`, label];
}

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
  const [progressData, setProgressData] = useState<ProgressReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных прогресса
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        const data = await progressReportService.getAllProgressReports();
        setProgressData(data);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  // Фильтрация данных в зависимости от выбранного временного диапазона
  const filteredData = progressData.filter(point => {
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

  // Преобразование данных для графика
  const chartData = filteredData.map(item => ({
    date: item.date,
    weight: item.weight || 0,
    bodyFat: item.bodyFat || 0,
    muscleMass: item.muscleMass || 0,
    measurements: {
      chest: item.chest || 0,
      waist: item.waist || 0,
      hips: item.hips || 0,
      arms: item.arms || 0,
      thighs: item.thighs || 0,
    }
  }));

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
        <LoadingOverlay visible={loading} overlayBlur={2} />
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
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatChartDate} />
              <YAxis />
              <Tooltip
                labelFormatter={formatTooltipDate}
                formatter={formatTooltipValue}
              />
              <Legend />
              {displayOptions.weight && (
                <Line
                  type="monotone"
                  dataKey="weight"
                  name={chartLabelMap.weight}
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              )}
              {displayOptions.bodyFat && (
                <Line
                  type="monotone"
                  dataKey="bodyFat"
                  name={chartLabelMap.bodyFat}
                  stroke="#82ca9d"
                />
              )}
              {displayOptions.muscleMass && (
                <Line
                  type="monotone"
                  dataKey="muscleMass"
                  name={chartLabelMap.muscleMass}
                  stroke="#ffc658"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        <Title order={3} mb="md">Комментарии тренера</Title>

        {progressData
          .filter(report => report.notes) // Фильтруем только отчеты с комментариями
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Сортируем по дате (новые первыми)
          .map(report => (
            <Card key={report.id} shadow="sm" padding="lg" radius="md" withBorder mb="md">
              <Text size="sm" c="dimmed">{new Date(report.date).toLocaleDateString()}</Text>
              <Text>{report.notes}</Text>
            </Card>
          ))}

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
