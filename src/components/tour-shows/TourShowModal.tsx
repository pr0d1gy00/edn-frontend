"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { TourShow, TourShowImage } from "@/types/tourShow";
import { tourShowsApi } from "@/services/tourShowsApi";

// Dynamic import for SSR safety
const LocationMap = dynamic(() => import("./LocationMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#e5e5e5] animate-pulse" />,
});

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "DISPONIBLE",
  FEW_TICKETS: "¡ÚLTIMAS!",
  SOLD_OUT: "AGOTADO",
};

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "bg-green-500",
  FEW_TICKETS: "bg-orange-500",
  SOLD_OUT: "bg-red-500",
};

function formatShowDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isCDNUrl(url: string): boolean {
  return (
    url.includes("s3.") ||
    url.includes("cdn.") ||
    url.includes("idrivee2") ||
    url.includes("facebook.com") ||
    url.includes("r2.dev")
  );
}

interface TourShowModalProps {
  show: TourShow | null;
  onClose: () => void;
}

export default function TourShowModal({ show, onClose }: TourShowModalProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const position: [number, number] = [
    show?.latitude || 0,
    show?.longitude || 0,
  ];
  const statusLabel =
    STATUS_LABELS[show?.ticketStatus || "AVAILABLE"] || "DISPONIBLE";
  const statusColor =
    STATUS_COLORS[show?.ticketStatus || "AVAILABLE"] || "bg-green-500";
  const hasImages = show?.images && show.images.length > 0;
  const canBuy = show?.ticketStatus !== "SOLD_OUT" && show?.ticketUrl;
  const imagesForCarousel = hasImages
    ? show.images.map((img: TourShowImage) => img.url)
    : [];

  const goToPrev = () => {
    if (imagesForCarousel.length <= 1) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? imagesForCarousel.length - 1 : prev - 1,
    );
  };

  const goToNext = () => {
    if (imagesForCarousel.length <= 1) return;
    setCurrentImageIndex((prev) =>
      prev === imagesForCarousel.length - 1 ? 0 : prev + 1,
    );
  };

  const handleEdit = () => {
    onClose();
    if (show) router.push(`/dashboard/tour-shows/${show.id}`);
  };

  const handleDelete = async () => {
    if (!show) return;
    setIsDeleting(true);
    try {
      await tourShowsApi.deleteTourShow(show.id);
      onClose();
      window.location.reload();
    } catch {
      setIsDeleting(false);
    }
  };

  const hasCoordinates = show?.latitude != null && show?.longitude != null;
  return (
    <AnimatePresence>
      {show ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80"
            onClick={onClose}
          >
<motion.div
            initial={{ scale: 0.8, rotate: -2 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.8, rotate: 2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white border-3 sm:border-4 border-black rounded-md shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Image Carousel */}
            <div className="relative">
              {imagesForCarousel.length > 0 ? (
                <div className="relative h-40 sm:h-52 md:h-64 bg-[#f9c937] border-b-3 sm:border-b-4 border-black flex items-center justify-center">
                    <Image
                      src={imagesForCarousel[currentImageIndex]}
                      alt={`${show?.city} - Imagen ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                      unoptimized={isCDNUrl(
                        imagesForCarousel[currentImageIndex],
                      )}
                    />

                    {/* Carousel controls */}
                    {imagesForCarousel.length > 1 && (
                      <>
                        <button
                          onClick={goToPrev}
                          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 bg-black/50 text-white font-archivo-black text-base sm:text-lg border-2 border-black hover:bg-black transition-colors flex items-center justify-center"
                        >
                          ‹
                        </button>
                        <button
                          onClick={goToNext}
                          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 bg-black/50 text-white font-archivo-black text-base sm:text-lg border-2 border-black hover:bg-black transition-colors flex items-center justify-center"
                        >
                          ›
                        </button>

                        {/* Dot indicators */}
                        <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {imagesForCarousel.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full border-2 border-black transition-colors ${
                                idx === currentImageIndex
                                  ? "bg-[#f9c937]"
                                  : "bg-black/50"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Image counter */}
                        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-black text-[#f9c937] font-archivo-black text-xs border-2 border-black">
                          {currentImageIndex + 1}/{imagesForCarousel.length}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="h-32 sm:h-40 bg-[#f9c937] border-b-3 sm:border-b-4 border-black flex items-center justify-center">
                    <span className="font-archivo-black text-6xl sm:text-8xl text-black/20 uppercase">
                      {show?.city?.charAt(0) || "?"}
                    </span>
                  </div>
                )}

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-2 sm:top-3 right-2 sm:top-3 w-8 sm:w-10 h-8 sm:h-10 bg-black text-[#f9c937] font-archivo-black text-base sm:text-xl border-2 border-black rounded-sm hover:bg-black/80 transition-colors z-10"
                >
                  ✕
                </button>

                {/* Status badge */}
                <div
                  className={`absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-3 py-1 sm:py-1.5 ${statusColor} border-2 border-black rounded-sm z-10`}
                >
                  <span className="font-archivo-black text-xs text-white uppercase tracking-wider">
                    {statusLabel}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 md:p-6">
                {/* Venue info */}
                <h2 className="font-syne font-extrabold text-2xl sm:text-3xl text-black uppercase leading-tight">
                  {show?.city || "Unknown"}
                </h2>
                <p className="font-archivo-black text-base sm:text-lg text-black/60 uppercase mt-1">
                  {show?.country || ""}
                </p>

                <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-lg sm:text-xl">📍</span>
                    <p className="font-plus-jakarta text-sm sm:text-base text-black font-medium">
                      {show?.venueName || ""}
                    </p>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-lg sm:text-xl">📅</span>
                    <p className="font-plus-jakarta text-sm sm:text-base text-black font-medium">
                      {show ? formatShowDate(show.showDate) : ""}
                    </p>
                  </div>
                </div>

                {/* Map embed */}
                <div className="mt-4 sm:mt-6 h-48 sm:h-56 md:h-64 border-3 sm:border-4 border-black">
                  {hasCoordinates ? (
                    <LocationMap position={position} />
                  ) : (
                    <div className="w-full h-32 bg-[#f9c937] border-4 border-black flex items-center justify-center">
                      <span className="font-archivo-black text-sm text-black/60 uppercase">
                        Ubicación no disponible
                      </span>
                    </div>
                  )}
                </div>

                {/* Image thumbnails */}
                {hasImages && (
                  <div className="mt-4 sm:mt-6">
                    <p className="font-archivo-black text-xs text-black/50 uppercase mb-2 sm:mb-3">
                      Imágenes ({show.images.length})
                    </p>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {show.images.map((img: TourShowImage, index: number) => (
                        <button
                          key={img.id}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative w-12 sm:w-14 sm:w-16 h-12 sm:h-14 sm:h-16 border-3 sm:border-4 rounded-sm overflow-hidden transition-transform hover:scale-110 ${
                            index === currentImageIndex
                              ? "border-[#f9c937]"
                              : "border-black"
                          }`}
                        >
                          <Image
                            src={img.url}
                            alt={`${show?.city} ${index + 1}`}
                            fill
                            className="object-cover"
                            unoptimized={isCDNUrl(img.url)}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="mt-6 sm:mt-8 flex gap-2 sm:gap-3">
                  {canBuy && (
                    <a
                      href={show.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 sm:py-4 bg-[#f9c937] text-black font-archivo-black uppercase text-center border-3 sm:border-4 border-black hover:bg-[#e5b800] transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      COMPRAR ENTRADAS
                    </a>
                  )}
                </div>

                {/* Delete confirmation text */}
                {showDeleteConfirm && (
                  <p className="mt-2 sm:mt-3 font-plus-jakarta text-xs sm:text-sm text-red-500 text-center">
                    ¿Estás seguro de eliminar este show?
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
