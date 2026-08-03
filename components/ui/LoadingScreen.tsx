"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (document.readyState === "complete") {
      const t = setTimeout(() => setLoading(false), 2200);
      return () => clearTimeout(t);
    }
    const onLoad = () => {
      const t = setTimeout(() => setLoading(false), 1800);
      return () => clearTimeout(t);
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0A1628]"
        >
          {/* Warm halo behind the emblem — the logo's own glow is baked in at
              low alpha, so this gives it something to bloom against. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[76vmin] w-[76vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,202,40,0.14) 0%, rgba(255,145,0,0.05) 45%, transparent 70%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[min(74vw,360px)]"
          >
            {/* Preloaded rather than lazy: this is the first paint of the site,
                so it is the LCP element. */}
            <Image
              src="/logo-lockup.webp"
              alt="SunNest Power — Turning Sunlight Into Savings"
              width={900}
              height={819}
              preload
              sizes="(max-width: 500px) 74vw, 360px"
              className="h-auto w-full"
            />
          </motion.div>

          {/* Indeterminate sweep — gold is hardcoded rather than themed because
              this screen is always navy, in both day and night mode. */}
          <div className="relative mt-9 h-px w-[min(54vw,210px)] overflow-hidden bg-white/10">
            <motion.div
              className="absolute inset-y-0 w-1/3"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #FFCA28, transparent)",
              }}
              animate={{ x: ["-120%", "320%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
