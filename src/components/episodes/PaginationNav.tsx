'use client';

import type { Pagination } from '@/types/episode';

interface PaginationNavProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export default function PaginationNav({ pagination, onPageChange }: PaginationNavProps) {
  const { page, totalPages } = pagination;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <nav className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-3 bg-white border-4 border-black font-archivo-black text-black uppercase tracking-wider rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f9c937] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        ← ANT
      </button>

      <div className="flex items-center gap-1">
        {getVisiblePages().map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-3 py-3 font-archivo-black text-black/50">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`
                w-12 h-12 font-archivo-black text-lg uppercase tracking-wider rounded-sm border-4 border-black
                transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                ${
                  p === page
                    ? 'bg-black text-[#f9c937]'
                    : 'bg-white text-black hover:bg-[#f9c937]'
                }
              `}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-4 py-3 bg-white border-4 border-black font-archivo-black text-black uppercase tracking-wider rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f9c937] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        SIG →
      </button>
    </nav>
  );
}
