'use client';

import type { Guest } from '@/types/guest';

interface SelectedGuestsProps {
  guests: Guest[];
  onRemove: (guest: Guest) => void;
}

export default function SelectedGuests({ guests, onRemove }: SelectedGuestsProps) {
  if (guests.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {guests.map((guest) => {
        const handles: string[] = [];
        if (guest.twitterHandle) handles.push(`@${guest.twitterHandle}`);
        if (guest.instagramHandle) handles.push(`@${guest.instagramHandle}`);

        return (
          <div
            key={guest.id}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f9c937] text-black font-archivo-black text-sm uppercase border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="flex flex-col leading-tight">
              <span>{guest.name}</span>
              {handles.length > 0 && (
                <span className="font-plus-jakarta text-xs normal-case text-black/70">
                  {handles.join(' · ')}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => onRemove(guest)}
              className="ml-1 w-5 h-5 flex items-center justify-center bg-black text-[#f9c937] font-archivo-black text-xs rounded-sm border border-black hover:bg-black/80 transition-colors"
              aria-label={`Eliminar ${guest.name}`}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
