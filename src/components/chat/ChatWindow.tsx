'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Stack, Center, Loader, Text } from '@mantine/core';
import { useChatSocket } from '@/hooks/useChatSocket';
import { chatService, ChatMessage } from '@/services/chatService';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ChatHeader } from './ChatHeader';

interface ChatWindowProps {
  otherUserId: number;
  otherUserUsername: string;
  currentUserId: number;
  currentUserType: 'client' | 'trainer';
}

export function ChatWindow({
  otherUserId,
  otherUserUsername,
  currentUserId,
  currentUserType,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionAttempted, setConnectionAttempted] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentOtherUserIdRef = useRef<number>(otherUserId);

  const { sendMessage, markAsRead, sendTypingStatus, isConnected } = useChatSocket({
    onMessage: (message) => {
      console.log('[ChatWindow] Received message:', message);
      setMessages((prev) => {
        // Проверяем, не дубликат ли это
        const exists = prev.some(m => m.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
      // Помечаем сообщения как прочитанные автоматически
      if (message.senderId !== currentUserId) {
        markAsRead(message.senderId);
      }
    },
    onMessageSent: (message) => {
      console.log('[ChatWindow] Message sent confirmation:', message);
      setMessages((prev) => {
        // Проверяем, не дубликат ли это
        const exists = prev.some(m => m.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
    },
    onUserTyping: (data) => {
      if (data.senderId === otherUserId) {
        setIsTyping(data.isTyping);
      }
    },
    onConnected: (data) => {
      console.log('[ChatWindow] Connected:', data);
      setConnectionAttempted(true);
    },
  });

  // Отслеживаем смену собеседника
  useEffect(() => {
    if (currentOtherUserIdRef.current !== otherUserId) {
      console.log('[ChatWindow] Changing conversation from', currentOtherUserIdRef.current, 'to', otherUserId);
      currentOtherUserIdRef.current = otherUserId;
      setMessages([]);
      setIsLoading(true);
    }
  }, [otherUserId]);

  // Загрузка истории переписки
  useEffect(() => {
    const loadMessages = async () => {
      console.log('[ChatWindow] Loading messages for user:', otherUserId);
      setIsLoading(true);
      try {
        const data = await chatService.getConversation(otherUserId, 100, 0);
        console.log('[ChatWindow] Loaded messages:', data.length);
        setMessages(data);

        // Помечаем сообщения как прочитанные
        const unreadMessages = data.filter(
          (m) => m.senderId !== currentUserId && !m.isRead
        );
        if (unreadMessages.length > 0) {
          console.log('[ChatWindow] Marking', unreadMessages.length, 'messages as read');
          await chatService.markMessagesAsRead(otherUserId);
        }
      } catch (error) {
        console.error('[ChatWindow] Error loading messages:', error);
      } finally {
        setIsLoading(false);
        setConnectionAttempted(true);
      }
    };

    if (otherUserId) {
      loadMessages();
    }
  }, [otherUserId, currentUserId]);

  // Отправка сообщения
  const handleSendMessage = useCallback(
    (message: string) => {
      console.log('[ChatWindow] Sending message:', message);
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
      setIsTyping(false);
    }, 1000);
  }, [sendTypingStatus, otherUserId]);

  return (
    <Stack gap={0} style={{ flex: 1, height: '100%', padding: '32px' }}>
      <ChatHeader
        username={otherUserUsername}
        userId={otherUserId}
        isConnected={isConnected}
        isTyping={isTyping}
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
