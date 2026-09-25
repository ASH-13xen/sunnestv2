"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

// How long the brand splash stays up once the page is interactive. It used to
// wait for window `load` — i.e. every image and the hero video on the page —
// and then add another ~2 s on top, which on mobile data meant many seconds of
// staring at the logo. The page is usable as soon as React hydrates.
const SPLASH_MS = 900;

const READY_EVENT = "sunnest:ready";

declare global {
  interface Window {
    __sunnestReady?: boolean;
  }
}

/** Runs `cb` once the splash starts fading out (immediately if it already has). */
export function onSiteReady(cb: () => void) {
  if (window.__sunnestReady) {
    cb();
    return () => {};
  }
  window.addEventListener(READY_EVENT, cb, { once: true });
  return () => window.removeEventListener(READY_EVENT, cb);
}

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      window.__sunnestReady = true;
      window.dispatchEvent(new Event(READY_EVENT));
    }, SPLASH_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0A1628]"
        >
          {/* The lockup artwork already contains the wordmark and tagline, so
              nothing is captioned underneath it. Preloaded: this is the site's
              first paint, and therefore the LCP element. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/logo-lockup.webp"
                alt="SunNest Power"
                width={900}
                height={819}
                preload
                sizes="150px"
                className="w-[150px] h-auto"
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
