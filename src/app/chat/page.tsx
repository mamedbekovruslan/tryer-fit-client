'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Paper, Stack, Text, TextInput, Button, Group, Avatar, ScrollArea } from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import { useRouter, useSearchParams } from 'next/navigation';

// Типы данных для сообщений
interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  timestamp: string;
  is_read: boolean;
}

// Тип данных для клиента
interface Client {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export default function ChatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Получаем ID клиента из параметров URL (например, /chat?clientId=1)
  const clientId = searchParams?.get('clientId');

  useEffect(() => {
    if (!user || user.user_type !== 'trainer') {
      // Если пользователь не тренер, перенаправляем на главную
      router.push('/home');
      return;
    }

    if (!clientId) {
      // Если не указан ID клиента, перенаправляем на админ панель
      router.push('/admin');
      return;
    }

    const loadChatData = async () => {
      try {
        // Используем моковые данные для клиента, так как реального API пока нет
        const mockClient: Client = {
          id: parseInt(clientId, 10),
          username: `client${clientId}`,
          email: `client${clientId}@example.com`,
          first_name: `Клиент${clientId}`,
          last_name: `Тестовый${clientId}`
        };
        
        setClient(mockClient);

        // Загружаем моковую историю сообщений
        const mockMessages: Message[] = [
          {
            id: 1,
            sender_id: parseInt(clientId, 10),
            receiver_id: user.id,
            message: 'Привет! Как дела?',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            is_read: true
          },
          {
            id: 2,
            sender_id: user.id,
            receiver_id: parseInt(clientId, 10),
            message: 'Привет! Всё отлично, спасибо! Как тренировки?',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            is_read: true
          },
          {
            id: 3,
            sender_id: parseInt(clientId, 10),
            receiver_id: user.id,
            message: 'Тренировки идут хорошо, но есть вопросы по питанию',
            timestamp: new Date(Date.now() - 600000).toISOString(),
            is_read: true
          }
        ];
        setMessages(mockMessages);
      } catch (error) {
        console.error('Error loading chat data:', error);
        // Если не удалось загрузить данные, перенаправляем на админ панель
        router.push('/admin');
      } finally {
        setLoading(false);
      }
    };

    loadChatData();
  }, [user, clientId, router]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !client) return;

    // В реальном приложении здесь будет вызов API для отправки сообщения
    const newMessageObj: Message = {
      id: messages.length + 1,
      sender_id: user!.id,
      receiver_id: client.id,
      message: newMessage,
      timestamp: new Date().toISOString(),
      is_read: false
    };

    setMessages([...messages, newMessageObj]);
    setNewMessage('');
  };

  if (loading) {
    return (
      <UserTypeProtectedRoute allowedUserTypes={['trainer']}>
        <Container size="md" py="xl">
          <Paper shadow="md" p="xl" radius="md">
            <Text ta="center">Загрузка чата...</Text>
          </Paper>
        </Container>
      </UserTypeProtectedRoute>
    );
  }

  if (!user || !client) {
    return (
      <UserTypeProtectedRoute allowedUserTypes={['trainer']}>
        <Container size="md" py="xl">
          <Paper shadow="md" p="xl" radius="md">
            <Text ta="center">Не удалось загрузить данные чата</Text>
          </Paper>
        </Container>
      </UserTypeProtectedRoute>
    );
  }

  return (
    <UserTypeProtectedRoute allowedUserTypes={['trainer']}>
      <Container size="md" py="xl">
        <Paper shadow="md" p="xl" radius="md">
          <Group mb="xl">
            <Avatar
              src={null} // Здесь может быть аватар клиента
              alt={client.username}
              radius="xl"
              size="md"
            >
              {client.username?.charAt(0)?.toUpperCase()}
            </Avatar>
            <div>
              <Title order={3}>
                {client.first_name} {client.last_name} ({client.username})
              </Title>
              <Text size="sm" c="dimmed">
                {client.email}
              </Text>
            </div>
          </Group>

          <Paper shadow="xs" p="md" mb="xl" style={{ height: '400px' }}>
            <ScrollArea h="100%" offsetScrollbars>
              <Stack gap="sm">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    style={{ 
                      textAlign: message.sender_id === user.id ? 'right' : 'left',
                      marginLeft: message.sender_id === user.id ? '25%' : '0',
                      marginRight: message.sender_id === user.id ? '0' : '25%'
                    }}
                  >
                    <Paper 
                      p="sm" 
                      radius="md" 
                      style={{ 
                        display: 'inline-block',
                        backgroundColor: message.sender_id === user.id ? '#3b82f6' : '#e5e7eb',
                        color: message.sender_id === user.id ? 'white' : 'black'
                      }}
                    >
                      <Text>{message.message}</Text>
                      <Text size="xs" mt="xs" style={{ opacity: 0.7 }}>
                        {new Date(message.timestamp).toLocaleString()}
                      </Text>
                    </Paper>
                  </div>
                ))}
              </Stack>
            </ScrollArea>
          </Paper>

          <Group>
            <TextInput
              placeholder="Введите сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.currentTarget.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              flex={1}
            />
            <Button onClick={handleSendMessage}>Отправить</Button>
          </Group>
        </Paper>
      </Container>
    </UserTypeProtectedRoute>
  );
}