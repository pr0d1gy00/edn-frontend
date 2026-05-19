'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTourShowById } from '@/hooks/useTourShowById';

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'DISPONIBLE',
  FEW_TICKETS: '¡ÚLTIMAS!',
  SOLD_OUT: 'AGOTADO',
};

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: 'bg-green-500',
  FEW_TICKETS: 'bg-orange-500',
  SOLD_OUT: 'bg-red-500',
};

function formatShowDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface TourShowModalProps {
  showId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function TourShowModal({ showId, isOpen, onClose }: TourShowModalProps) {
  const { tourShow, loading, error } = useTourShowById(isOpen ? showId : '');

  if (!isOpen) return null;

  const statusLabel = tourShow ? STATUS_LABELS[tourShow.ticketStatus] || 'DISPONIBLE' : '';
  const statusColor = tourShow ? STATUS_COLORS[tourShow.ticketStatus] || 'bg-green-500' : '';
  const hasImages = tourShow?.images && tourShow.images.length > 0;
  const canBuy = tourShow?.ticketStatus !== 'SOLD_OUT' && tourShow?.ticketUrl;

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-white border-4 border-black rounded-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header area */}
            <div className="relative">
              {hasImages ? (
                <div className="relative h-64 bg-[#f9c937] border-b-4 border-black">
                  <Image
                    src={tourShow!.images[0]}
                    alt={tourShow!.city}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-40 bg-[#f9c937] border-b-4 border-black flex items-center justify-center">
                  <span className="font-archivo-black text-8xl text-black/20 uppercase">
                    {tourShow ? tourShow.city.charAt(0) : '?'}
                  </span>
                </div>
              )}

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-12 h-12 bg-black text-[#f9c937] font-archivo-black text-2xl border-2 border-black rounded-sm hover:bg-black/80 transition-colors"
              >
                ✕
              </button>

              {/* Status badge */}
              {tourShow && (
                <div className={`absolute top-4 left-4 px-3 py-1 ${statusColor} border-2 border-black rounded-sm`}>
                  <span className="font-archivo-black text-sm text-white uppercase tracking-wider">
                    {statusLabel}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  <div className="h-8 bg-black/10 rounded-sm animate-pulse w-3/4" />
                  <div className="h-4 bg-black/10 rounded-sm animate-pulse w-full" />
                  <div className="h-4 bg-black/10 rounded-sm animate-pulse w-2/3" />
                  <div className="h-4 bg-black/10 rounded-sm animate-pulse w-1/2" />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="font-archivo-black text-xl text-red-500 uppercase">{error}</p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-3 bg-black text-[#f9c937] font-archivo-black uppercase border-4 border-black hover:bg-black/80 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              ) : tourShow ? (
                <>
                  {/* City heading */}
                  <h2 className="font-syne font-extrabold text-4xl text-black uppercase leading-tight">
                    {tourShow.city}
                  </h2>
                  <p className="font-archivo-black text-lg text-black/60 uppercase mt-1">
                    {tourShow.country}
                  </p>

                  {/* Details */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📍</span>
                      <p className="font-plus-jakarta text-black font-medium">
                        {tourShow.venueName}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📅</span>
                      <p className="font-plus-jakarta text-black font-medium">
                        {formatShowDate(tourShow.showDate)}
                      </p>
                    </div>

                    {tourShow.latitude != null && tourShow.longitude != null && (
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">🌍</span>
                        <p className="font-plus-jakarta text-black/60 text-sm">
                          {tourShow.latitude}, {tourShow.longitude}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Images gallery */}
                  {hasImages && (
                    <div className="mt-6">
                      <p className="font-archivo-black text-xs text-black/50 uppercase mb-3">
                        Imágenes ({tourShow.images.length})
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {tourShow.images.map((url, index) => (
                          <div
                            key={index}
                            className="relative w-20 h-20 border-4 border-black rounded-sm overflow-hidden"
                          >
                            <Image
                              src={url}
                              alt={`${tourShow.city} ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="mt-6 space-y-2 font-plus-jakarta text-sm text-black/60">
                    {tourShow.createdAt && (
                      <p>
                        Creado:{' '}
                        {new Date(tourShow.createdAt).toLocaleDateString('es-AR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                    {tourShow.updatedAt && (
                      <p>
                        Actualizado:{' '}
                        {new Date(tourShow.updatedAt).toLocaleDateString('es-AR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-8 flex gap-4">
                    <button
                      onClick={onClose}
                      className="flex-1 py-4 bg-black text-[#f9c937] font-archivo-black uppercase border-4 border-black hover:bg-black/80 transition-colors"
                    >
                      Cerrar
                    </button>

                    {canBuy && (
                      <a
                        href={tourShow.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-4 bg-[#f9c937] text-black font-archivo-black uppercase text-center border-4 border-black hover:bg-[#e5b800] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      >
                        COMPRAR ENTRADAS
                      </a>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
