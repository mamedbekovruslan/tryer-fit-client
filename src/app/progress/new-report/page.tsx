'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewReportPage() {
  const router = useRouter();

  useEffect(() => {
    // Перенаправляем на новую страницу добавления прогресса
    router.push('/me/progress/new-report');
  }, [router]);

  return null;
}