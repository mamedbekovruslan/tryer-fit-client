'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Paper, Box, Card, Button, Group, Select, Loader } from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';
import { MdCalendarToday, MdCalendarViewWeek, MdCalendarViewMonth } from 'react-icons/md';

interface NutritionItem {
  id: number;
  mealTime: string;
  title: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const dailyNutritionData: NutritionItem[] = [
  {
    id: 1,
    mealTime: '08:00',
    title: 'Завтрак',
    description: 'Овсянка с ягодами и медом',
    calories: 350,
    protein: 12,
    carbs: 55,
    fat: 8
  },
  {
    id: 2,
    mealTime: '11:00',
    title: 'Перекус',
    description: 'Банан и орехи',
    calories: 200,
    protein: 4,
    carbs: 30,
    fat: 10
  },
  {
    id: 3,
    mealTime: '13:00',
    title: 'Обед',
    description: 'Куриная грудка с гречкой и овощами',
    calories: 450,
    protein: 35,
    carbs: 45,
    fat: 12
  },
  {
    id: 4,
    mealTime: '16:00',
    title: 'Перекус',
    description: 'Творог с фруктами',
    calories: 180,
    protein: 18,
    carbs: 12,
    fat: 6
  },
  {
    id: 5,
    mealTime: '19:00',
    title: 'Ужин',
    description: 'Лосось на пару с брокколи',
    calories: 380,
    protein: 30,
    carbs: 10,
    fat: 22
  },
  {
    id: 6,
    mealTime: '21:00',
    title: 'Перед сном',
    description: 'Кефир',
    calories: 100,
    protein: 8,
    carbs: 10,
    fat: 3
  }
];

const weeklyNutritionData: NutritionItem[] = [
  {
    id: 1,
    mealTime: 'Пн',
    title: 'День 1',
    description: 'Завтрак: Овсянка с ягодами. Обед: Куриная грудка с рисом. Ужин: Салат с авокадо.',
    calories: 1450,
    protein: 65,
    carbs: 120,
    fat: 45
  },
  {
    id: 2,
    mealTime: 'Вт',
    title: 'День 2',
    description: 'Завтрак: Творог с фруктами. Обед: Рыба на пару с овощами. Ужин: Гречка с грибами.',
    calories: 1380,
    protein: 60,
    carbs: 110,
    fat: 40
  },
  {
    id: 3,
    mealTime: 'Ср',
    title: 'День 3',
    description: 'Завтрак: Блинчики с творогом. Обед: Индейка с картофелем. Ужин: Овощное рагу.',
    calories: 1520,
    protein: 70,
    carbs: 130,
    fat: 50
  },
  {
    id: 4,
    mealTime: 'Чт',
    title: 'День 4',
    description: 'Завтрак: Гречневая каша. Обед: Говядина с макаронами. Ужин: Тушеная рыба.',
    calories: 1580,
    protein: 75,
    carbs: 140,
    fat: 55
  },
  {
    id: 5,
    mealTime: 'Пт',
    title: 'День 5',
    description: 'Завтрак: Омлет с овощами. Обед: Курица с гречкой. Ужин: Суп из тыквы.',
    calories: 1420,
    protein: 68,
    carbs: 125,
    fat: 42
  },
  {
    id: 6,
    mealTime: 'Сб',
    title: 'День 6',
    description: 'Завтрак: Мюсли с йогуртом. Обед: Постный борщ. Ужин: Запеченная рыба.',
    calories: 1480,
    protein: 72,
    carbs: 135,
    fat: 48
  },
  {
    id: 7,
    mealTime: 'Вс',
    title: 'День 7',
    description: 'Завтрак: Овсянка с бананом. Обед: Стейк с овощами. Ужин: Салат с креветками.',
    calories: 1600,
    protein: 80,
    carbs: 145,
    fat: 60
  }
];

const monthlyNutritionData: NutritionItem[] = [
  {
    id: 1,
    mealTime: 'Неделя 1',
    title: 'Первая неделя',
    description: 'Фокус на очищение и настройку метаболизма. Много овощей, фруктов, нежирного белка.',
    calories: 10150,
    protein: 455,
    carbs: 840,
    fat: 315
  },
  {
    id: 2,
    mealTime: 'Неделя 2',
    title: 'Вторая неделя',
    description: 'Увеличение белка и сложных углеводов. Введение новых продуктов и рецептов.',
    calories: 10660,
    protein: 490,
    carbs: 910,
    fat: 350
  },
  {
    id: 3,
    mealTime: 'Неделя 3',
    title: 'Третья неделя',
    description: 'Стабилизация режима питания. Поддержание баланса белков, жиров и углеводов.',
    calories: 10780,
    protein: 504,
    carbs: 945,
    fat: 364
  },
  {
    id: 4,
    mealTime: 'Неделя 4',
    title: 'Четвертая неделя',
    description: 'Поддержание достигнутых результатов. Корректировка рациона при необходимости.',
    calories: 10360,
    protein: 488,
    carbs: 896,
    fat: 336
  }
];

export default function NutritionPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'day' | 'week' | 'month'>('day');

