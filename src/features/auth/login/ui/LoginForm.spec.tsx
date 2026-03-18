import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginForm from './LoginForm';
import { renderWithProviders } from '@/test/render';

const { handleLoginMock, onSwitchToRegisterMock, useLoginMock } = vi.hoisted(
  () => ({
    handleLoginMock: vi.fn(),
    onSwitchToRegisterMock: vi.fn(),
    useLoginMock: vi.fn(),
  }),
);

vi.mock('../hooks/useLogin', () => ({
  useLogin: () => useLoginMock(),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useLoginMock.mockReturnValue({
      handleLogin: handleLoginMock,
      loading: false,
      error: null,
    });
  });

  it('login form submits credentials', async () => {
    renderWithProviders(<LoginForm onSwitchToRegister={onSwitchToRegisterMock} />);

    fireEvent.change(screen.getByPlaceholderText('your@email.com'), {
      target: { value: 'user@test.dev' },
    });
    fireEvent.change(screen.getByPlaceholderText('Ваш пароль'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      expect(handleLoginMock).toHaveBeenCalledTimes(1);
    });
    expect(handleLoginMock).toHaveBeenCalledWith(
      'user@test.dev',
      'password123',
      expect.any(Function),
    );
  });

  it('login form shows API error', () => {
    useLoginMock.mockReturnValue({
      handleLogin: handleLoginMock,
      loading: false,
      error: 'Неверные учетные данные',
    });

    renderWithProviders(<LoginForm onSwitchToRegister={onSwitchToRegisterMock} />);

    expect(screen.getByText('Неверные учетные данные')).toBeInTheDocument();
  });
});
