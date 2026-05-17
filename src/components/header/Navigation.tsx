'use client';

import Link from "next/link";
import { useCallback } from "react";
import { motion, Variants } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";

type NavItem = {
  href: string;
  label: string;
  isSpecial?: boolean;
  hasHash?: boolean;
};

const navItems: NavItem[] = [
  { href: "/", label: "Inicio" },
  { href: "/#tour-carousel", label: "Tour", hasHash: true },
  { href: "/#episodes", label: "Episodios", hasHash: true },
  { href: "/historias", label: "Historias" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 60,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -30, rotate: -5 },
  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 15,
    },
  },
  hover: {
    scale: 1.02,
    transition: { type: "spring" as const, stiffness: 400, damping: 15 },
  },
};

export default function Navigation() {
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, hasHash?: boolean) => {
      if (hasHash) {
        const href = e.currentTarget.getAttribute("href");
        if (href?.startsWith("/#")) {
          e.preventDefault();
          const targetId = href.replace("/#", "");
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      }
    },
    [],
  );

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const getInitial = () => {
    if (user?.username) {
      return user.username[0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "?";
  };

  return (
    <motion.nav
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex items-center gap-2"
    >
      {navItems.map((item) => (
        <motion.div key={item.href} variants={itemVariants} whileHover="hover">
          <Link
            href={item.href}
            onClick={(e) => handleClick(e, item.hasHash)}
            className={`
              px-4 py-2 font-archivo-black uppercase tracking-wider text-sm font-black
              border-2 border-black rounded-md
              transition-all duration-100
              bg-transparent text-black hover:bg-black hover:text-edn-neon-yellow
            `}
          >
            {item.label}
          </Link>
        </motion.div>
      ))}

      {/* Auth section */}
      {isAuthenticated && user ? (
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="relative group"
          >
            {/* Avatar circle */}
            <div className="w-10 h-10 bg-black text-edn-neon-yellow font-archivo-black text-lg flex items-center justify-center rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] cursor-pointer">
              {getInitial()}
            </div>

            {/* Dropdown menu */}
            <div className="absolute right-0 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
              <div className="bg-white border-4 border-black rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden min-w-[160px]">
                {/* Username */}
                <div className="px-4 py-3 bg-edn-neon-yellow border-b-2 border-black">
                  <p className="font-archivo-black text-black text-xs uppercase truncate max-w-[150px]">
                    {user.username}
                  </p>
                  <p className="font-plus-jakarta text-black/60 text-xs truncate max-w-[150px]">
                    {user.email}
                  </p>
                </div>

                {/* Dashboard link */}
                <Link
                  href="/dashboard"
                  className="block px-4 py-3 font-archivo-black text-black text-sm uppercase text-left hover:bg-black hover:text-edn-neon-yellow transition-colors border-b-2 border-black"
                >
                  Dashboard
                </Link>

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 font-archivo-black text-black text-sm uppercase text-left hover:bg-black hover:text-edn-neon-yellow transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <motion.div variants={itemVariants} whileHover="hover">
          <Link
            href="/login"
            data-testid="nav-login"
            className={`
              px-4 py-2 font-archivo-black uppercase tracking-wider text-sm font-black
              border-2 border-black rounded-md
              transition-all duration-100
              bg-black text-edn-neon-yellow
            `}
          >
            Login
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
}