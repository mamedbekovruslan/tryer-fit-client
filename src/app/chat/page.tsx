'use client';

import { useEffect, useMemo } from 'react';
import { Box, Text, Center, Loader, Stack, Avatar } from '@mantine/core';
import { useSearchParams, useRouter } from 'next/navigation';
import { ClientList } from '@/components/chat/ClientList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { useAuth } from '@/providers/AuthProvider';
import { useChatStore } from '@/stores/chatStore';

interface CurrentUser {
  id: number;
  user_type: 'client' | 'trainer';
  username: string;
  trainer?: {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
    photo_urls?: string[];
    photoUrls?: string[];
  } | null;
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clientIdFromQuery = searchParams.get('clientId');
  const { user, isInitializing, isAuthenticated } = useAuth();
  const clients = useChatStore((state) => state.clients);
  const isClientsLoading = useChatStore((state) => state.isClientsLoading);
  const selectedClientId = useChatStore((state) => state.selectedClientId);
  const setSelectedClientId = useChatStore((state) => state.setSelectedClientId);
  const loadChats = useChatStore((state) => state.loadChats);
  const currentUser = user as CurrentUser | null;

  const getPhotoUrl = (photoUrls?: string[]) => {
    const firstPhoto = photoUrls?.[0];
    return firstPhoto && firstPhoto.trim() ? firstPhoto : null;
  };

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
  }, [clientIdFromQuery, setSelectedClientId]);

  useEffect(() => {
    if (!currentUser || currentUser.user_type !== 'trainer') {
      return;
    }

    const loadClients = async () => {
      try {
        const data = await loadChats();

        if (!selectedClientId && data.length > 0) {
          const firstClientId = data[0].userId;
          setSelectedClientId(firstClientId);
          router.push(`/chat?clientId=${firstClientId}`);
        }
      } catch (error) {
      }
    };

    void loadClients();
  }, [currentUser, loadChats, router, selectedClientId, setSelectedClientId]);

  const selectedClient = useMemo(
    () => clients.find((c) => c.userId === selectedClientId),
    [clients, selectedClientId]
  );

  if (isInitializing || !currentUser) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader />
      </Center>
    );
  }
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
          otherUserPhotoUrl={
            getPhotoUrl(currentUser.trainer.photo_urls) ??
            getPhotoUrl(currentUser.trainer.photoUrls)
          }
          currentUserId={currentUser.id}
          currentUserType="client"
        />
      </Box>
    );
  }

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
          <ClientList clients={clients} />
        </Box>

        <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedClientId && selectedClient ? (
            <ChatWindow
              otherUserId={selectedClientId}
              otherUserUsername={selectedClient.username}
              otherUserPhotoUrl={
                getPhotoUrl(selectedClient.photo_urls) ??
                getPhotoUrl(selectedClient.photoUrls)
              }
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
