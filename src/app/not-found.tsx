'use client';

import { Container, Title, Text, Button, Center, Stack } from '@mantine/core';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';

export default function NotFound() {
  return (
    <Container size="md" style={{ height: '100vh' }}>
      <Center style={{ height: '100%' }}>
        <Stack align="center" >
          <Title order={1} size="h1" fw={900}>
            404
          </Title>
          <Title order={2}>Страница не найдена</Title>
          <Text size="lg" c="dimmed" ta="center">
            Извините, запрашиваемая вами страница не существует.
          </Text>
          <Link href="/" passHref>
            <Button leftSection={<IoIosArrowBack size={16} />}>
              Вернуться на главную
            </Button>
          </Link>
        </Stack>
      </Center>
    </Container>
  );
}