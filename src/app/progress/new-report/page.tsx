'use client';

import { useState } from 'react';
import { Container, Title, Text, Paper, Button, Group, TextInput, NumberInput, Select, Textarea, Alert } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useAuth } from '@/providers/AuthProvider';

export default function NewReportPage() {
  const { user } = useAuth();
  const [reportData, setReportData] = useState({
    date: new Date(),
    weight: 0,
    bodyFat: 0,
    muscleMass: 0,
    chest: 0,
    waist: 0,
    hips: 0,
    arms: 0,
    thighs: 0,
    notes: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: any) => {
    setReportData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    console.log('Отправка данных:', reportData);
    
    // Сброс формы и показ сообщения об успехе
    setReportData({
      date: new Date(),
      weight: 0,
      bodyFat: 0,
      muscleMass: 0,
      chest: 0,
      waist: 0,
      hips: 0,
      arms: 0,
      thighs: 0,
      notes: '',
    });
    setSuccess(true);
    setError('');
  };

  return (
    <Container size="md" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Title order={2} mb="lg">Добавить прогресс</Title>
          
          {success && (
            <Alert title="Успешно" color="green" mb="lg">
              Отчет о прогрессе успешно добавлен!
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
                value={reportData.chest}
                onChange={(value) => handleChange('chest', value)}
                min={0}
                max={300}
              />
              
              <NumberInput
                label="Талия"
                placeholder="Талия"
                value={reportData.waist}
                onChange={(value) => handleChange('waist', value)}
                min={0}
                max={300}
              />
              
              <NumberInput
                label="Бедра"
                placeholder="Бедра"
                value={reportData.hips}
                onChange={(value) => handleChange('hips', value)}
                min={0}
                max={300}
              />
            </Group>
            
            <Group grow mb="md">
              <NumberInput
                label="Руки"
                placeholder="Руки"
                value={reportData.arms}
                onChange={(value) => handleChange('arms', value)}
                min={0}
                max={300}
              />
              
              <NumberInput
                label="Бедра (ноги)"
                placeholder="Бедра (ноги)"
                value={reportData.thighs}
                onChange={(value) => handleChange('thighs', value)}
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

            <Group justify="flex-end" mt="xl">
              <Button type="submit" variant="filled">
                Сохранить отчет
              </Button>
            </Group>
          </form>
        </Paper>
      </Container>
  );
}