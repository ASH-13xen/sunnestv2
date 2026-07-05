"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Phone } from "lucide-react";

const FAQS = [
  {
    q: "Is a solar subsidy available?",
    a: "Yes — subsidies are available for eligible residential installations as per government guidelines. Our team handles the paperwork and applies on your behalf.",
  },
  {
    q: "What is the typical ROI period?",
    a: "Most solar projects recover their full investment within 3–5 years, depending on system size and your existing energy usage.",
  },
  {
    q: "What is net metering?",
    a: "Net metering lets you export excess solar power back to the grid and receive credits on your electricity bill, effectively using the grid as storage.",
  },
  {
    q: "Does a solar system require regular maintenance?",
    a: "Solar systems need very little upkeep — periodic panel cleaning and a routine annual inspection is typically all that's required.",
  },
  {
    q: "How long does installation actually take?",
    a: "Most residential installations are completed within 1–3 days once permits and documentation are approved, with minimal disruption to your home.",
  },
  {
    q: "What financing options are available?",
    a: "We offer flexible monthly financing, one-time purchase, and lease-to-own options. Our team will help you find the plan that fits your budget.",
  },
];

export default function FAQSection() {
  const { theme } = useTheme();
  const isNight = theme === "night";

  // Alternating background theme for visual break
  const pageBg     = isNight ? "#090C12"                : "#F3EFE3";
  const pageText   = isNight ? "#f2f5ea"                : "#0A1628";
  const pageText45 = isNight ? "rgba(242,245,234,0.62)" : "rgba(10,22,40,0.50)";
  const goldColor  = isNight ? "#60A5FA"                : "#D4A017";
  const rowBg      = isNight ? "#121620"                : "#ffffff";
  const rowBgOpen  = "linear-gradient(165deg, #0A1628 0%, #0c1322 100%)";
  const rowBorder  = isNight ? "rgba(255,255,255,0.06)" : "rgba(10,22,40,0.08)";

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      style={{
        width: "100%",
        background: pageBg,
        transition: "background 0.4s ease",
        boxSizing: "border-box",
        padding: "var(--section-padding-top) clamp(16px, 6vw, 80px) var(--section-padding-bottom)",
        borderTop: `1px solid ${rowBorder}`,
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", maxWidth: "1000px", margin: "0px auto 60px" }}>
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
          05 // SUPPORT HUBS
        </span>

        <h2
          style={{
            fontSize: "clamp(3.5rem, 7vw, 6rem)",
            fontWeight: 900,
            textTransform: "uppercase",
            lineHeight: 0.85,
            color: pageText,
            margin: "0 0 20px",
            transition: "color 0.4s ease",
          }}
        >
          Got
          <br />
          <span style={{ color: goldColor, transition: "color 0.4s ease" }}>Questions?</span>
        </h2>

        <p
          style={{
            fontSize: "0.92rem",
            lineHeight: 1.7,
            color: pageText45,
            maxWidth: "600px",
            margin: "0 auto",
            transition: "color 0.4s ease",
          }}
        >
          Everything you need to know about our high-efficiency solar modules, PM Surya Ghar net metering paperwork, and post-commissioning warranties.
        </p>
      </div>

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "48px",
          alignItems: "flex-start",
        }}
        className="lg:grid-cols-12"
      >


        {/* ── Right Column: Accordion with Staggered Entrance Animations ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }} className="lg:col-span-7">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                style={{
                  borderRadius: "18px",
                  overflow: "hidden",
                  border: `1px solid ${isOpen ? "transparent" : rowBorder}`,
                  background: isOpen ? rowBgOpen : rowBg,
                  boxShadow: isOpen ? "0 16px 40px rgba(0,0,0,0.18)" : "none",
                  transition: "background 0.3s ease, border-color 0.3s ease",
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    padding: "20px 24px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.98rem",
                      fontWeight: 700,
                      color: isOpen ? goldColor : pageText,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {item.q}
                  </span>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: isOpen ? "rgba(255,255,255,0.10)" : `${goldColor}12`,
                      color: isOpen ? goldColor : (isNight ? pageText45 : "#0A1628"),
                    }}
                  >
                    {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        style={{
                          margin: 0,
                          padding: "0 24px 22px",
                          fontSize: "0.88rem",
                          lineHeight: 1.7,
                          color: isOpen ? "rgba(255,255,255,0.75)" : pageText45,
                          transition: "color 0.3s ease",
                        }}
                      >
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
