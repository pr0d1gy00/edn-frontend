'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const stats = [
  {
    label: 'Episodios',
    count: '24',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeWidth="3" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
      </svg>
    ),
  },
  {
    label: 'Tour',
    count: '12',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeWidth="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="square" strokeWidth="3" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: 'Historias',
    count: '48',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeWidth="3" d="M12 6.253v13M3 6.253h18M3 12h18M3 17.747h18" />
      </svg>
    ),
  },
  {
    label: 'Usuarios',
    count: '1.2K',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeWidth="3" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

const quickActions = [
  {
    label: 'Nuevo Episodio',
    href: '/dashboard/episodes/new',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeWidth="3" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: 'Agregar Tour',
    href: '/dashboard/tour/new',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeWidth="3" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: 'Publicar Historia',
    href: '/dashboard/historias/new',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeWidth="3" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
];

export default function DashboardPage() {
  return (
    <div className="bg-white min-h-screen p-8">
      {/* Header */}
      <div className="mb-8 border-b-4 border-black pb-6">
        <div className="inline-block bg-black border-4 border-black px-6 py-3 -ml-4">
          <h1 className="font-syne font-extrabold text-5xl text-[#f9c937] uppercase tracking-tighter leading-none">
            Dashboard
          </h1>
        </div>
        <p className="font-plus-jakarta text-black/50 mt-4 text-lg">
          Bienvenido al panel de administración de EDN
        </p>
      </div>

      {/* Stats Grid - Punch card style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 200, damping: 15 }}
            className="relative"
          >
            {/* Punch card style card */}
            <div className="bg-white border-4 border-black p-6 relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              {/* Punch holes decoration */}
              <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-around py-4">
                <div className="w-3 h-3 bg-black rounded-full" />
                <div className="w-3 h-3 bg-black rounded-full" />
                <div className="w-3 h-3 bg-black rounded-full" />
              </div>

              {/* Content */}
              <div className="pl-4">
                <div className="text-black mb-4">{stat.icon}</div>
                <span className="font-archivo-black text-5xl text-black leading-none block">
                  {stat.count}
                </span>
                <span className="font-archivo-black text-sm uppercase text-black/60 mt-2 block">
                  {stat.label}
                </span>
              </div>
            </div>

            {/* Decorative corner */}
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#f9c937]" />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions - Ticket style */}
      <div>
        <h2 className="font-archivo-black text-2xl text-black uppercase mb-6 flex items-center gap-4">
          <span className="w-12 h-1 bg-black block" />
          Acciones Rápidas
          <span className="flex-1 h-1 bg-black block" />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Link
                href={action.href}
                className="
                  relative flex flex-col items-center justify-center gap-4 p-8
                  bg-white border-4 border-black
                  shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                  hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]
                  hover:translate-x-[-4px] hover:translate-y-[-4px]
                  transition-all duration-150
                  group
                "
              >
                {/* Dashed inner border */}
                <div className="absolute inset-2 border-2 border-dashed border-black/20 pointer-events-none" />

                {/* Main icon */}
                <div className="text-black group-hover:scale-110 transition-transform duration-150">
                  {action.icon}
                </div>

                {/* Label with decorative lines */}
                <div className="flex items-center gap-3">
                  <span className="w-8 h-0.5 bg-black" />
                  <span className="font-archivo-black text-base text-black uppercase tracking-wider">
                    {action.label}
                  </span>
                  <span className="w-8 h-0.5 bg-black" />
                </div>

                {/* Corner accents */}
                <div className="absolute top-2 right-2 w-4 h-4 bg-[#f9c937]" />
                <div className="absolute bottom-2 left-2 w-4 h-4 bg-[#f9c937]" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative footer stripe */}
      <div className="mt-12 flex gap-1">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`h-2 flex-1 ${i % 2 === 0 ? 'bg-black' : 'bg-[#f9c937]'}`} />
        ))}
      </div>
    </div>
  );
}