"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

// ─── Kinetic Mask Config Variables ──────────────────────────────────────────
// You can adjust these variables directly to fine-tune the zoom animation:
const MAX_ZOOM_SCALE = 100; // Max zoom size for letters (e.g. 85, 550, 1500)
const SCROLL_SENSITIVITY = 0.004; // Sensitivity of manual scroll (e.g. 0.0006, 0.0012)
const ZOOM_EASING_POWER = 4; // Easing power curve (higher = starts slower, speeds up at the end)
const AUTO_ZOOM_TRIGGER = false; // TRUE = zoom completely on a single scroll flick; FALSE = zoom links directly to wheel scroll ticks
const AUTO_ZOOM_DURATION = 0.95; // Animation duration in seconds when in single-scroll trigger mode (AUTO_ZOOM_TRIGGER = true)
const REVERSE_DURATION = 0.85; // Duration in seconds when zooming out in single-scroll trigger mode (AUTO_ZOOM_TRIGGER = true)

// --- Scroll Cushion/Hold Configuration ---
const SCROLL_HOLD_BUFFER = 0.5; // Extra manual scroll depth (0.0 to 1.0+) the user must scroll through while the video stays fully zoomed before unlocking the page (e.g. 0.35, 0.5)
const AUTO_ZOOM_HOLD_DELAY = 600; // Delay in milliseconds after auto-zoom finishes before scroll is unlocked (e.g. 300, 600)

// --- Hero Background Tint Configuration (Control overlay opacity and colors here) ---
const NIGHT_OVERLAY_COLOR = "#0A1628";
const NIGHT_OVERLAY_OPACITY = 0.90; // Opacity overlay for dark mode

const DAY_OVERLAY_COLOR = "#0A1628"; // Opacity overlay color for light mode (dark tint)
const DAY_OVERLAY_OPACITY = 0.65;    // Opacity overlay for light mode (slightly lesser dark tint)
// ──────────────────────────────────────────────────────────────────────────

interface KineticMaskHeroProps {
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  isActive?: boolean;
  onExpansionChange?: (expanded: boolean) => void;
  onProgressChange?: (progress: number) => void;
}

