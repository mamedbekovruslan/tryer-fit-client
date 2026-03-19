'use client';

import { Box, Text, ScrollArea, Group, Avatar, Stack, Center, Loader } from '@mantine/core';
import { ChatMessage } from '@/services/chatService';
import { useEffect, useRef } from 'react';

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: number;
  currentUserType: 'client' | 'trainer';
  otherUserId: number;
  otherUserUsername: string;
  isLoading?: boolean;
}

export function MessageList({
  messages,
  currentUserId,
  otherUserId,
  otherUserUsername,
  isLoading,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (isLoading) {
    return (
      <Center style={{ flex: 1 }}>
        <Loader />
      </Center>
    );
  }

  if (messages.length === 0) {
    return (
      <Center style={{ flex: 1 }}>
        <Stack align="center" gap="xs">
          <Text c="dimmed" size="sm">
            Сообщений пока нет
          </Text>
          <Text c="dimmed" size="xs">
            Начните переписку с {otherUserUsername}
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <ScrollRef scrollRef={scrollRef}>
      <Stack gap="xs" p="md">
        {messages.map((message, index) => {
          const isOwnMessage = message.senderId === currentUserId;
          const showAvatar =
            index === 0 || messages[index - 1].senderId !== message.senderId;

          return (
            <Group
              key={message.id}
              justify={isOwnMessage ? 'flex-end' : 'flex-start'}
              wrap="nowrap"
              gap="xs"
            >
              {!isOwnMessage && showAvatar && (
                <Avatar
                  size="sm"
                  radius="xl"
                  name={otherUserUsername}
                  color={getClientColor(otherUserId)}
                />
              )}
              {!isOwnMessage && !showAvatar && <Box w={28} />}
              <Box
                style={{
                  backgroundColor: isOwnMessage
                    ? 'var(--mantine-color-blue-filled)'
                    : 'var(--mantine-color-blue-filled)',
                  color: isOwnMessage ? 'white' : 'var(--mantine-color-default)',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  maxWidth: '70%',
                  wordBreak: 'break-word',
                }}
              >
                <Text size="sm">{message.message}</Text>
                <Text
                  size="xs"
                  style={{
                    marginTop: '4px',
                  }}
                >
                  {formatTime(message.createdAt)}
                </Text>
              </Box>
            </Group>
          );
        })}
      </Stack>
    </ScrollRef>
  );
}

interface ScrollRefProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}

function ScrollRef({ scrollRef, children }: ScrollRefProps) {
  return (
    <ScrollArea style={{ flex: 1 }} offsetScrollbars viewportRef={scrollRef}>
      {children}
    </ScrollArea>
  );
}

function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function getClientColor(userId: number): string {
  const colors = ['blue', 'green', 'orange', 'red', 'purple', 'pink', 'teal', 'cyan'];
  return colors[userId % colors.length];
}
