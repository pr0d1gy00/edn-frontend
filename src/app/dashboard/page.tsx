'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const stats = [
  { label: 'Episodios', count: '24', color: 'bg-edn-neon-yellow' },
  { label: 'Tour', count: '12', color: 'bg-green-500' },
  { label: 'Historias', count: '48', color: 'bg-blue-500' },
  { label: 'Usuarios', count: '1.2K', color: 'bg-purple-500' },
];

const quickActions = [
  {
    label: 'Nuevo Episodio',
    href: '/dashboard/episodes/new',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeWidth="2" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: 'Agregar Tour',
    href: '/dashboard/tour/new',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeWidth="2" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: 'Publicar Historia',
    href: '/dashboard/historias/new',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeWidth="2" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
];

export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-syne font-extrabold text-4xl text-white uppercase tracking-tight">
          Dashboard
        </h1>
        <p className="font-plus-jakarta text-white/60 mt-2">
          Bienvenido al panel de administración de EDN
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              p-6 border-4 border-black rounded-md shadow-[4px_4px_0px_0px_rgba(249,201,55,0.3)]
              ${stat.color}
            `}
          >
            <span className="font-archivo-black text-3xl text-black">{stat.count}</span>
            <span className="block font-archivo-black text-sm uppercase text-black/60 mt-1">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-archivo-black text-xl text-white uppercase mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Link
                href={action.href}
                className="
                  flex flex-col items-center justify-center gap-3 p-6
                  bg-white border-4 border-black rounded-md
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                  hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                  hover:translate-x-[-2px] hover:translate-y-[-2px]
                  transition-all duration-150
                "
              >
                <div className="text-black">{action.icon}</div>
                <span className="font-archivo-black text-sm uppercase text-black">
                  {action.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}