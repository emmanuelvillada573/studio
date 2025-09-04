"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Spinner from '@/components/ui/spinner';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      router.push('/login');
    } else {
      router.push('/households');
    }
  }, [user, loading, router]);

  return <Spinner />;
}
