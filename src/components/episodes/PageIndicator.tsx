'use client';

interface PageIndicatorProps {
  page: number;
  totalPages: number;
  total: number;
}

export default function PageIndicator({ page, totalPages, total }: PageIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-2 mt-8">
      <p className="font-archivo-black text-xl text-[#f9c937] uppercase tracking-wider">
        P&Aacute;GINA {page} DE {totalPages}
      </p>
      <p className="font-plus-jakarta text-sm text-white/60">
        {total} EPISODIOS TOTALES
      </p>
    </div>
  );
}
