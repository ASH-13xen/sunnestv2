"use client";

import { Fragment, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

// ─── Word data ────────────────────────────────────────────────────────────────
interface Word {
  text: string;
  highlight: boolean;
}

const WORDS: Word[] = [
  { text: "Tomorrow", highlight: false },
  { text: "shouldn't", highlight: false },
  { text: "rely", highlight: false },
  { text: "on", highlight: false },
  { text: "the", highlight: false },
  { text: "infrastructure", highlight: false },
  { text: "of", highlight: false },
  { text: "the", highlight: false },
  { text: "past.", highlight: false },
  { text: "That", highlight: false },
  { text: "is", highlight: false },
  { text: "why", highlight: false },
  { text: "Sunnest", highlight: true },
  { text: "is", highlight: false },
  { text: "building", highlight: false },
  { text: "a", highlight: false },
  { text: "future", highlight: false },
  { text: "where", highlight: false },
  { text: "technology", highlight: false },
  { text: "delivers", highlight: true },
  { text: "more", highlight: false },
  { text: "than", highlight: false },
  { text: "just", highlight: false },
  { text: "electricity.", highlight: false },
  { text: "By", highlight: false },
  { text: "engineering", highlight: false },
  { text: "smart", highlight: true },
  { text: "adaptable", highlight: false },
  { text: "arrays,", highlight: false },
  { text: "we", highlight: false },
  { text: "make", highlight: false },
  { text: "solar", highlight: true },
  { text: "power", highlight: false },
  { text: "accessible", highlight: false },
  { text: "for", highlight: true },
  { text: "absolutely", highlight: false },
  { text: "every", highlight: true },
  { text: "unique", highlight: false },
  { text: "energy", highlight: false },
  { text: "need.", highlight: true },
];

const HL_WORDS = WORDS.filter((w) => w.highlight);
const FULL_TEXT = WORDS.map((w) => w.text).join(" ");

// ─── Component ────────────────────────────────────────────────────────────────

export default function TextHighlighted() {
  const { theme } = useTheme();
  const isNight = theme === "night";

  const pageBg    = isNight ? "#0c0f1a" : "#FBF8F0";
  const goldColor = isNight ? "#60A5FA" : "#D4A017";
  const pageText  = isNight ? "#f2f5ea" : "#0A1628";
  const ghostColor = pageText;

  const boxBorder = isNight ? "rgba(255,255,255,0.09)" : "rgba(10,22,40,0.10)";
  const boxBg     = isNight ? "rgba(255,255,255,0.02)" : "rgba(10,22,40,0.03)";
  const boxShadow = isNight
    ? "0 0 0 1px rgba(96,165,250,0.05), 0 8px 48px rgba(0,0,0,0.45)"
    : "0 8px 48px rgba(10,22,40,0.09)";

  const sectionRef   = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLDivElement>(null);
  const targetRef    = useRef<HTMLDivElement>(null);

  const goldRef     = useRef(goldColor);
  const pageTextRef = useRef(pageText);

  useEffect(() => {
    goldRef.current     = goldColor;
    pageTextRef.current = pageText;
  }, [goldColor, pageText]);

  useEffect(() => {
    const section  = sectionRef.current;
    const paraEl   = paragraphRef.current;
    const targetEl = targetRef.current;
    if (!section || !paraEl || !targetEl) return;

    const allSpans = Array.from(
      paraEl.querySelectorAll<HTMLSpanElement>("[data-word]"),
    );
    const hlSpans  = allSpans.filter((s) => s.dataset.highlight === "true");
    const tgtSpans = Array.from(
      targetEl.querySelectorAll<HTMLSpanElement>("[data-target]"),
    );

    type Delta = { x: number; y: number };
    let deltas: Delta[] = [];

    let isMounted = true;
    let st: { kill(): void } | null = null;
    let resizeHandler: (() => void) | null = null;

    (async () => {
      const { gsap }         = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!isMounted) return;

      const fitHeight = () => {
        const pEl = paraEl.querySelector("p") as HTMLElement | null;
        if (!pEl) return;
        const needed = pEl.offsetHeight + 80;
        section.style.minHeight = `${Math.max(window.innerHeight, needed)}px`;
      };

      const measure = () => {
        gsap.set(hlSpans, { x: 0, y: 0 });
        const sRect = section.getBoundingClientRect();
        const froms = hlSpans.map((s) => {
          const r = s.getBoundingClientRect();
          return { x: r.left - sRect.left, y: r.top - sRect.top };
        });
        const tos = tgtSpans.map((s) => {
          const r = s.getBoundingClientRect();
          return { x: r.left - sRect.left, y: r.top - sRect.top };
        });
        deltas = froms.map((f, i) => ({
          x: tos[i].x - f.x,
          y: tos[i].y - f.y,
        }));
      };

      resizeHandler = () => {
        fitHeight();
        measure();
        ScrollTrigger.refresh();
      };

      setTimeout(() => {
        if (!isMounted) return;
        fitHeight();
        measure();
        ScrollTrigger.refresh();
      }, 200);

      window.addEventListener("resize", resizeHandler);

      allSpans.forEach((s) => {
        s.style.color   = pageTextRef.current;
        s.style.opacity = "1";
      });

      st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${section.offsetHeight * 1.8}`,
        scrub: 1.0,
        pin: true,
        onUpdate(self) {
          const p    = self.progress;
          const gold = goldRef.current;
          const pt   = pageTextRef.current;

          if (p <= 0.42) {
            const t1 = p / 0.42;
            allSpans.forEach((s) => {
              const isHL = s.dataset.highlight === "true";
              if (isHL) {
                s.style.color   = t1 > 0.45 ? gold : pt;
                s.style.opacity = "1";
              } else {
                s.style.opacity = String(Math.max(0, 1 - t1 * 1.4));
              }
            });
            gsap.set(hlSpans, { x: 0, y: 0 });
          } else {
            allSpans.forEach((s) => {
              if (s.dataset.highlight !== "true") {
                s.style.opacity = "0";
              } else {
                s.style.color   = goldRef.current;
                s.style.opacity = "1";
              }
            });

            const t2 = (p - 0.42) / 0.58;
            hlSpans.forEach((s, i) => {
              const d = deltas[i] ?? { x: 0, y: 0 };
              gsap.set(s, { x: d.x * t2, y: d.y * t2 });
            });
          }
        },
      });
    })();

    return () => {
      isMounted = false;
      st?.kill();
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  const sharedParaStyle: React.CSSProperties = {
    maxWidth: "900px",
    fontSize: "clamp(1.6rem, 2.8vw, 3.8rem)",
    fontWeight: 700,
    lineHeight: 1.6,
    textAlign: "center",
    fontFamily: "var(--font-playfair)",
    margin: 0,
  };

  const boxPadding = "clamp(36px, 5vh, 72px) clamp(32px, 6vw, 80px)";

  return (
    <div
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: pageBg,
        overflow: "hidden",
        transition: "background 0.4s ease",
      }}
    >
      {/* ── Ghost box: border frame + always-on ghost text layers ───────────── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(980px, 90vw)",
          padding: boxPadding,
          border: `1px solid ${boxBorder}`,
          borderRadius: "24px",
          background: boxBg,
          boxShadow,
          overflow: "hidden",
          pointerEvents: "none",
          boxSizing: "border-box",
          transition: "border-color 0.4s ease, background 0.4s ease, box-shadow 0.4s ease",
        }}
      >
        {/* Ghost 1 — heavier blur, nudged up-right, scaled up slightly */}
        <p
          aria-hidden="true"
          style={{
            ...sharedParaStyle,
            position: "absolute",
            inset: 0,
            maxWidth: "unset",
            padding: boxPadding,
            boxSizing: "border-box",
            color: ghostColor,
            filter: "blur(9px)",
            opacity: 0.11,
            userSelect: "none",
            transform: "translate(10px, -6px) scale(1.02)",
            transformOrigin: "center center",
            transition: "color 0.4s ease",
          }}
        >
          {FULL_TEXT}
        </p>

        {/* Ghost 2 — lighter blur, nudged down-left, scaled down slightly */}
        <p
          aria-hidden="true"
          style={{
            ...sharedParaStyle,
            position: "absolute",
            inset: 0,
            maxWidth: "unset",
            padding: boxPadding,
            boxSizing: "border-box",
            color: ghostColor,
            filter: "blur(4px)",
            opacity: 0.07,
            userSelect: "none",
            transform: "translate(-6px, 8px) scale(0.985)",
            transformOrigin: "center center",
            transition: "color 0.4s ease",
          }}
        >
          {FULL_TEXT}
        </p>

        {/* Transparent spacer — gives the box its natural height from the text */}
        <p
          aria-hidden="true"
          style={{ ...sharedParaStyle, maxWidth: "unset", color: "transparent", userSelect: "none" }}
        >
          {FULL_TEXT}
        </p>
      </div>

      {/* ── Live paragraph ─────────────────────────────────────────────────────
           Space is a SIBLING text node outside each inline-block span so that
           CSS trailing-whitespace stripping inside inline-blocks does not drop
           the gaps when highlighted words converge in Phase 2.               */}
      <div
        ref={paragraphRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px clamp(24px, 7vw, 120px)",
          boxSizing: "border-box",
        }}
      >
        <p style={{ ...sharedParaStyle, color: pageText, transition: "color 0.4s ease" }}>
          {WORDS.map((w, i) => (
            <Fragment key={i}>
              <span
                data-word={i}
                data-highlight={w.highlight ? "true" : "false"}
                style={{
                  display: "inline-block",
                  position: "relative",
                  zIndex: w.highlight ? 2 : 1,
                }}
              >
                {w.text}
              </span>
              {i < WORDS.length - 1 ? " " : ""}
            </Fragment>
          ))}
        </p>
      </div>

      {/* ── Hidden target line ─────────────────────────────────────────────────
           Space also outside the span here so getBoundingClientRect picks up
           the correct left offset (including the preceding space's width).   */}
      <div
        ref={targetRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px clamp(24px, 7vw, 120px)",
          boxSizing: "border-box",
          visibility: "hidden",
          pointerEvents: "none",
        }}
      >
        <p style={{ ...sharedParaStyle }}>
          {HL_WORDS.map((w, i) => (
            <Fragment key={i}>
              <span data-target={i} style={{ display: "inline-block" }}>
                {w.text}
              </span>
              {i < HL_WORDS.length - 1 ? " " : ""}
            </Fragment>
          ))}
        </p>
      </div>
    </div>
  );
}
