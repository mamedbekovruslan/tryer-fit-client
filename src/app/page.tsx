import { Title, Container, Paper, Group } from '@mantine/core';
import AuthForm from '../components/AuthForm';
import ThemeToggle from '../components/ThemeToggle';

export default function Home() {
  return (
    <>
      <Group justify="flex-end" style={{ position: 'fixed', right: '20px', top: '20px', zIndex: 1000 }}>
        <ThemeToggle />
      </Group>
      <Container size="sm" fluid style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
        <Paper radius="md" p="xl" withBorder shadow="md" w={500}>
          <Title order={2} ta="center" mb="lg">
            Добро пожаловать
          </Title>

          <AuthForm />
        </Paper>
      </Container>
    </>
  );
}
