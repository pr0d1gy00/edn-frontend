'use client';

import { motion } from 'framer-motion';

export default function UsersAdminPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne font-extrabold text-3xl text-white uppercase tracking-tight">
            Usuarios
          </h1>
          <p className="font-plus-jakarta text-white/60 mt-1">
            Gestiona los usuarios registrados
          </p>
        </div>
      </div>

      {/* Placeholder */}
      <div className="bg-white/5 border-4 border-dashed border-white/20 rounded-md p-12 text-center">
        <p className="font-archivo-black text-white/40 uppercase">
          Próximamente — Gestión de Usuarios
        </p>
      </div>
    </div>
  );
}