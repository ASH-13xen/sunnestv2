"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface Plan {
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  systemSize: string;
  popular: boolean;
  features: string[];
}

const PLANS: Plan[] = [
  {
    name: "Starter Home",
    tagline: "Ideal for apartments & small homes",
    priceMonthly: 2399,
    priceYearly: 1999,
    systemSize: "3 kW System",
    popular: false,
    features: [
      "Up to 6-8 premium monocrystalline panels",
      "Sleek standard grid-tie inverter",
      "PM Surya Ghar Subsidy guidance",
      "25-year panel warranty",
      "5-year workmanship warranty",
      "Net metering setup in Maharashtra",
    ],
  },
  {
    name: "Home Pro",
    tagline: "Most popular for average households",
    priceMonthly: 3999,
    priceYearly: 3499,
    systemSize: "5 kW System",
    popular: true,
    features: [
      "Up to 10-12 premium half-cut panels",
      "Premium high-efficiency inverter",
      "SunNest smart monitoring app access",
      "25-year panel performance guarantee",
      "10-year workmanship warranty",
      "Complete net metering registration",
      "Assistance with ₹78,000 Govt subsidy",
    ],
  },
  {
    name: "Power Estate",
    tagline: "Ideal for large villas & small businesses",
    priceMonthly: 7499,
    priceYearly: 6499,
    systemSize: "10 kW System",
    popular: false,
    features: [
      "Up to 20-24 premium monocrystalline panels",
      "Hybrid inverter with battery storage support",
      "SunNest smart monitoring (Elite)",
      "25-year full system warranty",
      "10-year workmanship warranty",
      "Priority maintenance & cleaning support",
      "Net metering & custom grid sync support",
    ],
  },
];

