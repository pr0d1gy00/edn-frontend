"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { TourShow } from "@/types/tourShow";
import { useTourShows } from "@/hooks/useTourShows";
import TourShowGrid from "@/components/tour-shows/TourShowGrid";
import PaginationNav from "@/components/episodes/PaginationNav";
import LimitSelector from "@/components/episodes/LimitSelector";
import PageIndicator from "@/components/episodes/PageIndicator";

export default function TourShowsPage() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [ticketStatus, setTicketStatus] = useState("");
  const [upcoming, setUpcoming] = useState(false);

  const {
    tourShows,
    loading: tourShowsLoading,
    error: tourShowsError,
    meta,
  } = useTourShows({
    page,
    limit,
    ticketStatus: ticketStatus || undefined,
    upcoming: upcoming || undefined,
    search: search || undefined,
  });

  const handleTourShowClick = useCallback(
    (show: TourShow) => {
      router.push(`/dashboard/tour-shows/${show.id}`);
    },
    [router],
  );

  const handleAddClick = useCallback(() => {
    router.push("/dashboard/tour-shows/new");
  }, [router]);

  const handleRetry = useCallback(() => {
    setPage((p) => p);
  }, []);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTicketStatus(e.target.value);
    setPage(1);
  };

  const handleUpcomingToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpcoming(e.target.checked);
    setPage(1);
  };

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="min-w-0">
          <h1 className="font-syne font-extrabold text-2xl sm:text-3xl text-black uppercase tracking-tight">
            Tour Shows
          </h1>
          <p className="font-plus-jakarta text-black/50 mt-1 text-sm sm:text-base">
            Gestiona las fechas de la gira
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="
            px-4 sm:px-6 py-2.5 sm:py-3 bg-black text-white font-archivo-black uppercase text-xs sm:text-sm
            border-3 sm:border-4 border-black rounded-none
            shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
            hover:translate-x-[-1px] hover:translate-y-[-1px] sm:hover:translate-x-[-2px] sm:hover:translate-y-[-2px]
            transition-all duration-150
            whitespace-nowrap
          "
        >
          + Nuevo Show
        </button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex-1 min-w-0">
          <label
            htmlFor="show-status-filter"
            className="block font-archivo-black uppercase text-xs text-black mb-1 tracking-wide"
          >
            Estado
          </label>
          <select
            id="show-status-filter"
            value={ticketStatus}
            onChange={handleStatusChange}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-3 sm:border-4 border-black font-plus-jakarta text-black text-sm focus:outline-none focus:bg-[#f9c937]/20"
          >
            <option value="">TODOS</option>
            <option value="AVAILABLE">DISPONIBLE</option>
            <option value="FEW_TICKETS">¡ÚLTIMAS!</option>
            <option value="SOLD_OUT">AGOTADO</option>
          </select>
        </div>

        <div className="flex items-center gap-2 pt-0 sm:pt-5">
          <input
            id="upcoming-filter"
            type="checkbox"
            checked={upcoming}
            onChange={handleUpcomingToggle}
            className="w-5 h-5 border-4 border-black accent-[#f9c937] flex-shrink-0"
          />
          <label
            htmlFor="upcoming-filter"
            className="font-archivo-black uppercase text-sm text-black cursor-pointer"
          >
            Solo próximos
          </label>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-4 sm:mb-6">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar por ciudad o país..."
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-3 sm:border-4 border-black font-plus-jakarta text-black text-sm placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20"
        />
      </div>

      {/* Pagination controls */}
      {meta && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6 p-3 sm:p-4 bg-black/[0.03] border-3 sm:border-4 border-black">
          <LimitSelector value={limit} onChange={handleLimitChange} />
          <PageIndicator
            page={page}
            totalPages={meta.totalPages}
            total={meta.total}
          />
          <PaginationNav pagination={meta} onPageChange={handlePageChange} />
        </div>
      )}

      <TourShowGrid
        shows={tourShows}
        isLoading={tourShowsLoading}
        error={tourShowsError}
        onTourShowClick={handleTourShowClick}
        onAddClick={handleAddClick}
        onRetry={handleRetry}
      />
    </div>
  );
}
