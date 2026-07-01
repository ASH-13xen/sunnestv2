"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WeaveSpinner } from "@/components/ui/WeaveSpinner";

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
          <WeaveSpinner />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ delay: 0.35, duration: 0.45 }}
            className="text-[9px] uppercase font-black tracking-widest text-gold-400 mt-6 font-mono"
          >
            Powering Clean Energy...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