export default function KineticMaskHero({
  mediaSrc,
  posterSrc,
  bgImageSrc,
  isActive = true,
  onExpansionChange,
  onProgressChange,
}: KineticMaskHeroProps) {
  const { theme } = useTheme();
  const isNight = theme === "night";

  const pageBg = isNight ? "#0A1628" : "#FBF8F0";
  const pageText = isNight ? "#FBF8F0" : "#0A1628";
  const goldColor = isNight ? "#60A5FA" : "#D4A017";
  const paraText = isNight ? "rgba(255, 255, 255, 0.65)" : "rgba(10, 22, 40, 0.68)";

  const imageFilter = isNight ? "url(#aerial-filter)" : "none";
  const overlayColor = isNight ? NIGHT_OVERLAY_COLOR : DAY_OVERLAY_COLOR;
  const overlayOpacity = isNight ? NIGHT_OVERLAY_OPACITY : DAY_OVERLAY_OPACITY;

  const progressVal = useMotionValue(0);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Keep the canvas pixel resolution in sync with the viewport
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const onExpansionChangeRef = useRef(onExpansionChange);
  const onProgressChangeRef = useRef(onProgressChange);
  const targetProgress = useRef(0);
  const isAnimating = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.defaultMuted = true;
    vid.muted = true;

    if (!isActive) {
      vid.pause();
      return;
    }

    // Prime the video initially so the first frame is loaded/cached
    if (vid.paused && vid.currentTime === 0) {
      vid
        .play()
        .then(() => {
          vid.pause();
        })
        .catch((err) => {
          console.warn("Priming video play failed:", err);
        });
    }

    const unsubscribe = progressVal.on("change", (latest) => {
      if (latest > 0.85) {
        if (vid.paused) {
          vid.play().catch((err) => {
            // Ignore auto-play block issues
          });
        }
      } else {
        if (!vid.paused) {
          vid.pause();
          vid.currentTime = 0;
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isActive, progressVal]);

  // Copy video frames into the canvas on every animation frame.
  // Using a canvas inside foreignObject instead of a raw <video> element
  // fixes iOS Safari: iOS extracts <video> from SVG foreignObject onto a
  // separate GPU compositing layer (bypassing the SVG mask), but a <canvas>
  // drawn with drawImage stays in the normal compositing stack so the mask works.
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let rafId: number;
    const draw = () => {
      if (video.readyState >= 2 && video.videoWidth > 0) {
        const cw = canvas.clientWidth || 1000;
        const ch = canvas.clientHeight || 1000;
        if (canvas.width !== cw || canvas.height !== ch) {
          canvas.width = cw;
          canvas.height = ch;
        }
        const scale = Math.max(
          canvas.width / video.videoWidth,
          canvas.height / video.videoHeight,
        );
        const dw = video.videoWidth * scale;
        const dh = video.videoHeight * scale;
        ctx.drawImage(
          video,
          (canvas.width - dw) / 2,
          (canvas.height - dh) / 2,
          dw,
          dh,
        );
      }
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafId);
  }, []);
  const autoZoomTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Refs keep event-handler closures stable — no re-registration on state change.
  const mediaFullyExpandedRef = useRef(false);
  const touchStartYRef = useRef(0);

  useEffect(() => {
    onExpansionChangeRef.current = onExpansionChange;
  }, [onExpansionChange]);

  useEffect(() => {
    onProgressChangeRef.current = onProgressChange;
  }, [onProgressChange]);

  // Synchronize changes to progressVal back to the parent component (clamped to 1.0 for visual consistency)
  useEffect(() => {
    const handler = (latest: number) => {
      onProgressChangeRef.current?.(Math.min(latest, 1.0));
    };

    return progressVal.on("change", handler);
  }, [progressVal]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (autoZoomTimeoutRef.current) clearTimeout(autoZoomTimeoutRef.current);
    };
  }, []);

  // Scroll and touch triggers.
  // All handlers use refs for state so the effect only needs to re-run when
  // isActive changes — no stale-closure re-registration on every state tick.
  useEffect(() => {
    if (!isActive) return;

    // Local helper keeps the ref and React state in sync atomically.
    const setExpanded = (val: boolean) => {
      mediaFullyExpandedRef.current = val;
      setMediaFullyExpanded(val);
    };

    // ── Desktop wheel ─────────────────────────────────────────────────────────
    const handleWheel = (e: WheelEvent) => {
      const expanded = mediaFullyExpandedRef.current;

      if (AUTO_ZOOM_TRIGGER) {
        if (e.deltaY > 0 && !expanded && targetProgress.current !== 1) {
          e.preventDefault();
          targetProgress.current = 1;
          isAnimating.current = true;
          if (autoZoomTimeoutRef.current) clearTimeout(autoZoomTimeoutRef.current);
          animate(progressVal, 1, {
            duration: AUTO_ZOOM_DURATION,
            ease: [0.16, 1, 0.3, 1],
            onComplete: () => {
              autoZoomTimeoutRef.current = setTimeout(() => {
                setExpanded(true);
                onExpansionChangeRef.current?.(true);
                isAnimating.current = false;
              }, AUTO_ZOOM_HOLD_DELAY);
            },
          });
        } else if (e.deltaY < 0 && expanded && targetProgress.current !== 0 && window.scrollY <= 5) {
          e.preventDefault();
          targetProgress.current = 0;
          isAnimating.current = true;
          setExpanded(false);
          onExpansionChangeRef.current?.(false);
          animate(progressVal, 0, {
            duration: REVERSE_DURATION,
            ease: [0.16, 1, 0.3, 1],
            onComplete: () => { isAnimating.current = false; },
          });
        } else if (isAnimating.current) {
          e.preventDefault();
        }
      } else {
        const maxProgressLimit = 1.0 + SCROLL_HOLD_BUFFER;
        if (expanded && e.deltaY < 0 && window.scrollY <= 5) {
          setExpanded(false);
          onExpansionChangeRef.current?.(false);
          targetProgress.current = 1.0;
          e.preventDefault();
          animate(progressVal, 1.0, { duration: 0.1, ease: "linear" });
        } else if (!expanded) {
          e.preventDefault();
          const newProgress = Math.min(
            Math.max(progressVal.get() + e.deltaY * SCROLL_SENSITIVITY, 0),
            maxProgressLimit,
          );
          animate(progressVal, newProgress, { duration: 0.15, ease: "linear" });
          if (newProgress >= maxProgressLimit) {
            setExpanded(true);
            onExpansionChangeRef.current?.(true);
            targetProgress.current = maxProgressLimit;
          }
        }
      }
    };

    // ── Proportional touch zoom ───────────────────────────────────────────────
    // Swipe distance directly drives progress (45% screen height = full zoom).
    // On release, snap forward if progress > 35%, snap back otherwise.
    // This lets the user see the whole animation at their own pace instead of
    // a 20px flick firing an uncontrollable auto-zoom.
    const SWIPE_FULL_PX  = window.innerHeight * 0.45;
    const SWIPE_DEAD_PX  = 12;

    const handleTouchStart = (e: TouchEvent) => {
      // Ignore new touches while a commit/reverse animation is in flight —
      // otherwise a second swipe during that ~1.3s window (very common on
      // mobile, since people keep swiping) can hijack progressVal and,
      // depending on where it lands, undo the zoom that's already committing.
      // That's what caused the "zooms in then comes back" repeating bug.
      if (isAnimating.current) return;
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isAnimating.current) return;
      const startY   = touchStartYRef.current;
      if (!startY) return;
      const expanded = mediaFullyExpandedRef.current;
      const deltaY   = startY - e.touches[0].clientY;

      if (!expanded) {
        // Prevent default for ANY downward movement here — not just past the
        // dead zone — otherwise the browser's native scroll/bounce sneaks in
        // during the first ~12px of drag and the scroll-lock below snaps it
        // back, producing a visible "scrolls down a little then springs back"
        // stutter on mobile.
        e.preventDefault();
        if (deltaY > SWIPE_DEAD_PX) {
          const progress = Math.min((deltaY - SWIPE_DEAD_PX) / SWIPE_FULL_PX, 1.0);
          progressVal.set(progress);
          targetProgress.current = progress;
        }
      } else if (window.scrollY <= 5 && deltaY < -SWIPE_DEAD_PX) {
        e.preventDefault();
        // Map swipe-up distance back to reverse progress (1 → 0)
        const swipeDist       = Math.max(deltaY + SWIPE_DEAD_PX, -SWIPE_FULL_PX);
        const reverseProgress = 1.0 + swipeDist / SWIPE_FULL_PX;
        progressVal.set(Math.max(reverseProgress, 0));
        targetProgress.current = reverseProgress;
      }
    };

    const handleTouchEnd = () => {
      if (isAnimating.current) return;
      const current  = progressVal.get();
      const expanded = mediaFullyExpandedRef.current;

      if (!expanded) {
        if (current > 0.35) {
          // Snap to full zoom
          targetProgress.current = 1;
          isAnimating.current    = true;
          animate(progressVal, 1, {
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
            onComplete: () => {
              autoZoomTimeoutRef.current = setTimeout(() => {
                setExpanded(true);
                onExpansionChangeRef.current?.(true);
                isAnimating.current = false;
              }, AUTO_ZOOM_HOLD_DELAY);
            },
          });
        } else {
          // Snap back to start
          targetProgress.current = 0;
          isAnimating.current = true;
          animate(progressVal, 0, {
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
            onComplete: () => { isAnimating.current = false; },
          });
        }
      } else if (current < 0.5) {
        // Swiped back far enough — reverse the zoom
        setExpanded(false);
        onExpansionChangeRef.current?.(false);
        targetProgress.current = 0;
        isAnimating.current = true;
        animate(progressVal, 0, {
          duration: REVERSE_DURATION,
          ease: [0.16, 1, 0.3, 1],
          onComplete: () => { isAnimating.current = false; },
        });
      }

      touchStartYRef.current = 0;
    };

    // ── Nav-click handler ─────────────────────────────────────────────────────
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("nav")) return;

      const logoSpan = target.closest("span");
      if (logoSpan && (logoSpan.textContent?.includes("Sun") || logoSpan.textContent?.includes("Nest"))) {
        setExpanded(false);
        onExpansionChangeRef.current?.(false);
        progressVal.set(0);
        targetProgress.current = 0;
        return;
      }

      if (!target.closest("ul")) return;

      setExpanded(true);
      onExpansionChangeRef.current?.(true);
      progressVal.set(1.0 + SCROLL_HOLD_BUFFER);
      targetProgress.current = 1.0 + SCROLL_HOLD_BUFFER;
    };

    const handleScroll = () => {
      if (!mediaFullyExpandedRef.current) window.scrollTo(0, 0);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("click", handleGlobalClick);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [isActive]);

  // Map progressVal directly to styling transforms via useTransform
  // Scale is capped at 85x to avoid vector path rasterization lag in browsers
  const scale = useTransform(
    progressVal,
    (v) => 1 + Math.pow(Math.min(v, 1.0), ZOOM_EASING_POWER) * MAX_ZOOM_SCALE,
  );
  const bgOpacity = useTransform(progressVal, (v) => 1 - Math.min(v, 1.0));
  const contentOpacity = useTransform(progressVal, (v) =>
    Math.max(0, 1 - Math.min(v, 1.0) * 3),
  );

  // Inverted mask: white = cover opaque (video hidden), black = cover transparent (video visible).
  // White text punches holes in the cover, revealing the canvas below.
  // As progress → 1 the entire cover fades to transparent, video fills the screen.
  const coverMaskBg = useTransform(
    progressVal,
    [0, 0.8, 1.0, 1.0 + SCROLL_HOLD_BUFFER],
    ["rgb(255,255,255)", "rgb(255,255,255)", "rgb(0,0,0)", "rgb(0,0,0)"],
  );

  const transformOrigin = isMobile ? "450px 430px" : "430px 470px";

  return (
    <div
      className="relative w-full h-dvh overflow-hidden"
      style={{
        backgroundColor: pageBg,
        transition: "background-color 0.4s ease",
        // While the zoom hasn't finished, fully own touch gestures so the
        // browser never starts its own native scroll/rubber-band under us —
        // that's what caused the "scrolls down a little then snaps back"
        // stutter on mobile. Release it once expanded so normal page scroll
        // (and the swipe-to-reverse handler) works as expected.
        touchAction: mediaFullyExpanded ? "auto" : "none",
        overscrollBehavior: mediaFullyExpanded ? "auto" : "none",
      }}
    >
      {/* Dark backdrop */}
      <div className="absolute inset-0 z-0" style={{ backgroundColor: pageBg, transition: "background-color 0.4s ease" }} />

      {/* Video source — kept nearly-invisible in the HTML tree so iOS decodes
          frames for canvas.drawImage() without the foreignObject GPU-layer bug. */}
      <video
        ref={videoRef}
        src={mediaSrc}
        poster={posterSrc}
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        style={{
          position: "absolute",
          opacity: 0.01,
          width: "1px",
          height: "1px",
          pointerEvents: "none",
        }}
      />

      {/* Canvas: full-screen HTML element, NO masking applied.
          The SVG cover above it (with the inverted hole-punch mask) reveals it
          only at the text positions, then fully as progress reaches 1.
          Keeping the canvas in HTML (not foreignObject) is the iOS fix — iOS
          never extracts plain HTML canvas onto a separate GPU layer. */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[10]"
        style={{ display: "block", width: "100%", height: "100%" }}
      />

      {/* Kinetic SVG overlay */}
      <svg
        className="absolute inset-0 z-20 w-full h-full pointer-events-none select-none"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Gold gradient for outline stroke */}
          <linearGradient
            id="gold-stroke-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FFE57F" />
            <stop offset="30%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FF9100" />
          </linearGradient>

          {/* SVG filter: grayscale + contrast(1.25) + brightness(0.45) for the aerial image.
              Equivalent to the CSS classes grayscale/contrast-125/brightness-[0.45]. */}
          <filter id="aerial-filter" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.11981 0.40219 0.04050 0 -0.05625
                      0.11981 0.40219 0.04050 0 -0.05625
                      0.11981 0.40219 0.04050 0 -0.05625
                      0       0       0       1  0"
            />
          </filter>

          {/* ── Inverted hole-punch mask ──────────────────────────────────────
              white = cover remains opaque  (canvas video is hidden)
              black = cover becomes transparent  (canvas video shows through)
              Text shapes are black → they punch holes through which the canvas
              HTML element below is visible. As progress → 1 the whole cover
              fades to transparent, revealing the video everywhere. */}
          <mask id="cover-mask">
            <motion.rect width="1000" height="1000" fill={coverMaskBg} />
            <motion.g style={{ transformOrigin, scale }}>
              <text
                x="500"
                y={isMobile ? "430" : "470"}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="black"
                className="font-sans font-black tracking-tighter"
                style={{
                  fontSize: isMobile ? "90px" : "125px",
                  letterSpacing: isMobile ? "-1px" : "-2px",
                }}
              >
                SUNNEST
              </text>
              <text
                x="507"
                y={isMobile ? "505" : "545"}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="black"
                className="font-sans font-bold tracking-[0.35em]"
                style={{ fontSize: isMobile ? "45px" : "65px" }}
              >
                POWER
              </text>
            </motion.g>
          </mask>
        </defs>

        {/* ── Cover layer: dark navy + aerial image, hole-punched at text positions.
            This is native SVG — masks on SVG elements work correctly on iOS. ── */}
        <g mask="url(#cover-mask)">
          {/* Base background */}
          <rect width="1000" height="1000" fill={pageBg} style={{ transition: "fill 0.4s ease" }} />
          {/* Aerial image (grayscale+dark via SVG filter in dark mode, raw image in light mode), fades as zoom progresses */}
          <motion.image
            href={bgImageSrc}
            x="0"
            y="0"
            width="1000"
            height="1000"
            preserveAspectRatio="xMidYMid slice"
            filter={imageFilter}
            style={{ opacity: bgOpacity }}
          />
          {/* Luxury duotone overlay (controlled by config variables) */}
          <rect width="1000" height="1000" fill={overlayColor} opacity={overlayOpacity} style={{ transition: "fill 0.4s ease, opacity 0.4s ease" }} />
        </g>

        {/* ── Liquid Gold Outline (desktop only — gold stroke bleeds visually on mobile) ── */}
        {!isMobile && <motion.g style={{ transformOrigin, scale, opacity: bgOpacity }}>
          <text
            x="500"
            y={isMobile ? "430" : "470"}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="none"
            stroke="url(#gold-stroke-gradient)"
            strokeWidth="2"
            className="font-sans font-black tracking-tighter"
            style={{
              fontSize: isMobile ? "90px" : "125px",
              letterSpacing: isMobile ? "-1px" : "-2px",
            }}
          >
            SUNNEST
          </text>
          <text
            x="507"
            y={isMobile ? "505" : "545"}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="none"
            stroke="url(#gold-stroke-gradient)"
            strokeWidth="1.5"
            className="font-sans font-bold tracking-[0.35em]"
            style={{ fontSize: isMobile ? "45px" : "65px" }}
          >
            POWER
          </text>
        </motion.g>}
      </svg>

      {/* Scroll hint (fades out as we zoom) */}
      <motion.div
        className="absolute inset-x-0 top-[70%] z-40 flex flex-col items-center justify-center gap-3 pointer-events-none text-center px-6"
        style={{ opacity: contentOpacity }}
      >
        <p
          className="max-w-xl text-sm md:text-base font-medium leading-relaxed"
          style={{ color: "rgba(255, 255, 255, 0.75)" }}
        >
          High-yield solar power systems engineered for residential autonomy and
          commercial savings. We design, permit, and commission lifetime clean
          energy infrastructure across India.
        </p>
        <span
          className="text-xs font-serif italic tracking-widest opacity-80"
          style={{ color: "#FFE57F" }}
        >
          Scroll to enter the grid
        </span>
      </motion.div>
    </div>
  );
}
