'use client';

import { useState, useEffect, useRef } from 'react';
import { Container, Title, Paper, Text, Input, Button, Group, ScrollArea, Avatar, Box, ActionIcon, Tooltip } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { FaPaperPlane, FaSmile, FaImage } from 'react-icons/fa';

// Типы данных
interface Message {
  id: number;
  sender: 'client' | 'trainer';
  content: string;
  timestamp: string;
  type: 'text' | 'image';
  read: boolean;
}

interface Trainer {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
}

// Моковые данные
const mockTrainer: Trainer = {
  id: 1,
  name: 'Иван Петров',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  online: true
};

const mockMessages: Message[] = [
  { id: 1, sender: 'trainer', content: 'Привет! Как продвигается тренировочный процесс?', timestamp: '10:30', type: 'text', read: true },
  { id: 2, sender: 'client', content: 'Все отлично! Вес стал меньше на 2 кг за последнюю неделю', timestamp: '10:32', type: 'text', read: true },
  { id: 3, sender: 'trainer', content: 'Отличные новости! Продолжай в том же духе', timestamp: '10:33', type: 'text', read: true },
  { id: 4, sender: 'trainer', content: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', timestamp: '10:35', type: 'image', read: false },
  { id: 5, sender: 'client', content: 'Спасибо! Вот мои последние измерения', timestamp: '10:36', type: 'text', read: false },
];

export default function TrainerChatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputValue, setInputValue] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Автоматическая прокрутка к последнему сообщению
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, selectedImages]);

  // Подсчет непрочитанных сообщений от тренера
  const unreadCount = messages.filter(msg => msg.sender === 'trainer' && !msg.read).length;

  const handleSendMessage = () => {
    if (inputValue.trim() === '' && selectedImages.length === 0) return;

    const newMessages: Message[] = [];

    // Добавляем текстовое сообщение, если оно есть
    if (inputValue.trim() !== '') {
      const newTextMessage: Message = {
        id: messages.length + 1,
        sender: 'client',
        content: inputValue,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        read: false
      };
      newMessages.push(newTextMessage);
      setInputValue('');
    }

    // Добавляем изображения, если они есть
    selectedImages.forEach(image => {
      const newImageMessage: Message = {
        id: messages.length + newMessages.length + 1,
        sender: 'client',
        content: URL.createObjectURL(image),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'image',
        read: false
      };
      newMessages.push(newImageMessage);
    });

    setMessages(prev => [...prev, ...newMessages]);
    setSelectedImages([]);
  };

  const handleImageUpload = (files: File[]) => {
    setSelectedImages(prev => [...prev, ...files]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container size="md" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Group justify="space-between" mb="lg">
          <Group>
            <Avatar src={mockTrainer.avatar} alt={mockTrainer.name} radius="xl" />
            <div>
              <Title order={3}>{mockTrainer.name}</Title>
              <Text size="sm" c={mockTrainer.online ? 'green' : 'gray'}>
                {mockTrainer.online ? 'В сети' : 'Не в сети'}
              </Text>
            </div>
          </Group>
          {unreadCount > 0 && (
            <Text bg="red" c="white" px="sm" py="xs" style={{ borderRadius: '10px' }}>
              {unreadCount} непрочит.
            </Text>
          )}
        </Group>

        <ScrollArea h={400} mb="md" ref={scrollAreaRef}>
          {messages.map((message) => (
            <Box
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.sender === 'client' ? 'flex-end' : 'flex-start',
                marginBottom: '10px'
              }}
            >
              <Box
                style={{
                  maxWidth: '70%',
                  padding: '10px 15px',
                  borderRadius: '18px',
                  backgroundColor: message.sender === 'client' ? '#0084ff' : '#f0f0f0',
                  color: message.sender === 'client' ? 'white' : 'black'
                }}
              >
                {message.type === 'image' ? (
                  <img 
                    src={message.content} 
                    alt="Uploaded content" 
                    style={{ maxWidth: '100%', borderRadius: '8px' }} 
                  />
                ) : (
                  <Text>{message.content}</Text>
                )}
                <Text size="xs" opacity={0.6} mt="xs" style={{ textAlign: 'right' }}>
                  {message.timestamp}
                </Text>
              </Box>
            </Box>
          ))}
          
          {/* Отображение выбранных изображений */}
          {selectedImages.map((image, index) => (
            <Box
              key={`selected-${index}`}
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: '10px'
              }}
            >
              <Box
                style={{
                  maxWidth: '70%',
                  padding: '10px 15px',
                  borderRadius: '18px',
                  backgroundColor: '#0084ff',
                  color: 'white'
                }}
              >
                <img 
                  src={URL.createObjectURL(image)} 
                  alt={`Selected ${index}`} 
                  style={{ maxWidth: '100%', borderRadius: '8px' }} 
                />
              </Box>
            </Box>
          ))}
        </ScrollArea>

        <Box>
          {selectedImages.length > 0 && (
            <Group mb="md">
              {selectedImages.map((image, index) => (
                <Box key={index} style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index}`}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <Button
                    variant="subtle"
                    color="red"
                    size="compact-xs"
                    style={{ position: 'absolute', top: -5, right: -5 }}
                    onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                  >
                    ×
                  </Button>
                </Box>
              ))}
            </Group>
          )}

          <Group align="flex-end">
            <Input.Wrapper>
              <Input
                component="textarea"
                minRows={2}
                maxRows={4}
                placeholder="Напишите сообщение..."
                value={inputValue}
                onChange={(e) => setInputValue(e.currentTarget.value)}
                onKeyDown={handleKeyPress}
              />
            </Input.Wrapper>

            <Group>
              <Dropzone
                onDrop={handleImageUpload}
                onReject={(files) => console.log('rejected files', files)}
                maxSize={3 * 1024 ** 2} // 3MB
                accept={IMAGE_MIME_TYPE}
                style={{ width: 'auto', padding: '6px' }}
              >
                <ActionIcon variant="light">
                  <FaImage />
                </ActionIcon>
              </Dropzone>

              <Tooltip label="Отправить">
                <ActionIcon variant="filled" color="blue" onClick={handleSendMessage}>
                  <FaPaperPlane />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
        </Box>
      </Paper>
    </Container>
  );
}