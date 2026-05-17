"use client";

import Link from "next/link";
import Image from "next/image";
import Navigation from "./Navigation";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 bg-edn-neon-yellow border-b-4 border-black"
    >
      <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
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
              width={70}
              height={70}
              className="rounded-md border-2 border-black"
              priority
            />
          </Link>
        </motion.div>
        <Navigation />
      </div>
    </motion.header>
  );
}
