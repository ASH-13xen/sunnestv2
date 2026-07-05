"use client";

import { useTheme } from "@/context/ThemeContext";
import { ArrowRight } from "lucide-react";

export default function ConsultationStrip() {
  const { theme } = useTheme();
  const isNight = theme === "night";

  const goldColor = isNight ? "#60A5FA" : "#D4A017";
  const goldBg = isNight ? "#0c0f1a" : "#0A1628";

  const MarqueeItem = () => (
    <div style={{ display: "flex", alignItems: "center", gap: "32px", flexShrink: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px" }}>
        <span
          style={{
            display: "block",
            fontSize: "0.62rem",
            fontWeight: 700,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: `${goldColor}99`,
          }}
        >
          Free, No-Obligation
        </span>
        <h2
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
            fontWeight: 900,
            color: "#ffffff",
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            fontFamily: "var(--font-sans)",
          }}
        >
          Book Your First Consultation
        </h2>
        <p
          style={{
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.55)",
            margin: 0,
            maxWidth: "480px",
            lineHeight: 1.5,
            whiteSpace: "normal",
          }}
        >
          Talk to a solar expert, get a free site assessment, and see exactly
          how much you could save.
        </p>
      </div>

      <a
        href="#book"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 24px",
          borderRadius: "999px",
          background: goldColor,
          color: goldBg,
          fontSize: "0.82rem",
          fontWeight: 800,
          textDecoration: "none",
          whiteSpace: "nowrap",
          transition: "opacity 0.2s ease",
          boxShadow: `0 8px 24px -6px ${goldColor}55`,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Schedule Free Consultation <ArrowRight size={14} />
      </a>
    </div>
  );

  const StarDivider = () => (
    <span
      style={{
        color: goldColor,
        fontSize: "1.8rem",
        opacity: 0.8,
        userSelect: "none",
        margin: "0 20px",
      }}
    >
      ✦
    </span>
  );

  return (
    <section
      className="mesh-gradient-glow"
      style={{
        width: "100%",
        position: "relative",
        padding: "clamp(32px, 5vh, 48px) 0",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .mesh-gradient-glow {
          background: linear-gradient(270deg, #0A1628, #111B2C, #0E223D, #0A1628);
          background-size: 300% 300%;
          animation: gradientShift 16s ease infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-container {
          display: flex;
          overflow: hidden;
          width: 100%;
          user-select: none;
          mask-image: linear-gradient(to right, transparent, white 10%, white 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, white 10%, white 90%, transparent);
          position: relative;
          z-index: 1;
        }
        .marquee-content {
          display: flex;
          gap: 60px;
          animation: marquee 35s linear infinite;
          white-space: nowrap;
          align-items: center;
        }
        .marquee-content:hover {
          animation-play-state: paused;
        }
      `,
        }}
      />

      {/* Grid Pattern Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.045) 1px, transparent 0)",
          backgroundSize: "24px 24px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div className="marquee-container">
        <div className="marquee-content">
          <MarqueeItem />
          <StarDivider />
          <MarqueeItem />
          <StarDivider />
          <MarqueeItem />
          <StarDivider />

          {/* Duplicated for infinite scrolling */}
          <MarqueeItem />
          <StarDivider />
          <MarqueeItem />
          <StarDivider />
          <MarqueeItem />
          <StarDivider />
        </div>
      </div>
    </section>
  );
}
