"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    label: "Episodios",
    href: "/dashboard/episodes",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="square"
          strokeWidth="3"
          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"
        />
      </svg>
    ),
    number: "01",
  },
  {
    label: "Tour Shows",
    href: "/dashboard/tour-shows",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="square"
          strokeWidth="3"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    number: "02",
  },
  {
    label: "Historias",
    href: "/dashboard/historias",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="square"
          strokeWidth="3"
          d="M12 6.253v13M3 6.253h18M3 12h18M3 17.747h18"
        />
      </svg>
    ),
    number: "03",
  },
  {
    label: "Usuarios",
    href: "/dashboard/users",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="square"
          strokeWidth="3"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    number: "04",
  },
  {
    label: "Invitados",
    href: "/dashboard/guests",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="square"
          strokeWidth="3"
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    number: "05",
  },
  {
    label: "Prompts",
    href: "/dashboard/prompts",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="square"
          strokeWidth="3"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
    number: "06",
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay backdrop — only visible on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-edn-neon-yellow min-h-screen border-r-4 border-black flex flex-col overflow-hidden
          transform transition-transform duration-150
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:w-64
          lg:w-72
        `}
      >
      {/* Mobile close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-black text-edn-neon-yellow font-archivo-black text-xl border-4 border-black hover:bg-black/80 md:hidden flex items-center justify-center"
        aria-label="Close sidebar"
      >
        ✕
      </button>

      {/* Diagonal stripes decoration */}
      <div className="absolute top-0 right-0 w-24 h-full overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[200%] h-full bg-black/3"
          style={{ clipPath: "polygon(100% 0, 0 0, 0 100%)" }}
        />
      </div>

      {/* Header block */}
      <div className="p-6 border-b-4 border-black relative">
        <div className="bg-black px-4 py-4 -mx-4 -mt-4 border-b-4 border-black">
          <h1 className="font-syne font-extrabold text-4xl uppercase tracking-tighter leading-none text-edn-neon-yellow">
            EDN
          </h1>
          <p className="font-archivo-black text-sm uppercase mt-1 tracking-widest text-edn-neon-yellow/70">
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
                    relative flex items-center gap-4 p-4 font-archivo-black uppercase
                    border-4 border-black rounded-none transition-all duration-100
                    ${
                      isActive
                        ? "bg-black text-edn-neon-yellow shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                        : "bg-white hover:bg-black hover:text-edn-neon-yellow text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                    }
                  `}
                >
                  {/* Number badge */}
                  <span
                    className={`
                    absolute -top-3 -left-3 w-8 h-8 flex items-center justify-center
                    font-archivo-black text-xs border-4 border-black rounded-none
                    ${isActive ? "bg-edn-neon-yellow text-black" : "bg-black text-edn-neon-yellow"}
                  `}
                  >
                    {item.number}
                  </span>

                  {/* Icon */}
                  <div
                    className={`shrink-0 ${isActive ? "text-edn-neon-yellow" : ""}`}
                  >
                    {item.icon}
                  </div>

                  {/* Label */}
                  <span className="font-bold text-lg tracking-wide">
                    {item.label}
                  </span>

                  {/* Arrow indicator */}
                  <svg
                    className={`absolute right-4 w-6 h-6 transition-transform ${isActive ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="square"
                      strokeWidth="3"
                      d="M9 5l7 7-7 7"
                    />
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
            bg-black text-edn-neon-yellow font-archivo-black uppercase text-sm font-bold
            border-4 border-black rounded-none
            shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]
            hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)]
            hover:translate-x-[-2px] hover:translate-y-[-2px]
            transition-all duration-150
          "
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="square"
              strokeWidth="3"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
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
    </>
  );
}
