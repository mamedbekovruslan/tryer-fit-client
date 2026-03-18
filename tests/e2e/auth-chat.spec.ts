import { expect, test } from '@playwright/test';
import {
  expectAuthenticatedPath,
  getClientCredentials,
  getTrainerCredentials,
  hasClientCredentials,
  hasTrainerCredentials,
  login,
} from './helpers/auth';

const hasClientE2ECredentials = hasClientCredentials();
const hasTrainerE2ECredentials = hasTrainerCredentials();

test.describe('Auth and Chat flows', () => {
  test.skip(
    !hasClientE2ECredentials && !hasTrainerE2ECredentials,
    'E2E credentials are not configured',
  );

  test('client can log in and open chat with trainer', async ({ page }) => {
    test.skip(!hasClientE2ECredentials, 'E2E client credentials are not configured');

    await login(page, getClientCredentials());
    await expectAuthenticatedPath(page, /\/home|\/chat/);

    await page.goto('/chat');
    await expect(page.getByText(/Онлайн|Офлайн/)).toBeVisible();

    const pageBody = page.locator('body');
    await expect(pageBody).toContainText(/Чат с тренером|История переписки пуста|Напишите первое сообщение|Онлайн|Офлайн/);
  });

  test('trainer can log in and see assigned clients in chat', async ({ page }) => {
    test.skip(
      !hasTrainerE2ECredentials,
      'E2E trainer credentials are not configured',
    );

    await login(page, getTrainerCredentials());
    await expectAuthenticatedPath(page, /\/admin/);

    await page.goto('/chat');
    await expect(page.getByText('Клиенты')).toBeVisible();

    const pageBody = page.locator('body');
    await expect(pageBody).toContainText(
      /У вас пока нет клиентов|Выберите клиента для начала переписки|Онлайн|Офлайн|История переписки пуста/,
    );
  });
});
