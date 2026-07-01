"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

const SLAT_COUNT = 5;

export default function PageTransitionOverlay() {
  const { theme } = useTheme();
  const isNight = theme === "night";

  const [activeHref, setActiveHref] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "entering" | "scrolling" | "exiting">("idle");

  useEffect(() => {
    const handleTransition = (e: Event) => {
      const customEvent = e as CustomEvent<{ href: string }>;
      const href = customEvent.detail.href;
      
      setActiveHref(href);
      setPhase("entering");
    };

    window.addEventListener("page-transition", handleTransition);
    return () => window.removeEventListener("page-transition", handleTransition);
  }, []);

  useEffect(() => {
    if (phase !== "idle") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  // When all panels have finished sliding down, we perform the scroll jump and transition to exit phase
  const handleEntranceComplete = () => {
    if (phase === "entering") {
      setPhase("scrolling");
      
      // Perform the scroll jump instantly while screen is fully blacked out
      if (activeHref) {
        const el = document.querySelector(activeHref);
        if (el) {
          el.scrollIntoView({ behavior: "auto" });
        }
      }

      // Briefly pause to ensure layout paint occurs, then slide out
      setTimeout(() => {
        setPhase("exiting");
      }, 100);
    }
  };

  const handleExitComplete = () => {
    if (phase === "exiting") {
      setPhase("idle");
      setActiveHref(null);
    }
  };

  if (phase === "idle") return null;

  // Rich premium dark theme colors for the panels
  const slatColors = isNight
    ? ["#0A1628", "#1E293B", "#0A1628", "#0F172A", "#0A1628"]
    : ["#0A1628", "#F5EFE4", "#0A1628", "#E2D9C8", "#0A1628"];

  const goldAccent = "#D4A017";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        pointerEvents: "none",
        display: "flex",
        width: "100vw",
        height: "100vh",
      }}
    >
      {/* 5 Vertical staggered panels */}
      {Array.from({ length: SLAT_COUNT }).map((_, i) => {
        const delayIn = i * 0.05;
        const delayOut = (SLAT_COUNT - 1 - i) * 0.05; // reverse exit stagger

        return (
          <motion.div
            key={i}
            initial={{ y: "-100%" }}
            animate={
              phase === "entering"
                ? { y: "0%" }
                : phase === "exiting"
                ? { y: "100%" }
                : { y: "0%" }
            }
            transition={{
              duration: 0.45,
              ease: [0.76, 0, 0.24, 1], // easeInOutQuint
              delay: phase === "entering" ? delayIn : delayOut,
            }}
            onAnimationComplete={() => {
              // Only trigger completion on the last animation index
              if (phase === "entering" && i === SLAT_COUNT - 1) {
                handleEntranceComplete();
              } else if (phase === "exiting" && i === 0) {
                handleExitComplete();
              }
            }}
            style={{
              flex: 1,
              height: "100%",
              background: slatColors[i],
              position: "relative",
              borderRight: i < SLAT_COUNT - 1 ? "1px solid rgba(255,255,255,0.02)" : "none",
              pointerEvents: "auto",
            }}
          >
            {/* Top gold accent line inside each panel for extra premium touch */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: goldAccent,
                opacity: 0.7,
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
