import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChatMessage, ChatUser } from '@/services/chatService';

const { getUserChatsMock, getConversationMock, markMessagesAsReadMock } =
  vi.hoisted(() => ({
    getUserChatsMock: vi.fn(),
    getConversationMock: vi.fn(),
    markMessagesAsReadMock: vi.fn(),
  }));

vi.mock('@/services/chatService', () => ({
  chatService: {
    getUserChats: getUserChatsMock,
    getConversation: getConversationMock,
    markMessagesAsRead: markMessagesAsReadMock,
  },
}));

import { useChatStore } from '@/stores/chatStore';

describe('chatStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useChatStore.setState(useChatStore.getInitialState(), true);
  });

  it('loadChats stores chat summaries', async () => {
    const chats: ChatUser[] = [
      {
        userId: 10,
        username: 'Coach',
        unreadCount: 2,
      },
    ];
    getUserChatsMock.mockResolvedValue(chats);

    const result = await useChatStore.getState().loadChats();

    expect(result).toEqual(chats);
    expect(useChatStore.getState().clients).toEqual(chats);
    expect(useChatStore.getState().isClientsLoading).toBe(false);
  });

  it('loadConversation stores messages by userId', async () => {
    const messages: ChatMessage[] = [
      createMessage({
        id: 1,
        senderId: 10,
        receiverId: 7,
        isRead: false,
        createdAt: '2026-03-18T10:00:00.000Z',
      }),
      createMessage({
        id: 2,
        senderId: 7,
        receiverId: 10,
        isRead: true,
        createdAt: '2026-03-18T10:01:00.000Z',
      }),
    ];
    getConversationMock.mockResolvedValue(messages);
    markMessagesAsReadMock.mockResolvedValue(undefined);
    useChatStore.setState(
      {
        ...useChatStore.getInitialState(),
        clients: [
          {
            userId: 10,
            username: 'Coach',
            unreadCount: 1,
          },
        ],
      },
      true,
    );

    await useChatStore.getState().loadConversation(10, 7);

    expect(getConversationMock).toHaveBeenCalledWith(10, 100, 0);
    expect(markMessagesAsReadMock).toHaveBeenCalledWith(10);
    expect(useChatStore.getState().messagesByUserId[10]).toEqual([
      {
        ...messages[0],
        isRead: true,
      },
      messages[1],
    ]);
    expect(useChatStore.getState().clients[0]).toMatchObject({
      userId: 10,
      unreadCount: 0,
      lastMessage: messages[1],
    });
  });

  it('receiveMessage appends unique message and increments unread', () => {
    useChatStore.setState(
      {
        ...useChatStore.getInitialState(),
        clients: [
          {
            userId: 10,
            username: 'Coach',
            unreadCount: 0,
          },
        ],
      },
      true,
    );
    const message = createMessage({
      id: 1,
      senderId: 10,
      receiverId: 7,
      createdAt: '2026-03-18T10:00:00.000Z',
    });

    useChatStore.getState().receiveMessage(message, 7);
    useChatStore.getState().receiveMessage(message, 7);

    expect(useChatStore.getState().messagesByUserId[10]).toEqual([message]);
    expect(useChatStore.getState().clients[0]?.unreadCount).toBe(1);
  });

  it('receiveSentMessage appends unique outgoing message', () => {
    useChatStore.setState(
      {
        ...useChatStore.getInitialState(),
        clients: [
          {
            userId: 10,
            username: 'Coach',
            unreadCount: 3,
          },
        ],
      },
      true,
    );
    const message = createMessage({
      id: 2,
      senderId: 7,
      receiverId: 10,
      createdAt: '2026-03-18T10:02:00.000Z',
    });

    useChatStore.getState().receiveSentMessage(message, 7);

    expect(useChatStore.getState().messagesByUserId[10]).toEqual([message]);
    expect(useChatStore.getState().clients[0]).toMatchObject({
      unreadCount: 3,
      lastMessage: message,
    });
  });

  it('applyMessagesRead resets unread count', () => {
    useChatStore.setState(
      {
        ...useChatStore.getInitialState(),
        clients: [
          {
            userId: 10,
            username: 'Coach',
            unreadCount: 4,
          },
        ],
        messagesByUserId: {
          10: [
            createMessage({
              id: 1,
              senderId: 10,
              receiverId: 7,
              isRead: false,
            }),
          ],
        },
      },
      true,
    );

    useChatStore.getState().applyMessagesRead(10);

    expect(useChatStore.getState().clients[0]?.unreadCount).toBe(0);
    expect(useChatStore.getState().messagesByUserId[10]?.[0]?.isRead).toBe(
      true,
    );
  });
});

function createMessage(overrides: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id: 1,
    senderId: 1,
    receiverId: 2,
    senderType: 'trainer',
    message: 'hello',
    isRead: false,
    createdAt: '2026-03-18T10:00:00.000Z',
    updatedAt: '2026-03-18T10:00:00.000Z',
    ...overrides,
  };
}
