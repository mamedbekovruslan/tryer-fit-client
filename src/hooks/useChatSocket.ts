'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage } from '@/services/chatService';

interface UseChatSocketOptions {
  onMessage?: (message: ChatMessage) => void;
  onMessageSent?: (message: ChatMessage) => void;
  onMessagesRead?: (data: { userId: number; senderId: number }) => void;
  onUserTyping?: (data: { senderId: number; senderType: string; isTyping: boolean }) => void;
  onConnected?: (data: { userId: number; userType: string }) => void;
}

// Используем ref для хранения колбэков, чтобы избежать пересоздания подключения
export function useChatSocket(options: UseChatSocketOptions = {}) {
  const socketRef = useRef<Socket | null>(null);
  const optionsRef = useRef(options);
  const [isConnected, setIsConnected] = useState(false);

  // Обновляем ref с опциями при каждом изменении
  optionsRef.current = options;

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('[useChatSocket] No token found, skipping WebSocket connection');
      return;
    }

    // Если подключение уже есть, не создаём новое
    if (socketRef.current) {
      console.log('[useChatSocket] Socket already exists, skipping connection');
      return;
    }

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

    console.log('[useChatSocket] Connecting to WebSocket:', `${baseURL}/chat`);

    // Создаем WebSocket подключение
    socketRef.current = io(`${baseURL}/chat`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('[useChatSocket] WebSocket connected:', socketRef.current?.id);
      setIsConnected(true);
    });

    socketRef.current.on('connected', (data) => {
      console.log('[useChatSocket] Authenticated as:', data);
      optionsRef.current.onConnected?.(data);
    });

    socketRef.current.on('receiveMessage', (message: ChatMessage) => {
      console.log('[useChatSocket] New message received:', message);
      optionsRef.current.onMessage?.(message);
    });

    socketRef.current.on('messageSent', (message: ChatMessage) => {
      console.log('[useChatSocket] Message sent:', message);
      optionsRef.current.onMessageSent?.(message);
    });

    socketRef.current.on('messagesRead', (data) => {
      console.log('[useChatSocket] Messages marked as read:', data);
      optionsRef.current.onMessagesRead?.(data);
    });

    socketRef.current.on('userTyping', (data) => {
      optionsRef.current.onUserTyping?.(data);
    });

    socketRef.current.on('error', (error) => {
      console.error('[useChatSocket] WebSocket error:', error);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('[useChatSocket] WebSocket disconnected:', reason);
      setIsConnected(false);
    });

    socketRef.current.on('reconnect', (attemptNumber) => {
      console.log('[useChatSocket] WebSocket reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
    });

    socketRef.current.on('reconnect_error', (error) => {
      console.error('[useChatSocket] Reconnect error:', error);
    });

    return () => {
      // Не отключаем сокет при размонтировании, чтобы сохранить подключение
      // при навигации между компонентами
      console.log('[useChatSocket] Component unmounted, keeping socket alive');
    };
  }, []); // Пустой массив зависимостей - создаём подключение только один раз

  // Отдельный эффект для очистки подключения при размонтировании всего приложения
  useEffect(() => {
    return () => {
      // Проверяем, есть ли другие активные компоненты с этим хуком
      // Если нет - отключаем сокет
      const token = localStorage.getItem('token');
      if (!token && socketRef.current) {
        console.log('[useChatSocket] No token, disconnecting socket');
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, []);

  const sendMessage = useCallback((receiverId: number, senderType: 'client' | 'trainer', message: string) => {
    if (socketRef.current?.connected) {
      console.log('[useChatSocket] Sending message:', { receiverId, senderType, message });
      socketRef.current.emit('sendMessage', {
        receiverId,
        senderType,
        message,
      });
    } else {
      console.warn('[useChatSocket] Socket not connected, message not sent');
    }
  }, []);

  const markAsRead = useCallback((senderId: number) => {
    if (socketRef.current?.connected) {
      console.log('[useChatSocket] Marking messages as read:', senderId);
      socketRef.current.emit('markAsRead', { senderId });
    }
  }, []);

  const sendTypingStatus = useCallback((receiverId: number, isTyping: boolean) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing', { receiverId, isTyping });
    }
  }, []);

  return {
    socket: socketRef.current,
    sendMessage,
    markAsRead,
    sendTypingStatus,
    isConnected,
  };
}
