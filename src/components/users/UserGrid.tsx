"use client";

import { AnimatePresence } from "framer-motion";
import type { User } from "@/types/user";
import UserCard from "./UserCard";

interface UserGridProps {
  users: User[];
  isLoading: boolean;
  error: string | null;
  onUserClick: (user: User) => void;
  onAddClick: () => void;
}

export default function UserGrid({
  users,
  isLoading,
  error,
  onUserClick,
  onAddClick,
}: UserGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-48 bg-white/10 border-4 border-black rounded-md animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="font-archivo-black text-2xl text-red-500 uppercase">
          {error}
        </p>
        <button
          onClick={onAddClick}
          className="mt-4 px-6 py-3 bg-[#f9c937] border-4 border-black font-archivo-black text-black uppercase rounded-sm hover:bg-[#e5b800] transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-syne text-3xl text-black/40 uppercase">
          No hay usuarios registrados
        </p>
        <button
          onClick={onAddClick}
          className="mt-6 px-6 py-3 bg-[#f9c937] border-4 border-black font-archivo-black text-black uppercase rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-150"
        >
          Crear usuario
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <AnimatePresence mode="popLayout">
        {users.map((user, index) => (
          <UserCard
            key={user.id}
            user={user}
            index={index}
            onClick={() => onUserClick(user)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
