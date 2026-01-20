'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Paper, Button, Group, TextInput, NumberInput, Select, Textarea, Alert } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useParams } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

// Типы данных
interface ProgressReport {
  id: number;
  date: Date;
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
  date: new Date('2024-04-25'),
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

export default function EditReportPage() {
  const { user } = useAuth();
  const params = useParams();
  const reportId = params.id as string;
  
  const [reportData, setReportData] = useState<ProgressReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // В реальном приложении здесь будет запрос к API для получения данных отчета
    // Сейчас используем моковые данные
    setTimeout(() => {
      setReportData(mockReport);
      setLoading(false);
    }, 500);
  }, [reportId]);

  const handleChange = (field: string, value: any) => {
    if (!reportData) return;
    
    if (field.includes('.')) {
      // Обработка вложенных полей (например, measurements.chest)
      const [parent, child] = field.split('.');
      setReportData(prev => ({
        ...prev!,
        [parent]: {
          ...(prev![parent as keyof ProgressReport] as object),
          [child]: value
        }
      }));
    } else {
      setReportData(prev => ({
        ...prev!,
        [field]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportData) return;
    
    // Валидация
    if (!reportData.date) {
      setError('Дата обязательна');
      return;
    }
    
    if (reportData.weight <= 0) {
      setError('Введите корректный вес');
      return;
    }
    
    // Здесь будет логика отправки данных на сервер
    console.log('Отправка обновленных данных:', reportData);
    
    // Показ сообщения об успехе
    setSuccess(true);
    setError('');
  };

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

  if (!reportData) {
    return (
      <Container size="md" py="xl">
        <Paper shadow="md" p="xl" radius="md" style={{ textAlign: 'center' }}>
          <Text>Отчет не найден</Text>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Group justify="space-between" mb="lg">
          <Title order={2}>Редактировать отчет от {reportData.date.toLocaleDateString()}</Title>
        </Group>
          
          {success && (
            <Alert title="Успешно" color="green" mb="lg">
              Отчет о прогрессе успешно обновлен!
            </Alert>
          )}
          
          {error && (
            <Alert title="Ошибка" color="red" mb="lg">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <DatePickerInput
              label="Дата"
              placeholder="Выберите дату"
              value={reportData.date}
              onChange={(date) => handleChange('date', date)}
              required
              mb="md"
            />

            <NumberInput
              label="Вес (кг)"
              placeholder="Введите вес"
              value={reportData.weight}
              onChange={(value) => handleChange('weight', value)}
              min={0}
              max={300}
              required
              mb="md"
            />

            <NumberInput
              label="Процент жира (%)"
              placeholder="Введите процент жира"
              value={reportData.bodyFat}
              onChange={(value) => handleChange('bodyFat', value)}
              min={0}
              max={100}
              mb="md"
            />

            <NumberInput
              label="Мышечная масса (кг)"
              placeholder="Введите мышечную массу"
              value={reportData.muscleMass}
              onChange={(value) => handleChange('muscleMass', value)}
              min={0}
              max={300}
              mb="md"
            />

            <Title order={4} mb="md">Измерения (см)</Title>
            
            <Group grow mb="md">
              <NumberInput
                label="Грудь"
                placeholder="Грудь"
                value={reportData.measurements.chest}
                onChange={(value) => handleChange('measurements.chest', value)}
                min={0}
                max={300}
              />
              
              <NumberInput
                label="Талия"
                placeholder="Талия"
                value={reportData.measurements.waist}
                onChange={(value) => handleChange('measurements.waist', value)}
                min={0}
                max={300}
              />
              
              <NumberInput
                label="Бедра"
                placeholder="Бедра"
                value={reportData.measurements.hips}
                onChange={(value) => handleChange('measurements.hips', value)}
                min={0}
                max={300}
              />
            </Group>
            
            <Group grow mb="md">
              <NumberInput
                label="Руки"
                placeholder="Руки"
                value={reportData.measurements.arms}
                onChange={(value) => handleChange('measurements.arms', value)}
                min={0}
                max={300}
              />
              
              <NumberInput
                label="Бедра (ноги)"
                placeholder="Бедра (ноги)"
                value={reportData.measurements.thighs}
                onChange={(value) => handleChange('measurements.thighs', value)}
                min={0}
                max={300}
              />
            </Group>

            <Textarea
              label="Комментарии"
              placeholder="Введите дополнительные комментарии"
              value={reportData.notes}
              onChange={(value) => handleChange('notes', value)}
              mb="md"
              minRows={4}
            />

            <Group justify="space-between" mt="xl">
              <Button component="a" href={`/progress/${reportData.id}`} variant="outline">
                Отмена
              </Button>
              <Button type="submit" variant="filled">
                Сохранить изменения
              </Button>
            </Group>
          </form>
        </Paper>
      </Container>
  );
}