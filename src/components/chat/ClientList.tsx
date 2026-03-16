'use client';

import { Box, Text, Avatar, Badge, Group, Stack, ScrollArea } from '@mantine/core';
import { ChatUser } from '@/services/chatService';
import { useRouter, useSearchParams } from 'next/navigation';

interface ClientListProps {
  clients: ChatUser[];
  selectedClientId?: number | null;
}

export function ClientList({ clients, selectedClientId }: ClientListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelectClient = (clientId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('clientId', clientId.toString());
    router.push(`/chat?${params.toString()}`);
  };

  if (!clients || clients.length === 0) {
    return (
      <Box p="lg" ta="center" c="dimmed">
        <Text size="sm">У вас пока нет клиентов</Text>
      </Box>
    );
  }

  return (
    <ScrollArea style={{ flex: 1 }} offsetScrollbars>
      <Stack gap="xs" p="xs">
        {clients.map((client) => (
          <Box
            key={client.userId}
            onClick={() => handleSelectClient(client.userId)}
            style={{
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: selectedClientId === client.userId ? 'var(--mantine-color-blue-light)' : 'transparent',
              transition: 'background-color 0.2s',
            }}
          >
            <Group justify="space-between" wrap="nowrap">
              <Group wrap="nowrap">
                <Avatar
                  size="md"
                  radius="xl"
                  src={client.photo_urls?.[0] || null}
                  name={client.username}
                  color={getClientColor(client.userId)}
                />
                <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                  <Text fw={client.unreadCount > 0 ? 600 : 400} size="sm" truncate>
                    {client.username}
                  </Text>
                  {client.lastMessage && (
                    <Text
                      size="xs"
                      c={client.unreadCount > 0 ? 'dimmed' : 'dimmed'}
                      truncate
                      style={{
                        fontStyle: client.unreadCount > 0 ? 'normal' : 'italic',
                      }}
                    >
                      {client.lastMessage.message}
                    </Text>
                  )}
                </Stack>
              </Group>
              {client.unreadCount > 0 && (
                <Badge size="sm" color="blue" radius="sm">
                  {client.unreadCount}
                </Badge>
              )}
            </Group>
          </Box>
        ))}
      </Stack>
    </ScrollArea>
  );
}

function getClientColor(userId: number): string {
  const colors = ['blue', 'green', 'orange', 'red', 'purple', 'pink', 'teal', 'cyan'];
  return colors[userId % colors.length];
}
