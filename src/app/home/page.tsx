'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Paper, Stack } from '@mantine/core';
import { useAuth } from '@/providers/AuthProvider';
import UserTypeProtectedRoute from '@/components/UserTypeProtectedRoute';
import TrainerInfoCard from '@/components/TrainerInfoCard';
import { trainerService, Trainer } from '@/services/trainerService';
import { clientService } from '@/services/clientService';

export default function HomePage() {
  const { user, refreshUserProfile, isAuthenticated } = useAuth();
  const [trainerProfile, setTrainerProfile] = useState<Trainer | null>(null);

  useEffect(() => {
    if (!user && isAuthenticated) {
      void refreshUserProfile();
    }
  }, [user, refreshUserProfile, isAuthenticated]);

  useEffect(() => {
    const loadTrainerProfile = async () => {
      if (!user || user.user_type !== 'client') {
        setTrainerProfile(null);
        return;
      }

      try {
        const clientProfile = await clientService.getMyProfile();
        const trainerFromClient = clientProfile.trainer;

        if (trainerFromClient) {
          setTrainerProfile(trainerFromClient);
          return;
        }

        if (user.trainer?.id) {
          const trainer = await trainerService.getTrainerById(user.trainer.id);
          setTrainerProfile(trainer);
          return;
        }

        setTrainerProfile(null);
      } catch (error) {
        setTrainerProfile(user.trainer || null);
      }
    };

    loadTrainerProfile();
  }, [user]);

  return (
    <UserTypeProtectedRoute allowedUserTypes={['client']}>
      <Container size="md" py="xl">
        <Paper shadow="md" p="xl" radius="md">
          <Title order={1} ta="center" mb="xl">Добро пожаловать в Tryer Fit!</Title>

          <Text size="lg" mb="lg">
            Здравствуйте, <strong>{user?.username}</strong>!
            Вы успешно вошли в систему как <strong>{user?.user_type}</strong>.
          </Text>

          <Stack gap="xl" mt="xl">
            <TrainerInfoCard trainer={trainerProfile || user?.trainer} />
          </Stack>
        </Paper>
      </Container>
    </UserTypeProtectedRoute>
  );
}
