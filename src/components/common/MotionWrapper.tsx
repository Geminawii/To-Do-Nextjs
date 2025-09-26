"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function MotionWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: 200 }} 
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -200 }} 
        transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
        className="min-h-screen"
      >
        <main>{children}</main>
      </motion.div>
    </AnimatePresence>
  );
}
