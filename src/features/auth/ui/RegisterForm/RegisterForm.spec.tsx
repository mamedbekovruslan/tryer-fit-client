import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RegisterForm from './RegisterForm';
import { renderWithProviders } from '@/test/render';

const {
  loginMock,
  refreshUserProfileMock,
  clientRegisterMock,
  trainerRegisterMock,
  authLoginMock,
  onSwitchToLoginMock,
} = vi.hoisted(() => ({
  loginMock: vi.fn(),
  refreshUserProfileMock: vi.fn(),
  clientRegisterMock: vi.fn(),
  trainerRegisterMock: vi.fn(),
  authLoginMock: vi.fn(),
  onSwitchToLoginMock: vi.fn(),
}));

vi.mock('@/providers/AuthProvider', () => ({
  useAuth: () => ({
    login: loginMock,
    refreshUserProfile: refreshUserProfileMock,
  }),
}));

vi.mock('@/services/clientService', () => ({
  clientService: {
    register: clientRegisterMock,
  },
}));

vi.mock('@/services/trainerService', () => ({
  trainerService: {
    register: trainerRegisterMock,
  },
}));

vi.mock('@/services/authService', () => ({
  authService: {
    login: authLoginMock,
  },
}));

vi.mock('@/features/auth/register/client/ui/ClientRegistrationForm', () => ({
  default: ({ commonFields }: { commonFields: Record<string, unknown> }) => (
    <div>
      <input
        aria-label="Фамилия"
        value={String(commonFields.lastName ?? '')}
        onChange={(event) =>
          (commonFields.setLastName as (value: string) => void)(
            event.currentTarget.value,
          )
        }
      />
      <input
        aria-label="Имя"
        value={String(commonFields.firstName ?? '')}
        onChange={(event) =>
          (commonFields.setFirstName as (value: string) => void)(
            event.currentTarget.value,
          )
        }
      />
      <input
        aria-label="Электронная почта"
        value={String(commonFields.email ?? '')}
        onChange={(event) =>
          (commonFields.setEmail as (value: string) => void)(
            event.currentTarget.value,
          )
        }
      />
      <input
        aria-label="Пароль"
        value={String(commonFields.password ?? '')}
        onChange={(event) =>
          (commonFields.setPassword as (value: string) => void)(
            event.currentTarget.value,
          )
        }
      />
      <input
        aria-label="Подтверждение пароля"
        value={String(commonFields.confirmPassword ?? '')}
        onChange={(event) =>
          (commonFields.setConfirmPassword as (value: string) => void)(
            event.currentTarget.value,
          )
        }
      />
    </div>
  ),
}));

