'use client';

import { useRouter } from 'next/navigation';
import TourShowForm from '@/components/tour-shows/TourShowForm';

export default function NewTourShowPage() {
  const router = useRouter();

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <button
          onClick={() => router.push('/dashboard/tour-shows')}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-black text-[#f9c937] font-archivo-black uppercase text-xs sm:text-sm border-3 sm:border-4 border-black hover:bg-[#f9c937] hover:text-black transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden xs:inline">Volver</span>
        </button>
        <h1 className="font-syne font-extrabold text-2xl sm:text-3xl text-black uppercase tracking-tight">
          Nuevo Show
        </h1>
      </div>

      {/* Form */}
      <TourShowForm mode="create" />
    </div>
  );
}
