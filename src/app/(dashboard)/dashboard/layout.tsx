'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Sidebar from './components/Sidebar';
import { Toaster } from '@/components/ui/Toast';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 bg-white lg:p-8 overflow-auto">
        {/* Hamburger button — only visible on tablets and below (md) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-3 left-3 lg:top-4 lg:left-4 z-[60] w-12 h-12 lg:w-14 lg:h-14 bg-edn-neon-yellow border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:hidden flex items-center justify-center"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          <span className="font-archivo-black text-xl lg:text-2xl text-black">{sidebarOpen ? '✕' : '☰'}</span>
        </button>
        <div className="max-w-7xl mx-auto pt-14 md:pt-16 lg:pt-0 px-4 md:px-6 lg:px-0">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}