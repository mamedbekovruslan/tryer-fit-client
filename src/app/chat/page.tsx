'use client';

import { useEffect, useState, useMemo } from 'react';
import { Box, Text, Center, Loader, Stack, Avatar } from '@mantine/core';
import { useSearchParams, useRouter } from 'next/navigation';
import { chatService, ChatUser } from '@/services/chatService';
import { ClientList } from '@/components/chat/ClientList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { useAuth } from '@/providers/AuthProvider';

interface CurrentUser {
  id: number;
  user_type: 'client' | 'trainer';
  username: string;
  trainer?: {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
  } | null;
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clientIdFromQuery = searchParams.get('clientId');
  const { user, isInitializing, isAuthenticated } = useAuth();

  const [clients, setClients] = useState<ChatUser[]>([]);
  const [isClientsLoading, setIsClientsLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const currentUser = user as CurrentUser | null;

  // Обновление selectedClientId при изменении query параметра
  useEffect(() => {
    if (isInitializing) {
      return;
    }

    if (!isAuthenticated || !currentUser) {
      router.push('/auth');
    }
  }, [isAuthenticated, isInitializing, currentUser, router]);

  useEffect(() => {
    if (clientIdFromQuery) {
      setSelectedClientId(parseInt(clientIdFromQuery, 10));
    } else {
      setSelectedClientId(null);
    }
  }, [clientIdFromQuery]);

  // Загрузка списка клиентов (для тренера)
  useEffect(() => {
    if (!currentUser || currentUser.user_type !== 'trainer') {
      setIsClientsLoading(false);
      return;
    }

    const loadClients = async () => {
      try {
        const data = await chatService.getUserChats();
        setClients(data);

        // Если клиент не выбран, но есть клиенты в списке, выбираем первого
        if (!selectedClientId && data.length > 0) {
          const firstClientId = data[0].userId;
          setSelectedClientId(firstClientId);
          router.push(`/chat?clientId=${firstClientId}`);
        }
      } catch (error) {
        console.error('[ChatPage] Error loading clients:', error);
      } finally {
        setIsClientsLoading(false);
      }
    };

    loadClients();
  }, [currentUser, selectedClientId, router]);

  // Находим информацию о выбранном клиенте
  const selectedClient = useMemo(
    () => clients.find((c) => c.userId === selectedClientId),
    [clients, selectedClientId]
  );

  // Показываем загрузку пока не определили пользователя
  if (isInitializing || !currentUser) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader />
      </Center>
    );
  }
  // Если пользователь - клиент, показываем только чат с его тренером
  if (currentUser.user_type === 'client') {
    if (!currentUser.trainer) {
      return (
        <Center style={{ height: 'calc(100vh - 60px)' }}>
          <Stack align="center" gap="xs">
            <Avatar size="lg" radius="xl" color="gray">
              ?
            </Avatar>
            <Text c="dimmed">У вас нет закреплённого тренера</Text>
          </Stack>
        </Center>
      );
    }

    return (
      <Box style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', padding: '16px' }}>
        <ChatWindow
          otherUserId={currentUser.trainer.id}
          otherUserUsername={
            `${currentUser.trainer.first_name || ''} ${currentUser.trainer.last_name || ''}`.trim() ||
            currentUser.trainer.username
          }
          currentUserId={currentUser.id}
          currentUserType="client"
        />
      </Box>
    );
  }

  // Если пользователь - тренер
  if (isClientsLoading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader />
      </Center>
    );
  }

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', padding: '16px' }}>
      <Box style={{ display: 'flex', flex: 1, overflow: 'hidden', padding: '32px' }}>
        {/* Сайдбар со списком клиентов */}
        <Box
          style={{
            width: '320px',
            borderRight: '1px solid var(--mantine-color-gray-3)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
            <Text fw={600} size="xl">
              Клиенты
            </Text>
          </Box>
          <ClientList clients={clients} selectedClientId={selectedClientId} />
        </Box>

        {/* Окно чата */}
        <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedClientId && selectedClient ? (
            <ChatWindow
              otherUserId={selectedClientId}
              otherUserUsername={selectedClient.username}
              currentUserId={currentUser.id}
              currentUserType="trainer"
            />
          ) : (
            <Center style={{ flex: 1 }}>
              <Stack align="center" gap="xs">
                <Avatar size="lg" radius="xl" color="gray">
                  💬
                </Avatar>
                <Text c="dimmed">Выберите клиента для начала переписки</Text>
              </Stack>
            </Center>
          )}
        </Box>
      </Box>
    </Box>
  );
}
