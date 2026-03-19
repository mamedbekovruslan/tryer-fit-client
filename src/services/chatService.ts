import apiClient from '@/lib/api';
import { normalizeChatUser } from './modelAdapters';

export interface ChatMessage {
  id: number;
  senderId: number;
  receiverId: number;
  senderType: 'client' | 'trainer';
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatUser {
  userId: number;
  username: string;
  email?: string;
  photo_urls?: string[];
  photoUrls?: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export const chatService = {
  getConversation: async (userId: number, limit?: number, offset?: number): Promise<ChatMessage[]> => {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());

      const url = `/chat/messages/${userId}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiClient.get<ChatMessage[]>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserChats: async (): Promise<ChatUser[]> => {
    try {
      const response = await apiClient.get<ChatUser[]>('/chat/chats');
      return response.data.map(
        (user) =>
          normalizeChatUser(user as unknown as Record<string, unknown>) as unknown as ChatUser,
      );
    } catch (error) {
      throw error;
    }
  },

  sendMessage: async (
    receiverId: number,
    senderType: 'client' | 'trainer',
    message: string
  ): Promise<ChatMessage> => {
    try {
      const response = await apiClient.post<ChatMessage>('/chat/messages', {
        receiverId,
        senderType,
        message,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markMessagesAsRead: async (senderId: number): Promise<void> => {
    try {
      await apiClient.patch(`/chat/messages/${senderId}/read`);
    } catch (error) {
      throw error;
    }
  },

  getUnreadMessages: async (senderId: number): Promise<ChatMessage[]> => {
    try {
      const response = await apiClient.get<ChatMessage[]>(
        `/chat/messages/unread/${senderId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
