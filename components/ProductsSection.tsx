"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import {
  SunMedium,
  Sun,
  Zap,
  BatteryCharging,
  Cable,
  ShieldCheck,
  Package,
  PackageCheck,
  type LucideIcon,
} from "lucide-react";

interface Product {
  title: string;
  category: string;
  tags: string[];
  icon: LucideIcon;
  description: string;
  spec: string;
  imageUrl: string;
}

const PRODUCTS: Product[] = [
  {
    title: "Bifacial Monoperc Modules",
    category: "Module",
    tags: ["Up to 585 Wp", "+30% Bifacial Gain"],
    icon: SunMedium,
    description: "Capture dual-sided solar energy with high-yield bifacial passivated emitter rear cell technology.",
    spec: "Efficiency: 21.8%",
    imageUrl: "/images/products/bifacial.png"
  },
  {
    title: "TOPCon Modules",
    category: "Module",
    tags: ["Up to 610 Wp", "22%+ Efficiency"],
    icon: Sun,
    description: "Tunnel Oxide Passivated Contact cells engineered for extreme durability and top power generation.",
    spec: "Efficiency: 22.6%",
    imageUrl: "/images/products/topcon.png"
  },
  {
    title: "On-Grid Inverters",
    category: "Inverter",
    tags: ["3 – 100 kW", "Grid-Tied"],
    icon: Zap,
    description: "High-efficiency grid-tied solar conversion featuring multi-MPPT tracking and smart cloud monitoring.",
    spec: "Max Yield: 98.8%",
    imageUrl: "/images/products/ongrid.png"
  },
  {
    title: "Hybrid Inverters",
    category: "Inverter",
    tags: ["Battery Ready", "Backup Power"],
    icon: BatteryCharging,
    description: "Intelligent battery-ready energy management providing instant fallback backup power and zero export.",
    spec: "Transfer Time: <10ms",
    imageUrl: "/images/products/hybrid.png"
  },
  {
    title: "ACDB + DCDB",
    category: "BOS",
    tags: ["Surge Protected", "IP65 Rated"],
    icon: Cable,
    description: "Robust protective enclosures with integrated surge protection and DC/AC circuit isolation.",
    spec: "Rating: IP65 Outdoor",
    imageUrl: "/images/products/acdb.png"
  },
  {
    title: "Earthing Set",
    category: "BOS",
    tags: ["IS 3043 Compliant", "Chemical Earthing"],
    icon: ShieldCheck,
    description: "Low-impedance chemical grounding systems providing ultimate protection against surges and lighting.",
    spec: "Ground Resistance: <2Ω",
    imageUrl: "/images/products/earthing.png"
  },
  {
    title: "Mini Kit",
    category: "Kit",
    tags: ["Modules + Inverter", "ACDB + DCDB + Earthing"],
    icon: Package,
    description: "Complete, balanced residential solar packages configured for rapid installation and immediate savings.",
    spec: "Output: 3kW – 5kW",
    imageUrl: "/images/products/mini_kit.png"
  },
  {
    title: "Full Kit",
    category: "Kit",
    tags: ["Turnkey Installation", "All Components Included"],
    icon: PackageCheck,
    description: "Industrial turnkey solar systems including structure engineering, high-voltage cabling, and tools.",
    spec: "Output: 10kW – 100kW+",
    imageUrl: "/images/products/full_kit.png"
  },
];

const HEADING_WORDS = "Every Component. One Trusted Source.".split(" ");
const PARA_WORDS =
  "From high-efficiency modules to fully packaged installation kits, we supply and support every part of your solar plant under one roof."
    .split(" ");

