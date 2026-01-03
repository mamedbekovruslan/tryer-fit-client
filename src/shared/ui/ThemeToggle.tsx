'use client';

import { useState, useEffect } from 'react';
import { ActionIcon } from '@mantine/core';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '@/providers/ThemeProvider';

export default function ThemeToggle() {
  const [isMounted, setIsMounted] = useState(false);
  const { colorScheme, toggleColorScheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div style={{ width: 36, height: 36 }} />;
  }

  return (
    <ActionIcon
      variant="outline"
      color={colorScheme === 'dark' ? 'yellow' : 'blue'}
      onClick={toggleColorScheme}
      title="Переключить тему"
    >
      {colorScheme === 'dark' ? <FaSun size={16} /> : <FaMoon size={16} />}
    </ActionIcon>
  );
}