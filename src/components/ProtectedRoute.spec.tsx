import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProtectedRoute from './ProtectedRoute';

const pushMock = vi.fn();
const useAuthMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock('@/providers/AuthProvider', () => ({
  useAuth: () => useAuthMock(),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects unauthenticated user', async () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: false,
      isInitializing: false,
    });

    render(
      <ProtectedRoute>
        <div>Protected content</div>
      </ProtectedRoute>,
    );

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/auth');
    });
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });
});
