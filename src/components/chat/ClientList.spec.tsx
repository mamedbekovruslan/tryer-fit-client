import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ClientList } from './ClientList';
import { renderWithProviders } from '@/test/render';

const { pushMock, useSearchParamsMock, setSelectedClientIdMock } = vi.hoisted(
  () => ({
    pushMock: vi.fn(),
    useSearchParamsMock: vi.fn(),
    setSelectedClientIdMock: vi.fn(),
  }),
);

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useSearchParams: () => useSearchParamsMock(),
}));

vi.mock('@/stores/chatStore', () => {
  const state = {
    selectedClientId: null as number | null,
    setSelectedClientId: setSelectedClientIdMock,
  };

  return {
    useChatStore: (selector: (value: typeof state) => unknown) => selector(state),
  };
});

describe('ClientList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSearchParamsMock.mockReturnValue({
      toString: () => '',
    });
  });

  it('trainer selects client from list and opens conversation', () => {
    renderWithProviders(
      <ClientList
        clients={[
          {
            userId: 12,
            username: 'Client One',
            unreadCount: 2,
            lastMessage: {
              id: 1,
              senderId: 12,
              receiverId: 5,
              senderType: 'client',
              message: 'Привет',
              isRead: false,
              createdAt: '2026-03-18T10:00:00.000Z',
              updatedAt: '2026-03-18T10:00:00.000Z',
            },
          },
        ]}
      />,
    );

    fireEvent.click(screen.getByText('Client One'));

    expect(setSelectedClientIdMock).toHaveBeenCalledWith(12);
    expect(pushMock).toHaveBeenCalledWith('/chat?clientId=12');
  });
});
