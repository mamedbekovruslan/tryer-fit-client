import { Container, Title, Text, Paper, Stack, Card, Grid, Button, Flex, Badge } from '@mantine/core';
import { ReactNode } from 'react';

interface ClientProfileLayoutProps {
  children: ReactNode;
}

export default function ClientProfileLayout({ children }: ClientProfileLayoutProps) {
  return (
    <div>
      {children}
    </div>
  );
}