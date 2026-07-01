"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Home",      href: "#hero" },
  { label: "Solutions", href: "#solutions" },
  { label: "About",     href: "#about" },
  { label: "Process",   href: "#process" },
  { label: "Pricing",   href: "#pricing" },
  { label: "FAQ",       href: "#faq" },
  { label: "Contact",   href: "#contact" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [onHero, setOnHero]     = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setOnHero(y < window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("page-transition", { detail: { href } }));
  };

  // When the drawer is open or we're on the dark hero, always use light text
  const lightText = isOpen || onHero || theme === "night";

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-8 py-3.5 transition-all duration-[400ms]",
        scrolled && !onHero
          ? theme === "night"
            ? "bg-navy-900/90 backdrop-blur-md border-b border-white/5 shadow-lg"
            : "bg-bg-cream/90 backdrop-blur-md border-b border-gold-500/10 shadow-md"
          : "bg-transparent"
      )}
    >
      {/* ── Logo ──────────────────────────────────────────────────────────── */}
      <span
        className="text-xl font-black tracking-tight select-none z-[60] cursor-pointer"
        onClick={() => handleNavClick("#hero")}
      >
        <span className={cn("transition-colors duration-300", lightText ? "text-white" : "text-navy-900")}>
          Sun
        </span>
        <span className="text-[#FFD700]">Nest</span>
        <span className={cn("text-sm font-medium ml-1 transition-colors duration-300", lightText ? "text-white/60" : "text-text-mid")}>
          Power
        </span>
      </span>

      {/* ── Desktop links ─────────────────────────────────────────────────── */}
      <ul className="hidden md:flex items-center gap-1 list-none p-0 m-0">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <button
              onClick={() => handleNavClick(link.href)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer",
                lightText
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-text-mid hover:text-text-dark hover:bg-gold-500/10"
              )}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 z-[60]">
        {/* ── Theme toggle ─────────────────────────────────────────────────── */}
        {/* Same button style as sunlatest; isWiping guard prevents double-fire */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleTheme(); }}
          aria-label="Toggle theme"
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 border shadow-md z-[60]",
            lightText
              ? "bg-white/10 border-white/15 hover:bg-white/20 text-[#60A5FA]"
              : "bg-gold-500/10 border-gold-500/20 hover:bg-gold-500/20 text-gold-500"
          )}
          title={theme === "day" ? "Switch to Night Mode" : "Switch to Day Mode"}
        >
          {/* Animated Sun ↔ Moon swap — rotate in from above, out below */}
          <AnimatePresence mode="wait" initial={false}>
            {theme === "day" ? (
              <motion.span
                key="sun"
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0,   opacity: 1, scale: 1   }}
                exit={{    rotate:  90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="flex items-center justify-center"
              >
                <Sun className="w-4 h-4" />
              </motion.span>
            ) : (
              <motion.span
                key="moon"
                initial={{ rotate:  90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0,   opacity: 1, scale: 1   }}
                exit={{    rotate: -90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="flex items-center justify-center"
              >
                <Moon className="w-4 h-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* ── Mobile hamburger (animated 3 bars → X, identical to sunlatest) ── */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          className={cn(
            "md:hidden w-8 h-8 rounded-full border flex flex-col items-center justify-center gap-[5px] cursor-pointer z-[60] transition-all duration-300 shadow-md",
            lightText
              ? "bg-white/10 border-white/15 hover:bg-white/20"
              : "bg-navy-900/5 border-navy-900/10 hover:bg-navy-900/10"
          )}
        >
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 5.5 : 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cn("w-4 h-0.5 block rounded-full transition-colors duration-300", lightText ? "bg-white" : "bg-text-dark")}
          />
          <motion.span
            animate={{ opacity: isOpen ? 0 : 1, scaleX: isOpen ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className={cn("w-4 h-0.5 block rounded-full transition-colors duration-300", lightText ? "bg-white" : "bg-text-dark")}
          />
          <motion.span
            animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -5.5 : 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cn("w-4 h-0.5 block rounded-full transition-colors duration-300", lightText ? "bg-white" : "bg-text-dark")}
          />
        </button>
      </div>

      {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-navy-900/96 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-4 px-8"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => handleNavClick(link.href)}
                className="w-full max-w-xs text-center text-xl font-black text-white/85 hover:text-white py-3 px-6 rounded-2xl hover:bg-white/5 transition-all duration-200 cursor-pointer border border-transparent hover:border-white/10"
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