export default function PricingSection() {
  const { theme } = useTheme();
  const isNight = theme === "night";

  const pageBg     = isNight ? "#0c0f1a"                : "#FBF8F0";
  const pageText   = isNight ? "#f2f5ea"                : "#0A1628";
  const pageText45 = isNight ? "rgba(242,245,234,0.62)" : "rgba(10,22,40,0.45)";
  const goldColor  = isNight ? "#60A5FA"                : "#D4A017";
  const goldBg     = isNight ? "#0c0f1a"                : "#0A1628";
  const cardBg     = isNight ? "#111115"                : "#ffffff";
  const cardBorder = isNight ? "rgba(255,255,255,0.08)" : "rgba(10,22,40,0.10)";
  const cardText55 = isNight ? "rgba(242,245,234,0.68)" : "rgba(10,22,40,0.55)";
  const popularBg  = "linear-gradient(165deg, #0A1628 0%, #0c1322 100%)";

  const [yearly, setYearly] = useState(false);

  return (
    <section
      id="pricing"
      style={{
        width: "100%",
        background: pageBg,
        transition: "background 0.4s ease",
        boxSizing: "border-box",
        padding: "var(--section-padding-top) clamp(16px, 6vw, 80px) var(--section-padding-bottom)",
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", maxWidth: "1000px", margin: "0px auto 80px" }}>
        <span
          style={{
            display: "block",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: `${goldColor}99`,
            marginBottom: "14px",
            transition: "color 0.4s ease",
          }}
        >
          Transparent Pricing
        </span>
        <h2
          style={{
            fontSize: "clamp(3.5rem, 7vw, 6rem)",
            fontWeight: 900,
            textTransform: "uppercase",
            lineHeight: 0.85,
            color: pageText,
            margin: "0 0 14px",
            transition: "color 0.4s ease",
          }}
        >
          Simple,{" "}
          <span
            style={{
              color: goldColor,
              transition: "color 0.4s ease",
            }}
          >
            Honest Pricing
          </span>
        </h2>
        <p style={{ fontSize: "0.92rem", lineHeight: 1.7, color: pageText45, margin: "0 0 24px", transition: "color 0.4s ease" }}>
          No hidden fees, no surprises. Choose the plan that fits your home and start saving immediately.
        </p>

        {/* Toggle */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: !yearly ? pageText : pageText45, transition: "color 0.2s ease" }}>
            Monthly
          </span>
          <button
            onClick={() => setYearly((y) => !y)}
            style={{
              width: "42px",
              height: "22px",
              borderRadius: "999px",
              position: "relative",
              border: "none",
              cursor: "pointer",
              padding: "3px",
              background: yearly ? goldColor : (isNight ? "rgba(255,255,255,0.15)" : "rgba(10,22,40,0.15)"),
              transition: "background 0.25s ease",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                position: "absolute",
                top: "3px",
                left: yearly ? "23px" : "3px",
                transition: "left 0.25s ease",
              }}
            />
          </button>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: yearly ? pageText : pageText45, display: "flex", alignItems: "center", gap: "6px", transition: "color 0.2s ease" }}>
            Annual
            <span style={{ background: goldColor, color: goldBg, fontSize: "0.6rem", fontWeight: 800, padding: "2px 8px", borderRadius: "999px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Save 15%
            </span>
          </span>
        </div>
      </div>

      {/* ── Plan grid ───────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {PLANS.map((plan, idx) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: idx * 0.12 }}
            style={{
              borderRadius: "28px",
              padding: "32px 28px",
              background: plan.popular ? popularBg : cardBg,
              border: `1px solid ${plan.popular ? goldColor : cardBorder}`,
              boxShadow: plan.popular ? `0 24px 60px ${goldColor}22` : "0 10px 30px rgba(0,0,0,0.05)",
              transform: plan.popular ? "scale(1.03)" : "scale(1)",
              display: "flex",
              flexDirection: "column",
              transition: "background 0.4s ease, border-color 0.4s ease, transform 0.4s ease",
            }}
          >
            {/* Top row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  padding: "4px 12px",
                  borderRadius: "999px",
                  color: goldColor,
                  border: `1px solid ${goldColor}40`,
                  background: `${goldColor}12`,
                }}
              >
                ⚡ {plan.systemSize}
              </span>
              {plan.popular && (
                <span style={{ fontSize: "0.6rem", fontWeight: 800, padding: "4px 10px", borderRadius: "999px", background: goldColor, color: goldBg, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Most Popular
                </span>
              )}
            </div>

            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0 0 4px", color: plan.popular ? "#ffffff" : pageText, fontFamily: "var(--font-serif)" }}>
              {plan.name}
            </h3>
            <p style={{ fontSize: "0.82rem", margin: "0 0 20px", color: plan.popular ? "rgba(255,255,255,0.55)" : cardText55, fontStyle: "italic" }}>
              {plan.tagline}
            </p>

            <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "4px" }}>
              <span style={{ fontSize: "2.2rem", fontWeight: 800, color: plan.popular ? goldColor : pageText, fontFamily: "var(--font-serif)", lineHeight: 1 }}>
                ₹{(yearly ? plan.priceYearly : plan.priceMonthly).toLocaleString("en-IN")}
              </span>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: plan.popular ? "rgba(255,255,255,0.45)" : pageText45 }}>/mo</span>
            </div>
            {yearly && (
              <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "#4ade80", marginBottom: "20px" }}>
                Save ₹{((plan.priceMonthly - plan.priceYearly) * 12).toLocaleString("en-IN")}/yr
              </div>
            )}
            {!yearly && <div style={{ marginBottom: "20px" }} />}

            <a
              href="#contact"
              style={{
                textAlign: "center",
                padding: "12px",
                borderRadius: "12px",
                fontSize: "0.82rem",
                fontWeight: 800,
                textDecoration: "none",
                marginBottom: "24px",
                background: plan.popular ? goldColor : (isNight ? "rgba(255,255,255,0.06)" : "#0A1628"),
                color: plan.popular ? goldBg : "#ffffff",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Get Started
            </a>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {plan.features.map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <Check size={14} color="#4ade80" strokeWidth={2.5} style={{ marginTop: "2px", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.82rem", lineHeight: 1.5, color: plan.popular ? "rgba(255,255,255,0.75)" : cardText55 }}>
                    {f}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>


    </section>
  );
}
