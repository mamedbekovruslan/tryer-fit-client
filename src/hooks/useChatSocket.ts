'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage } from '@/services/chatService';
import { useAuth } from '@/providers/AuthProvider';
import { useChatStore } from '@/stores/chatStore';
import { getStoredAuthToken } from '@/lib/authToken';

interface UseChatSocketOptions {
  onMessage?: (message: ChatMessage) => void;
  onMessageSent?: (message: ChatMessage) => void;
  onMessagesRead?: (data: { userId: number; senderId: number }) => void;
  onUserTyping?: (data: { senderId: number; senderType: string; isTyping: boolean }) => void;
  onConnected?: (data: { userId: number; userType: string }) => void;
}

export function useChatSocket(options: UseChatSocketOptions = {}) {
  const socketRef = useRef<Socket | null>(null);
  const optionsRef = useRef(options);
  const { user, isAuthenticated, isInitializing } = useAuth();
  const isConnected = useChatStore((state) => state.isConnected);
  const setConnectionStatus = useChatStore((state) => state.setConnectionStatus);
  const setConnectionAttempted = useChatStore((state) => state.setConnectionAttempted);
  const setTyping = useChatStore((state) => state.setTyping);
  const applyMessagesRead = useChatStore((state) => state.applyMessagesRead);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (isInitializing || !isAuthenticated) {
      return;
    }

    if (socketRef.current) {
      return;
    }

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    const token = getStoredAuthToken();

    socketRef.current = io(`${baseURL}/chat`, {
      auth: token ? { token } : undefined,
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      setConnectionStatus(true);
    });

    socketRef.current.on('connected', (data) => {
      setConnectionAttempted(true);
      optionsRef.current.onConnected?.(data);
    });

    socketRef.current.on('receiveMessage', (message: ChatMessage) => {
      if (user?.id) {
        useChatStore.getState().receiveMessage(message, user.id);
      }
      optionsRef.current.onMessage?.(message);
    });

    socketRef.current.on('messageSent', (message: ChatMessage) => {
      if (user?.id) {
        useChatStore.getState().receiveSentMessage(message, user.id);
      }
      optionsRef.current.onMessageSent?.(message);
    });

    socketRef.current.on('messagesRead', (data: { userId: number; senderId: number }) => {
      applyMessagesRead(data.userId);
      optionsRef.current.onMessagesRead?.(data);
    });

    socketRef.current.on('userTyping', (data: { senderId: number; senderType: string; isTyping: boolean }) => {
      setTyping(data.senderId, data.isTyping);
      optionsRef.current.onUserTyping?.(data);
    });

    socketRef.current.on('error', (error) => {
    });

    socketRef.current.on('disconnect', () => {
      setConnectionStatus(false);
    });

    socketRef.current.on('reconnect', () => {
      setConnectionStatus(true);
    });

    socketRef.current.on('reconnect_error', (error) => {
    });

    return () => {
    };
  }, [
    applyMessagesRead,
    isAuthenticated,
    isInitializing,
    setConnectionAttempted,
    setConnectionStatus,
    setTyping,
    user?.id,
  ]);

  useEffect(() => {
    if (!isInitializing && !isAuthenticated && socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setConnectionStatus(false);
    }
  }, [isAuthenticated, isInitializing, setConnectionStatus]);

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
    sendMessage,
    markAsRead,
    sendTypingStatus,
    isConnected,
  };
}