// Card explosion vector, computed from its position in the grid so the
// spread scales with column count instead of assuming a fixed layout.
function explosionVector(index: number, numCols: number) {
  const col = index % numCols;
  const row = Math.floor(index / numCols);
  const centerCol = (numCols - 1) / 2;
  const colOffset = col - centerCol; // negative = left of center, positive = right
  const x = colOffset * (520 / numCols);
  const y = row === 0 ? -220 - Math.abs(colOffset) * 30 : 220 + Math.abs(colOffset) * 30;
  const rotate = colOffset * 12 * (row === 0 ? -1 : 1);
  return { x, y, rotate };
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
  const iconBg = isNight
    ? "linear-gradient(135deg, rgba(96,165,250,0.22), rgba(96,165,250,0.05))"
    : "linear-gradient(135deg, rgba(212,160,23,0.22), rgba(212,160,23,0.05))";
  const badgeBg = isNight ? "rgba(96,165,250,0.12)" : "rgba(212,160,23,0.12)";
  const tagBg = isNight ? "rgba(255,255,255,0.05)" : "rgba(10,22,40,0.04)";
  const tagBorder = isNight ? "rgba(255,255,255,0.08)" : "rgba(10,22,40,0.07)";

  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const headingWordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const paraWordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const kickerRef = useRef<HTMLSpanElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let isMounted = true;
    let st: { kill(): void } | null = null;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!isMounted) return;

      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      const headingWords = headingWordRefs.current.filter(Boolean) as HTMLSpanElement[];
      const paraWords = paraWordRefs.current.filter(Boolean) as HTMLSpanElement[];
      const kicker = kickerRef.current;

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
          const numCols = window.innerWidth < 640 ? 2 : 4;

          // Phase 1 (0 -> 0.3): cards + heading settle, fully visible, no motion.
          // Phase 2 (0.3 -> 1): cards fly outward, heading fades, reveal text appears.
          const t = Math.max(0, Math.min(1, (p - 0.3) / 0.7));
          const ease = smoothstep(t);

          // Disable pointer events on the grid during scroll explosion so user scrolling/gestures aren't blocked
          if (gridContainerRef.current) {
            gridContainerRef.current.style.pointerEvents = p > 0.15 ? "none" : "auto";
          }

          cards.forEach((card, i) => {
            const v = explosionVector(i, numCols);
            gsap.set(card, {
              x: v.x * ease,
              y: v.y * ease,
              rotate: v.rotate * ease,
              opacity: 1 - ease,
              scale: 1 - ease * 0.15,
            });
          });

          if (kicker) kicker.style.opacity = String(Math.min(1, ease * 2.2));

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
        },
      });
    })();

    return () => {
      isMounted = false;
      st?.kill();
    };
  }, []);

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
          Panels, inverters, balance-of-system, and ready-to-install kits — sourced,
          tested, and warrantied end to end.
        </p>
      </div>

      {/* Pinned section container */}
      <div
        ref={sectionRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
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
                <span key={i} style={{ display: "inline-block" }}>
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
                  {" "}
                </span>
              );
            })}
          </h2>

          <div
            style={{
              width: "64px",
              height: "1px",
              background: goldSoft,
              opacity: 0.5,
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
              <span key={i} style={{ display: "inline-block" }}>
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
                {" "}
              </span>
            ))}
          </p>
        </div>

        {/* Foreground cards layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 clamp(16px, 4vw, 60px)",
            boxSizing: "border-box",
          }}
        >

      {/* Custom Styles for Glowing Glassmorphic Hover Effects & Responsiveness */}
      <style>{`
        .product-card-inner {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.3s ease,
                      box-shadow 0.3s ease,
                      background 0.3s ease;
          min-height: 245px;
        }
        .product-card-inner:hover {
          transform: translateY(-5px) scale(1.025);
          border-color: ${goldColor} !important;
          box-shadow: ${isNight ? "0 12px 30px rgba(96, 165, 250, 0.14), 0 0 1px rgba(96, 165, 250, 0.3)" : "0 12px 30px rgba(212, 160, 23, 0.1), 0 0 1px rgba(212, 160, 23, 0.3)"} !important;
        }
        .product-card-inner:hover .product-card-img {
          transform: scale(1.06);
        }
        
        @media (max-width: 640px) {
          .product-card-inner {
            min-height: 135px !important;
            padding: 10px !important;
            gap: 6px !important;
            border-radius: 12px !important;
          }
          .product-card-img-container {
            height: 55px !important;
            margin-bottom: 2px !important;
            border-radius: 8px !important;
          }
          .product-card-desc {
            display: none !important;
          }
        }
      `}</style>

      {/* Cards grid */}
      <div
        ref={gridContainerRef}
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "auto",
        }}
      >
        <div
          className="grid grid-cols-2 sm:grid-cols-4"
          style={{
            gap: "clamp(12px, 1.6vw, 22px)",
            width: "100%",
            maxWidth: "1220px",
            pointerEvents: "auto",
          }}
        >
          {PRODUCTS.map((product, i) => {
            const Icon = product.icon;
            return (
              <div
                key={product.title}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                style={{
                  position: "relative",
                  willChange: "transform, opacity",
                  pointerEvents: "auto",
                }}
              >
                <div
                  className="product-card-inner group relative flex flex-col items-start w-full rounded-[20px] cursor-pointer overflow-hidden"
                  style={{
                    background: cardBg,
                    border: `1px solid ${cardBorder}`,
                    boxShadow: cardShadow,
                    padding: "16px 14px 14px",
                    gap: "8px",
                  }}
                >
                  {/* Subtle top light reflection bar */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "3px",
                      background: `linear-gradient(90deg, ${goldSoft}, transparent)`,
                    }}
                  />

                  {/* Number Row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: pageText45,
                        fontVariantNumeric: "tabular-nums",
                        letterSpacing: "0.05em",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* 3D Product Image Showcase Container */}
                  <div
                    className="product-card-img-container"
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "105px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      background: isNight ? "rgba(0,0,0,0.2)" : "rgba(10,22,40,0.03)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      className="product-card-img"
                      src={product.imageUrl}
                      alt={product.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                  </div>

                  {/* Title */}
                  <span
                    style={{
                      fontSize: "clamp(0.85rem, 1.1vw, 0.98rem)",
                      fontWeight: 700,
                      color: pageText,
                      lineHeight: 1.25,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {product.title}
                  </span>

                  {/* Description (visible on desktop) */}
                  <p
                    className="product-card-desc"
                    style={{
                      fontSize: "0.72rem",
                      lineHeight: 1.45,
                      color: pageText70,
                      margin: "0",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {product.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}
