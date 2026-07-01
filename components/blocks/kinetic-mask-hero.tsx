"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

// ─── Kinetic Mask Config Variables ──────────────────────────────────────────
// You can adjust these variables directly to fine-tune the zoom animation:
const MAX_ZOOM_SCALE       = 100;           // Max zoom size for letters (e.g. 85, 550, 1500)
const SCROLL_SENSITIVITY   = 0.004;        // Sensitivity of manual scroll (e.g. 0.0006, 0.0012)
const ZOOM_EASING_POWER    = 4;             // Easing power curve (higher = starts slower, speeds up at the end)
const AUTO_ZOOM_TRIGGER    = false;         // TRUE = zoom completely on a single scroll flick; FALSE = zoom links directly to wheel scroll ticks
const AUTO_ZOOM_DURATION   = 0.95;          // Animation duration in seconds when in single-scroll trigger mode (AUTO_ZOOM_TRIGGER = true)
const REVERSE_DURATION     = 0.85;          // Duration in seconds when zooming out in single-scroll trigger mode (AUTO_ZOOM_TRIGGER = true)

// --- Scroll Cushion/Hold Configuration ---
const SCROLL_HOLD_BUFFER   = 0.50;          // Extra manual scroll depth (0.0 to 1.0+) the user must scroll through while the video stays fully zoomed before unlocking the page (e.g. 0.35, 0.5)
const AUTO_ZOOM_HOLD_DELAY = 600;           // Delay in milliseconds after auto-zoom finishes before scroll is unlocked (e.g. 300, 600)
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
  const progressVal = useMotionValue(0);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
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
    
    if (isActive) {
      if (mediaFullyExpanded) {
        vid.play().catch((err) => {
          console.warn("Video playback was prevented:", err);
        });
      } else {
        // Prime the video on iOS Safari/Chrome to force frame decoding while keeping it paused
        if (vid.paused && vid.currentTime === 0) {
          vid.play()
            .then(() => {
              // Pause immediately after play resolves to capture first frame
              vid.pause();
            })
            .catch((err) => {
              console.warn("Priming video play failed:", err);
            });
        } else {
          vid.pause();
          vid.currentTime = 0;
        }
      }
    } else {
      vid.pause();
    }
  }, [isActive, mediaFullyExpanded]);

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
        const scale = Math.max(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
        const dw = video.videoWidth * scale;
        const dh = video.videoHeight * scale;
        ctx.drawImage(video, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
      }
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafId);
  }, []);
  const autoZoomTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    if ((progressVal as any).on) {
      return (progressVal as any).on("change", handler);
    } else {
      return progressVal.onChange(handler);
    }
  }, [progressVal]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (autoZoomTimeoutRef.current) clearTimeout(autoZoomTimeoutRef.current);
    };
  }, []);

  // Scroll and touch triggers
  useEffect(() => {
    if (!isActive) return;

    const handleWheel = (e: WheelEvent) => {
      if (AUTO_ZOOM_TRIGGER) {
        // --- 1. SINGLE-SCROLL TRIGGER MODE ---
        if (e.deltaY > 0 && !mediaFullyExpanded && targetProgress.current !== 1) {
          e.preventDefault();
          targetProgress.current = 1;
          isAnimating.current = true;
          if (autoZoomTimeoutRef.current) clearTimeout(autoZoomTimeoutRef.current);

          animate(progressVal, 1, {
            duration: AUTO_ZOOM_DURATION,
            ease: [0.16, 1, 0.3, 1], // Ultra-smooth easeOutExpo
            onComplete: () => {
              // Wait an extra cushion delay before unlocking the grid scrolling
              autoZoomTimeoutRef.current = setTimeout(() => {
                setMediaFullyExpanded(true);
                onExpansionChangeRef.current?.(true);
                isAnimating.current = false;
              }, AUTO_ZOOM_HOLD_DELAY);
            }
          });
        }
        else if (e.deltaY < 0 && mediaFullyExpanded && targetProgress.current !== 0 && window.scrollY <= 5) {
          e.preventDefault();
          targetProgress.current = 0;
          isAnimating.current = true;
          setMediaFullyExpanded(false);
          onExpansionChangeRef.current?.(false);
          animate(progressVal, 0, {
            duration: REVERSE_DURATION,
            ease: [0.16, 1, 0.3, 1],
            onComplete: () => {
              isAnimating.current = false;
            }
          });
        }
        else if (isAnimating.current) {
          e.preventDefault();
        }
      } else {
        // --- 2. DIRECT SCROLL-LINKED MODE (WITH SCROLL BUFFER) ---
        const maxProgressLimit = 1.0 + SCROLL_HOLD_BUFFER;

        if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
          setMediaFullyExpanded(false);
          onExpansionChangeRef.current?.(false);
          targetProgress.current = 1.0; // Reset progress back to the visual boundary
          e.preventDefault();
          animate(progressVal, 1.0, { duration: 0.1, ease: "linear" });
        } else if (!mediaFullyExpanded) {
          e.preventDefault();
          const current = progressVal.get();

          // Allow progress to go beyond 1.0 up to maxProgressLimit to create a scroll pause
          const newProgress = Math.min(Math.max(current + e.deltaY * SCROLL_SENSITIVITY, 0), maxProgressLimit);

          // Smoothly animate to the new progress step to avoid wheel tick stutters
          animate(progressVal, newProgress, { duration: 0.15, ease: "linear" });

          // Only unlock bento grid scroll when user has scrolled past the full hold buffer
          if (newProgress >= maxProgressLimit) {
            setMediaFullyExpanded(true);
            onExpansionChangeRef.current?.(true);
            targetProgress.current = maxProgressLimit;
          }
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => setTouchStartY(e.touches[0].clientY);

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;
      const deltaY = touchStartY - e.touches[0].clientY;

      if (AUTO_ZOOM_TRIGGER) {
        // --- 1. SINGLE-SCROLL TRIGGER MODE ---
        if (deltaY > 20 && !mediaFullyExpanded && targetProgress.current !== 1) {
          e.preventDefault();
          targetProgress.current = 1;
          isAnimating.current = true;
          if (autoZoomTimeoutRef.current) clearTimeout(autoZoomTimeoutRef.current);

          animate(progressVal, 1, {
            duration: AUTO_ZOOM_DURATION,
            ease: [0.16, 1, 0.3, 1],
            onComplete: () => {
              autoZoomTimeoutRef.current = setTimeout(() => {
                setMediaFullyExpanded(true);
                onExpansionChangeRef.current?.(true);
                isAnimating.current = false;
              }, AUTO_ZOOM_HOLD_DELAY);
            }
          });
        } else if (deltaY < -20 && mediaFullyExpanded && targetProgress.current !== 0 && window.scrollY <= 5) {
          e.preventDefault();
          targetProgress.current = 0;
          isAnimating.current = true;
          setMediaFullyExpanded(false);
          onExpansionChangeRef.current?.(false);
          animate(progressVal, 0, {
            duration: REVERSE_DURATION,
            ease: [0.16, 1, 0.3, 1],
            onComplete: () => {
              isAnimating.current = false;
            }
          });
        } else if (isAnimating.current) {
          e.preventDefault();
        }
      } else {
        // --- 2. DIRECT SCROLL-LINKED MODE (WITH SCROLL BUFFER) ---
        const maxProgressLimit = 1.0 + SCROLL_HOLD_BUFFER;

        if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
          setMediaFullyExpanded(false);
          onExpansionChangeRef.current?.(false);
          targetProgress.current = 1.0;
          e.preventDefault();
          animate(progressVal, 1.0, { duration: 0.1, ease: "linear" });
        } else if (!mediaFullyExpanded) {
          e.preventDefault();
          const factor = deltaY < 0 ? 0.008 : 0.005;
          const current = progressVal.get();
          const newProgress = Math.min(Math.max(current + deltaY * factor, 0), maxProgressLimit);

          animate(progressVal, newProgress, { duration: 0.15, ease: "linear" });

          if (newProgress >= maxProgressLimit) {
            setMediaFullyExpanded(true);
            onExpansionChangeRef.current?.(true);
            targetProgress.current = maxProgressLimit;
          }
          setTouchStartY(e.touches[0].clientY);
        }
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const navElement = target.closest("nav");
      if (navElement) {
        const isLogoClick = target.closest("span") && (target.textContent?.includes("Sun") || target.textContent?.includes("Nest"));
        if (isLogoClick) {
          setMediaFullyExpanded(false);
          onExpansionChangeRef.current?.(false);
          progressVal.set(0);
          targetProgress.current = 0;
        } else {
          setMediaFullyExpanded(true);
          onExpansionChangeRef.current?.(true);
          progressVal.set(1.0 + SCROLL_HOLD_BUFFER);
          targetProgress.current = 1.0 + SCROLL_HOLD_BUFFER;
        }
      }
    };

    const handleTouchEnd = () => setTouchStartY(0);
    const handleScroll = () => {
      if (!mediaFullyExpanded) window.scrollTo(0, 0);
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
  }, [mediaFullyExpanded, touchStartY, isActive, progressVal]);

  // Map progressVal directly to styling transforms via useTransform
  // Scale is capped at 85x to avoid vector path rasterization lag in browsers
  const scale = useTransform(progressVal, (v) => 1 + Math.pow(Math.min(v, 1.0), ZOOM_EASING_POWER) * MAX_ZOOM_SCALE);
  const bgOpacity = useTransform(progressVal, (v) => 1 - Math.min(v, 1.0));
  const contentOpacity = useTransform(progressVal, (v) => Math.max(0, 1 - Math.min(v, 1.0) * 3));

  // Inverted mask: white = cover opaque (video hidden), black = cover transparent (video visible).
  // White text punches holes in the cover, revealing the canvas below.
  // As progress → 1 the entire cover fades to transparent, video fills the screen.
  const coverMaskBg = useTransform(
    progressVal,
    [0, 0.8, 1.0, 1.0 + SCROLL_HOLD_BUFFER],
    ["rgb(255,255,255)", "rgb(255,255,255)", "rgb(0,0,0)", "rgb(0,0,0)"]
  );

  const transformOrigin = isMobile ? "450px 430px" : "430px 470px";

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#0A1628]">
      {/* Dark backdrop */}
      <div className="absolute inset-0 z-0 bg-[#0A1628]" />

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
          <linearGradient id="gold-stroke-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
          {/* Base dark navy background */}
          <rect width="1000" height="1000" fill="#0A1628" />
          {/* Aerial image (grayscale+dark via SVG filter), fades as zoom progresses */}
          <motion.image
            href={bgImageSrc}
            x="0"
            y="0"
            width="1000"
            height="1000"
            preserveAspectRatio="xMidYMid slice"
            filter="url(#aerial-filter)"
            style={{ opacity: bgOpacity }}
          />
          {/* Luxury blue duotone overlay */}
          <rect width="1000" height="1000" fill="#0A1628" opacity="0.90" />
        </g>

        {/* ── 3D Architectural Shadow (above cover, fades on zoom) ── */}
        <motion.g style={{ transformOrigin, scale, opacity: bgOpacity }}>
          <text
            x="505"
            y={isMobile ? "435" : "475"}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#050C16"
            className="font-sans font-black tracking-tighter opacity-80"
            style={{
              fontSize: isMobile ? "90px" : "125px",
              letterSpacing: isMobile ? "-1px" : "-2px",
            }}
          >
            SUNNEST
          </text>
          <text
            x="512"
            y={isMobile ? "510" : "550"}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#050C16"
            className="font-sans font-bold tracking-[0.35em] opacity-80"
            style={{ fontSize: isMobile ? "45px" : "65px" }}
          >
            POWER
          </text>
        </motion.g>

        {/* ── Liquid Gold Outline (above cover, fades on zoom) ── */}
        <motion.g style={{ transformOrigin, scale, opacity: bgOpacity }}>
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
        </motion.g>
      </svg>

      {/* Scroll hint (fades out as we zoom) */}
      <motion.div
        className="absolute inset-x-0 top-[58%] lg:top-auto lg:bottom-12 z-40 flex flex-col items-center justify-center gap-3 pointer-events-none text-center px-6"
        style={{ opacity: contentOpacity }}
      >
        <p className="max-w-md text-xs md:text-sm font-medium text-white/65 leading-relaxed">
          High-yield solar power systems engineered for residential autonomy and commercial savings. We design, permit, and commission lifetime clean energy infrastructure across India.
        </p>
        <span className="text-xs font-serif italic text-yellow-400 tracking-widest opacity-80">
          Scroll to enter the grid
        </span>
      </motion.div>
    </div>
  );
}
