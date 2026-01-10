'use client';

import { Card, Image, Text, Group, Box, Stack } from '@mantine/core';
import { Trainer } from '@/services/clientService';

interface TrainerInfoCardProps {
  trainer: Trainer | undefined;
}

export default function TrainerInfoCard({ trainer }: TrainerInfoCardProps) {
  if (!trainer) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text size="lg" fw={500}>
          У вас пока нет закрепленного тренера
        </Text>
        <Text size="sm" c="dimmed">
          Обратитесь в администрацию для назначения тренера
        </Text>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group wrap="nowrap" align="flex-start">
        {/* Фотография тренера */}
        <Box flex={0}>
          <Image
            src={trainer.photo_urls && trainer.photo_urls.length > 0 ? trainer.photo_urls[0] : '/placeholder-trainer.jpg'}
            alt={`Фото тренера ${trainer.first_name} ${trainer.last_name}`}
            width={120}
            height={120}
            fit="cover"
            radius="md"
            fallbackSrc="/placeholder-trainer.jpg"
          />
        </Box>

        {/* Информация о тренере */}
        <Stack gap="xs" flex={1}>
          <Text size="lg" fw={700}>
            Ваш тренер: {trainer.first_name} {trainer.last_name} {trainer.middle_name || ''}
          </Text>

          <Group gap="lg">
            <div>
              <Text size="sm" c="dimmed">Email</Text>
              <Text size="sm">{trainer.email}</Text>
            </div>

            <div>
              <Text size="sm" c="dimmed">Телефон</Text>
              <Text size="sm">{trainer.phone || 'Не указан'}</Text>
            </div>
          </Group>

          <Group gap="lg">
            <div>
              <Text size="sm" c="dimmed">Специализация</Text>
              <Text size="sm">{trainer.specialization || 'Не указана'}</Text>
            </div>

            <div>
              <Text size="sm" c="dimmed">Образование</Text>
              <Text size="sm">{trainer.education || 'Не указано'}</Text>
            </div>
          </Group>

          {trainer.degree && (
            <div>
              <Text size="sm" c="dimmed">Ученая степень</Text>
              <Text size="sm">{trainer.degree}</Text>
            </div>
          )}

          {trainer.certificate_number && (
            <div>
              <Text size="sm" c="dimmed">Номер сертификата</Text>
              <Text size="sm">{trainer.certificate_number}</Text>
            </div>
          )}
        </Stack>
      </Group>
    </Card>
  );
}