'use client';

import { useParams, useRouter } from 'next/navigation';
import { GuestModal } from '@/components/guests';

export default function GuestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const guestId = params.id as string;

  return (
    <div className="bg-white min-h-screen">
      {/* Back button */}
      <div className="p-4">
        <button
          onClick={() => router.push('/dashboard/guests')}
          className="flex items-center gap-2 px-4 py-2 bg-black text-[#f9c937] font-archivo-black uppercase text-sm border-4 border-black hover:bg-[#f9c937] hover:text-black transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </button>
      </div>

      {/* Modal auto-opened */}
      <GuestModal
        guestId={guestId}
        isOpen={true}
        onClose={() => router.push('/dashboard/guests')}
      />
    </div>
  );
}
