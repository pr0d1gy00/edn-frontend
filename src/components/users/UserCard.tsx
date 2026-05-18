'use client';

import { motion } from 'framer-motion';
import type { User } from '@/types/user';

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface UserCardProps {
  user: User;
  index: number;
  onClick: () => void;
}

export default function UserCard({ user, index, onClick }: UserCardProps) {
  const initials = getInitials(user.username);
  const isAdmin = user.role === 'ADMIN';

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
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-syne font-extrabold text-xl md:text-2xl text-black uppercase leading-tight line-clamp-2">
              {user.username}
            </h3>
            {/* Role badge */}
            <span
              className={`
                flex-shrink-0 px-3 py-1 font-archivo-black text-xs uppercase rounded-sm border-2 border-black
                ${isAdmin ? 'bg-[#f9c937] text-black' : 'bg-gray-300 text-black'}
              `}
            >
              {user.role}
            </span>
          </div>

          <p className="font-plus-jakarta text-sm text-black/70 mt-3">
            {user.email}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
