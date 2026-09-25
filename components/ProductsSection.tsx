"use client";

import { Fragment, useEffect, useRef } from "react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { loadGsap } from "@/lib/gsap";
import {
  Package,
  PackageCheck,
  Check,
  ShieldCheck,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

interface Kit {
  title: string;
  tagline: string;
  icon: LucideIcon;
  output: string;
  description: string;
  includes: string[];
  stats: { label: string; value: string }[];
  imageUrl: string;
}

// PLACEHOLDER SPECS — replace with the real kit sheets before launch.
// Output ranges and the component list come from the previous product grid;
// roof area, generation and warranty figures are typical-market placeholders.
const KITS: Kit[] = [
  {
    title: "Mini Kit",
    tagline: "Homes & small shops",
    icon: Package,
    output: "3 kW – 5 kW",
    description:
      "A complete, balanced rooftop package for homes and small businesses. Every part is pre-matched, so installation is quick and your bill starts dropping from the first sunny day.",
    includes: [
      "Bifacial Mono PERC modules",
      "On-grid or hybrid inverter",
      "ACDB + DCDB with surge protection",
      "Earthing set & lightning arrester",
      "Solar DC/AC cables & MC4 connectors",
      "Net-metering & subsidy paperwork",
    ],
    stats: [
      { label: "Roof area", value: "300–500 sq ft" },
      { label: "Generation", value: "12–20 units/day" },
      { label: "Warranty", value: "25 yr modules" },
    ],
    imageUrl: "/images/products/mini_kit.png",
  },
  {
    title: "Full Kit",
    tagline: "Businesses, schools & factories",
    icon: PackageCheck,
    output: "10 kW – 100 kW+",
    description:
      "A turnkey plant for commercial, institutional and industrial rooftops, covering structure engineering, high-voltage cabling and commissioning. One order, one team, one warranty.",
    includes: [
      "TOPCon / bifacial high-yield modules",
      "Three-phase on-grid or hybrid inverters",
      "Hot-dip galvanised mounting structure",
      "ACDB + DCDB, earthing & lightning arrester",
      "Remote monitoring & performance reports",
      "Installation, commissioning & AMC",
    ],
    stats: [
      { label: "Roof area", value: "1,000–10,000+ sq ft" },
      { label: "Generation", value: "40–400+ units/day" },
      { label: "Warranty", value: "25 yr modules" },
    ],
    imageUrl: "/images/products/full_kit.png",
  },
];

const RESELLER_LINE = "Authorized Seller for Reliance Energy";

const HEADING_WORDS = "Every Component. One Trusted Source.".split(" ");
const PARA_WORDS =
  "From high-efficiency modules to fully packaged installation kits, we supply and support every part of your solar plant under one roof."
    .split(" ");

// Side-by-side cards from this width up; stacked below it.
const SIDE_BY_SIDE_QUERY = "(min-width: 768px)";

// Where each card flies to as the section scrolls. Side by side, the left card
// leaves to the left and the right card to the right; stacked, the top card
// leaves upward and the bottom one downward. Same curve either way.
function exitVector(index: number, sideBySide: boolean) {
  const dir = index === 0 ? -1 : 1;
  if (sideBySide) {
    return {
      x: dir * Math.min(window.innerWidth * 0.42, 620),
      y: -40,
      rotate: dir * 10,
    };
  }
  return {
    x: 0,
    y: dir * window.innerHeight * 0.42,
    rotate: -dir * 4,
  };
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

export default function ProductsSection() {
  const { theme } = useTheme();
  const isNight = theme === "night";

  const pageBg = isNight ? "#0A1628" : "#FBF8F0";
  const pageText = isNight ? "#f2f5ea" : "#0A1628";
  const pageText70 = isNight ? "rgba(242,245,234,0.7)" : "rgba(10,22,40,0.68)";
  const pageText45 = isNight ? "rgba(242,245,234,0.62)" : "rgba(10,22,40,0.48)";
  const goldColor = isNight ? "#60A5FA" : "#D4A017";
  const goldSoft = isNight ? "rgba(96,165,250,0.85)" : "rgba(212,160,23,0.9)";
  const cardBg = isNight
    ? "linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))"
    : "linear-gradient(160deg, #FFFFFF, #FBF8F0)";
  const cardBorder = isNight ? "rgba(255,255,255,0.09)" : "rgba(10,22,40,0.09)";
  const cardShadow = isNight
    ? "0 10px 34px rgba(0,0,0,0.4)"
    : "0 10px 34px rgba(10,22,40,0.1)";
  const badgeBg = isNight ? "rgba(96,165,250,0.12)" : "rgba(212,160,23,0.12)";
  const tagBg = isNight ? "rgba(255,255,255,0.05)" : "rgba(10,22,40,0.04)";
  const tagBorder = isNight ? "rgba(255,255,255,0.08)" : "rgba(10,22,40,0.07)";

  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const headingWordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const paraWordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const kickerRef = useRef<HTMLSpanElement>(null);
  const resellerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let isMounted = true;
    let st: { kill(): void } | null = null;
    const sideBySideMq = window.matchMedia(SIDE_BY_SIDE_QUERY);

    (async () => {
      const { gsap, ScrollTrigger } = await loadGsap();
      if (!isMounted) return;

      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      const headingWords = headingWordRefs.current.filter(Boolean) as HTMLSpanElement[];
      const paraWords = paraWordRefs.current.filter(Boolean) as HTMLSpanElement[];
      const kicker = kickerRef.current;
      const reseller = resellerRef.current;
      const divider = dividerRef.current;

      st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * 1.4}`,
        scrub: 0.4,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const p = self.progress;
          const sideBySide = sideBySideMq.matches;

          // Phase 1 (0 -> 0.3): cards + heading settle, fully visible, no motion.
          // Phase 2 (0.3 -> 1): cards fly outward, reveal text appears.
          const t = Math.max(0, Math.min(1, (p - 0.3) / 0.7));
          const ease = smoothstep(t);

          // Cards stop taking clicks once they start leaving, so they never
          // swallow a tap meant for the text underneath.
          if (gridContainerRef.current) {
            gridContainerRef.current.style.pointerEvents = p > 0.15 ? "none" : "auto";
          }

          cards.forEach((card, i) => {
            const v = exitVector(i, sideBySide);
            gsap.set(card, {
              x: v.x * ease,
              y: v.y * ease,
              rotate: v.rotate * ease,
              opacity: 1 - ease,
              scale: 1 - ease * 0.15,
            });
          });

          if (kicker) kicker.style.opacity = String(Math.min(1, ease * 2.2));
          // Hidden until the cards move — it otherwise peeks through the gap
          // between the two side-by-side cards.
          if (divider) divider.style.opacity = String(Math.min(1, ease * 2.2) * 0.5);

          // Word-reveal timing: each word's [start, start+duration] window is
          // scaled so the LAST word always finishes exactly at ease === 1 —
          // otherwise trailing words never fully resolve and stay visibly
          // half-transformed (the "curved/distorted" tail text).
          const headingDuration = 0.25;
          const headingLastStart = 1 - headingDuration;
          headingWords.forEach((w, i) => {
            const start =
              headingWords.length > 1
                ? (i / (headingWords.length - 1)) * headingLastStart
                : 0;
            const local = Math.max(0, Math.min(1, (ease - start) / headingDuration));
            w.style.opacity = String(local);
            w.style.transform = `translateY(${(1 - local) * 100}%)`;
          });

          const paraBaseStart = 0.35;
          const paraDuration = 0.25;
          const paraLastStart = 1 - paraDuration;
          paraWords.forEach((w, i) => {
            const start =
              paraWords.length > 1
                ? paraBaseStart + (i / (paraWords.length - 1)) * (paraLastStart - paraBaseStart)
                : paraBaseStart;
            const local = Math.max(0, Math.min(1, (ease - start) / paraDuration));
            w.style.opacity = String(local);
            w.style.transform = `translateY(${(1 - local) * 60}%)`;
          });

          // Reseller badge lands last, once the paragraph is mostly in.
          if (reseller) {
            const local = Math.max(0, Math.min(1, (ease - 0.75) / 0.25));
            reseller.style.opacity = String(local);
            reseller.style.transform = `translateY(${(1 - local) * 12}px)`;
          }
        },
      });
    })();

    return () => {
      isMounted = false;
      st?.kill();
    };
  }, []);

  const goToContact = () => {
    window.dispatchEvent(
      new CustomEvent("page-transition", { detail: { href: "#contact" } }),
    );
  };

  return (
    <div
      id="products"
      style={{
        position: "relative",
        width: "100%",
        background: pageBg,
        transition: "background 0.4s ease",
      }}
    >
      {/* Intro heading — visible while cards sit still, scrolls up naturally */}
      <div
        style={{
          textAlign: "center",
          padding: "clamp(60px, 8vh, 100px) clamp(16px, 4vw, 60px) clamp(24px, 4vh, 40px)",
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: goldColor,
            marginBottom: "14px",
          }}
        >
          01 // OUR PRODUCTS
        </span>
        <h2
          style={{
            fontSize: "clamp(3.5rem, 7vw, 6rem)",
            fontWeight: 900,
            textTransform: "uppercase",
            lineHeight: 0.85,
            color: pageText,
            margin: "0 0 20px",
          }}
        >
          Everything Your <span style={{ color: goldColor }}>Solar Plant</span> Needs
        </h2>
        <p
          style={{
            fontSize: "0.9rem",
            lineHeight: 1.6,
            color: pageText45,
            maxWidth: "560px",
            margin: "0 auto",
          }}
        >
          Two ready-to-install solar kits. Every panel, inverter and protection
          component is sourced, tested and warrantied end to end.
        </p>
      </div>

      {/* Pinned section container. svh, not vh: on mobile 100vh is taller
          than the visible screen, which pushed the bottom card under the
          browser toolbar. */}
      <div
        ref={sectionRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100svh",
          overflow: "hidden",
        }}
      >
        {/* Text layer — sits behind the cards, revealed as they fly outward */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 clamp(20px, 8vw, 120px)",
          }}
        >
          <span
            ref={kickerRef}
            style={{
              display: "block",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontFamily: "var(--font-plus-jakarta)",
              color: goldSoft,
              marginBottom: "20px",
              opacity: 0,
              transition: "color 0.4s ease",
            }}
          >
            Complete Solar Ecosystem
          </span>

          <h2
            style={{
              fontSize: "clamp(2.4rem, 6vw, 5rem)",
              fontWeight: 600,
              lineHeight: 1.12,
              color: pageText,
              margin: "0 0 26px",
              maxWidth: "980px",
              fontFamily: "var(--font-playfair)",
              transition: "color 0.4s ease",
            }}
          >
            {HEADING_WORDS.map((word, i) => {
              const isAccent = word === "One";
              return (
                <Fragment key={i}>
                  <span
                    style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
                  >
                    <span
                      ref={(el) => {
                        headingWordRefs.current[i] = el;
                      }}
                      style={{
                        display: "inline-block",
                        opacity: 0,
                        transform: "translateY(100%)",
                        willChange: "transform, opacity",
                        fontStyle: isAccent ? "italic" : "normal",
                        color: isAccent ? goldSoft : "inherit",
                      }}
                    >
                      {word}
                    </span>
                  </span>
                  {" "}
                </Fragment>
              );
            })}
          </h2>

          <div
            ref={dividerRef}
            style={{
              width: "64px",
              height: "1px",
              background: goldSoft,
              opacity: 0,
              marginBottom: "24px",
            }}
          />

          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: pageText70,
              maxWidth: "600px",
              margin: 0,
              fontFamily: "var(--font-plus-jakarta)",
              fontWeight: 400,
              letterSpacing: "0.01em",
              transition: "color 0.4s ease",
            }}
          >
            {PARA_WORDS.map((word, i) => (
              <Fragment key={i}>
                <span
                  style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
                >
                  <span
                    ref={(el) => {
                      paraWordRefs.current[i] = el;
                    }}
                    style={{
                      display: "inline-block",
                      opacity: 0,
                      transform: "translateY(60%)",
                      willChange: "transform, opacity",
                    }}
                  >
                    {word}
                  </span>
                </span>
                {" "}
              </Fragment>
            ))}
          </p>

          {/* Reliance reseller badge */}
          <div
            ref={resellerRef}
            style={{
              marginTop: "28px",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 18px",
              borderRadius: "999px",
              background: badgeBg,
              border: `1px solid ${goldSoft}`,
              color: pageText,
              fontSize: "clamp(0.72rem, 1.6vw, 0.85rem)",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              opacity: 0,
              transition: "color 0.4s ease, background 0.4s ease",
            }}
          >
            <ShieldCheck style={{ width: 18, height: 18, color: goldColor, flexShrink: 0 }} />
            {RESELLER_LINE}
          </div>
        </div>

        {/* Foreground cards layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // Top padding clears the fixed navbar.
            padding: "clamp(64px, 9svh, 88px) clamp(14px, 4vw, 60px) clamp(14px, 3svh, 32px)",
            boxSizing: "border-box",
          }}
        >
          <style>{`
            .kit-card {
              transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                          border-color 0.3s ease,
                          box-shadow 0.3s ease;
            }
            @media (hover: hover) {
              .kit-card:hover {
                transform: translateY(-5px);
                border-color: ${goldColor} !important;
                box-shadow: ${isNight ? "0 14px 34px rgba(96, 165, 250, 0.14)" : "0 14px 34px rgba(212, 160, 23, 0.12)"} !important;
              }
              .kit-card:hover .kit-card-img { transform: scale(1.05); }
            }
            .kit-card-img { transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }

            /* Image band: shorter on short screens so both cards always fit. */
            .kit-card-media { height: clamp(88px, 22svh, 240px); }

            /* Stacked (phones): keep each card to roughly half the screen. */
            @media (max-width: 767px) {
              .kit-card-media { height: clamp(72px, 13svh, 130px); }
              .kit-card-body { padding: 14px 16px 16px !important; gap: 8px !important; }
              .kit-card-desc {
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
              }
              .kit-card-includes, .kit-card-stats { display: none !important; }
            }
            @media (max-width: 767px) and (max-height: 700px) {
              .kit-card-desc { -webkit-line-clamp: 2; }
            }
            /* Short laptop screens: drop the stats row before anything overflows. */
            @media (min-width: 768px) and (max-height: 760px) {
              .kit-card-stats { display: none !important; }
            }
          `}</style>

          <div
            ref={gridContainerRef}
            className="grid grid-cols-1 md:grid-cols-2"
            style={{
              gap: "clamp(12px, 2vw, 28px)",
              width: "100%",
              maxWidth: "1220px",
              maxHeight: "100%",
            }}
          >
            {KITS.map((kit, i) => {
              const Icon = kit.icon;
              return (
                <div
                  key={kit.title}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  style={{ position: "relative", willChange: "transform, opacity", minHeight: 0 }}
                >
                  <div
                    className="kit-card relative flex flex-col w-full h-full overflow-hidden rounded-[22px]"
                    style={{
                      background: cardBg,
                      border: `1px solid ${cardBorder}`,
                      boxShadow: cardShadow,
                    }}
                  >
                    {/* Top accent bar */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        zIndex: 2,
                        background: `linear-gradient(90deg, ${goldSoft}, transparent)`,
                      }}
                    />

                    {/* Image band */}
                    <div
                      className="kit-card-media relative w-full overflow-hidden shrink-0"
                      style={{ background: isNight ? "rgba(0,0,0,0.2)" : "rgba(10,22,40,0.03)" }}
                    >
                      <Image
                        src={kit.imageUrl}
                        alt={`${kit.title} solar kit`}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="kit-card-img object-cover"
                        style={{ objectPosition: "center 40%" }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background: isNight
                            ? "linear-gradient(to top, rgba(10,22,40,0.85), transparent 60%)"
                            : "linear-gradient(to top, rgba(10,22,40,0.45), transparent 60%)",
                        }}
                      />
                      <span
                        className="absolute left-4 bottom-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] px-2.5 py-1 rounded-full"
                        style={{ background: "rgba(10,22,40,0.7)", color: "#fff" }}
                      >
                        {String(i + 1).padStart(2, "0")} · {kit.tagline}
                      </span>
                    </div>

                    {/* Body */}
                    <div
                      className="kit-card-body flex flex-col flex-1 min-h-0"
                      style={{ padding: "clamp(16px, 2svh, 24px) clamp(16px, 2vw, 26px)", gap: "12px" }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: badgeBg }}
                          >
                            <Icon style={{ width: 18, height: 18, color: goldColor }} />
                          </span>
                          <h3
                            style={{
                              fontSize: "clamp(1.25rem, 2.2vw, 1.9rem)",
                              fontWeight: 900,
                              textTransform: "uppercase",
                              letterSpacing: "-0.01em",
                              lineHeight: 1,
                              color: pageText,
                              margin: 0,
                            }}
                          >
                            {kit.title}
                          </h3>
                        </div>
                        <span
                          className="shrink-0 font-bold rounded-full"
                          style={{
                            fontSize: "0.75rem",
                            padding: "5px 12px",
                            background: badgeBg,
                            color: goldColor,
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {kit.output}
                        </span>
                      </div>

                      <p
                        className="kit-card-desc"
                        style={{
                          fontSize: "clamp(0.8rem, 1vw, 0.9rem)",
                          lineHeight: 1.55,
                          color: pageText70,
                          margin: 0,
                        }}
                      >
                        {kit.description}
                      </p>

                      <ul
                        className="kit-card-includes grid grid-cols-1 lg:grid-cols-2"
                        style={{ gap: "7px 16px", margin: 0, padding: 0, listStyle: "none" }}
                      >
                        {kit.includes.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span
                              className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-[2px]"
                              style={{ background: badgeBg }}
                            >
                              <Check style={{ width: 10, height: 10, color: goldColor }} />
                            </span>
                            <span style={{ fontSize: "0.78rem", lineHeight: 1.4, color: pageText70 }}>
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="kit-card-stats grid grid-cols-3" style={{ gap: "8px" }}>
                        {kit.stats.map((s) => (
                          <div
                            key={s.label}
                            className="rounded-xl"
                            style={{ background: tagBg, border: `1px solid ${tagBorder}`, padding: "8px 10px" }}
                          >
                            <div
                              style={{
                                fontSize: "0.6rem",
                                fontWeight: 700,
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                                color: pageText45,
                              }}
                            >
                              {s.label}
                            </div>
                            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: pageText, marginTop: 2 }}>
                              {s.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={goToContact}
                        className="mt-auto self-start inline-flex items-center gap-1.5 font-bold uppercase cursor-pointer hover:opacity-75 transition-opacity"
                        style={{ fontSize: "0.72rem", letterSpacing: "0.18em", color: goldColor }}
                      >
                        Get a quote <ArrowRight style={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
