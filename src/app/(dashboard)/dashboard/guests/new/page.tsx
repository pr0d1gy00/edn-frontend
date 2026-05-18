'use client';

import { useRouter } from 'next/navigation';
import GuestForm from '@/components/guests/GuestForm';

export default function NewGuestPage() {
  const router = useRouter();

  return (
    <div className="bg-white p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push('/dashboard/guests')}
          className="flex items-center gap-2 px-4 py-2 bg-black text-[#f9c937] font-archivo-black uppercase text-sm border-4 border-black hover:bg-[#f9c937] hover:text-black transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </button>
        <h1 className="font-syne font-extrabold text-3xl text-black uppercase tracking-tight">
          Nuevo Invitado
        </h1>
      </div>

      {/* Form */}
      <GuestForm mode="create" />
    </div>
  );
}
