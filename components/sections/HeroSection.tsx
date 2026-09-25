"use client";

import { useRef, useCallback } from "react";
import KineticMaskHero from "@/components/blocks/kinetic-mask-hero";

const BG_SRC           = "/images/hero-bg.webp";
const MEDIA_SRC        = "/hero-desktop.mp4"; // 1080p, ~5 MB
const MOBILE_MEDIA_SRC = "/hero-mobile.mp4";  // 720p, ~3 MB
const POSTER_SRC       = "/hero-poster.webp";

// ─── Design Rectangle Variables ─────────────────────────────────────────────
const RECT_BORDER_THICKNESS = "2px";
const RECT_CURVE            = "32px";
const RECT_TOP              = "88px";
const RECT_SIDE_MARGIN      = "100px";
const RECT_BOTTOM_OFFSET    = "-100px";
const RECT_BORDER_COLOR     = "rgba(255, 255, 255, 0.5)";
const RECT_Z_INDEX          = 45;
// ──────────────────────────────────────────────────────────────────────────

export default function HeroSection() {
  const rectRef = useRef<HTMLDivElement>(null);

  const handleProgressChange = useCallback((progress: number) => {
    if (rectRef.current) {
      rectRef.current.style.opacity = String(1 - progress);
    }
  }, []);

  return (
    // svh, not h-screen (100vh): on mobile 100vh is measured with the
    // browser toolbar hidden, so the hero was taller than the visible screen
    // and didn't match the inner hero's height. svh never changes while
    // scrolling, so nothing below the hero shifts.
    <div className="w-full h-svh relative overflow-hidden">
      {/* Premium Half-White Design Rectangle — fades out as card expands */}
      <div
        ref={rectRef}
        className="absolute pointer-events-none hidden lg:block"
        style={{
          top: RECT_TOP,
          left: RECT_SIDE_MARGIN,
          right: RECT_SIDE_MARGIN,
          bottom: RECT_BOTTOM_OFFSET,
          borderTop: `${RECT_BORDER_THICKNESS} solid ${RECT_BORDER_COLOR}`,
          borderLeft: `${RECT_BORDER_THICKNESS} solid ${RECT_BORDER_COLOR}`,
          borderRight: `${RECT_BORDER_THICKNESS} solid ${RECT_BORDER_COLOR}`,
          borderBottom: "none",
          borderTopLeftRadius: RECT_CURVE,
          borderTopRightRadius: RECT_CURVE,
          zIndex: RECT_Z_INDEX,
        }}
      />

      <KineticMaskHero
        mediaSrc={MEDIA_SRC}
        mobileMediaSrc={MOBILE_MEDIA_SRC}
        posterSrc={POSTER_SRC}
        bgImageSrc={BG_SRC}
        onProgressChange={handleProgressChange}
      />
    </div>
  );
}
