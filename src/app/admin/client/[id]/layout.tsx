import { PropsWithChildren } from 'react';
import { Container, Title, Text, Paper, Stack, Button, Group } from '@mantine/core';
import Link from 'next/link';

export default function ClientProfileLayout({ children }: PropsWithChildren<{}>) {
  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Group justify="space-between" mb="xl">
          <Title order={1}>
            Профиль клиента
          </Title>

          <Link href="/admin" passHref>
            <Button variant="outline">
              Назад к списку клиентов
            </Button>
          </Link>
        </Group>

        <Stack gap="xl">
          {children}
        </Stack>
      </Paper>
    </Container>
  );
}