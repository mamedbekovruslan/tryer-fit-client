# Playwright E2E

## Что есть сейчас

- foundation для `Playwright`
- 3 базовых сценария:
  - `client can log in and open chat with trainer`
  - `trainer can log in and see assigned clients in chat`
  - `trainer opens workout workspace and can start creating a program`

## Что нужно для запуска

Задать переменные окружения:

```bash
export PLAYWRIGHT_BASE_URL=http://localhost:3000
export E2E_CLIENT_EMAIL=client@test.dev
export E2E_CLIENT_PASSWORD=password123
export E2E_TRAINER_EMAIL=trainer@test.dev
export E2E_TRAINER_PASSWORD=password123
```

Можно взять шаблон из [`.env.example`](/Users/RAMamedbekov/Desktop/ramamedbekov/pet%20projects/tryer-fit/tryer-fit-client/tests/e2e/.env.example).
Локально можно вместо `export` использовать `tryer-fit-client/.env.e2e`: Playwright теперь подхватывает этот файл автоматически.

## Команды

```bash
npm run test:e2e
npm run test:e2e:headed
```

## Важно

- эти сценарии не поднимают frontend/backend сами;
- перед запуском должны быть доступны `http://localhost:3000` и backend API;
- если e2e-учётки не заданы, тесты будут `skip`.
