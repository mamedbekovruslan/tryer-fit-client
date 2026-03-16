'use client';

import { useEffect, useCallback, useRef } from 'react';
import { Box, Stack, Center, Loader, Text } from '@mantine/core';
import { useChatSocket } from '@/hooks/useChatSocket';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ChatHeader } from './ChatHeader';
import { useChatStore } from '@/stores/chatStore';
import { type ChatMessage } from '@/services/chatService';

interface ChatWindowProps {
  otherUserId: number;
  otherUserUsername: string;
  currentUserId: number;
  currentUserType: 'client' | 'trainer';
  otherUserPhotoUrl?: string | null;
}

const EMPTY_MESSAGES: ChatMessage[] = [];

export function ChatWindow({
  otherUserId,
  otherUserUsername,
  currentUserId,
  currentUserType,
  otherUserPhotoUrl,
}: ChatWindowProps) {
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentOtherUserIdRef = useRef<number>(otherUserId);
  const messages = useChatStore(
    useCallback(
      (state) => state.messagesByUserId[otherUserId] ?? EMPTY_MESSAGES,
      [otherUserId],
    ),
  );
  const isLoading = useChatStore(
    useCallback(
      (state) => state.loadingConversations[otherUserId] ?? false,
      [otherUserId],
    ),
  );
  const isTyping = useChatStore(
    useCallback(
      (state) => state.typingByUserId[otherUserId] ?? false,
      [otherUserId],
    ),
  );
  const connectionAttempted = useChatStore((state) => state.connectionAttempted);
  const loadConversation = useChatStore((state) => state.loadConversation);
  const setTyping = useChatStore((state) => state.setTyping);

  const { sendMessage, markAsRead, sendTypingStatus, isConnected } = useChatSocket({
    onMessage: (message) => {
      if (message.senderId !== currentUserId) {
        markAsRead(message.senderId);
      }
    },
    onUserTyping: (data) => {
      if (data.senderId === otherUserId) {
        setTyping(data.senderId, data.isTyping);
      }
    },
  });

  // Отслеживаем смену собеседника
  useEffect(() => {
    if (currentOtherUserIdRef.current !== otherUserId) {
      currentOtherUserIdRef.current = otherUserId;
    }
  }, [otherUserId]);

  // Загрузка истории переписки
  useEffect(() => {
    if (otherUserId) {
      void loadConversation(otherUserId, currentUserId);
    }
  }, [currentUserId, loadConversation, otherUserId]);

  // Отправка сообщения
  const handleSendMessage = useCallback(
    (message: string) => {
      sendMessage(otherUserId, currentUserType, message);
    },
    [sendMessage, otherUserId, currentUserType]
  );

  // Отправка статуса набора текста
  const handleTyping = useCallback(() => {
    sendTypingStatus(otherUserId, true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(otherUserId, false);
      setTyping(otherUserId, false);
    }, 1000);
  }, [otherUserId, sendTypingStatus, setTyping]);

  return (
    <Stack gap={0} style={{ flex: 1, height: '100%', padding: '32px' }}>
      <ChatHeader
        username={otherUserUsername}
        userId={otherUserId}
        isConnected={isConnected}
        isTyping={isTyping}
        photoUrl={otherUserPhotoUrl}
      />

      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {isLoading ? (
          <Center style={{ flex: 1 }}>
            <Loader />
          </Center>
        ) : messages.length === 0 ? (
          <Center style={{ flex: 1 }}>
            <Stack align="center" gap="xs">
              <Text c="dimmed">История переписки пуста</Text>
              <Text c="dimmed" size="sm">Напишите первое сообщение</Text>
            </Stack>
          </Center>
        ) : (
          <MessageList
            messages={messages}
            currentUserId={currentUserId}
            currentUserType={currentUserType}
            otherUserId={otherUserId}
            otherUserUsername={otherUserUsername}
            isLoading={false}
          />
        )}
      </Box>

      <MessageInput onSendMessage={handleSendMessage} onTyping={handleTyping} disabled={!isConnected} />
      
      {!isConnected && connectionAttempted && (
        <Box p="xs" style={{ backgroundColor: 'var(--mantine-color-orange-light)', textAlign: 'center' }}>
          <Text size="xs" c="orange">Нет соединения с сервером чата</Text>
        </Box>
      )}
    </Stack>
  );
}
