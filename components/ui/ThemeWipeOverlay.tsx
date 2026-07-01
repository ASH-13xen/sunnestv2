"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

// Diagonal wipe animation that sweeps across the screen when the theme is toggled.
// Copied from sunlatest — two overlapping waves:
//   1. Front: gold→blue gradient (colour depends on active theme's CSS variables)
//   2. Back:  new page background colour (fills in as the new theme activates at 500 ms)
// Both travel x: -100% → 0% → 100% with a skewX(-15deg) for the diagonal feel.
export default function ThemeWipeOverlay() {
  const { isWiping, setIsWiping } = useTheme();

  return (
    <AnimatePresence>
      {isWiping && (
        <>
          {/* Front wave — branded gradient stripe */}
          <motion.div
            initial={{ x: "-100%", skewX: -15 }}
            animate={{ x: ["-100%", "0%", "100%"] }}
            exit={{ x: "100%" }}
            transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
            onAnimationComplete={() => setIsWiping(false)}
            className="fixed inset-y-0 -left-[20%] w-[140%] z-[150] pointer-events-none
                       bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400
                       shadow-[0_0_50px_rgba(0,0,0,0.3)]"
          />
          {/* Back wave — new page background, reveals the switched theme */}
          <motion.div
            initial={{ x: "-100%", skewX: -15 }}
            animate={{ x: ["-100%", "0%", "100%"] }}
            transition={{ duration: 1.0, delay: 0.05, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-y-0 -left-[20%] w-[140%] z-[140] pointer-events-none bg-background"
          />
        </>
      )}
    </AnimatePresence>
  );
}
