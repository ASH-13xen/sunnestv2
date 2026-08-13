"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type Theme = "day" | "night";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isWiping: boolean;
  setIsWiping: (v: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

// Dark is the default for a first-time visitor. Kept in sync with the
// pre-paint script in app/layout.tsx — if you change it here, change it there
// too, or the CSS variables and the React state will disagree on first render.
const DEFAULT_THEME: Theme = "night";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [isWiping, setIsWiping] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sunnest-theme") as Theme;
    const initial = saved === "day" || saved === "night" ? saved : DEFAULT_THEME;
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggleTheme = useCallback(() => {
    if (isWiping) return; // prevent double-trigger during sweep
    setIsWiping(true);
    // Switch the actual theme halfway through the 1 s wipe so it's hidden behind the wave
    setTimeout(() => {
      setTheme((prev) => {
        const next = prev === "day" ? "night" : "day";
        localStorage.setItem("sunnest-theme", next);
        document.documentElement.setAttribute("data-theme", next);
        return next;
      });
    }, 500);
  }, [isWiping]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isWiping, setIsWiping }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
