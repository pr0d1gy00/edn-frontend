"use client";

import { AnimatePresence } from "framer-motion";
import type { Guest } from "@/types/guest";
import GuestCard from "./GuestCard";

interface GuestGridProps {
  guests: Guest[];
  isLoading: boolean;
  error: string | null;
  onGuestClick: (guest: Guest) => void;
  onAddClick: () => void;
}

export default function GuestGrid({
  guests,
  isLoading,
  error,
  onGuestClick,
  onAddClick,
}: GuestGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-48 bg-white/10 border-4 border-black rounded-md animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="font-archivo-black text-2xl text-red-500 uppercase">
          {error}
        </p>
        <button
          onClick={onAddClick}
          className="mt-4 px-6 py-3 bg-[#f9c937] border-4 border-black font-archivo-black text-black uppercase rounded-sm hover:bg-[#e5b800] transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (guests.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-syne text-3xl text-black/40 uppercase">
          No hay invitados registrados
        </p>
        <button
          onClick={onAddClick}
          className="mt-6 px-6 py-3 bg-[#f9c937] border-4 border-black font-archivo-black text-black uppercase rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-150"
        >
          Agregar invitado
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <AnimatePresence mode="popLayout">
        {guests.map((guest, index) => (
          <GuestCard
            key={guest.id}
            guest={guest}
            index={index}
            onClick={() => onGuestClick(guest)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
