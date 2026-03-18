'use client';

import { create } from 'zustand';
import { chatService, type ChatMessage, type ChatUser } from '@/services/chatService';

interface ChatStoreState {
  clients: ChatUser[];
  selectedClientId: number | null;
  messagesByUserId: Record<number, ChatMessage[]>;
  isClientsLoading: boolean;
  loadingConversations: Record<number, boolean>;
  typingByUserId: Record<number, boolean>;
  isConnected: boolean;
  connectionAttempted: boolean;
  setSelectedClientId: (clientId: number | null) => void;
  setConnectionStatus: (isConnected: boolean) => void;
  setConnectionAttempted: (value: boolean) => void;
  setTyping: (userId: number, isTyping: boolean) => void;
  loadChats: () => Promise<ChatUser[]>;
  loadConversation: (otherUserId: number, currentUserId: number) => Promise<void>;
  receiveMessage: (message: ChatMessage, currentUserId: number) => void;
  receiveSentMessage: (message: ChatMessage, currentUserId: number) => void;
  markMessagesRead: (senderId: number) => Promise<void>;
  applyMessagesRead: (userId: number) => void;
  clear: () => void;
}

function appendUniqueMessage(messages: ChatMessage[], message: ChatMessage) {
  if (messages.some((item) => item.id === message.id)) {
    return messages;
  }

  return [...messages, message].sort(
    (left, right) =>
      new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
  );
}

function getOtherUserId(message: ChatMessage, currentUserId: number) {
  return message.senderId === currentUserId
    ? message.receiverId
    : message.senderId;
}

function withLastMessage(
  clients: ChatUser[],
  userId: number,
  updater: (client: ChatUser) => ChatUser,
) {
  return clients.map((client) =>
    client.userId === userId ? updater(client) : client,
  );
}

export const useChatStore = create<ChatStoreState>((set, get) => ({
  clients: [],
  selectedClientId: null,
  messagesByUserId: {},
  isClientsLoading: false,
  loadingConversations: {},
  typingByUserId: {},
  isConnected: false,
  connectionAttempted: false,

  setSelectedClientId: (clientId) => {
    set({ selectedClientId: clientId });
  },

  setConnectionStatus: (isConnected) => {
    set({ isConnected });
  },

  setConnectionAttempted: (value) => {
    set({ connectionAttempted: value });
  },

  setTyping: (userId, isTyping) => {
    set((state) => ({
      typingByUserId: {
        ...state.typingByUserId,
        [userId]: isTyping,
      },
    }));
  },

  loadChats: async () => {
    set({ isClientsLoading: true });

    try {
      const clients = await chatService.getUserChats();
      set({ clients });
      return clients;
    } finally {
      set({ isClientsLoading: false });
    }
  },

  loadConversation: async (otherUserId, currentUserId) => {
    set((state) => ({
      loadingConversations: {
        ...state.loadingConversations,
        [otherUserId]: true,
      },
    }));

    try {
      const messages = await chatService.getConversation(otherUserId, 100, 0);
      set((state) => ({
        messagesByUserId: {
          ...state.messagesByUserId,
          [otherUserId]: messages,
        },
        clients: withLastMessage(state.clients, otherUserId, (client) => ({
          ...client,
          lastMessage: messages.at(-1) ?? client.lastMessage,
          unreadCount: 0,
        })),
      }));

      const unreadMessages = messages.filter(
        (message) => message.senderId !== currentUserId && !message.isRead,
      );

      if (unreadMessages.length > 0) {
        await get().markMessagesRead(otherUserId);
      }
    } finally {
      set((state) => ({
        loadingConversations: {
          ...state.loadingConversations,
          [otherUserId]: false,
        },
        connectionAttempted: true,
      }));
    }
  },

  receiveMessage: (message, currentUserId) => {
    const otherUserId = getOtherUserId(message, currentUserId);

    set((state) => {
      const currentMessages = state.messagesByUserId[otherUserId] ?? [];
      const nextMessages = appendUniqueMessage(currentMessages, message);
      const isDuplicate = nextMessages === currentMessages;

      return {
        messagesByUserId: {
          ...state.messagesByUserId,
          [otherUserId]: nextMessages,
        },
        clients: withLastMessage(state.clients, otherUserId, (client) => ({
          ...client,
          lastMessage: message,
          unreadCount:
            message.senderId === currentUserId || isDuplicate
              ? client.unreadCount
              : client.unreadCount + 1,
        })),
      };
    });
  },

  receiveSentMessage: (message, currentUserId) => {
    const otherUserId = getOtherUserId(message, currentUserId);

    set((state) => ({
      messagesByUserId: {
        ...state.messagesByUserId,
        [otherUserId]: appendUniqueMessage(
          state.messagesByUserId[otherUserId] ?? [],
          message,
        ),
      },
      clients: withLastMessage(state.clients, otherUserId, (client) => ({
        ...client,
        lastMessage: message,
      })),
    }));
  },

  markMessagesRead: async (senderId) => {
    await chatService.markMessagesAsRead(senderId);
    get().applyMessagesRead(senderId);
  },

  applyMessagesRead: (userId) => {
    set((state) => ({
      messagesByUserId: {
        ...state.messagesByUserId,
        [userId]: (state.messagesByUserId[userId] ?? []).map((message) => ({
          ...message,
          isRead: true,
        })),
      },
      clients: withLastMessage(state.clients, userId, (client) => ({
        ...client,
        unreadCount: 0,
      })),
    }));
  },

  clear: () => {
    set({
      clients: [],
      selectedClientId: null,
      messagesByUserId: {},
      isClientsLoading: false,
      loadingConversations: {},
      typingByUserId: {},
      isConnected: false,
      connectionAttempted: false,
    });
  },
}));
