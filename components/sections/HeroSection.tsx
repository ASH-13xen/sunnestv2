"use client";

import { useState, useRef, useCallback } from "react";
import KineticMaskHero from "@/components/blocks/kinetic-mask-hero";

const BG_SRC    = "/images/hero-bg.png";
const MEDIA_SRC = "/hero-bg.mp4";

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
  const [heroExpanded, setHeroExpanded] = useState(false);
  const rectRef = useRef<HTMLDivElement>(null);

  const handleProgressChange = useCallback((progress: number) => {
    if (rectRef.current) {
      rectRef.current.style.opacity = String(1 - progress);
    }
  }, []);

  return (
    <div className="w-full h-screen relative overflow-hidden">
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
        bgImageSrc={BG_SRC}
        isActive={true}
        onExpansionChange={setHeroExpanded}
        onProgressChange={handleProgressChange}
      />
    </div>
  );
}
