'use client';

import { useEffect, useState } from 'react';
import { Alert, Button, Container, Group, NumberInput, Paper, Text, Textarea, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useParams, useRouter } from 'next/navigation';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import {
  progressReportService,
  ProgressReport,
  UpdateProgressReportRequest,
} from '@/services/progressReportService';

interface EditableReport {
  id: number;
  date: Date | null;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  notes: string;
}

function normalizeDateValue(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

function toEditableReport(report: ProgressReport): EditableReport {
  return {
    id: report.id,
    date: new Date(report.date),
    weight: report.weight,
    bodyFat: report.bodyFat,
    muscleMass: report.muscleMass,
    chest: report.chest,
    waist: report.waist,
    hips: report.hips,
    arms: report.arms,
    thighs: report.thighs,
    notes: report.notes || '',
  };
}

export default function EditReportPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = Number(params.id);

  const [reportData, setReportData] = useState<EditableReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        const report = await progressReportService.getProgressReportById(reportId);
        setReportData(toEditableReport(report));
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить отчет');
      } finally {
        setLoading(false);
      }
    };

    if (Number.isFinite(reportId)) {
      void loadReport();
    } else {
      setLoading(false);
      setError('Некорректный идентификатор отчета');
    }
  }, [reportId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportData) return;

    if (!reportData.date) {
      setError('Дата обязательна');
      return;
    }

    if (!reportData.weight || reportData.weight <= 0) {
      setError('Введите корректный вес');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const payload: UpdateProgressReportRequest = {
        date: reportData.date,
        weight: reportData.weight,
        bodyFat: reportData.bodyFat,
        muscleMass: reportData.muscleMass,
        chest: reportData.chest,
        waist: reportData.waist,
        hips: reportData.hips,
        arms: reportData.arms,
        thighs: reportData.thighs,
        notes: reportData.notes,
      };

      await progressReportService.updateProgressReport(reportData.id, payload);
      setSuccess(true);
      setTimeout(() => router.push(`/progress/${reportData.id}`), 800);
    } catch (err) {
      console.error(err);
      setError('Не удалось сохранить изменения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <UserTypeProtectedRoute allowedUserTypes={['client']}>
      <Container size="md" py="xl">
        <Paper shadow="md" p="xl" radius="md">
          {loading ? (
            <Text ta="center">Загрузка отчета...</Text>
          ) : !reportData ? (
            <Text ta="center">{error || 'Отчет не найден'}</Text>
          ) : (
            <>
              <Title order={2} mb="lg">
                Редактировать отчет от {reportData.date?.toLocaleDateString('ru-RU')}
              </Title>

              {success && (
                <Alert title="Успешно" color="green" mb="lg">
                  Отчет о прогрессе успешно обновлен
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
                  onChange={(date) =>
                    setReportData((prev) =>
                      prev ? { ...prev, date: normalizeDateValue(date) } : prev,
                    )
                  }
                  required
                  mb="md"
                />

                <NumberInput
                  label="Вес (кг)"
                  placeholder="Введите вес"
                  value={reportData.weight}
                  onChange={(value) => setReportData((prev) => (prev ? { ...prev, weight: typeof value === 'number' ? value : undefined } : prev))}
                  min={0}
                  mb="md"
                />

                <NumberInput
                  label="Процент жира (%)"
                  placeholder="Введите процент жира"
                  value={reportData.bodyFat}
                  onChange={(value) => setReportData((prev) => (prev ? { ...prev, bodyFat: typeof value === 'number' ? value : undefined } : prev))}
                  min={0}
                  mb="md"
                />

                <NumberInput
                  label="Мышечная масса (кг)"
                  placeholder="Введите мышечную массу"
                  value={reportData.muscleMass}
                  onChange={(value) => setReportData((prev) => (prev ? { ...prev, muscleMass: typeof value === 'number' ? value : undefined } : prev))}
                  min={0}
                  mb="md"
                />

                <Group grow mb="md">
                  <NumberInput label="Грудь" value={reportData.chest} onChange={(value) => setReportData((prev) => (prev ? { ...prev, chest: typeof value === 'number' ? value : undefined } : prev))} min={0} />
                  <NumberInput label="Талия" value={reportData.waist} onChange={(value) => setReportData((prev) => (prev ? { ...prev, waist: typeof value === 'number' ? value : undefined } : prev))} min={0} />
                  <NumberInput label="Бедра" value={reportData.hips} onChange={(value) => setReportData((prev) => (prev ? { ...prev, hips: typeof value === 'number' ? value : undefined } : prev))} min={0} />
                </Group>

                <Group grow mb="md">
                  <NumberInput label="Руки" value={reportData.arms} onChange={(value) => setReportData((prev) => (prev ? { ...prev, arms: typeof value === 'number' ? value : undefined } : prev))} min={0} />
                  <NumberInput label="Бедра (ноги)" value={reportData.thighs} onChange={(value) => setReportData((prev) => (prev ? { ...prev, thighs: typeof value === 'number' ? value : undefined } : prev))} min={0} />
                </Group>

                <Textarea
                  label="Комментарии"
                  placeholder="Введите дополнительные комментарии"
                  value={reportData.notes}
                  onChange={(event) => setReportData((prev) => (prev ? { ...prev, notes: event.currentTarget.value } : prev))}
                  minRows={4}
                  mb="md"
                />

                <Group justify="space-between" mt="xl">
                  <Button component="a" href={`/progress/${reportData.id}`} variant="outline">
                    Отмена
                  </Button>
                  <Button type="submit" loading={saving}>
                    Сохранить изменения
                  </Button>
                </Group>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </UserTypeProtectedRoute>
  );
}
