'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewReportPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/me/progress/new-report');
  }, [router]);

  return null;
}