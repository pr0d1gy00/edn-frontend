"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { TourShow } from "@/types/tourShow";

const STATUS_LABELS: Record<string, { text: string; bg: string; textColor: string }> = {
  AVAILABLE: { text: "DISPONIBLE", bg: "bg-green-500", textColor: "text-white" },
  FEW_TICKETS: { text: "¡ÚLTIMAS!", bg: "bg-orange-500", textColor: "text-white" },
  SOLD_OUT: { text: "AGOTADO", bg: "bg-red-500", textColor: "text-white" },
};

function formatShowDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface TourShowCardProps {
  show: TourShow;
  index: number;
  onClick: () => void;
}

export default function TourShowCard({
  show,
  index,
  onClick,
}: TourShowCardProps) {
  const statusInfo =
    STATUS_LABELS[show.ticketStatus] || STATUS_LABELS.AVAILABLE;
  const formattedDate = formatShowDate(show.showDate);
  const validImages = (show.images || []).filter(
    (img) => img.url && img.url.trim() !== "",
  );
  const hasImages = validImages.length > 0;
  const canBuy = show.ticketStatus !== "SOLD_OUT" && show.ticketUrl;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        type: "spring",
        stiffness: 150,
        damping: 20,
      }}
      onClick={onClick}
      className="relative bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[-2px] hover:-translate-y-[-2px] transition-all duration-150 cursor-pointer overflow-hidden"
    >
      {/* Image / Header area */}
      <div className="relative h-36 bg-[#f9c937] border-b-4 border-black">
        {hasImages ? (
          <Image
            src={validImages[0].url}
            alt={show.city}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
            unoptimized={
              validImages[0].url.includes("s3.") ||
              validImages[0].url.includes("cdn.") ||
              validImages[0].url.includes("r2.dev")
            }
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <span className="font-archivo-black text-7xl text-[#f9c937] uppercase">
              {show.city.charAt(0)}
            </span>
          </div>
        )}

        {/* Status badge - prominent, top-left corner */}
        <div className="absolute top-0 left-0">
          <div className={`px-4 py-2 ${statusInfo.bg} border-b-4 border-r-4 border-black`}>
            <span className={`font-archivo-black text-xs ${statusInfo.textColor} uppercase tracking-wider`}>
              {statusInfo.text}
            </span>
          </div>
        </div>

        {/* Image count badge */}
        {hasImages && show.images.length > 1 && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black text-[#f9c937] font-archivo-black text-xs border-2 border-[#f9c937]">
            {show.images.length} 📷
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-syne font-extrabold text-2xl text-black uppercase leading-tight tracking-tight">
              {show.city}
            </h3>
            <p className="font-archivo-black text-xs text-black/60 uppercase mt-1 tracking-widest">
              {show.country}
            </p>
          </div>
        </div>

        {/* Venue */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg">📍</span>
          <p className="font-plus-jakarta text-sm text-black font-medium">
            {show.venueName}
          </p>
        </div>

        {/* Date */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg">📅</span>
          <p className="font-archivo-black text-sm text-black">
            {formattedDate}
          </p>
        </div>

        {/* Action area */}
        <div className="mt-4 pt-4 border-t-4 border-black flex items-center justify-between">
          {canBuy ? (
            <a
              href={show.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-4 py-2 bg-[#f9c937] text-black font-archivo-black text-xs uppercase tracking-wider border-2 border-black hover:bg-black hover:text-[#f9c937] transition-colors"
            >
              COMPRAR
            </a>
          ) : (
            <span className="font-archivo-black text-xs text-black/40 uppercase">
              Sin entradas disponibles
            </span>
          )}
          <div className="w-3 h-3 bg-black rounded-full" />
        </div>
      </div>
    </motion.article>
  );
}