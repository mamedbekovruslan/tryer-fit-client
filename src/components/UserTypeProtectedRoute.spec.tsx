import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UserTypeProtectedRoute from './UserTypeProtectedRoute';

const pushMock = vi.fn();
const useAuthMock = vi.fn();
const usePathnameMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  usePathname: () => usePathnameMock(),
}));

vi.mock('@/providers/AuthProvider', () => ({
  useAuth: () => useAuthMock(),
}));

describe('UserTypeProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePathnameMock.mockReturnValue('/home');
  });

  it('redirects wrong role', async () => {
    useAuthMock.mockReturnValue({
      user: {
        id: 5,
        user_type: 'trainer',
      },
      isAuthenticated: true,
      isInitializing: false,
    });

    render(
      <UserTypeProtectedRoute>
        <div>Client page</div>
      </UserTypeProtectedRoute>,
    );

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/admin');
    });
    expect(screen.queryByText('Client page')).not.toBeInTheDocument();
  });
});
