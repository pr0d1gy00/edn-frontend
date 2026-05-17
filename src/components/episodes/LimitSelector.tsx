'use client';

import { useState } from 'react';

const LIMIT_OPTIONS = [6, 12, 15, 24, 30] as const;

interface LimitSelectorProps {
  value: number;
  onChange: (limit: number) => void;
}

export default function LimitSelector({ value, onChange }: LimitSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <label className="block font-archivo-black text-xs text-white/50 uppercase tracking-wider mb-2">
        EPISODIOS POR PÁGINA
      </label>

      {/* Custom select trigger */}
      <div
        className={`
          flex items-center justify-between gap-4 px-4 py-3 bg-white border-4 border-black rounded-sm
          cursor-pointer select-none
          shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
          hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
          hover:translate-x-[-2px] hover:translate-y-[-2px]
          active:translate-x-0 active:translate-y-0 active:shadow-none
          transition-all duration-100
          ${isOpen ? 'bg-[#f9c937] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' : ''}
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-archivo-black text-black text-lg uppercase">
          {value}
        </span>
        <span className="font-archivo-black text-black/60 text-sm uppercase">por p&aacute;gina</span>

        {/* Custom arrow */}
        <svg
          className={`w-6 h-6 text-black transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="square" strokeWidth="3" d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {/* Dropdown options */}
      {isOpen && (
        <>
          {/* Backdrop to close */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Options panel */}
          <div className="absolute top-full left-0 mt-2 w-full bg-white border-4 border-black rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-20 overflow-hidden">
            {LIMIT_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-3 text-left font-archivo-black text-lg uppercase
                  border-b-2 border-black last:border-b-0
                  transition-colors duration-100
                  ${value === opt
                    ? 'bg-black text-[#f9c937]'
                    : 'text-black hover:bg-[#f9c937]'
                  }
                `}
              >
                {opt}
                <span className="ml-2 text-sm opacity-60">por p&aacute;gina</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}