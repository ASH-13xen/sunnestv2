"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";

// ─── Social icon SVGs ─────────────────────────────────────────────────────────
function IconInstagram() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function IconLinkedin() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
      <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
    </svg>
  );
}
function IconFacebook() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
    </svg>
  );
}

const SOCIALS = [
  { label: "Instagram", icon: <IconInstagram />, href: "https://www.instagram.com/sunnestpower?igsh=MWNkYmcxcDg0bnBhcw%3D%3D&utm_source=qr" },
  { label: "LinkedIn",  icon: <IconLinkedin />,  href: "https://www.linkedin.com/company/sunnest-power/" },
  { label: "Facebook",  icon: <IconFacebook />,  href: "https://www.facebook.com/share/161aZ8ZhACb/?mibextid=wwXIfr" },
];

const CONTACT_ITEMS = [
  { Icon: Phone, label: "Call Us",  value: "+91-9109102662",         sub: "Mon–Sat, 9 AM–6 PM",      href: "tel:+919109102662",             accent: "#D4A017" },
  { Icon: Mail,  label: "Email Us", value: "sales@sunnestpower.com", sub: "We reply within 2 hours", href: "mailto:sales@sunnestpower.com", accent: "#6366F1" },
];

const OFFICE_ADDRESS = "A-09/10 Mahavir Gaushala Complex, Moudhapara Road, Raipur";
const OFFICE_PHONE = "+91 79996 48310";
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(OFFICE_ADDRESS)}&output=embed`;

type ContactForm = { name: string; email: string; phone: string; subject: string; message: string };

export default function ContactUsSection() {
  const { theme } = useTheme();
  const isNight = theme === "night";

  const gold       = isNight ? "#60A5FA" : "#D4A017";
  const pageBg     = isNight ? "#0c0f1a" : "#FBF8F0";
  const pageText   = isNight ? "#f2f5ea" : "#0A1628";
  const pageText55 = isNight ? "rgba(242,245,234,0.68)" : "rgba(10,22,40,0.55)";
  const pageText30 = isNight ? "rgba(242,245,234,0.30)" : "rgba(10,22,40,0.30)";
  const cardBg     = isNight ? "rgba(17,21,35,0.80)" : "rgba(255,255,255,0.92)";
  const cardBorder = isNight ? "rgba(255,255,255,0.07)" : "rgba(10,22,40,0.09)";
  const inputBg    = isNight ? "rgba(255,255,255,0.04)" : "rgba(10,22,40,0.02)";
  const inputBdr   = isNight ? "rgba(255,255,255,0.10)" : "rgba(10,22,40,0.12)";

  const [form, setForm]       = useState<ContactForm>({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const messageText = `Hello Sunnest! I have a general inquiry.

