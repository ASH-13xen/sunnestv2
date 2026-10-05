"use client";

import { useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import KineticMaskHero from "@/components/blocks/kinetic-mask-hero";
import { RESELLER_TITLE, RESELLER_BRAND } from "@/lib/site";

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
const LEGEND_GAP_PADDING    = 12; // px of empty border on each side of the reseller badge
// ──────────────────────────────────────────────────────────────────────────

// The top border is cut open behind the label: a mask whose top strip is
// transparent in the middle (width = label + padding), and opaque elsewhere.
const FRAME_MASK =
  "linear-gradient(to right, #000 calc(50% - var(--legend-half, 0px)), transparent calc(50% - var(--legend-half, 0px)), transparent calc(50% + var(--legend-half, 0px)), #000 calc(50% + var(--legend-half, 0px))), linear-gradient(#000, #000)";

export default function HeroSection() {
  const frameRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);

  const handleProgressChange = useCallback((progress: number) => {
    if (frameRef.current) {
      frameRef.current.style.opacity = String(1 - progress);
    }
  }, []);

  // Size the gap in the frame's top border to the label's actual width.
  useEffect(() => {
    const rect = rectRef.current;
    const legend = legendRef.current;
    if (!rect || !legend) return;
    const update = () => {
      rect.style.setProperty("--legend-half", `${legend.offsetWidth / 2 + LEGEND_GAP_PADDING}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(legend);
    return () => ro.disconnect();
  }, []);

  return (
    // svh, not h-screen (100vh): on mobile 100vh is measured with the
    // browser toolbar hidden, so the hero was taller than the visible screen
    // and didn't match the inner hero's height. svh never changes while
    // scrolling, so nothing below the hero shifts.
    <div className="w-full h-svh relative overflow-hidden">
      {/* Premium Half-White Design Rectangle (desktop) with the reseller
          label set into its top edge — both fade out as the zoom opens. */}
      <div
        ref={frameRef}
        className="absolute inset-0 pointer-events-none hidden lg:block"
        style={{ zIndex: RECT_Z_INDEX }}
      >
        <div
          ref={rectRef}
          className="absolute"
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
            maskImage: FRAME_MASK,
            WebkitMaskImage: FRAME_MASK,
            maskSize: "100% 4px, 100% calc(100% - 4px)",
            WebkitMaskSize: "100% 4px, 100% calc(100% - 4px)",
            maskPosition: "top, bottom",
            WebkitMaskPosition: "top, bottom",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        />

        {/* Reseller badge: a gold-edged pill sitting in the gap of the frame */}
        <div
          ref={legendRef}
          className="absolute flex items-center gap-3 whitespace-nowrap rounded-full"
          style={{
            top: `calc(${RECT_TOP} + ${RECT_BORDER_THICKNESS} / 2)`,
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "7px 22px 7px 8px",
            background: "linear-gradient(135deg, rgba(255,229,127,0.16), rgba(10,22,40,0.72) 45%)",
            border: "1px solid rgba(255, 229, 127, 0.55)",
            boxShadow: "0 0 28px rgba(255, 200, 80, 0.22), inset 0 1px 0 rgba(255,255,255,0.12)",
            fontSize: "0.78rem",
            fontWeight: 800,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
          }}
        >
          <span
            className="flex items-center justify-center rounded-full shrink-0"
            style={{ width: 34, height: 34, background: "rgba(10,22,40,0.85)", border: "1px solid rgba(255,229,127,0.35)" }}
          >
            <Image src="/reliance-mark.png" alt="Reliance" width={147} height={137} style={{ width: 22, height: "auto" }} />
          </span>
          <span style={{ color: "#FFE57F" }}>{RESELLER_TITLE}</span>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>·</span>
          <span style={{ color: "#ffffff" }}>{RESELLER_BRAND}</span>
        </div>
      </div>

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
