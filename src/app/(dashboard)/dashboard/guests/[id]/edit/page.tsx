'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGuestById } from '@/hooks/useGuestById';
import GuestForm from '@/components/guests/GuestForm';

export default function EditGuestPage() {
  const params = useParams();
  const router = useRouter();
  const guestId = params.id as string;
  const { guest, loading, error } = useGuestById(guestId);

  if (loading) {
    return (
      <div className="bg-white p-8 flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !guest) {
    return (
      <div className="bg-white p-8">
        <div className="p-6 bg-red-500 text-white font-archivo-black uppercase border-4 border-black">
          {error || 'Invitado no encontrado'}
        </div>
        <button
          onClick={() => router.push('/dashboard/guests')}
          className="mt-4 px-6 py-3 bg-black text-white font-archivo-black uppercase border-4 border-black hover:bg-[#f9c937] hover:text-black transition-colors"
        >
          ← Volver a invitados
        </button>
      </div>
    );
  }

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
          Editar Invitado
        </h1>
      </div>

      {/* Form */}
      <GuestForm mode="edit" initialData={guest} />
    </div>
  );
}