  const getFilteredData = () => {
    // В реальном приложении здесь будет логика фильтрации по выбранному периоду
    // Сейчас возвращаем соответствующий набор данных в зависимости от выбранного фильтра
    switch(filter) {
      case 'day':
        return dailyNutritionData;
      case 'week':
        return weeklyNutritionData;
      case 'month':
        return monthlyNutritionData;
      default:
        return dailyNutritionData;
    }
  };

  const filteredData = getFilteredData();

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Box p="md">
          <Title order={2} mb="lg">План питания</Title>

          <Group mb="lg">
            <Select
              label="Период"
              placeholder="Выберите период"
              value={filter}
              onChange={(value) => value && setFilter(value as 'day' | 'week' | 'month')}
              data={[
                { value: 'day', label: 'День' },
                { value: 'week', label: 'Неделя' },
                { value: 'month', label: 'Месяц' }
              ]}
              w={200}
            />

            <Button
              leftSection={
                filter === 'day' ? <MdCalendarToday size={16} /> :
                filter === 'week' ? <MdCalendarViewWeek size={16} /> :
                <MdCalendarViewMonth size={16} />
              }
              variant={filter === 'day' ? 'filled' : 'light'}
              onClick={() => setFilter('day')}
              disabled={filter === 'day'}
            >
              На день
            </Button>

            <Button
              leftSection={
                filter === 'week' ? <MdCalendarViewWeek size={16} /> :
                filter === 'day' ? <MdCalendarToday size={16} /> :
                <MdCalendarViewMonth size={16} />
              }
              variant={filter === 'week' ? 'filled' : 'light'}
              onClick={() => setFilter('week')}
              disabled={filter === 'week'}
            >
              На неделю
            </Button>

            <Button
              leftSection={
                filter === 'month' ? <MdCalendarViewMonth size={16} /> :
                filter === 'day' ? <MdCalendarToday size={16} /> :
                <MdCalendarViewWeek size={16} />
              }
              variant={filter === 'month' ? 'filled' : 'light'}
              onClick={() => setFilter('month')}
              disabled={filter === 'month'}
            >
              На месяц
            </Button>
          </Group>

          <Text mb="md">Ваш план питания на {filter === 'day' ? 'день' : filter === 'week' ? 'неделю' : 'месяц'}:</Text>

          {filteredData.map((item) => (
            <Card key={item.id} shadow="sm" padding="lg" radius="md" withBorder mb="md">
              <Group justify="space-between" mb="xs">
                <Text fw={500}>{item.title} - {item.mealTime}</Text>
                <Text c="dimmed" size="sm">{item.calories} ккал</Text>
              </Group>

              <Text size="sm" mb="sm">{item.description}</Text>

              <Group>
                <Text size="xs">Белки: {item.protein}г</Text>
                <Text size="xs">Углеводы: {item.carbs}г</Text>
                <Text size="xs">Жиры: {item.fat}г</Text>
              </Group>
            </Card>
          ))}
        </Box>
      </Paper>
    </Container>
  );
}