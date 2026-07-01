"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { Sun, Clock, FileText, MessageSquare, Shield } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const INFO_ITEMS = [
  { Icon: Clock,        title: "45–60 Minutes",  sub: "Full home assessment" },
  { Icon: FileText,     title: "Custom Report",   sub: "Savings projection included" },
  { Icon: MessageSquare,title: "Expert Q&A",      sub: "All questions answered" },
  { Icon: Shield,       title: "Zero Obligation", sub: "No pressure, ever" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

type BookingForm = { name: string; email: string; phone: string; address: string; notes: string };

// ─── Component ────────────────────────────────────────────────────────────────
export default function BookInspectionSection() {
  const { theme } = useTheme();
  const isNight = theme === "night";

  const gold       = isNight ? "#60A5FA" : "#D4A017";
  const pageBg     = isNight ? "#0D111A" : "#FBF8F0";
  const pageText   = isNight ? "#f2f5ea" : "#0A1628";
  const pageText55 = isNight ? "rgba(242,245,234,0.55)" : "rgba(10,22,40,0.55)";
  const cardBg     = isNight ? "rgba(16,20,32,0.92)" : "rgba(255,255,255,0.96)";
  const cardBorder = isNight ? "rgba(255,255,255,0.07)" : "rgba(212,160,23,0.18)";
  const inputBg    = isNight ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)";
  const inputBdr   = isNight ? "rgba(255,255,255,0.10)" : "rgba(212,160,23,0.22)";

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear,  setCurrentYear]  = useState(today.getFullYear());
  const [selectedDay,  setSelectedDay]  = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep]   = useState(1);
  const [form, setForm]   = useState<BookingForm>({ name: "", email: "", phone: "", address: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const monthName  = MONTH_NAMES[currentMonth];
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay    = getFirstDayOfMonth(currentYear, currentMonth);

  const isPast = (day: number) => {
    const d = new Date(currentYear, currentMonth, day);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return d < t;
  };
  const isWeekend = (day: number) => {
    const dw = new Date(currentYear, currentMonth, day).getDay();
    return dw === 0 || dw === 6;
  };

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
    setSelectedDay(null);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", boxSizing: "border-box",
    border: `1.5px solid ${inputBdr}`, borderRadius: "10px",
    fontSize: "0.88rem", color: pageText, background: inputBg,
    outline: "none", fontFamily: "var(--font-plus-jakarta)",
    transition: "border-color 0.2s ease, background 0.4s ease, color 0.4s ease",
  };

  const btnPrimary: React.CSSProperties = {
    width: "100%", padding: "13px",
    borderRadius: "12px", border: "none",
    background: `linear-gradient(135deg, ${gold}, ${gold}cc)`,
    color: "#0A1628",
    fontSize: "0.9rem", fontWeight: 800, cursor: "pointer",
    fontFamily: "var(--font-plus-jakarta)",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    transition: "opacity 0.2s ease",
  };
  const btnDisabled: React.CSSProperties = {
    ...btnPrimary,
    background: `${gold}25`,
    color: pageText55,
    cursor: "not-allowed",
  };

  return (
    <section
      id="book"
      style={{
        background: pageBg, transition: "background 0.4s ease",
        padding: "var(--section-padding-top) clamp(16px,6vw,80px) var(--section-padding-bottom)",
        boxSizing: "border-box", position: "relative", overflow: "hidden",
      }}
    >
      {/* Gold top line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: `linear-gradient(90deg, transparent, ${gold}80, transparent)`,
        transition: "background 0.4s ease",
      }} />

      {/* Background glow */}
      <div style={{
        position: "absolute", bottom: "-10%", left: "-5%",
        width: "480px", height: "480px", borderRadius: "50%",
        background: `radial-gradient(circle, ${gold}08, transparent 70%)`,
        pointerEvents: "none", transition: "background 0.4s ease",
      }} />

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.65 }}
        style={{ maxWidth: "1200px", margin: "0 auto 52px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <span style={{
          display: "block", fontSize: "0.68rem", fontWeight: 800,
          letterSpacing: "0.28em", textTransform: "uppercase",
          color: gold, marginBottom: "14px", transition: "color 0.4s ease",
        }}>
          03 // FREE INSPECTION
        </span>
        <h2 style={{
          fontSize: "clamp(3.5rem, 7vw, 6rem)", fontWeight: 900,
          textTransform: "uppercase", lineHeight: 0.85,
          color: pageText, margin: "0 0 20px", transition: "color 0.4s ease",
        }}>
          Book Your Free<br />
          <span style={{ color: gold, transition: "color 0.4s ease" }}>Home Inspection</span>
        </h2>
        <p style={{ color: pageText55, fontSize: "0.92rem", maxWidth: "520px", lineHeight: 1.7, transition: "color 0.4s ease", margin: 0 }}>
          Our solar expert will visit your home, assess your roof, and design a custom system — completely free, with zero obligation.
        </p>
      </motion.div>

      {/* ── Card ─────────────────────────────────────────────────────────────── */}
      <motion.div
        className="book-card-outer"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.1 }}
        style={{
          maxWidth: "1060px", margin: "0 auto",
          background: cardBg, backdropFilter: "blur(20px)",
          border: `1px solid ${cardBorder}`,
          borderRadius: "28px", overflow: "hidden",
          boxShadow: isNight
            ? "0 20px 80px rgba(0,0,0,0.45)"
            : "0 20px 80px rgba(10,22,40,0.1)",
          transition: "background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
        }}
      >
        <div className="book-inner-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.65fr)" }}>

          {/* ── Left panel (always dark) ───────────────────────────────────── */}
          <div style={{
            background: "linear-gradient(160deg, #0A1628 0%, #0E2040 100%)",
            padding: "clamp(32px,5vw,52px) clamp(24px,4vw,44px)",
            position: "relative", overflow: "hidden",
          }}>
            {/* Glow orb */}
            <div style={{
              position: "absolute", top: "-20%", right: "-30%",
              width: "300px", height: "300px", borderRadius: "50%",
              background: `radial-gradient(circle, ${gold}22, transparent 70%)`,
              pointerEvents: "none", transition: "background 0.4s ease",
            }} />

            {/* Brand */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px", position: "relative" }}>
              <div style={{
                width: "34px", height: "34px", borderRadius: "10px",
                background: `linear-gradient(135deg, ${gold}, #FF9100)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 18px ${gold}40`, flexShrink: 0,
                transition: "background 0.4s ease, box-shadow 0.4s ease",
              }}>
                <Sun style={{ width: "18px", height: "18px", color: "#0A1628" }} />
              </div>
              <span style={{ fontSize: "1.05rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.02em" }}>
                Sun<span style={{ color: gold, transition: "color 0.4s ease" }}>Nest</span>
                <span style={{ fontSize: "0.72rem", fontWeight: 500, color: "rgba(255,255,255,0.45)", marginLeft: "3px" }}>Power</span>
              </span>
            </div>

            <h3 style={{ color: "#ffffff", fontSize: "1.35rem", fontWeight: 700, marginBottom: "8px", fontFamily: "var(--font-playfair)" }}>
              Free Home Inspection
            </h3>
            <p style={{ color: "rgba(255,255,255,0.52)", fontSize: "0.85rem", marginBottom: "30px", lineHeight: 1.65 }}>
              A certified SunNest expert will visit your property at no cost.
            </p>

            {INFO_ITEMS.map(({ Icon, title, sub }) => (
              <div key={title} style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "18px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
                  background: `${gold}18`, border: `1px solid ${gold}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.4s ease, border-color 0.4s ease",
                }}>
                  <Icon style={{ width: "16px", height: "16px", color: gold, transition: "color 0.4s ease" }} />
                </div>
                <div>
                  <div style={{ color: "#ffffff", fontWeight: 600, fontSize: "0.88rem" }}>{title}</div>
                  <div style={{ color: "rgba(255,255,255,0.42)", fontSize: "0.77rem" }}>{sub}</div>
                </div>
              </div>
            ))}

            <div style={{
              marginTop: "24px", padding: "16px",
              background: `${gold}14`, border: `1px solid ${gold}28`,
              borderRadius: "12px", transition: "background 0.4s ease, border-color 0.4s ease",
            }}>
              <div style={{ color: gold, fontWeight: 700, fontSize: "0.9rem", marginBottom: "4px", transition: "color 0.4s ease" }}>
                ⚡ Limited Slots Available
              </div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.79rem", lineHeight: 1.55 }}>
                We typically book out 1–2 weeks in advance. Secure your slot today.
              </div>
            </div>
          </div>

          {/* ── Right panel (booking form) ─────────────────────────────────── */}
          <div style={{ padding: "clamp(32px,5vw,52px) clamp(24px,4vw,44px)" }}>

            {submitted ? (
              <motion.div
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ textAlign: "center", padding: "32px 16px" }}
              >
                <div style={{ fontSize: "3.5rem", marginBottom: "20px" }}>🎉</div>
                <h3 style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "1.7rem", fontWeight: 800,
                  color: pageText, marginBottom: "12px", transition: "color 0.4s ease",
                }}>
                  Inspection Booked!
                </h3>
                <p style={{ color: pageText55, fontSize: "0.98rem", lineHeight: 1.7, transition: "color 0.4s ease" }}>
                  We've received your request for{" "}
                  <strong style={{ color: pageText }}>{monthName} {selectedDay}</strong> at{" "}
                  <strong style={{ color: pageText }}>{selectedTime}</strong>.<br />
                  A confirmation will be sent to <strong style={{ color: pageText }}>{form.email}</strong>.
                </p>
                <div style={{
                  marginTop: "24px", padding: "18px",
                  background: "linear-gradient(135deg,rgba(34,197,94,0.1),rgba(34,197,94,0.05))",
                  border: "1px solid rgba(34,197,94,0.22)",
                  borderRadius: "12px", color: "#16A34A", fontWeight: 600, fontSize: "0.88rem",
                }}>
                  ✓ Our team will call you within 2 hours to confirm your appointment
                </div>
              </motion.div>
            ) : (
              <>
                {/* Step progress */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "32px" }}>
                  {["Pick Date", "Pick Time", "Your Details"].map((label, idx) => {
                    const s = idx + 1;
                    return (
                      <div key={label} style={{ flex: 1 }}>
                        <div style={{
                          height: "4px", borderRadius: "2px",
                          background: step >= s ? `linear-gradient(90deg,${gold},${gold}99)` : `${gold}20`,
                          transition: "background 0.4s ease",
                        }} />
                        <div style={{
                          fontSize: "0.68rem", fontWeight: 700, marginTop: "6px",
                          color: step >= s ? gold : pageText55, transition: "color 0.4s ease",
                        }}>
                          {label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── STEP 1: Calendar ── */}
                {step === 1 && (
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: "1.05rem", color: pageText, marginBottom: "20px", transition: "color 0.4s ease" }}>
                      Select a Date
                    </h3>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                      <button onClick={prevMonth} style={{
                        background: "none", border: `1px solid ${gold}40`,
                        borderRadius: "8px", padding: "6px 14px",
                        cursor: "pointer", color: gold, fontWeight: 700, fontSize: "1rem",
                        transition: "border-color 0.2s ease, color 0.4s ease",
                      }}>←</button>
                      <span style={{ fontWeight: 700, fontSize: "0.98rem", color: pageText, transition: "color 0.4s ease" }}>
                        {monthName} {currentYear}
                      </span>
                      <button onClick={nextMonth} style={{
                        background: "none", border: `1px solid ${gold}40`,
                        borderRadius: "8px", padding: "6px 14px",
                        cursor: "pointer", color: gold, fontWeight: 700, fontSize: "1rem",
                        transition: "border-color 0.2s ease, color 0.4s ease",
                      }}>→</button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "4px", marginBottom: "8px" }}>
                      {DAY_NAMES.map(d => (
                        <div key={d} style={{ textAlign: "center", fontSize: "0.68rem", fontWeight: 700, color: pageText55, padding: "4px 0", transition: "color 0.4s ease" }}>
                          {d}
                        </div>
                      ))}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "4px", marginBottom: "24px" }}>
                      {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                        const disabled = isPast(day) || isWeekend(day);
                        const sel = selectedDay === day;
                        return (
                          <button
                            key={day}
                            onClick={() => !disabled && setSelectedDay(day)}
                            disabled={disabled}
                            style={{
                              padding: "8px 2px", borderRadius: "8px", border: "none",
                              cursor: disabled ? "not-allowed" : "pointer",
                              fontSize: "0.83rem", fontWeight: 600,
                              background: sel ? `linear-gradient(135deg,${gold},${gold}bb)` : "transparent",
                              color: sel
                                ? "#0A1628"
                                : disabled
                                  ? (isNight ? "rgba(255,255,255,0.12)" : "rgba(10,22,40,0.18)")
                                  : pageText,
                              boxShadow: sel ? `0 4px 12px ${gold}38` : "none",
                              transition: "background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease",
                            }}
                            onMouseEnter={e => { if (!disabled && !sel) e.currentTarget.style.background = `${gold}18`; }}
                            onMouseLeave={e => { if (!disabled && !sel) e.currentTarget.style.background = "transparent"; }}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => selectedDay && setStep(2)}
                      style={selectedDay ? btnPrimary : btnDisabled}
                      onMouseEnter={e => { if (selectedDay) e.currentTarget.style.opacity = "0.88"; }}
                      onMouseLeave={e => { if (selectedDay) e.currentTarget.style.opacity = "1"; }}
                    >
                      Continue →
                    </button>
                  </div>
                )}

                {/* ── STEP 2: Time slots ── */}
                {step === 2 && (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                      <button onClick={() => setStep(1)} style={{ background: "none", border: "none", cursor: "pointer", color: gold, fontSize: "1.2rem", padding: "4px 8px", transition: "color 0.4s ease" }}>←</button>
                      <div>
                        <h3 style={{ fontWeight: 700, fontSize: "1.05rem", color: pageText, margin: 0, transition: "color 0.4s ease" }}>Select a Time</h3>
                        <p style={{ color: pageText55, fontSize: "0.79rem", margin: 0, transition: "color 0.4s ease" }}>{monthName} {selectedDay}, {currentYear}</p>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", marginBottom: "24px" }}>
                      {TIME_SLOTS.map(time => {
                        const sel = selectedTime === time;
                        return (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            style={{
                              padding: "12px 8px", borderRadius: "10px",
                              border: `1.5px solid ${sel ? gold : `${gold}28`}`,
                              background: sel ? `linear-gradient(135deg,${gold},${gold}bb)` : "transparent",
                              cursor: "pointer", fontSize: "0.82rem", fontWeight: 600,
                              color: sel ? "#0A1628" : pageText,
                              fontFamily: "var(--font-plus-jakarta)",
                              transition: "all 0.2s ease",
                            }}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => selectedTime && setStep(3)}
                      style={selectedTime ? btnPrimary : btnDisabled}
                      onMouseEnter={e => { if (selectedTime) e.currentTarget.style.opacity = "0.88"; }}
                      onMouseLeave={e => { if (selectedTime) e.currentTarget.style.opacity = "1"; }}
                    >
                      Continue →
                    </button>
                  </div>
                )}

                {/* ── STEP 3: Personal details ── */}
                {step === 3 && (
                  <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                      <button type="button" onClick={() => setStep(2)} style={{ background: "none", border: "none", cursor: "pointer", color: gold, fontSize: "1.2rem", padding: "4px 8px", transition: "color 0.4s ease" }}>←</button>
                      <div>
                        <h3 style={{ fontWeight: 700, fontSize: "1.05rem", color: pageText, margin: 0, transition: "color 0.4s ease" }}>Your Details</h3>
                        <p style={{ color: pageText55, fontSize: "0.79rem", margin: 0, transition: "color 0.4s ease" }}>{monthName} {selectedDay} at {selectedTime}</p>
                      </div>
                    </div>

                    {(["name","email","phone","address"] as const).map((key, i) => {
                      const labels = { name: "Full Name", email: "Email Address", phone: "Phone Number", address: "Home Address" };
                      const types  = { name: "text", email: "email", phone: "tel", address: "text" };
                      return (
                        <div key={key} style={{ marginBottom: i < 3 ? "14px" : "14px" }}>
                          <label style={{ display: "block", fontSize: "0.77rem", fontWeight: 700, color: pageText, marginBottom: "5px", transition: "color 0.4s ease" }}>
                            {labels[key]} <span style={{ color: gold }}>*</span>
                          </label>
                          <input
                            type={types[key]} required
                            value={form[key]}
                            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                            style={inputStyle}
                            onFocus={e => (e.target.style.borderColor = gold)}
                            onBlur={e  => (e.target.style.borderColor = inputBdr)}
                          />
                        </div>
                      );
                    })}

                    <div style={{ marginBottom: "22px" }}>
                      <label style={{ display: "block", fontSize: "0.77rem", fontWeight: 700, color: pageText, marginBottom: "5px", transition: "color 0.4s ease" }}>
                        Additional Notes{" "}
                        <span style={{ color: pageText55, fontWeight: 400 }}>(Optional)</span>
                      </label>
                      <textarea
                        value={form.notes}
                        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                        rows={3}
                        style={{ ...inputStyle, resize: "vertical" }}
                        onFocus={e => (e.target.style.borderColor = gold)}
                        onBlur={e  => (e.target.style.borderColor = inputBdr)}
                      />
                    </div>

                    <button
                      type="submit"
                      style={btnPrimary}
                      onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                    >
                      Confirm Free Inspection ✓
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 720px) {
          .book-inner-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
