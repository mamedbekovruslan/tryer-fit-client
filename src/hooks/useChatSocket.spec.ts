import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChatMessage } from '@/services/chatService';

type EventHandler = (...args: unknown[]) => void;

const {
  ioMock,
  receiveMessageMock,
  receiveSentMessageMock,
  applyMessagesReadMock,
  setTypingMock,
  setConnectionStatusMock,
  setConnectionAttemptedMock,
  disconnectMock,
  emitMock,
  handlers,
  authState,
  storeState,
} = vi.hoisted(() => {
  const handlersMap = new Map<string, EventHandler>();

  return {
    ioMock: vi.fn(),
    receiveMessageMock: vi.fn(),
    receiveSentMessageMock: vi.fn(),
    applyMessagesReadMock: vi.fn(),
    setTypingMock: vi.fn(),
    setConnectionStatusMock: vi.fn(),
    setConnectionAttemptedMock: vi.fn(),
    disconnectMock: vi.fn(),
    emitMock: vi.fn(),
    handlers: handlersMap,
    authState: {
      user: { id: 7, user_type: 'client' as const },
      isAuthenticated: true,
      isInitializing: false,
    },
    storeState: {
      isConnected: false,
      setConnectionStatus: vi.fn(),
      setConnectionAttempted: vi.fn(),
      setTyping: vi.fn(),
      applyMessagesRead: vi.fn(),
    },
  };
});

vi.mock('socket.io-client', () => ({
  io: ioMock,
}));

vi.mock('@/providers/AuthProvider', () => ({
  useAuth: () => authState,
}));

vi.mock('@/stores/chatStore', () => ({
  useChatStore: Object.assign(
    (selector: (value: typeof storeState) => unknown) => selector(storeState),
    {
      getState: () => ({
        receiveMessage: receiveMessageMock,
        receiveSentMessage: receiveSentMessageMock,
      }),
    },
  ),
}));

import { useChatSocket } from '@/hooks/useChatSocket';

describe('useChatSocket', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    handlers.clear();

    authState.user = { id: 7, user_type: 'client' };
    authState.isAuthenticated = true;
    authState.isInitializing = false;

    storeState.isConnected = false;
    storeState.setConnectionStatus = setConnectionStatusMock;
    storeState.setConnectionAttempted = setConnectionAttemptedMock;
    storeState.setTyping = setTypingMock;
    storeState.applyMessagesRead = applyMessagesReadMock;

    ioMock.mockImplementation(() => ({
      connected: true,
      on: (event: string, handler: EventHandler) => {
        handlers.set(event, handler);
      },
      emit: emitMock,
      disconnect: disconnectMock,
    }));
  });

  it('connects socket and handles receiveMessage flow', () => {
    const onMessage = vi.fn();

    renderHook(() => useChatSocket({ onMessage }));

    expect(ioMock).toHaveBeenCalledWith('http://localhost:3001/chat', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const message = createMessage({
      senderId: 10,
      receiverId: 7,
    });

    act(() => {
      handlers.get('connect')?.();
      handlers.get('connected')?.({ userId: 7, userType: 'client' });
      handlers.get('receiveMessage')?.(message);
    });

    expect(setConnectionStatusMock).toHaveBeenCalledWith(true);
    expect(setConnectionAttemptedMock).toHaveBeenCalledWith(true);
    expect(receiveMessageMock).toHaveBeenCalledWith(message, 7);
    expect(onMessage).toHaveBeenCalledWith(message);
  });

  it('handles messageSent, messagesRead and userTyping events', () => {
    const onMessageSent = vi.fn();
    const onMessagesRead = vi.fn();
    const onUserTyping = vi.fn();

    renderHook(() =>
      useChatSocket({
        onMessageSent,
        onMessagesRead,
        onUserTyping,
      }),
    );

    const sentMessage = createMessage({
      id: 2,
      senderId: 7,
      receiverId: 10,
    });

    act(() => {
      handlers.get('messageSent')?.(sentMessage);
      handlers.get('messagesRead')?.({ userId: 10, senderId: 7 });
      handlers.get('userTyping')?.({
        senderId: 10,
        senderType: 'trainer',
        isTyping: true,
      });
    });

    expect(receiveSentMessageMock).toHaveBeenCalledWith(sentMessage, 7);
    expect(applyMessagesReadMock).toHaveBeenCalledWith(10);
    expect(onMessagesRead).toHaveBeenCalledWith({ userId: 10, senderId: 7 });
    expect(setTypingMock).toHaveBeenCalledWith(10, true);
    expect(onUserTyping).toHaveBeenCalledWith({
      senderId: 10,
      senderType: 'trainer',
      isTyping: true,
    });
    expect(onMessageSent).toHaveBeenCalledWith(sentMessage);
  });

  it('exposes sendMessage, markAsRead and sendTypingStatus', () => {
    const { result } = renderHook(() => useChatSocket());

    act(() => {
      result.current.sendMessage(10, 'client', 'hello');
      result.current.markAsRead(10);
      result.current.sendTypingStatus(10, true);
    });

    expect(emitMock).toHaveBeenNthCalledWith(1, 'sendMessage', {
      receiverId: 10,
      senderType: 'client',
      message: 'hello',
    });
    expect(emitMock).toHaveBeenNthCalledWith(2, 'markAsRead', {
      senderId: 10,
    });
    expect(emitMock).toHaveBeenNthCalledWith(3, 'typing', {
      receiverId: 10,
      isTyping: true,
    });
  });

  it('disconnects socket when auth becomes unauthenticated', () => {
    const { rerender } = renderHook(() => useChatSocket());

    authState.isAuthenticated = false;
    authState.user = null;

    rerender();

    expect(disconnectMock).toHaveBeenCalledTimes(1);
    expect(setConnectionStatusMock).toHaveBeenCalledWith(false);
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
