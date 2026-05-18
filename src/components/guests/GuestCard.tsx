'use client';

import { motion } from 'framer-motion';
import type { Guest } from '@/types/guest';

function truncateBio(bio: string, maxLen: number = 100): string {
  if (bio.length <= maxLen) return bio;
  return bio.slice(0, maxLen).replace(/\s+\S*$/, '') + '...';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface GuestCardProps {
  guest: Guest;
  index: number;
  onClick: () => void;
}

export default function GuestCard({ guest, index, onClick }: GuestCardProps) {
  const initials = getInitials(guest.name);
  const displayBio = truncateBio(guest.bio);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 150, damping: 20 }}
      onClick={onClick}
      className={`
        relative bg-white border-4 border-black rounded-md overflow-hidden
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
        hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
        hover:translate-x-[-4px] hover:translate-y-[-4px]
        transition-all duration-150 cursor-pointer
      `}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Avatar / Initials block */}
        <div className="relative w-full sm:w-40 h-32 sm:h-auto bg-[#f9c937] flex-shrink-0 flex items-center justify-center border-b-4 sm:border-b-0 sm:border-r-4 border-black">
          <span className="font-archivo-black text-5xl text-black/30">
            {initials}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <h3 className="font-syne font-extrabold text-xl md:text-2xl text-black uppercase leading-tight line-clamp-2">
            {guest.name}
          </h3>

          <p className="font-plus-jakarta text-sm text-black/70 mt-3 line-clamp-2">
            {displayBio}
          </p>

          {/* Social handles */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {guest.twitterHandle && (
              <span className="px-3 py-1 bg-black text-[#f9c937] font-archivo-black text-xs uppercase rounded-sm border border-[#f9c937]/30">
                @{guest.twitterHandle}
              </span>
            )}
            {guest.instagramHandle && (
              <span className="px-3 py-1 bg-black text-[#f9c937] font-archivo-black text-xs uppercase rounded-sm border border-[#f9c937]/30">
                @{guest.instagramHandle}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
