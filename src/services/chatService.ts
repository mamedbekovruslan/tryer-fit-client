import apiClient from '@/lib/api';

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
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export const chatService = {
  /**
   * Получить историю переписки с пользователем
   */
  getConversation: async (userId: number, limit?: number, offset?: number): Promise<ChatMessage[]> => {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());

      const url = `/chat/messages/${userId}${params.toString() ? `?${params.toString()}` : ''}`;
      console.log('[chatService] getConversation URL:', url);
      
      const response = await apiClient.get<ChatMessage[]>(url);
      console.log('[chatService] getConversation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[chatService] Error fetching conversation:', error);
      throw error;
    }
  },

  /**
   * Получить все чаты пользователя
   */
  getUserChats: async (): Promise<ChatUser[]> => {
    try {
      console.log('[chatService] getUserChats - calling API');
      const response = await apiClient.get<ChatUser[]>('/chat/chats');
      console.log('[chatService] getUserChats response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[chatService] Error fetching user chats:', error);
      throw error;
    }
  },

  /**
   * Отправить сообщение (REST API)
   */
  sendMessage: async (
    receiverId: number,
    senderType: 'client' | 'trainer',
    message: string
  ): Promise<ChatMessage> => {
    try {
      console.log('[chatService] sendMessage:', { receiverId, senderType, message });
      const response = await apiClient.post<ChatMessage>('/chat/messages', {
        receiverId,
        senderType,
        message,
      });
      console.log('[chatService] sendMessage response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[chatService] Error sending message:', error);
      throw error;
    }
  },

  /**
   * Отметить сообщения как прочитанные
   */
  markMessagesAsRead: async (senderId: number): Promise<void> => {
    try {
      console.log('[chatService] markMessagesAsRead:', senderId);
      await apiClient.patch(`/chat/messages/${senderId}/read`);
    } catch (error) {
      console.error('[chatService] Error marking messages as read:', error);
      throw error;
    }
  },

  /**
   * Получить непрочитанные сообщения
   */
  getUnreadMessages: async (senderId: number): Promise<ChatMessage[]> => {
    try {
      console.log('[chatService] getUnreadMessages:', senderId);
      const response = await apiClient.get<ChatMessage[]>(
        `/chat/messages/unread/${senderId}`
      );
      console.log('[chatService] getUnreadMessages response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[chatService] Error fetching unread messages:', error);
      throw error;
    }
  },
};
