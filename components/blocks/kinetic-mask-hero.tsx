"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { onSiteReady } from "@/components/ui/LoadingScreen";

// ─── Kinetic Mask Config Variables ──────────────────────────────────────────
// You can adjust these variables directly to fine-tune the zoom animation:
const MAX_ZOOM_SCALE = 100; // Max zoom size for letters (e.g. 85, 550, 1500)
const SCROLL_SENSITIVITY = 0.004; // Sensitivity of manual scroll (e.g. 0.0006, 0.0012)
const ZOOM_EASING_POWER = 4; // Easing power curve (higher = starts slower, speeds up at the end)

// --- Scroll Cushion/Hold Configuration (desktop wheel only) ---
const SCROLL_HOLD_BUFFER = 0.5; // Extra manual scroll depth (0.0 to 1.0+) the user must scroll through while the video stays fully zoomed before unlocking the page (e.g. 0.35, 0.5)

// --- Touch devices: the zoom plays once on its own, the page is never locked ---
const AUTO_ZOOM_DELAY = 1100; // ms the SUNNEST POWER title is held after the splash screen before zooming
const AUTO_ZOOM_DURATION = 2.2; // seconds for the automatic zoom

// Video starts playing once the zoom is this far through (before that it only
// shows through the letters, where a still frame looks the same).
const VIDEO_PLAY_AT = 0.85;

// Canvas resolution cap — full devicePixelRatio (3x on iPhones) means copying
// ~9x the pixels every frame for no visible gain on moving footage.
const MAX_CANVAS_DPR = 1.5;

// --- Hero Background Tint Configuration (Control overlay opacity and colors here) ---
const NIGHT_OVERLAY_COLOR = "#0A1628";
const NIGHT_OVERLAY_OPACITY = 0.90; // Opacity overlay for dark mode

const DAY_OVERLAY_COLOR = "#0A1628"; // Opacity overlay color for light mode (dark tint)
const DAY_OVERLAY_OPACITY = 0.65;    // Opacity overlay for light mode (slightly lesser dark tint)
// ──────────────────────────────────────────────────────────────────────────

interface KineticMaskHeroProps {
  /** Full-quality video for desktop. */
  mediaSrc: string;
  /** Lighter video for phones and tablets. Falls back to `mediaSrc`. */
  mobileMediaSrc?: string;
  /** Still frame drawn into the canvas until the video has data. */
  posterSrc?: string;
  bgImageSrc: string;
  onProgressChange?: (progress: number) => void;
}

