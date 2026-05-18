'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useGuestById } from '@/hooks/useGuestById';

interface GuestModalProps {
  guestId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function GuestModal({ guestId, isOpen, onClose }: GuestModalProps) {
  const { guest, loading, error } = useGuestById(isOpen ? guestId : '');

  if (!isOpen) return null;

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
            <div className="relative h-40 bg-[#f9c937] flex items-center justify-center">
              <span className="font-archivo-black text-7xl text-black/20">
                {loading ? '...' : guest ? guest.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?'}
              </span>

              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-12 h-12 bg-black text-[#f9c937] font-archivo-black text-2xl border-2 border-black rounded-sm hover:bg-black/80 transition-colors"
              >
                ✕
              </button>
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
              ) : guest ? (
                <>
                  {/* Guest info */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-black text-[#f9c937] font-archivo-black text-xl flex items-center justify-center rounded-sm border-2 border-black flex-shrink-0">
                      {guest.name.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <h2 className="font-syne font-extrabold text-2xl md:text-3xl text-black uppercase leading-tight">
                        {guest.name}
                      </h2>
                    </div>
                  </div>

                  {/* Full bio */}
                  <p className="mt-6 font-plus-jakarta text-black/80 text-lg leading-relaxed">
                    {guest.bio}
                  </p>

                  {/* Social handles */}
                  <div className="flex flex-wrap gap-4 mt-6">
                    {guest.twitterHandle && (
                      <span className="px-4 py-2 bg-black text-[#f9c937] font-archivo-black text-sm uppercase rounded-sm border-2 border-black">
                        @{guest.twitterHandle}
                      </span>
                    )}
                    {guest.instagramHandle && (
                      <span className="px-4 py-2 bg-black text-[#f9c937] font-archivo-black text-sm uppercase rounded-sm border-2 border-black">
                        @{guest.instagramHandle}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-8 flex gap-4">
                    {guest.id && (
                      <Link
                        href={`/dashboard/guests/${guest.id}/edit`}
                        className="flex-1 py-4 bg-[#f9c937] text-black font-archivo-black uppercase text-center border-4 border-black hover:bg-[#e5b800] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      >
                        Editar
                      </Link>
                    )}
                    <button
                      onClick={onClose}
                      className="flex-1 py-4 bg-black text-[#f9c937] font-archivo-black uppercase border-4 border-black hover:bg-black/80 transition-colors"
                    >
                      Cerrar
                    </button>
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
