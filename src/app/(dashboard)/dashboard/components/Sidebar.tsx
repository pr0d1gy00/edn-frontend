'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    label: 'Episodios',
    href: '/dashboard/episodes',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeWidth="3" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
      </svg>
    ),
    number: '01',
  },
  {
    label: 'Tour',
    href: '/dashboard/tour',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeWidth="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="square" strokeWidth="3" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    number: '02',
  },
  {
    label: 'Historias',
    href: '/dashboard/historias',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeWidth="3" d="M12 6.253v13M3 6.253h18M3 12h18M3 17.747h18" />
      </svg>
    ),
    number: '03',
  },
  {
    label: 'Bromas',
    href: '/dashboard/bromas',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeWidth="3" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    number: '04',
  },
  {
    label: 'Usuarios',
    href: '/dashboard/users',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeWidth="3" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    number: '05',
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-[#f9c937] min-h-screen border-r-4 border-black flex flex-col relative overflow-hidden">
      {/* Diagonal stripes decoration */}
      <div className="absolute top-0 right-0 w-24 h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[200%] h-full bg-black/[0.03]" style={{ clipPath: 'polygon(100% 0, 0 0, 0 100%)' }} />
      </div>

      {/* Header block */}
      <div className="p-6 border-b-4 border-black relative">
        <div className="bg-black px-4 py-4 -mx-4 -mt-4 border-b-4 border-black">
          <h1 className="font-syne font-extrabold text-4xl uppercase tracking-tighter leading-none text-[#f9c937]">
            EDN
          </h1>
          <p className="font-archivo-black text-sm uppercase mt-1 tracking-widest text-[#f9c937]/70">
            Panel de Control
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 relative">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    relative flex items-center gap-4 p-4 font-archivo-black uppercase text-black
                    border-4 border-black rounded-none transition-all duration-100
                    ${isActive
                      ? 'bg-black text-[#f9c937] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white hover:bg-black hover:text-[#f9c937] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                    }
                  `}
                >
                  {/* Number badge */}
                  <span className={`
                    absolute -top-3 -left-3 w-8 h-8 flex items-center justify-center
                    font-archivo-black text-xs border-4 border-black rounded-none
                    ${isActive ? 'bg-[#f9c937] text-black' : 'bg-black text-[#f9c937]'}
                  `}>
                    {item.number}
                  </span>

                  {/* Icon */}
                  <div className={`flex-shrink-0 ${isActive ? 'text-[#f9c937]' : ''}`}>
                    {item.icon}
                  </div>

                  {/* Label */}
                  <span className="font-bold text-lg tracking-wide">
                    {item.label}
                  </span>

                  {/* Arrow indicator */}
                  <svg
                    className={`absolute right-4 w-6 h-6 transition-transform ${isActive ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="square" strokeWidth="3" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer block */}
      <div className="p-4 border-t-4 border-black relative">
        <Link
          href="/"
          className="
            flex items-center justify-center gap-3 px-4 py-4
            bg-black text-[#f9c937] font-archivo-black uppercase text-sm font-bold
            border-4 border-black rounded-none
            shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]
            hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)]
            hover:translate-x-[-2px] hover:translate-y-[-2px]
            transition-all duration-150
          "
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al Inicio
        </Link>
      </div>

      {/* EDN Logo watermark */}
      <div className="absolute bottom-20 right-4 pointer-events-none opacity-10">
        <span className="font-syne font-black text-8xl text-black rotate-90 origin-center">
          EDN
        </span>
      </div>
    </aside>
  );
}