'use client';

import { useState } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Paper, 
  Stack, 
  Card, 
  Grid, 
  Button, 
  TextInput,
  Select,
  Group,
  Alert
} from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Типы данных
interface NutritionSubcategory {
  id: number;
  name: string;
  category_id: number;
  created_at: string;
}

export default function CreateNutritionSubcategoryPage() {
  const { categoryId } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  
  const [subcategoryData, setSubcategoryData] = useState({
    name: '',
    description: ''
  });
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setSubcategoryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!subcategoryData.name.trim()) {
      setError('Название дня обязательно');
      return;
    }
    
    // Здесь будет вызов API для сохранения подкатегории
    console.log('Сохраняем день питания:', subcategoryData);
    
    // Имитация успешного сохранения
    setSuccess(true);
    setError('');
    
    // Через 2 секунды перенаправляем обратно к категории
    setTimeout(() => {
      router.push(`/admin/nutrition/${categoryId}`);
    }, 2000);
  };

  if (!user) {
    return (
      <UserTypeProtectedRoute allowedUserTypes={['trainer']}>
        <Container size="md" py="xl">
          <Paper shadow="md" p="xl" radius="md">
            <Text ta="center">Загрузка...</Text>
          </Paper>
        </Container>
      </UserTypeProtectedRoute>
    );
  }

  return (
    <UserTypeProtectedRoute allowedUserTypes={['trainer']}>
      <Container size="lg" py="xl">
        <Paper shadow="md" p="xl" radius="md">
          <Title order={1} ta="center" mb="xl">Создать день питания: {categoryId}</Title>
          
          {success && (
            <Alert title="Успех!" color="green" mb="md">
              День питания успешно создан!
            </Alert>
          )}
          
          {error && (
            <Alert title="Ошибка" color="red" mb="md">
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Grid gutter="xl">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Stack gap="md">
                    <Title order={3}>Основная информация</Title>
                    
                    <Select
                      label="День недели"
                      placeholder="Выберите день недели"
                      data={[
                        { value: 'Понедельник', label: 'Понедельник' },
                        { value: 'Вторник', label: 'Вторник' },
                        { value: 'Среда', label: 'Среда' },
                        { value: 'Четверг', label: 'Четверг' },
                        { value: 'Пятница', label: 'Пятница' },
                        { value: 'Суббота', label: 'Суббота' },
                        { value: 'Воскресенье', label: 'Воскресенье' }
                      ]}
                      value={subcategoryData.name}
                      onChange={(value) => handleInputChange('name', value)}
                      required
                    />
                    
                    <TextInput
                      label="Описание (необязательно)"
                      placeholder="Краткое описание дня питания..."
                      value={subcategoryData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                  </Stack>
                </Card>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Stack gap="md">
                    <Title order={3}>Информация</Title>
                    <Text>
                      После создания дня питания вы сможете добавить планы питания для этого дня.
                      Каждый день может содержать несколько планов питания, которые будут включать
                      завтрак, обед, ужин и перекусы.
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
            
            <Group justify="center" mt="xl">
              <Button 
                type="submit" 
                size="lg"
                disabled={success}
              >
                {success ? 'Создание...' : 'Создать день питания'}
              </Button>
              
              <Link href={`/admin/nutrition/${categoryId}`} passHref>
                <Button variant="outline" size="lg">
                  Отмена
                </Button>
              </Link>
            </Group>
          </form>
        </Paper>
      </Container>
    </UserTypeProtectedRoute>
  );
}