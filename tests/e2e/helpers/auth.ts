import { expect, type Page } from '@playwright/test';

export async function login(
  page: Page,
  credentials: {
    email: string;
    password: string;
  },
) {
  await page.goto('/auth');
  await page.getByPlaceholder('your@email.com').fill(credentials.email);
  await page.getByPlaceholder('Ваш пароль').fill(credentials.password);
  await page.getByRole('button', { name: 'Войти' }).click();
}

export function getClientCredentials() {
  return {
    email: process.env.E2E_CLIENT_EMAIL ?? '',
    password: process.env.E2E_CLIENT_PASSWORD ?? '',
  };
}

export function getTrainerCredentials() {
  return {
    email: process.env.E2E_TRAINER_EMAIL ?? '',
    password: process.env.E2E_TRAINER_PASSWORD ?? '',
  };
}

export function hasClientCredentials() {
  const creds = getClientCredentials();
  return Boolean(creds.email && creds.password);
}

export function hasTrainerCredentials() {
  const creds = getTrainerCredentials();
  return Boolean(creds.email && creds.password);
}

export async function expectAuthenticatedPath(
  page: Page,
  matcher: RegExp | string,
) {
  await expect(page).toHaveURL(matcher);
}