// Phones and tablets. They get the self-playing zoom instead of the
// wheel-driven one, so a touch never has to be intercepted.
function isTouchDevice() {
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

export default function KineticMaskHero({
  mediaSrc,
  mobileMediaSrc,
  posterSrc,
  bgImageSrc,
  onProgressChange,
}: KineticMaskHeroProps) {
  const { theme } = useTheme();
  const isNight = theme === "night";

  const pageBg = isNight ? "#0A1628" : "#FBF8F0";

  const imageFilter = isNight ? "url(#aerial-filter)" : "none";
  const overlayColor = isNight ? NIGHT_OVERLAY_COLOR : DAY_OVERLAY_COLOR;
  const overlayOpacity = isNight ? NIGHT_OVERLAY_OPACITY : DAY_OVERLAY_OPACITY;

  const progressVal = useMotionValue(0);
  const [isMobile, setIsMobile] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const onProgressChangeRef = useRef(onProgressChange);

  useEffect(() => {
    onProgressChangeRef.current = onProgressChange;
  }, [onProgressChange]);

  // Text layout switch. Width-only: mobile toolbars change the height on
  // nearly every scroll and must not re-render the whole SVG.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const check = () => setIsMobile(mq.matches);
    check();
    mq.addEventListener("change", check);
    return () => mq.removeEventListener("change", check);
  }, []);

  // Keep the parent's decorative frame in sync (clamped to 1.0).
  useEffect(() => {
    return progressVal.on("change", (latest) => {
      onProgressChangeRef.current?.(Math.min(latest, 1.0));
    });
  }, [progressVal]);

  // ── Video → canvas ────────────────────────────────────────────────────────
  // The video is drawn into a plain HTML canvas that the SVG cover masks.
  // (iOS lifts a <video> inside SVG foreignObject onto its own GPU layer,
  // bypassing the mask; a canvas stays in the normal compositing stack.)
  //
  // Frames are only copied while the video is actually playing AND the hero
  // is on screen. This used to run every animation frame for the lifetime of
  // the page — even paused, even scrolled far away — which kept the main
  // thread busy and made scrolling janky on phones.
  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!root || !video || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    video.defaultMuted = true;
    video.muted = true;
    video.src =
      mobileMediaSrc && (isTouchDevice() || window.innerWidth < 1024)
        ? mobileMediaSrc
        : mediaSrc;

    let poster: HTMLImageElement | null = null;
    let visible = true;
    let rafId = 0;

    const drawCover = (src: CanvasImageSource, w: number, h: number) => {
      if (!w || !h) return;
      const scale = Math.max(canvas.width / w, canvas.height / h);
      const dw = w * scale;
      const dh = h * scale;
      ctx.drawImage(src, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
    };

    const drawFrame = () => {
      if (video.readyState >= 2 && video.videoWidth > 0) {
        drawCover(video, video.videoWidth, video.videoHeight);
      } else if (poster?.complete && poster.naturalWidth > 0) {
        drawCover(poster, poster.naturalWidth, poster.naturalHeight);
      }
    };

    const loop = () => {
      drawFrame();
      rafId = requestAnimationFrame(loop);
    };
    const startLoop = () => {
      if (!rafId && visible && !video.paused) rafId = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      cancelAnimationFrame(rafId);
      rafId = 0;
    };

    if (posterSrc) {
      poster = new Image();
      poster.onload = drawFrame;
      poster.src = posterSrc;
    }

    // Resizing a canvas clears it, so redraw straight away — the old code
    // left it blank until the next frame, which flickered on every resize.
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_CANVAS_DPR);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (w && h && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
        drawFrame();
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Play only when the zoom has opened up and the hero is on screen.
    const syncPlayback = () => {
      const shouldPlay = visible && progressVal.get() > VIDEO_PLAY_AT;
      if (shouldPlay && video.paused) {
        video.play().catch(() => {});
      } else if (!shouldPlay && !video.paused) {
        video.pause();
      }
    };
    const unsubscribe = progressVal.on("change", (latest) => {
      // Zoomed back into the letters (desktop): rewind to the opening shot.
      if (latest <= VIDEO_PLAY_AT && video.currentTime !== 0) {
        video.pause();
        video.currentTime = 0;
      }
      syncPlayback();
    });

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
      if (visible) startLoop();
      else stopLoop();
    });
    io.observe(root);

    video.addEventListener("play", startLoop);
    video.addEventListener("pause", stopLoop);
    video.addEventListener("loadeddata", drawFrame);
    video.addEventListener("seeked", drawFrame);

    // iOS won't decode a first frame for canvas until the video has played
    // once, so prime it with a muted play → pause.
    video
      .play()
      .then(() => {
        if (progressVal.get() <= VIDEO_PLAY_AT) video.pause();
      })
      .catch(() => {});

    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
      unsubscribe();
      video.removeEventListener("play", startLoop);
      video.removeEventListener("pause", stopLoop);
      video.removeEventListener("loadeddata", drawFrame);
      video.removeEventListener("seeked", drawFrame);
    };
  }, [mediaSrc, mobileMediaSrc, posterSrc, progressVal]);

  // ── Zoom triggers ─────────────────────────────────────────────────────────
  useEffect(() => {
    // Users who've asked the OS for reduced motion don't get the zoom at
    // all — jump straight to the final state.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      progressVal.set(1);
      return;
    }

    // Navbar jumps (Navbar dispatches "page-transition"): going anywhere but
    // the hero finishes the intro; the logo / Home rewinds it on desktop.
    let finishIntro = () => {};
    let rewindIntro = () => {};
    const handleNavJump = (e: Event) => {
      const href = (e as CustomEvent<{ href: string }>).detail?.href;
      if (href === "#hero") rewindIntro();
      else finishIntro();
    };
    window.addEventListener("page-transition", handleNavJump);

    // ── Touch devices: play once, never lock the page ──────────────────────
    // The old version intercepted every touchmove on the window (non-passive,
    // never removed) to drive the zoom from swipes. That blocked native
    // scrolling everywhere on the site, and snapped users back into the hero
    // whenever they flicked to the top. Now the zoom plays on its own shortly
    // after the splash screen — or right away if the user starts scrolling
    // first — and only ever plays once.
    if (isTouchDevice()) {
      let started = false;
      let delayTimer: ReturnType<typeof setTimeout> | undefined;
      let controls: ReturnType<typeof animate> | undefined;

      const play = () => {
        if (started) return;
        started = true;
        clearTimeout(delayTimer);
        window.removeEventListener("scroll", play);
        controls = animate(progressVal, 1, {
          duration: AUTO_ZOOM_DURATION,
          ease: [0.45, 0, 0.55, 1],
        });
      };

      finishIntro = () => {
        started = true;
        clearTimeout(delayTimer);
        window.removeEventListener("scroll", play);
        controls?.stop();
        progressVal.set(1);
      };

      const stopReady = onSiteReady(() => {
        delayTimer = setTimeout(play, AUTO_ZOOM_DELAY);
      });
      window.addEventListener("scroll", play, { passive: true });

      return () => {
        stopReady();
        clearTimeout(delayTimer);
        controls?.stop();
        window.removeEventListener("scroll", play);
        window.removeEventListener("page-transition", handleNavJump);
      };
    }

    // ── Desktop: the wheel drives the zoom ─────────────────────────────────
    const maxProgress = 1.0 + SCROLL_HOLD_BUFFER;
    let expanded = false;

    finishIntro = () => {
      expanded = true;
      progressVal.set(maxProgress);
    };
    rewindIntro = () => {
      expanded = false;
      progressVal.set(0);
    };

    const handleWheel = (e: WheelEvent) => {
      if (expanded) {
        // Scrolling up at the very top re-enters the zoom.
        if (e.deltaY < 0 && window.scrollY <= 5) {
          expanded = false;
          e.preventDefault();
          animate(progressVal, 1.0, { duration: 0.1, ease: "linear" });
        }
        return;
      }
      e.preventDefault();
      const next = Math.min(
        Math.max(progressVal.get() + e.deltaY * SCROLL_SENSITIVITY, 0),
        maxProgress,
      );
      animate(progressVal, next, { duration: 0.15, ease: "linear" });
      if (next >= maxProgress) expanded = true;
    };

    const handleScroll = () => {
      if (expanded) return;
      // Wheel input is intercepted above, so a native scroll while the intro
      // is still running comes from the scrollbar, keyboard or Tab focus.
      // Trapping those users on the hero would lock them out of the site, so
      // treat it as "skip the intro".
      progressVal.set(1);
      expanded = true;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("page-transition", handleNavJump);
    };
  }, [progressVal]);

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
      ref={rootRef}
      className="relative w-full h-svh overflow-hidden"
      style={{
        backgroundColor: pageBg,
        transition: "background-color 0.4s ease",
      }}
    >
      {/* Dark backdrop */}
      <div className="absolute inset-0 z-0" style={{ backgroundColor: pageBg, transition: "background-color 0.4s ease" }} />

      {/* Video source — kept nearly-invisible in the HTML tree so iOS decodes
          frames for canvas.drawImage() without the foreignObject GPU-layer bug. */}
      {/* src is picked in the video effect (mobile vs desktop file). */}
      <video
        ref={videoRef}
        preload="auto"
        muted
        loop
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
        aria-hidden="true"
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
        aria-hidden="true"
        className="absolute inset-0 z-[10]"
        style={{ display: "block", width: "100%", height: "100%" }}
      />

      {/* Kinetic SVG overlay */}
      <svg
        aria-hidden="true"
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