Details:
- Name: ${form.name}
- Email: ${form.email}
- Phone: ${form.phone || "N/A"}
- Subject: ${form.subject || "N/A"}
- Message: ${form.message}`;

    const whatsappUrl = `https://wa.me/919109102662?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappUrl, "_blank");
  };

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const formColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let triggers: any[] = [];
    let isMounted = true;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!isMounted) return;

      const reveal = (el: HTMLElement | null, fromX: number, delay: number) => {
        if (!el) return;
        gsap.set(el, { opacity: 0, x: fromX, y: fromX === 0 ? 32 : 0 });
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            invalidateOnRefresh: true,
            once: true,
            onEnter: () =>
              gsap.to(el, { opacity: 1, x: 0, y: 0, duration: 0.75, delay, ease: "power3.out" }),
          })
        );
      };

      reveal(headerRef.current, 0, 0);
      reveal(leftColRef.current, -32, 0.1);
      reveal(formColRef.current, 32, 0.15);
    })();

    return () => {
      isMounted = false;
      triggers.forEach((t) => t.kill());
    };
  }, []);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", boxSizing: "border-box",
    border: `1.5px solid ${inputBdr}`, borderRadius: "10px",
    fontSize: "0.88rem", color: pageText, background: inputBg, outline: "none",
    fontFamily: "var(--font-plus-jakarta)",
    transition: "border-color 0.2s ease, background 0.4s ease, color 0.4s ease",
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{
        background: pageBg, transition: "background 0.4s ease",
        padding: "var(--section-padding-top) clamp(16px,6vw,80px) var(--section-padding-bottom)",
        boxSizing: "border-box", position: "relative", overflow: "hidden",
        borderTop: `1px solid ${cardBorder}`,
      }}
    >
      {/* ── Section header ────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: "1200px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr",
          gap: "48px", alignItems: "flex-start",
        }}
        className="contact-outer-grid"
      >
        {/* Top label + heading */}
        <div
          ref={headerRef}
          style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "1200px", margin: "0 auto" }}
        >
          <span style={{
            display: "block", fontSize: "0.68rem", fontWeight: 800,
            letterSpacing: "0.28em", textTransform: "uppercase",
            color: gold, marginBottom: "14px", transition: "color 0.4s ease",
          }}>
            04 // GET IN TOUCH
          </span>
          <h2 style={{
            fontSize: "clamp(3.5rem, 7vw, 6rem)", fontWeight: 900,
            textTransform: "uppercase", lineHeight: 0.85,
            color: pageText, margin: "0 0 20px", transition: "color 0.4s ease",
          }}>
            We&apos;re Here<br />
            <span style={{ color: gold, transition: "color 0.4s ease" }}>To Help</span>
          </h2>
          <p style={{
            fontSize: "0.92rem", lineHeight: 1.7, color: pageText55,
            maxWidth: "520px", margin: "0 0 20px 0", transition: "color 0.4s ease",
          }}>
            Have questions about solar? Our engineers are ready to answer anything — from system sizing to subsidies. We typically respond within 2 hours.
          </p>
        </div>

        {/* ── Two-column body: left = info, right = form ────────────────────── */}
        <div className="contact-body-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.65fr", gap: "clamp(28px,5vw,56px)", alignItems: "stretch" }}>

          {/* ── Left: contact cards + social ──────────────────────────────── */}
          <div
            ref={leftColRef}
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px", flexShrink: 0 }}>
              {CONTACT_ITEMS.map(({ Icon, label, value, sub, href, accent }) => (
                <div
                  key={label}
                  style={{
                    display: "flex", gap: "16px", padding: "20px",
                    background: cardBg, backdropFilter: "blur(12px)",
                    border: `1px solid ${cardBorder}`,
                    borderRadius: "18px", cursor: "default",
                    transition: "all 0.4s ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 32px ${accent}14`;
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}30`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLDivElement).style.borderColor = cardBorder;
                  }}
                >
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "12px", flexShrink: 0,
                    background: `${accent}12`, border: `1px solid ${accent}28`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon style={{ width: "18px", height: "18px", color: accent }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.65rem", color: pageText30, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px", transition: "color 0.4s ease" }}>
                      {label}
                    </div>
                    {href ? (
                      <a href={href} style={{ fontWeight: 700, color: pageText, fontSize: "0.88rem", marginBottom: "2px", display: "block", textDecoration: "none", transition: "color 0.2s ease" }}
                        onMouseEnter={e => (e.currentTarget.style.color = accent)}
                        onMouseLeave={e => (e.currentTarget.style.color = pageText)}
                      >{value}</a>
                    ) : (
                      <div style={{ fontWeight: 700, color: pageText, fontSize: "0.88rem", marginBottom: "2px", transition: "color 0.4s ease" }}>{value}</div>
                    )}
                    <div style={{ color: pageText55, fontSize: "0.77rem", transition: "color 0.4s ease" }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Visit Us panel — map + address + social links */}
            <div style={{
              padding: "18px",
              background: "linear-gradient(135deg, #0A1628 0%, #0E2040 100%)",
              borderRadius: "18px",
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
            }}>
              <a
                href={`https://www.google.com/maps?q=${encodeURIComponent(OFFICE_ADDRESS)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  position: "relative",
                  display: "block",
                  width: "100%", minHeight: "170px", flex: 1, borderRadius: "12px",
                  overflow: "hidden", marginBottom: "16px",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                {/* The embed itself never receives touch/pointer input — an
                    interactive Google Maps iframe otherwise captures the first
                    touch and drags the map instead of scrolling the page,
                    which is what made scrolling near this section feel buggy
                    on mobile. Tapping anywhere opens the real map instead. */}
                <iframe
                  src={MAP_EMBED_SRC}
                  title="SunNest Power office location"
                  width="100%"
                  height="100%"
                  style={{
                    border: 0, display: "block",
                    filter: "grayscale(0.15) contrast(1.05)",
                    pointerEvents: "none",
                  }}
                  referrerPolicy="no-referrer-when-downgrade"
                  tabIndex={-1}
                />
                <span
                  style={{
                    position: "absolute", top: "10px", right: "10px",
                    display: "flex", alignItems: "center", gap: "5px",
                    fontSize: "0.68rem", fontWeight: 700, color: "#fff",
                    background: "rgba(10,22,40,0.72)", backdropFilter: "blur(4px)",
                    padding: "5px 10px", borderRadius: "999px",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  Open in Maps ↗
                </span>
              </a>

              <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                <MapPin style={{ width: "16px", height: "16px", color: gold, flexShrink: 0, marginTop: "2px" }} />
                <span style={{ color: "rgba(255,255,255,0.68)", fontSize: "0.8rem", lineHeight: 1.5 }}>
                  {OFFICE_ADDRESS}
                </span>
              </div>
              <a
                href={`tel:${OFFICE_PHONE.replace(/\s+/g, "")}`}
                style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px", textDecoration: "none" }}
                onMouseEnter={e => {
                  const span = e.currentTarget.querySelector("span");
                  if (span) span.style.color = gold;
                }}
                onMouseLeave={e => {
                  const span = e.currentTarget.querySelector("span");
                  if (span) span.style.color = "rgba(255,255,255,0.68)";
                }}
              >
                <Phone style={{ width: "16px", height: "16px", color: gold, flexShrink: 0 }} />
                <span style={{ color: "rgba(255,255,255,0.68)", fontSize: "0.8rem", transition: "color 0.2s ease" }}>
                  {OFFICE_PHONE}
                </span>
              </a>

              <div style={{ display: "flex", gap: "10px" }}>
                {SOCIALS.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    style={{
                      width: "36px", height: "36px", borderRadius: "9px",
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "rgba(255,255,255,0.55)",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = `${gold}18`;
                      e.currentTarget.style.borderColor = `${gold}40`;
                      e.currentTarget.style.color = gold;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: form card ──────────────────────────────────────────── */}
          <div
            ref={formColRef}
            style={{
              background: cardBg, backdropFilter: "blur(20px)",
              border: `1px solid ${cardBorder}`,
              borderRadius: "24px", padding: "clamp(28px,5vw,44px)",
              boxShadow: isNight ? "0 20px 60px rgba(0,0,0,0.35)" : "0 20px 60px rgba(10,22,40,0.08)",
              transition: "background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
            }}
          >
            {submitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ textAlign: "center", padding: "32px 16px" }}
              >
                <div style={{ fontSize: "3.2rem", marginBottom: "18px" }}>✉️</div>
                <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.6rem", fontWeight: 800, color: pageText, marginBottom: "12px", transition: "color 0.4s ease" }}>
                  Message Sent!
                </h3>
                <p style={{ color: pageText55, fontSize: "0.96rem", lineHeight: 1.65, transition: "color 0.4s ease" }}>
                  Thanks, <strong style={{ color: pageText }}>{form.name}</strong>! We&apos;ll get back to you at{" "}
                  <strong style={{ color: pageText }}>{form.email}</strong> within 2 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.35rem", fontWeight: 700, color: pageText, marginBottom: "28px", transition: "color 0.4s ease" }}>
                  Send Us a Message
                </h3>

                {/* Name + Email row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }} className="contact-name-row">
                  {(["name","email"] as const).map(key => (
                    <div key={key}>
                      <label style={{ display: "block", fontSize: "0.77rem", fontWeight: 700, color: pageText, marginBottom: "5px", transition: "color 0.4s ease" }}>
                        {key === "name" ? "Full Name" : "Email"} <span style={{ color: gold }}>*</span>
                      </label>
                      <input
                        type={key === "email" ? "email" : "text"} required
                        value={form[key]}
                        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                        style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = gold)}
                        onBlur={e  => (e.target.style.borderColor = inputBdr)}
                      />
                    </div>
                  ))}
                </div>

                {/* Phone + Subject */}
                {(["phone","subject"] as const).map(key => (
                  <div key={key} style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "0.77rem", fontWeight: 700, color: pageText, marginBottom: "5px", transition: "color 0.4s ease" }}>
                      {key === "phone" ? "Phone" : "Subject"}
                      {key === "phone" && <span style={{ color: pageText55, fontWeight: 400 }}> (Optional)</span>}
                    </label>
                    <input
                      type={key === "phone" ? "tel" : "text"}
                      value={form[key]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = gold)}
                      onBlur={e  => (e.target.style.borderColor = inputBdr)}
                    />
                  </div>
                ))}

                {/* Message */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.77rem", fontWeight: 700, color: pageText, marginBottom: "5px", transition: "color 0.4s ease" }}>
                    Message <span style={{ color: gold }}>*</span>
                  </label>
                  <textarea
                    required rows={5}
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Tell us about your home, energy needs, or any questions..."
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={e => (e.target.style.borderColor = gold)}
                    onBlur={e  => (e.target.style.borderColor = inputBdr)}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%", padding: "14px",
                    borderRadius: "12px", border: "none",
                    background: `linear-gradient(135deg, ${gold}, ${gold}cc)`,
                    color: "#0A1628",
                    fontSize: "0.92rem", fontWeight: 800, cursor: "pointer",
                    fontFamily: "var(--font-plus-jakarta)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    transition: "opacity 0.2s ease, background 0.4s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  Send Message
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-body-grid { grid-template-columns: 1fr !important; }
          .contact-name-row  { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
