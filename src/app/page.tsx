"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Pas orang buka localhost:3000, langsung lempar ke /beranda otomatis!
    router.replace('/beranda');
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-gray-500 font-mono text-xs tracking-widest uppercase">
      Mengalihkan ke Beranda CinemaVote...
    </div>
  );
}