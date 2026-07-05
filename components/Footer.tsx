"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Mail, Phone, MapPin } from "lucide-react";

// ─── Navigation ───────────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { label: "Home",     href: "#hero" },
  { label: "Solutions",href: "#solutions" },
  { label: "About",    href: "#about" },
  { label: "Process",  href: "#process" },
  { label: "Pricing",  href: "#pricing" },
  { label: "Contact",  href: "#contact" },
  { label: "FAQ",      href: "#faq" },
];

const SERVICES = [
  "Residential Solar",
  "Commercial Solar",
  "Institutional Solar",
  "Industrial Solar",
  "Net Metering Setup",
  "After-Sales Service",
];

// ─── Inline social SVGs (no react-icons dep needed) ───────────────────────────
function IconInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function IconLinkedin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}
function IconFacebook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
    </svg>
  );
}

const SOCIALS = [
  { label: "Instagram", icon: <IconInstagram />, href: "https://www.instagram.com/sunnestpower?igsh=MWNkYmcxcDg0bnBhcw%3D%3D&utm_source=qr" },
  { label: "LinkedIn",  icon: <IconLinkedin />,  href: "https://www.linkedin.com/company/sunnest-power/" },
  { label: "Facebook",  icon: <IconFacebook />,  href: "https://www.facebook.com/share/161aZ8ZhACb/?mibextid=wwXIfr" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Footer() {
  const { theme } = useTheme();
  const isNight = theme === "night";
  const gold = isNight ? "#60A5FA" : "#D4A017";

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer style={{ background: "#06080D", borderTop: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>

      {/* ── Main grid ────────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "clamp(56px, 8vh, 80px) clamp(24px, 6vw, 80px) 0",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "clamp(32px, 5vw, 56px)",
        }}
      >

        {/* ── Brand column ─────────────────────────────────────────────────── */}
        <div style={{ gridColumn: "span 1", minWidth: "200px" }}>
          {/* Logo */}
          <button
            onClick={() => scrollTo("#hero")}
            style={{ display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", padding: 0, cursor: "pointer", marginBottom: "20px" }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: `linear-gradient(135deg, ${gold}, #FF9100)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 20px ${gold}40`,
                flexShrink: 0,
              }}
            >
              <Sun style={{ width: "18px", height: "18px", color: "#0A1628" }} />
            </div>
            <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1 }}>
              Sun<span style={{ color: gold }}>Nest</span>
              <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "rgba(255,255,255,0.5)", marginLeft: "4px" }}>Power</span>
            </span>
          </button>

          <p style={{ fontSize: "0.8rem", lineHeight: 1.75, color: "rgba(255,255,255,0.38)", maxWidth: "260px", margin: "0 0 24px" }}>
            Engineering the future of solar energy across India — from rooftop installations to industrial-scale captive power plants.
          </p>

          {/* Social icons */}
          <div style={{ display: "flex", gap: "10px" }}>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.40)",
                  textDecoration: "none",
                  transition: "color 0.2s ease, border-color 0.2s ease, background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = gold;
                  e.currentTarget.style.borderColor = `${gold}50`;
                  e.currentTarget.style.background = `${gold}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.40)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Quick Links ──────────────────────────────────────────────────── */}
        <div>
          <p style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "18px" }}>
            Quick Links
          </p>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => scrollTo(link.href)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.45)",
                    fontFamily: "var(--font-sans)",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = gold)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Services ─────────────────────────────────────────────────────── */}
        <div>
          <p style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "18px" }}>
            Services
          </p>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {SERVICES.map((s) => (
              <li
                key={s}
                style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.45)" }}
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Contact info ─────────────────────────────────────────────────── */}
        <div>
          <p style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "18px" }}>
            Get in Touch
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { Icon: Mail,    text: "sales@sunnestpower.com", href: "mailto:sales@sunnestpower.com" },
              { Icon: Phone,   text: "+91-9109102662",         href: "tel:+919109102662" },
              { Icon: MapPin,  text: "A-09/10 Mahavir Gaushala Complex, Moudhapara Road, Raipur", href: null },
            ].map(({ Icon, text, href }) => (
              <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: `${gold}12`, border: `1px solid ${gold}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px", transition: "background 0.4s ease, border-color 0.4s ease" }}>
                  <Icon style={{ width: "13px", height: "13px", color: gold, transition: "color 0.4s ease" }} />
                </div>
                {href ? (
                  <a href={href} style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", textDecoration: "none", lineHeight: 1.5, transition: "color 0.2s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = gold)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                  >
                    {text}
                  </a>
                ) : (
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{text}</span>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => scrollTo("#contact")}
            style={{
              marginTop: "24px",
              padding: "11px 22px",
              borderRadius: "999px",
              background: gold,
              color: "#0A1628",
              fontSize: "0.75rem",
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              letterSpacing: "0.04em",
              transition: "opacity 0.2s ease, background 0.4s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Book Free Inspection →
          </button>
        </div>
      </div>

      {/* ── Giant watermark wordmark ──────────────────────────────────────────── */}
      <div
        style={{
          padding: "clamp(32px, 5vh, 48px) clamp(24px, 6vw, 80px) 0",
          maxWidth: "1200px",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        <p
          aria-hidden="true"
          style={{
            fontSize: "clamp(5rem, 16vw, 14rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            lineHeight: 0.85,
            color: "transparent",
            WebkitTextStroke: "1px rgba(255,255,255,0.055)",
            userSelect: "none",
            pointerEvents: "none",
            margin: 0,
            whiteSpace: "nowrap",
          }}
        >
          SUNNEST
        </p>
      </div>

      {/* ── Bottom bar ───────────────────────────────────────────────────────── */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "18px clamp(24px, 6vw, 80px)",
          marginTop: "0",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", margin: 0 }}>
            © 2026 SunNest Power Pvt. Ltd. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            {["Terms & Conditions", "Privacy Policy"].map((label) => (
              <a
                key={label}
                href="#"
                style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", textDecoration: "none", transition: "color 0.2s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = gold)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
