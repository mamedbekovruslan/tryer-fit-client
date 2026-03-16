'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage } from '@/services/chatService';
import { useAuth } from '@/providers/AuthProvider';

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
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (isInitializing || !isAuthenticated) {
      return;
    }

    // Если подключение уже есть, не создаём новое
    if (socketRef.current) {
      return;
    }

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

    // Создаем WebSocket подключение
    socketRef.current = io(`${baseURL}/chat`, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    setSocket(socketRef.current);

    socketRef.current.on('connect', () => {
      setIsConnected(true);
    });

    socketRef.current.on('connected', (data) => {
      optionsRef.current.onConnected?.(data);
    });

    socketRef.current.on('receiveMessage', (message: ChatMessage) => {
      optionsRef.current.onMessage?.(message);
    });

    socketRef.current.on('messageSent', (message: ChatMessage) => {
      optionsRef.current.onMessageSent?.(message);
    });

    socketRef.current.on('messagesRead', (data) => {
      optionsRef.current.onMessagesRead?.(data);
    });

    socketRef.current.on('userTyping', (data) => {
      optionsRef.current.onUserTyping?.(data);
    });

    socketRef.current.on('error', (error) => {
      console.error('[useChatSocket] WebSocket error:', error);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    socketRef.current.on('reconnect', () => {
      setIsConnected(true);
    });

    socketRef.current.on('reconnect_error', (error) => {
      console.error('[useChatSocket] Reconnect error:', error);
    });

    return () => {
      // Не отключаем сокет при размонтировании, чтобы сохранить подключение при навигации.
    };
  }, [isAuthenticated, isInitializing]);

  // Отдельный эффект для очистки подключения при размонтировании всего приложения
  useEffect(() => {
    if (!isInitializing && !isAuthenticated && socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    }
  }, [isAuthenticated, isInitializing]);

  const sendMessage = useCallback((receiverId: number, senderType: 'client' | 'trainer', message: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('sendMessage', {
        receiverId,
        senderType,
        message,
      });
    }
  }, []);

  const markAsRead = useCallback((senderId: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('markAsRead', { senderId });
    }
  }, []);

  const sendTypingStatus = useCallback((receiverId: number, isTyping: boolean) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing', { receiverId, isTyping });
    }
  }, []);

  return {
    socket,
    sendMessage,
    markAsRead,
    sendTypingStatus,
    isConnected,
  };
}
