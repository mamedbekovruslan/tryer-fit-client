'use client';

import { Box, Text, Group, Avatar, Badge } from '@mantine/core';

interface ChatHeaderProps {
  username: string;
  userId: number;
  isConnected: boolean;
  isTyping?: boolean;
  lastSeen?: Date;
  photoUrl?: string | null;
}

export function ChatHeader({
  username,
  userId,
  isConnected,
  isTyping,
  lastSeen,
  photoUrl,
}: ChatHeaderProps) {
  return (
    <Box
      style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--mantine-color-gray-3)',
        backgroundColor: 'var(--mantine-color-body)',
      }}
    >
      <Group wrap="nowrap">
        <Avatar
          size="md"
          radius="xl"
          src={photoUrl}
          name={username}
          color={getClientColor(userId)}
        />
        <Box style={{ flex: 1 }}>
          <Group justify="space-between" wrap="nowrap">
            <Text fw={600} size="md">
              {username}
            </Text>
            <Group gap="xs">
              {isTyping && (
                <Text size="xs" c="blue" fw={500}>
                  печатает...
                </Text>
              )}
              <Badge
                size="sm"
                color={isConnected ? 'green' : 'gray'}
                radius="sm"
                variant="dot"
              >
                {isConnected ? 'Онлайн' : 'Офлайн'}
              </Badge>
            </Group>
          </Group>
        </Box>
      </Group>
    </Box>
  );
}

function getClientColor(userId: number): string {
  const colors = ['blue', 'green', 'orange', 'red', 'purple', 'pink', 'teal', 'cyan'];
  return colors[userId % colors.length];
}
