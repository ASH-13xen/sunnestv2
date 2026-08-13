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
              low alpha, so this gives it something to bloom against. Sized in
              px against the mark rather than vmin, so it stays a halo instead
              of washing across the whole viewport on wide screens. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-65 w-65 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,202,40,0.16) 0%, rgba(255,145,0,0.06) 45%, transparent 70%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Slow breathe, so the mark itself carries the "working" feel
                rather than just sitting there. */}
            <motion.div
              animate={{ scale: [1, 1.07, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 sm:w-24"
            >
              {/* Emblem from the dedicated brand/sunnest-emblem.png export —
                  no sunburst, no wordmark, so nothing is clipped at any size.
                  Narrower than the old sunburst crop because the mark now fills
                  its own frame instead of sitting inside a ring of rays.
                  Preloaded: this is the site's first paint, so it is the LCP
                  element. */}
              <Image
                src="/logo-emblem.webp"
                alt="SunNest Power"
                width={512}
                height={490}
                preload
                sizes="96px"
                className="h-auto w-full"
              />
            </motion.div>
          </motion.div>

          {/* Indeterminate sweep — gold is hardcoded rather than themed because
              this screen is always navy, in both day and night mode. */}
          <div className="relative mt-7 h-px w-33 overflow-hidden bg-white/10">
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
