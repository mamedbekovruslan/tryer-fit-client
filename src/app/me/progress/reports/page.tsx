'use client';

import { useState } from 'react';
import { Container, Title, Text, Paper, Table, Button, Group, Pagination, Badge } from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';

// Типы данных
interface ProgressReport {
  id: number;
  date: string;
  weight: number;
  bodyFat: number;
  muscleMass: number;
  notes: string;
  trainerComment: string | null;
}

// Моковые данные
const mockReports: ProgressReport[] = [
  { id: 1, date: '2024-04-25', weight: 77, bodyFat: 17, muscleMass: 36.5, notes: 'Хороший прогресс за последний месяц!', trainerComment: 'Отличные результаты! Продолжайте в том же духе перед соревнованиями.' },
  { id: 2, date: '2024-04-20', weight: 77.2, bodyFat: 17.2, muscleMass: 36.4, notes: 'Фото выглядят отлично', trainerComment: 'Отличные результаты на фото.' },
  { id: 3, date: '2024-04-15', weight: 77.4, bodyFat: 17.4, muscleMass: 36.3, notes: 'Небольшая задержка воды', trainerComment: 'Небольшая задержка воды, но в целом все хорошо.' },
  { id: 4, date: '2024-04-10', weight: 77.6, bodyFat: 17.6, muscleMass: 36.2, notes: 'Хороший прогресс', trainerComment: 'Отличный прогресс за последний месяц!' },
  { id: 5, date: '2024-04-05', weight: 77.8, bodyFat: 17.8, muscleMass: 36.1, notes: 'Продолжаю следовать плану', trainerComment: 'Рекомендую немного изменить программу тренировок.' },
  { id: 6, date: '2024-03-25', weight: 78, bodyFat: 18, muscleMass: 36, notes: 'Вес продолжает снижаться', trainerComment: 'Рекомендую увеличить нагрузку на ноги.' },
  { id: 7, date: '2024-03-20', weight: 78.2, bodyFat: 18.2, muscleMass: 35.9, notes: 'Питание в порядке', trainerComment: 'Хороший прогресс по снижению процента жира.' },
  { id: 8, date: '2024-03-15', weight: 78.4, bodyFat: 18.4, muscleMass: 35.8, notes: 'Тренировки идут хорошо', trainerComment: 'Продолжайте в том же духе. Обратите внимание на питание.' },
  { id: 9, date: '2024-03-10', weight: 78.6, bodyFat: 18.6, muscleMass: 35.7, notes: 'Первый месяц тренировок', trainerComment: 'Отличный старт! Вес снижается, как и планировалось.' },
  { id: 10, date: '2024-03-05', weight: 78.8, bodyFat: 18.8, muscleMass: 35.6, notes: 'Начал программу', trainerComment: null },
  { id: 11, date: '2024-02-25', weight: 79, bodyFat: 19, muscleMass: 35.5, notes: 'Подготовка к программе', trainerComment: null },
  { id: 12, date: '2024-02-20', weight: 79.2, bodyFat: 19.2, muscleMass: 35.4, notes: 'Планирование питания', trainerComment: null },
];

export default function ReportsPage() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(5); // Показывать 5 отчетов на странице
  
  // Фильтрация отчетов для пагинации
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = mockReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(mockReports.length / reportsPerPage);

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Group justify="space-between" mb="lg">
          <Title order={2}>Все отчеты о прогрессе</Title>
          <Button component="a" href="/progress/new-report">
            Добавить новый отчет
          </Button>
        </Group>

          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Вес (кг)</th>
                <th>Процент жира (%)</th>
                <th>Мышечная масса (кг)</th>
                <th>Комментарии</th>
                <th>Комментарий тренера</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {currentReports.map(report => (
                <tr key={report.id}>
                  <td>{report.date}</td>
                  <td>{report.weight}</td>
                  <td>{report.bodyFat}</td>
                  <td>{report.muscleMass}</td>
                  <td>{report.notes}</td>
                  <td>
                    {report.trainerComment ? (
                      <Badge color="blue" variant="light">
                        {report.trainerComment}
                      </Badge>
                    ) : (
                      <Text c="dimmed" size="sm">-</Text>
                    )}
                  </td>
                  <td>
                    <Button 
                      component="a" 
                      href={`/progress/${report.id}`} 
                      variant="subtle" 
                      size="compact-sm"
                    >
                      Подробнее
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <Pagination
              total={totalPages}
              page={currentPage}
              onChange={setCurrentPage}
              mt="md"
              justify="center"
            />
          )}
        </Paper>
      </Container>
  );
}