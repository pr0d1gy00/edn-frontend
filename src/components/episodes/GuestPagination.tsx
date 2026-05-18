'use client';

import { useCallback } from 'react';

interface GuestPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export default function GuestPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: GuestPaginationProps) {
  const handlePrev = useCallback(() => {
    if (page > 1) onPageChange(page - 1);
  }, [page, onPageChange]);

  const handleNext = useCallback(() => {
    if (page < totalPages) onPageChange(page + 1);
  }, [page, totalPages, onPageChange]);

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const showEllipsisStart = page > 3;
    const showEllipsisEnd = page < totalPages - 2;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (showEllipsisStart) pages.push('...');
      
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (showEllipsisEnd) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  if (totalPages <= 1 && total <= limit) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-black/[0.03] border-4 border-black">
      {/* Limit selector */}
      <div className="flex items-center gap-2">
        <span className="font-archivo-black text-xs text-black/50 uppercase">
          Mostrar
        </span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="px-3 py-2 bg-white border-2 border-black font-archivo-black text-sm cursor-pointer"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
        <span className="font-archivo-black text-xs text-black/50 uppercase">
          por página
        </span>
      </div>

      {/* Page info */}
      <div className="font-plus-jakarta text-sm text-black/70">
        Página <span className="font-archivo-black">{page}</span> de{' '}
        <span className="font-archivo-black">{totalPages}</span> •{' '}
        <span className="font-archivo-black">{total}</span> invitados
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="w-10 h-10 bg-white border-2 border-black font-archivo-black text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f9c937] transition-colors flex items-center justify-center"
        >
          ‹
        </button>

        {getVisiblePages().map((p, idx) =>
          typeof p === 'number' ? (
            <button
              key={idx}
              onClick={() => onPageChange(p)}
              className={`
                w-10 h-10 border-2 border-black font-archivo-black text-sm
                ${p === page ? 'bg-black text-[#f9c937]' : 'bg-white text-black hover:bg-[#f9c937]'}
                transition-colors
              `}
            >
              {p}
            </button>
          ) : (
            <span key={idx} className="w-10 h-10 flex items-center justify-center font-archivo-black text-black/30">
              {p}
            </span>
          ),
        )}

        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="w-10 h-10 bg-white border-2 border-black font-archivo-black text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f9c937] transition-colors flex items-center justify-center"
        >
          ›
        </button>
      </div>
    </div>
  );
}