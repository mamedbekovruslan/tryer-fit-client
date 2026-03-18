import { expect, test } from '@playwright/test';
import {
  expectAuthenticatedPath,
  getTrainerCredentials,
  hasTrainerCredentials,
  login,
} from './helpers/auth';

const hasTrainerE2ECredentials = hasTrainerCredentials();

test.describe('Trainer workout flow', () => {
  test.skip(
    !hasTrainerE2ECredentials,
    'E2E trainer credentials are not configured',
  );

  test('trainer opens workout workspace and can start creating a program', async ({
    page,
  }) => {
    await login(page, getTrainerCredentials());
    await expectAuthenticatedPath(page, /\/admin/);

    await page.goto('/trainer/workout');
    await expect(page.getByText('Управление тренировками')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Программа' })).toBeVisible();

    await page.getByRole('button', { name: 'Программа' }).click();
    await expect(page.getByRole('button', { name: 'Создать' })).toBeVisible();
  });
});
