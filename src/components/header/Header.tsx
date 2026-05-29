"use client";

import Link from "next/link";
import Image from "next/image";
import Navigation from "./Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  const getInitial = () => {
    if (user?.username) return user.username[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return "?";
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    window.location.href = "/";
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="top-0 left-0 right-0 z-50 bg-edn-neon-yellow border-b-4 border-black"
      >
        <div className="max-w-7xl mx-auto px-4 h-16 sm:h-24 flex items-center justify-between">
          <motion.div
            initial={{ x: -50, opacity: 0, rotate: -5 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15,
              delay: 0.1,
            }}
          >
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo-edn-jpg.jpg"
                alt="EDN Logo"
                width={50}
                height={50}
                className="w-10 h-10 sm:w-16 sm:h-16 rounded-md border-2 border-black"
                priority
              />
              <span className="font-syne font-extrabold text-xl sm:text-3xl text-black uppercase tracking-tight hidden sm:block">
                EDN
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <Navigation />
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-12 h-12 bg-black text-edn-neon-yellow font-archivo-black text-2xl border-4 border-black flex items-center justify-center"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-edn-neon-yellow z-50 md:hidden border-r-4 border-black"
            >
              <div className="p-4 border-b-4 border-black bg-black flex items-center justify-between">
                <span className="font-syne font-extrabold text-2xl text-edn-neon-yellow uppercase">
                  Menú
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 bg-edn-neon-yellow text-black font-archivo-black text-xl border-4 border-black flex items-center justify-center"
                  aria-label="Cerrar menú"
                >
                  ✕
                </button>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 bg-white border-4 border-black font-archivo-black uppercase text-black hover:bg-black hover:text-edn-neon-yellow transition-colors"
                    >
                      Inicio
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#tour-carousel"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 bg-white border-4 border-black font-archivo-black uppercase text-black hover:bg-black hover:text-edn-neon-yellow transition-colors"
                    >
                      Tour
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#episodes"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 bg-white border-4 border-black font-archivo-black uppercase text-black hover:bg-black hover:text-edn-neon-yellow transition-colors"
                    >
                      Episodios
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#stories"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 bg-white border-4 border-black font-archivo-black uppercase text-black hover:bg-black hover:text-edn-neon-yellow transition-colors"
                    >
                      Historias
                    </Link>
                  </li>
                  <li className="pt-4 border-t-4 border-black">
                    {isAuthenticated && user ? (
                      <>
                        {/* User info */}
                        <div className="mb-4 p-3 bg-black border-4 border-black">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-edn-neon-yellow text-black font-archivo-black text-lg flex items-center justify-center rounded-full border-2 border-black">
                              {getInitial()}
                            </div>
                            <div>
                              <p className="font-archivo-black text-sm text-edn-neon-yellow uppercase">
                                @{user.username}
                              </p>
                              <p className="font-plus-jakarta text-xs text-white/60">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Dashboard link for admin */}
                        {user.role === "ADMIN" && (
                          <Link
                            href="/dashboard"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3 bg-white border-4 border-black font-archivo-black uppercase text-black hover:bg-black hover:text-edn-neon-yellow transition-colors mb-2"
                          >
                            Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full block px-4 py-3 bg-red-500 border-4 border-black font-archivo-black uppercase text-white hover:bg-red-600 transition-colors"
                        >
                          Cerrar sesión
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 bg-black border-4 border-black font-archivo-black uppercase text-edn-neon-yellow hover:bg-black/80 transition-colors text-center"
                      >
                        Login
                      </Link>
                    )}
                  </li>
                </ul>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
