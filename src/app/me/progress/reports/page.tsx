'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Paper, Card, Button, Group, Pagination, Select, Image, Badge, LoadingOverlay } from '@mantine/core';
import { DatePickerInput, type DatesRangeValue } from '@mantine/dates';
import { useRouter } from 'next/navigation';
import { progressReportService, ProgressReport } from '@/services/progressReportService';

export default function AllReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<ProgressReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(5);
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month' | 'custom'>('all');
  const [customDateRange, setCustomDateRange] = useState<DatesRangeValue>([null, null]);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const data = await progressReportService.getAllProgressReports();
        setReports(data);
      } catch (error) {
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  useEffect(() => {
    let result = [...reports];

    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
        <LoadingOverlay visible={loading} overlayProps={{ radius: 'sm', blur: 2 }} />
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

        {!loading && currentReports.length === 0 ? (
          <Text ta="center" py="xl">Нет отчетов для отображения</Text>
        ) : !loading ? (
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
                  <Text fw={500} size="lg">
                    {new Date(report.date).toLocaleDateString('ru-RU')}
                  </Text>
                  <Badge color="blue">{report.weight ?? '-'} кг</Badge>
                </Group>

                <Group mb="sm">
                  <Text size="sm">Талия: {report.waist ?? '-'} см</Text>
                  <Text size="sm">Бедра: {report.hips ?? '-'} см</Text>
                  {report.chest && <Text size="sm">Грудь: {report.chest} см</Text>}
                </Group>

                {report.photoUrls && report.photoUrls.length > 0 && (
                  <Group mb="sm">
                    <Image
                      src={report.photoUrls[0]}
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
              <Group justify="center" mt="md">
                <Pagination
                  total={totalPages}
                  value={currentPage}
                  onChange={setCurrentPage}
                />
              </Group>
            )}
          </>
        ) : null}
      </Paper>
    </Container>
  );
}
