'use client';

import { ReactNode } from 'react';
import { AppShell } from '@mantine/core';
import { HeaderContent } from '@/components/Header/Header';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header h={60} bg="blue" px="md">
        <HeaderContent />
      </AppShell.Header>
      <AppShell.Main p="md">
        {children}
      </AppShell.Main>
    </AppShell>
  );
};