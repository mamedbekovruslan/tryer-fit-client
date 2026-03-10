'use client';

import { useState } from 'react';
import { Container, Title, Text, Paper, Button, Group, NumberInput, Alert, Image, FileInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useAuth } from '@/providers/AuthProvider';
import { progressReportService } from '@/services/progressReportService';

// Используем типы из сервиса
// interface ProgressReport {
//   date: Date | null;
//   weight: number | '';
//   waist: number | '';
//   hips: number | '';
//   chest: number | '';
//   arms: number | '';
//   thighs: number | '';
//   bodyFat: number | '';
//   muscleMass: number | '';
//   photos: File[];
//   notes: string;
// }

// Тип для локального состояния формы
interface LocalProgressReport {
  date: Date | null;
  weight: number | '';
  waist: number | '';
  hips: number | '';
  chest: number | '';
  arms: number | '';
  thighs: number | '';
  bodyFat: number | '';
  muscleMass: number | '';
  photos: File[];
  notes: string;
}

export default function NewProgressReportPage() {
  const { user } = useAuth();
  const [reportData, setReportData] = useState<LocalProgressReport>({
    date: new Date(),
    weight: '',
    waist: '',
    hips: '',
    chest: '',
    arms: '',
    thighs: '',
    bodyFat: '',
    muscleMass: '',
    photos: [],
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (field: keyof LocalProgressReport, value: any) => {
    setReportData(prev => ({
      ...prev,
      [field]: value
    }));

    // Очистить ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error(`Не удалось прочитать файл ${file.name}`));
      reader.readAsDataURL(file);
    });

  const handlePhotoUpload = (file: File | null) => {
    if (!file) {
      setReportData(prev => ({
        ...prev,
        photos: []
      }));
      return;
    }

    setReportData(prev => ({
      ...prev,
      photos: [file]
    }));
  };

  const removePhoto = (index: number) => {
    setReportData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!reportData.date) {
      newErrors.date = 'Дата обязательна';
    }

    if (reportData.weight === '') {
      newErrors.weight = 'Вес обязателен';
    } else if (typeof reportData.weight === 'number' && (reportData.weight <= 0 || reportData.weight > 500)) {
      newErrors.weight = 'Введите корректный вес';
    }

    if (reportData.waist === '') {
      newErrors.waist = 'Обхват талии обязателен';
    } else if (typeof reportData.waist === 'number' && (reportData.waist <= 0 || reportData.waist > 300)) {
      newErrors.waist = 'Введите корректный обхват талии';
    }

    if (reportData.hips === '') {
      newErrors.hips = 'Обхват бедер обязателен';
    } else if (typeof reportData.hips === 'number' && (reportData.hips <= 0 || reportData.hips > 300)) {
      newErrors.hips = 'Введите корректный обхват бедер';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setUploading(true);

    try {
      const uploadedPhotoUrls = await Promise.all(
        reportData.photos.map((photo) => fileToDataUrl(photo))
      );

      // Подготовка данных для отправки
      const progressReportData = {
        date: reportData.date!.toISOString(), // Преобразуем дату в ISO строку для корректной передачи
        weight: typeof reportData.weight === 'number' ? reportData.weight : undefined,
        waist: typeof reportData.waist === 'number' ? reportData.waist : undefined,
        hips: typeof reportData.hips === 'number' ? reportData.hips : undefined,
        chest: typeof reportData.chest === 'number' ? reportData.chest : undefined,
        arms: typeof reportData.arms === 'number' ? reportData.arms : undefined,
        thighs: typeof reportData.thighs === 'number' ? reportData.thighs : undefined,
        bodyFat: typeof reportData.bodyFat === 'number' ? reportData.bodyFat : undefined,
        muscleMass: typeof reportData.muscleMass === 'number' ? reportData.muscleMass : undefined,
        notes: reportData.notes,
        photoUrls: uploadedPhotoUrls,
      };

      // Отправка данных на сервер
      await progressReportService.createProgressReport(progressReportData);

      setSuccess(true);

      // Сброс формы после успешной отправки
      setReportData({
        date: new Date(),
        weight: '',
        waist: '',
        hips: '',
        chest: '',
        arms: '',
        thighs: '',
        bodyFat: '',
        muscleMass: '',
        photos: [],
        notes: ''
      });
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      // Обработка ошибки - можно добавить более подробную обработку
      alert('Ошибка при сохранении отчета. Попробуйте еще раз.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container size="md" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Group justify="space-between" mb="lg">
          <Title order={2}>Добавить прогресс</Title>
        </Group>

        {success && (
          <Alert title="Успешно" color="green" mb="lg">
            Отчет о прогрессе успешно добавлен!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <DatePickerInput
            label="Дата"
            placeholder="Выберите дату"
            value={reportData.date}
            onChange={(date) => handleChange('date', date)}
            required
            error={errors.date}
            mb="md"
          />

          <NumberInput
            label="Вес (кг)"
            placeholder="Введите вес"
            value={reportData.weight}
            onChange={(value) => handleChange('weight', value)}
            required
            error={errors.weight}
            min={1}
            max={500}
            mb="md"
          />

          <NumberInput
            label="Обхват талии (см)"
            placeholder="Введите обхват талии"
            value={reportData.waist}
            onChange={(value) => handleChange('waist', value)}
            required
            error={errors.waist}
            min={1}
            max={300}
            mb="md"
          />

          <NumberInput
            label="Обхват бедер (см)"
            placeholder="Введите обхват бедер"
            value={reportData.hips}
            onChange={(value) => handleChange('hips', value)}
            required
            error={errors.hips}
            min={1}
            max={300}
            mb="md"
          />

          <Title order={4} mb="md">Дополнительные параметры</Title>

          <NumberInput
            label="Обхват груди (см)"
            placeholder="Введите обхват груди"
            value={reportData.chest}
            onChange={(value) => handleChange('chest', value)}
            min={1}
            max={300}
            mb="md"
          />

          <NumberInput
            label="Обхват рук (см)"
            placeholder="Введите обхват рук"
            value={reportData.arms}
            onChange={(value) => handleChange('arms', value)}
            min={1}
            max={300}
            mb="md"
          />

          <NumberInput
            label="Обхват бедер (ноги) (см)"
            placeholder="Введите обхват бедер (ноги)"
            value={reportData.thighs}
            onChange={(value) => handleChange('thighs', value)}
            min={1}
            max={300}
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
            min={1}
            max={500}
            mb="md"
          />

          <Text size="sm" mb="xs" mt="md">
            Фото прогресса
          </Text>
          <FileInput
            placeholder="Выберите изображение"
            accept="image/*"
            clearable
            onChange={handlePhotoUpload}
            mb="md"
          />

          {reportData.photos.length > 0 && (
            <Group mt="md">
              {reportData.photos.map((photo, index) => (
                <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                  <Image
                    src={URL.createObjectURL(photo)}
                    alt={`Фото ${index + 1}`}
                    width={100}
                    height={100}
                    fit="cover"
                    radius="md"
                  />
                  <Button
                    size="xs"
                    variant="light"
                    color="red"
                    style={{ position: 'absolute', top: -10, right: -10 }}
                    onClick={() => removePhoto(index)}
                  >
                    Удалить
                  </Button>
                </div>
              ))}
            </Group>
          )}

          <Button
            type="submit"
            variant="filled"
            fullWidth
            mt="xl"
            loading={uploading}
          >
            Сохранить отчет
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
