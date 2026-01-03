'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MantineProvider, ColorScheme } from '@mantine/core';

const ThemeContext = createContext<{
  colorScheme: ColorScheme;
  toggleColorScheme: () => void;
} | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('mantine-color-scheme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setColorScheme(savedTheme as ColorScheme);
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setColorScheme(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleColorScheme = () => {
    const nextColorScheme = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(nextColorScheme);
    localStorage.setItem('mantine-color-scheme', nextColorScheme);
  };

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      <MantineProvider theme={{ colorScheme }} forceColorScheme={colorScheme}>
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}