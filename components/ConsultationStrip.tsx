"use client";

import { useTheme } from "@/context/ThemeContext";
import { ArrowRight } from "lucide-react";

export default function ConsultationStrip() {
  const { theme } = useTheme();
  const isNight = theme === "night";

  const goldColor = isNight ? "#60A5FA" : "#D4A017";
  const goldBg     = isNight ? "#0c0f1a" : "#0A1628";

  return (
    <section
      className="mesh-gradient-glow"
      style={{
        width: "100%",
        position: "relative",
        padding: "clamp(44px, 6vh, 64px) clamp(20px, 6vw, 80px)",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
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
      `}} />

      {/* Grid Pattern Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.045) 1px, transparent 0)",
          backgroundSize: "24px 24px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "24px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span
            style={{
              display: "block",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: `${goldColor}99`,
              marginBottom: "10px",
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
              fontFamily: "var(--font-serif)",
            }}
          >
            Book Your First Consultation — On Us
          </h2>
          <p style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.55)", margin: "8px 0 0", maxWidth: "580px", lineHeight: 1.6 }}>
            Talk to a solar expert, get a free site assessment, and see exactly how much you could save.
          </p>
        </div>
 
        <a
          href="#contact"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "15px 30px",
            borderRadius: "999px",
            background: goldColor,
            color: goldBg,
            fontSize: "0.88rem",
            fontWeight: 800,
            textDecoration: "none",
            whiteSpace: "nowrap",
            transition: "opacity 0.2s ease",
            flexShrink: 0,
            boxShadow: `0 8px 24px -6px ${goldColor}55`,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Schedule Free Consultation <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
}
