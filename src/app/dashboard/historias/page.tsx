'use client';

import { motion } from 'framer-motion';

export default function HistoriasAdminPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne font-extrabold text-3xl text-white uppercase tracking-tight">
            Historias
          </h1>
          <p className="font-plus-jakarta text-white/60 mt-1">
            Gestiona las historias de la comunidad
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="
            px-6 py-3 bg-edn-neon-yellow text-black font-archivo-black uppercase text-sm
            border-4 border-black rounded-md
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
            hover:translate-x-[-2px] hover:translate-y-[-2px]
            transition-all duration-150
          "
        >
          + Nueva Historia
        </motion.button>
      </div>

      {/* Placeholder */}
      <div className="bg-white/5 border-4 border-dashed border-white/20 rounded-md p-12 text-center">
        <p className="font-archivo-black text-white/40 uppercase">
          Próximamente — Gestión de Historias
        </p>
      </div>
    </div>
  );
}