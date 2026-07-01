"use client";

import { CheckCircle2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";

const DIFFERENTIATORS = [
  "Leadership with Tata Power Solar experience",
  "Dedicated in-house engineers, not sub-contractors",
  "End-to-end support: design, install & lifetime service",
];

const STATS = [
  { val: "3-5 Yrs", label: "Average ROI Period" },
  { val: "100%", label: "In-House Engineers" },
  { val: "25 Yrs", label: "Panel Warranty" },
  { val: "Pan-India", label: "Operations & Support" },
];

export default function AboutSection() {
  const { theme } = useTheme();
  const isNight = theme === "night";

  // Alternating background colors for contrast transition
  const pageBg     = isNight ? "#0D111A"                : "#F7F3E9";
  const pageText   = isNight ? "#f2f5ea"                : "#0A1628";
  const pageText45 = isNight ? "rgba(242,245,234,0.45)" : "rgba(10,22,40,0.50)";
  const goldColor  = isNight ? "#60A5FA"                : "#D4A017";
  const cardBg     = isNight ? "rgba(255,255,255,0.03)" : "rgba(10,22,40,0.03)";
  const cardBorder = isNight ? "rgba(255,255,255,0.06)" : "rgba(10,22,40,0.08)";

  return (
    <div
      id="about"
      style={{
        background: pageBg,
        transition: "background 0.4s ease",
        boxSizing: "border-box",
        padding: "var(--section-padding-top) 0 var(--section-padding-bottom)",
        borderBottom: `1px solid ${cardBorder}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "48px",
        }}
      >
        {/* ── Top Narrative Block ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "1200px",
            width: "100%",
            padding: "0 clamp(16px, 6vw, 80px)",
            boxSizing: "border-box",
          }}
        >
          <div style={{ maxWidth: "700px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span
              style={{
                display: "block",
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: goldColor,
                marginBottom: "14px",
                transition: "color 0.4s ease",
              }}
            >
              02 // THE COMMITMENT
            </span>

            <h2
              style={{
                fontSize: "clamp(2.4rem, 5vw, 3.2rem)",
                fontWeight: 900,
                textTransform: "uppercase",
                lineHeight: 0.95,
                color: pageText,
                margin: "0 0 20px",
                fontFamily: "var(--font-serif)",
                transition: "color 0.4s ease",
              }}
            >
              Why Choose
              <br />
              <span style={{ color: goldColor, transition: "color 0.4s ease" }}>SunNest?</span>
            </h2>

            <p
              style={{
                fontSize: "0.92rem",
                lineHeight: 1.7,
                color: pageText45,
                margin: "0 0 24px",
                transition: "color 0.4s ease",
              }}
            >
              At SunNest Power, we design solar energy to be a reliable, high-yield asset for your property. Engineered with Tata Power Solar experience, our installations are built for decades of peak performance.
            </p>

            {/* Differentiators list */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                marginBottom: "32px",
              }}
            >
              {DIFFERENTIATORS.map((point) => (
                <div key={point} style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
                  <CheckCircle2 size={16} color="#4ade80" strokeWidth={2.2} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "0.85rem", color: pageText45, lineHeight: 1.5, transition: "color 0.4s ease" }}>
                    {point}
                  </span>
                </div>
              ))}
            </div>

            {/* Interactive Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", width: "100%", maxWidth: "600px" }} className="sm:grid-cols-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: cardBg,
                    border: `1px solid ${cardBorder}`,
                    padding: "16px 14px",
                    borderRadius: "16px",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div style={{ fontSize: "1.4rem", fontWeight: 900, color: goldColor, lineHeight: 1.1, marginBottom: "4px" }}>
                    {s.val}
                  </div>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, color: pageText45, textTransform: "uppercase", letterSpacing: "0.02em" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom Carousel: Core Benefits Testimonials Stack ── */}
        <div style={{ width: "100%", overflow: "hidden" }}>
          <StaggerTestimonials />
        </div>
      </div>
    </div>
  );
}
