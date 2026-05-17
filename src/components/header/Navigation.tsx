'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

type NavItem = { href: string; label: string; isSpecial?: boolean };

const navItems: NavItem[] = [
  { href: '/', label: 'Inicio' },
  { href: '/tour', label: 'Tour' },
  { href: '/episodios', label: 'Episodios' },
  { href: '/bromas', label: 'Bromas Internas' },
  { href: '/historias', label: 'Historias' },
  { href: '/login', label: 'Login', isSpecial: true },
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
      type: 'spring' as const,
      stiffness: 300,
      damping: 15,
    },
  },
  hover: {
    scale: 1.02,
    transition: { type: 'spring' as const, stiffness: 400, damping: 15 },
  },
};

export default function Navigation() {
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
            data-testid={item.isSpecial ? 'nav-login' : undefined}
            className={`
              px-4 py-2 font-archivo-black uppercase tracking-wider text-sm font-black
              border-2 border-black rounded-md
              transition-all duration-100
              ${
                item.isSpecial
                  ? 'bg-black text-edn-neon-yellow'
                  : 'bg-transparent text-black hover:bg-black hover:text-edn-neon-yellow'
              }
            `}
          >
            {item.label}
          </Link>
        </motion.div>
      ))}
    </motion.nav>
  );
}