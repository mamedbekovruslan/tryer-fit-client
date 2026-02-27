'use client';

import { useState, useCallback, useEffect } from 'react';
import { Box, TextInput, ActionIcon, Group } from '@mantine/core';
import { FaPaperPlane } from 'react-icons/fa';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onTyping?: () => void;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, onTyping, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [lastTypingTime, setLastTypingTime] = useState(0);

  const handleSend = useCallback(() => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  }, [message, onSendMessage, disabled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    // Отправляем событие набора текста не чаще чем раз в 500мс
    const now = Date.now();
    if (onTyping && now - lastTypingTime > 500) {
      onTyping();
      setLastTypingTime(now);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box p="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
      <Group gap="xs" wrap="nowrap">
        <TextInput
          placeholder="Введите сообщение..."
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          style={{ flex: 1 }}
          variant="filled"
          radius="md"
        />
        <ActionIcon
          size="lg"
          color="blue"
          variant="filled"
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          radius="md"
        >
          <FaPaperPlane size={18} />
        </ActionIcon>
      </Group>
    </Box>
  );
}
