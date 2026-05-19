'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTourShowById } from '@/hooks/useTourShowById';
import { useDeleteTourShow } from '@/hooks/useDeleteTourShow';
import { toast } from '@/components/ui/Toast';
import TourShowForm from '@/components/tour-shows/TourShowForm';

export default function EditTourShowPage() {
  const params = useParams();
  const router = useRouter();
  const showId = params.id as string;
  const { tourShow, loading, error } = useTourShowById(showId);
  const { deleteTourShow, loading: deleteLoading } = useDeleteTourShow();

  if (loading) {
    return (
      <div className="bg-white p-8 flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !tourShow) {
    return (
      <div className="bg-white p-8">
        <div className="p-6 bg-red-500 text-white font-archivo-black uppercase border-4 border-black">
          {error || 'Fecha no encontrada'}
        </div>
        <button
          onClick={() => router.push('/dashboard/tour-shows')}
          className="mt-4 px-6 py-3 bg-black text-white font-archivo-black uppercase border-4 border-black hover:bg-[#f9c937] hover:text-black transition-colors"
        >
          ← Volver a Tour Shows
        </button>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar esta fecha?')) return;

    const success = await deleteTourShow(showId);
    if (success) {
      toast.success('¡Fecha de tour eliminada! 🗑️');
      router.push('/dashboard/tour-shows');
    }
  };

  return (
    <div className="bg-white p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push('/dashboard/tour-shows')}
          className="flex items-center gap-2 px-4 py-2 bg-black text-[#f9c937] font-archivo-black uppercase text-sm border-4 border-black hover:bg-[#f9c937] hover:text-black transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </button>
        <h1 className="font-syne font-extrabold text-3xl text-black uppercase tracking-tight">
          Editar Show
        </h1>
      </div>

      {/* Form */}
      <TourShowForm mode="edit" initialData={tourShow} />

      {/* Delete section */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleDelete}
          disabled={deleteLoading}
          className="px-6 py-3 bg-red-600 text-white font-archivo-black uppercase text-sm border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {deleteLoading ? 'Eliminando...' : 'Eliminar show'}
        </button>
      </div>
    </div>
  );
}
