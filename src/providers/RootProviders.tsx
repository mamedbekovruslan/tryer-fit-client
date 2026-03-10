'use client';

import { ReactNode } from 'react';
import { Button, createTheme, MantineProvider } from '@mantine/core';
import { AuthProvider } from '@/providers/AuthProvider';
import { AuthLayout } from '@/components/AuthLayout';

interface RootProvidersProps {
  children: ReactNode;
}

const theme = createTheme({
  components: {
    Button: Button.extend({
      defaultProps: {
        size: 'md',
      },
    }),
  },
});

export const RootProviders = ({ children }: RootProvidersProps) => {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <AuthProvider>
        <AuthLayout>{children}</AuthLayout>
      </AuthProvider>
    </MantineProvider>
  );
};
