import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ChatPage from './page';
import { renderWithProviders } from '@/test/render';

const {
  pushMock,
  useSearchParamsMock,
  useAuthMock,
  setSelectedClientIdMock,
  loadChatsMock,
} = vi.hoisted(() => ({
  pushMock: vi.fn(),
  useSearchParamsMock: vi.fn(),
  useAuthMock: vi.fn(),
  setSelectedClientIdMock: vi.fn(),
  loadChatsMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useSearchParams: () => useSearchParamsMock(),
}));

vi.mock('@/providers/AuthProvider', () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock('@/components/chat/ChatWindow', () => ({
  ChatWindow: ({
    otherUserUsername,
    otherUserPhotoUrl,
  }: {
    otherUserUsername: string;
    otherUserPhotoUrl?: string | null;
  }) => (
    <div>
      <div data-testid="chat-window-username">{otherUserUsername}</div>
      <div data-testid="chat-window-photo">{otherUserPhotoUrl ?? 'no-photo'}</div>
    </div>
  ),
}));

vi.mock('@/components/chat/ClientList', () => ({
  ClientList: ({ clients }: { clients: Array<{ username: string }> }) => (
    <div data-testid="client-list">{clients.map((client) => client.username).join(', ')}</div>
  ),
}));

vi.mock('@/stores/chatStore', () => {
  const state = {
    clients: [] as Array<{
      userId: number;
      username: string;
      unreadCount: number;
      photo_urls?: string[];
      photoUrls?: string[];
    }>,
    isClientsLoading: false,
    selectedClientId: null as number | null,
    setSelectedClientId: setSelectedClientIdMock,
    loadChats: loadChatsMock,
  };

  return {
    useChatStore: (selector: (value: typeof state) => unknown) => selector(state),
  };
});

describe('ChatPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSearchParamsMock.mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    });
  });

  it('client chat page renders trainer name and photo', () => {
    useAuthMock.mockReturnValue({
      user: {
        id: 7,
        user_type: 'client',
        username: 'client_user',
        trainer: {
          id: 11,
          username: 'coach',
          first_name: 'Ivan',
          last_name: 'Petrov',
          photo_urls: ['https://cdn.test/trainer.jpg'],
        },
      },
      isInitializing: false,
      isAuthenticated: true,
    });

    renderWithProviders(<ChatPage />);

    expect(screen.getByTestId('chat-window-username')).toHaveTextContent(
      'Ivan Petrov',
    );
    expect(screen.getByTestId('chat-window-photo')).toHaveTextContent(
      'https://cdn.test/trainer.jpg',
    );
  });

  it('trainer loads chats and selects first client when none selected', async () => {
    loadChatsMock.mockResolvedValue([
      {
        userId: 101,
        username: 'Client One',
        unreadCount: 0,
      },
    ]);
    useAuthMock.mockReturnValue({
      user: {
        id: 20,
        user_type: 'trainer',
        username: 'trainer_user',
      },
      isInitializing: false,
      isAuthenticated: true,
    });

    renderWithProviders(<ChatPage />);

    await waitFor(() => {
      expect(loadChatsMock).toHaveBeenCalledTimes(1);
      expect(setSelectedClientIdMock).toHaveBeenCalledWith(101);
      expect(pushMock).toHaveBeenCalledWith('/chat?clientId=101');
    });
  });
});
