'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Guest } from '@/types/guest';
import { useGuests } from '@/hooks/useGuests';
import { useDeleteGuest } from '@/hooks/useDeleteGuest';
import { GuestGrid, GuestModal } from '@/components/guests';
import PaginationNav from '@/components/episodes/PaginationNav';
import LimitSelector from '@/components/episodes/LimitSelector';
import PageIndicator from '@/components/episodes/PageIndicator';

export default function GuestsPage() {
  const router = useRouter();
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const { guests, loading: guestsLoading, error: guestsError, meta } = useGuests({ page, limit });
  const { deleteGuest, loading: deleteLoading } = useDeleteGuest();

  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);

  const handleGuestClick = useCallback((guest: Guest) => {
    setSelectedGuestId(guest.id);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedGuestId(null);
  }, []);

  const handleAddClick = useCallback(() => {
    router.push('/dashboard/guests/new');
  }, [router]);

  const handleDelete = useCallback(async () => {
    if (!selectedGuestId) return;
    const name = guests.find((g) => g.id === selectedGuestId)?.name || 'este invitado';
    if (!confirm(`¿Estás seguro de eliminar a ${name}?`)) return;

    const success = await deleteGuest(selectedGuestId);
    if (success) {
      setSelectedGuestId(null);
      window.location.reload();
    }
  }, [selectedGuestId, guests, deleteGuest]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="bg-white p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne font-extrabold text-3xl text-black uppercase tracking-tight">
            Invitados
          </h1>
          <p className="font-plus-jakarta text-black/50 mt-1">
            Gestiona todos los invitados del podcast
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="
            px-6 py-3 bg-black text-white font-archivo-black uppercase text-sm
            border-4 border-black rounded-none
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
            hover:translate-x-[-2px] hover:translate-y-[-2px]
            transition-all duration-150
          "
        >
          + Nuevo Invitado
        </button>
      </div>

      {/* Pagination controls */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between mb-6 p-4 bg-black/[0.03] border-4 border-black">
          <LimitSelector value={limit} onChange={handleLimitChange} />
          <PageIndicator
            page={page}
            totalPages={meta.totalPages}
            total={meta.total}
          />
          <PaginationNav
            pagination={meta}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <GuestGrid
        guests={guests}
        isLoading={guestsLoading}
        error={guestsError}
        onGuestClick={handleGuestClick}
        onAddClick={handleAddClick}
      />

      {/* Guest detail modal */}
      {selectedGuestId && (
        <div className="fixed inset-0 z-[1000]">
          <GuestModal
            guestId={selectedGuestId}
            isOpen={true}
            onClose={handleCloseModal}
          />
          {/* Delete button overlay on modal */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1001]">
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="px-6 py-3 bg-red-600 text-white font-archivo-black uppercase text-sm border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deleteLoading ? 'Eliminando...' : 'Eliminar invitado'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
