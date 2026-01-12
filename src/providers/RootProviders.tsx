'use client';

import { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { AuthProvider } from '@/providers/AuthProvider';
import { AuthLayout } from '@/components/AuthLayout';

interface RootProvidersProps {
  children: ReactNode;
}

export const RootProviders = ({ children }: RootProvidersProps) => {
  return (
    <MantineProvider defaultColorScheme="light">
      <AuthProvider>
        <AuthLayout>{children}</AuthLayout>
      </AuthProvider>
    </MantineProvider>
  );
};