vi.mock('@/features/auth/register/trainer/ui/TrainerRegistrationForm', () => ({
  default: ({ commonFields }: { commonFields: Record<string, unknown> }) => (
    <div>
      <input
        aria-label="Фамилия"
        value={String(commonFields.lastName ?? '')}
        onChange={(event) =>
          (commonFields.setLastName as (value: string) => void)(
            event.currentTarget.value,
          )
        }
      />
      <input
        aria-label="Имя"
        value={String(commonFields.firstName ?? '')}
        onChange={(event) =>
          (commonFields.setFirstName as (value: string) => void)(
            event.currentTarget.value,
          )
        }
      />
      <input
        aria-label="Отчество"
        value={String(commonFields.middleName ?? '')}
        onChange={(event) =>
          (commonFields.setMiddleName as (value: string) => void)(
            event.currentTarget.value,
          )
        }
      />
      <input
        aria-label="Электронная почта"
        value={String(commonFields.email ?? '')}
        onChange={(event) =>
          (commonFields.setEmail as (value: string) => void)(
            event.currentTarget.value,
          )
        }
      />
      <input
        aria-label="Пароль"
        value={String(commonFields.password ?? '')}
        onChange={(event) =>
          (commonFields.setPassword as (value: string) => void)(
            event.currentTarget.value,
          )
        }
      />
      <input
        aria-label="Подтверждение пароля"
        value={String(commonFields.confirmPassword ?? '')}
        onChange={(event) =>
          (commonFields.setConfirmPassword as (value: string) => void)(
            event.currentTarget.value,
          )
        }
      />
    </div>
  ),
}));

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    refreshUserProfileMock.mockResolvedValue(undefined);
    authLoginMock.mockResolvedValue({
      access_token: 'token',
      user: {
        id: 1,
        email: 'user@test.dev',
        username: 'user',
        user_type: 'client',
      },
    });

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '' },
    });
  });

  it('register form validates password confirmation', async () => {
    renderWithProviders(<RegisterForm onSwitchToLogin={onSwitchToLoginMock} />);

    fireEvent.change(screen.getByLabelText('Фамилия'), {
      target: { value: 'Ivanov' },
    });
    fireEvent.change(screen.getByLabelText('Имя'), {
      target: { value: 'Ivan' },
    });
    fireEvent.change(screen.getByLabelText('Электронная почта'), {
      target: { value: 'client@test.dev' },
    });
    fireEvent.change(screen.getByLabelText('Пароль'), {
      target: { value: 'pass-one' },
    });
    fireEvent.change(screen.getByLabelText('Подтверждение пароля'), {
      target: { value: 'pass-two' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));

    expect(
      await screen.findByText('Пароли не совпадают'),
    ).toBeInTheDocument();
    expect(clientRegisterMock).not.toHaveBeenCalled();
    expect(trainerRegisterMock).not.toHaveBeenCalled();
  });

  it('client registration submits client payload', async () => {
    clientRegisterMock.mockResolvedValue({
      id: 1,
    });

    renderWithProviders(<RegisterForm onSwitchToLogin={onSwitchToLoginMock} />);

    fireEvent.change(screen.getByLabelText('Фамилия'), {
      target: { value: 'Ivanov' },
    });
    fireEvent.change(screen.getByLabelText('Имя'), {
      target: { value: 'Ivan' },
    });
    fireEvent.change(screen.getByLabelText('Электронная почта'), {
      target: { value: 'client@test.dev' },
    });
    fireEvent.change(screen.getByLabelText('Пароль'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Подтверждение пароля'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));

    await waitFor(() => {
      expect(clientRegisterMock).toHaveBeenCalledTimes(1);
    });
    expect(clientRegisterMock).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'client',
        email: 'client@test.dev',
        password: 'password123',
        first_name: 'Ivan',
        last_name: 'Ivanov',
      }),
    );
    expect(authLoginMock).toHaveBeenCalledWith({
      email: 'client@test.dev',
      password: 'password123',
    });
  });

  it('trainer registration submits trainer payload', async () => {
    trainerRegisterMock.mockResolvedValue({
      id: 2,
    });
    authLoginMock.mockResolvedValue({
      access_token: 'trainer-token',
      user: {
        id: 2,
        email: 'trainer@test.dev',
        username: 'trainer',
        user_type: 'trainer',
      },
    });

    renderWithProviders(<RegisterForm onSwitchToLogin={onSwitchToLoginMock} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Тренер' }));
    fireEvent.change(screen.getByLabelText('Фамилия'), {
      target: { value: 'Petrov' },
    });
    fireEvent.change(screen.getByLabelText('Имя'), {
      target: { value: 'Petr' },
    });
    fireEvent.change(screen.getByLabelText('Отчество'), {
      target: { value: 'Petrovich' },
    });
    fireEvent.change(screen.getByLabelText('Электронная почта'), {
      target: { value: 'trainer@test.dev' },
    });
    fireEvent.change(screen.getByLabelText('Пароль'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Подтверждение пароля'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));

    await waitFor(() => {
      expect(trainerRegisterMock).toHaveBeenCalledTimes(1);
    });
    expect(trainerRegisterMock).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'trainer',
        email: 'trainer@test.dev',
        password: 'password123',
        first_name: 'Petr',
        last_name: 'Petrov',
        middle_name: 'Petrovich',
      }),
    );
    expect(authLoginMock).toHaveBeenCalledWith({
      email: 'trainer@test.dev',
      password: 'password123',
    });
  });
});
