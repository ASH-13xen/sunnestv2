"use client";

import { useState, useCallback, useMemo } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  MessageSquare,
  Check,
  Home,
  Building2,
  Landmark,
  Factory,
  ChevronLeft,
  ChevronRight,
  Zap,
  TrendingUp,
  Compass,
  Globe,
} from "lucide-react";

interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

// Custom SVG Social Icons (representing Instagram, Linkedin, Twitter, Youtube)
const InstagramIcon = ({ size = 24, ...props }: CustomIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ size = 24, ...props }: CustomIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const FacebookIcon = ({ size = 24, ...props }: CustomIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = ({ size = 24, ...props }: CustomIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

// ─── Data & Helpers ─────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "Residential", label: "Residential", icon: Home, rateFactor: 1200 },
  { id: "Commercial", label: "Commercial", icon: Building2, rateFactor: 1000 },
  { id: "Institutional", label: "Institutional", icon: Landmark, rateFactor: 950 },
  { id: "Industrial", label: "Industrial", icon: Factory, rateFactor: 900 },
];

const TIME_SLOTS = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"];

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface BookingData {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

interface MessageData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactSection() {
  const { theme } = useTheme();
  const isNight = theme === "night";

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const pageBg       = isNight ? "#0c0f1a" : "#FBF8F0";
  const cardBg       = isNight ? "rgba(18, 22, 36, 0.6)" : "rgba(255, 255, 255, 0.75)";
  const cardBorder   = isNight ? "rgba(255,255,255,0.06)" : "rgba(10,22,40,0.08)";
  const goldColor    = isNight ? "#60A5FA" : "#D4A017";
  const goldBg       = "#0A1628"; // text color on gold button / active elements
  const inputBg      = isNight ? "rgba(255,255,255,0.04)" : "rgba(10,22,40,0.02)";
  const inputBorder  = isNight ? "rgba(255,255,255,0.08)" : "rgba(10,22,40,0.12)";
  const cardText     = isNight ? "#f2f5ea" : "#0A1628";
  const cardText70   = isNight ? "rgba(242,245,234,0.75)" : "rgba(10,22,40,0.75)";
  const cardText55   = isNight ? "rgba(242,245,234,0.68)" : "rgba(10,22,40,0.60)";
  const cardText30   = isNight ? "rgba(242,245,234,0.30)" : "rgba(10,22,40,0.35)";
  const disabledBg   = isNight ? "rgba(255,255,255,0.06)" : "rgba(10,22,40,0.05)";

  // ── Tab / Step State ─────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<"book" | "message">("book");
  const [bookingStep, setBookingStep] = useState(1);

  // ── Booking State ─────────────────────────────────────────────────────────
  const [selCategory, setSelCategory] = useState("Residential");
  const [dateOffset, setDateOffset] = useState(0);
  const [selDate, setSelDate] = useState<Date | null>(null);
  const [selTime, setSelTime] = useState<string | null>(null);
  const [bookData, setBookData] = useState<BookingData>({ name: "", email: "", phone: "", address: "", notes: "" });
  const [bookDone, setBookDone] = useState(false);

  // ── Message State ─────────────────────────────────────────────────────────
  const [msgData, setMsgData] = useState<MessageData>({ name: "", email: "", phone: "", message: "" });
  const [msgDone, setMsgDone] = useState(false);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const activeCategory = useMemo(() => {
    return CATEGORIES.find((c) => c.id === selCategory) || CATEGORIES[0];
  }, [selCategory]);

  // ── Date Generator Logic ──────────────────────────────────────────────────
  const daysList = useMemo(() => {
    const list = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + dateOffset + i);
      list.push(d);
    }
    return list;
  }, [dateOffset]);

  const shiftWeek = (direction: number) => {
    setDateOffset((prev) => Math.max(0, prev + direction * 7));
    setSelDate(null);
    setSelTime(null);
  };

  // ── Resets ────────────────────────────────────────────────────────────────
  const resetBook = () => {
    setBookDone(false);
    setBookingStep(1);
    setSelDate(null);
    setSelTime(null);
    setBookData({ name: "", email: "", phone: "", address: "", notes: "" });
    setSelCategory("Residential");
    setDateOffset(0);
  };

  const resetMsg = () => {
    setMsgDone(false);
    setMsgData({ name: "", email: "", phone: "", message: "" });
  };

  // ── Shared styles ─────────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: inputBg,
    border: `1px solid ${inputBorder}`,
    borderRadius: "12px",
    padding: "13px 16px",
    fontSize: "0.88rem",
    color: cardText,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "var(--font-sans)",
    transition: "all 0.2s ease",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: cardText55,
    marginBottom: "6px",
    display: "block",
  };

  const primaryBtn = (enabled: boolean): React.CSSProperties => ({
    padding: "14px 28px",
    borderRadius: "14px",
    border: "none",
    cursor: enabled ? "pointer" : "not-allowed",
    background: enabled ? goldColor : disabledBg,
    color: enabled ? goldBg : cardText30,
    fontSize: "0.88rem",
    fontWeight: 800,
    fontFamily: "var(--font-sans)",
    transition: "all 0.25s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    boxShadow: enabled ? `0 10px 20px -5px ${goldColor}30` : "none",
  });

  const backBtn: React.CSSProperties = {
    padding: "14px 24px",
    borderRadius: "14px",
    border: `1px solid ${inputBorder}`,
    cursor: "pointer",
    background: "transparent",
    color: cardText70,
    fontSize: "0.88rem",
    fontWeight: 700,
    fontFamily: "var(--font-sans)",
    transition: "all 0.2s ease",
  };

  const tabBtn = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "12px 18px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    background: active ? goldColor : "transparent",
    color: active ? goldBg : cardText55,
    fontSize: "0.82rem",
    fontWeight: 800,
    fontFamily: "var(--font-sans)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.25s ease",
  });

  const stepCardMotion = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <section
      id="contact"
      style={{
        width: "100%",
        background: pageBg,
        transition: "background 0.4s ease",
        boxSizing: "border-box",
        padding: "var(--section-padding-top) clamp(16px, 4vw, 32px) var(--section-padding-bottom)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background radial soft ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: isNight ? "rgba(96, 165, 250, 0.06)" : "rgba(212, 160, 23, 0.04)",
          filter: "blur(120px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "850px", margin: "80px auto" }}>
        
        {/* ── Heading ────────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
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
            Let&apos;s Talk Solar
          </span>
          <h2
            style={{
              fontSize: "clamp(2.4rem, 5.5vw, 3.8rem)",
              fontWeight: 900,
              lineHeight: 0.95,
              color: cardText,
              margin: "0 0 16px",
              fontFamily: "var(--font-serif)",
              textTransform: "uppercase",
              transition: "color 0.4s ease",
            }}
          >
            Plan Your{" "}
            <span style={{ color: goldColor, transition: "color 0.4s ease" }}>
              Solar System
            </span>
          </h2>
          <p
            style={{
              fontSize: "clamp(0.85rem, 1.2vw, 0.95rem)",
              lineHeight: 1.7,
              color: cardText55,
              maxWidth: "500px",
              margin: "0 auto",
              transition: "color 0.4s ease",
            }}
          >
            Schedule your free, on-site solar engineering inspection with our experts in just two steps.
          </p>
        </div>

        {/* ── Main Glassmorphic Card ────────────────────────────────────── */}
        <div
          style={{
            background: cardBg,
            border: `1px solid ${cardBorder}`,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "32px",
            boxShadow: isNight
              ? "0 40px 100px -20px rgba(0,0,0,0.6)"
              : "0 40px 100px -20px rgba(10,22,40,0.08)",
            padding: "clamp(24px, 5vw, 44px)",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            minHeight: "500px",
            transition: "all 0.4s ease",
          }}
        >
          {/* Tab Switcher */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              background: isNight ? "rgba(255,255,255,0.03)" : "rgba(10,22,40,0.03)",
              border: `1px solid ${cardBorder}`,
              borderRadius: "14px",
              padding: "5px",
              marginBottom: "32px",
            }}
          >
            <button onClick={() => setActiveTab("book")} style={tabBtn(activeTab === "book")}>
              <Calendar size={15} /> Schedule Site Inspection
            </button>
            <button onClick={() => setActiveTab("message")} style={tabBtn(activeTab === "message")}>
              <MessageSquare size={15} /> Send Quick Message
            </button>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
            <AnimatePresence mode="wait">

              {/* ── BOOKING WIZARD ── */}
              {activeTab === "book" && !bookDone && (
                <motion.div key={`book-${bookingStep}`} {...stepCardMotion} style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}>
                  
                  {/* Steps Progress Header */}
                  <div style={{ display: "flex", gap: "10px", marginBottom: "32px" }}>
                    {["1. Schedule Appointment", "2. Your Details"].map((label, idx) => {
                      const step = idx + 1;
                      const active = bookingStep >= step;
                      return (
                        <div key={label} style={{ flex: 1 }}>
                          <div
                            style={{
                              height: "4px",
                              borderRadius: "999px",
                              background: active ? goldColor : (isNight ? "rgba(255,255,255,0.08)" : "rgba(10,22,40,0.08)"),
                              transition: "background 0.3s ease",
                            }}
                          />
                          <div
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: 800,
                              marginTop: "8px",
                              color: active ? cardText : cardText30,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              transition: "color 0.3s ease",
                            }}
                          >
                            {label}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* STEP 1: SCHEDULER */}
                  {bookingStep === 1 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px", flex: 1 }}>
                      {/* Grid Category Selection */}
                      <div>
                        <label style={labelStyle}>Select Solar Installation Type</label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }} className="sm:grid-cols-4">
                          {CATEGORIES.map((cat) => {
                            const CatIcon = cat.icon;
                            const isSelected = selCategory === cat.id;
                            return (
                              <button
                                key={cat.id}
                                onClick={() => setSelCategory(cat.id)}
                                style={{
                                  padding: "12px",
                                  borderRadius: "12px",
                                  border: `1.5px solid ${isSelected ? goldColor : (isNight ? "rgba(255,255,255,0.06)" : "rgba(10,22,40,0.08)")}`,
                                  background: isSelected ? `${goldColor}12` : "transparent",
                                  color: isSelected ? cardText : cardText55,
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: "8px",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <CatIcon size={16} style={{ color: isSelected ? goldColor : cardText30 }} />
                                <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{cat.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Horizontal date strip list */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                          <label style={labelStyle}>Select Inspection Date</label>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: cardText55 }}>
                            Showing week of {daysList[0].toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button
                            onClick={() => shiftWeek(-1)}
                            disabled={dateOffset === 0}
                            style={{
                              background: "transparent",
                              border: `1px solid ${inputBorder}`,
                              borderRadius: "10px",
                              width: "36px",
                              height: "60px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: dateOffset === 0 ? "not-allowed" : "pointer",
                              color: dateOffset === 0 ? cardText30 : cardText,
                              opacity: dateOffset === 0 ? 0.3 : 1,
                              transition: "all 0.2s",
                            }}
                          >
                            <ChevronLeft size={16} />
                          </button>

                          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px" }}>
                            {daysList.map((date) => {
                              const isSelected = selDate ? selDate.toDateString() === date.toDateString() : false;
                              const isToday = new Date().toDateString() === date.toDateString();
                              return (
                                <button
                                  key={date.toDateString()}
                                  onClick={() => { setSelDate(date); setSelTime(null); }}
                                  style={{
                                    height: "60px",
                                    borderRadius: "12px",
                                    border: `1.5px solid ${isSelected ? goldColor : (isToday ? `${goldColor}40` : (isNight ? "rgba(255,255,255,0.06)" : "rgba(10,22,40,0.08)"))}`,
                                    background: isSelected ? goldColor : "transparent",
                                    color: isSelected ? goldBg : cardText,
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "2px",
                                    transition: "all 0.2s ease",
                                  }}
                                >
                                  <span style={{ fontSize: "0.58rem", fontWeight: 850, textTransform: "uppercase", opacity: isSelected ? 0.75 : 0.4 }}>
                                    {DAY_NAMES[date.getDay()]}
                                  </span>
                                  <span style={{ fontSize: "0.9rem", fontWeight: 800 }}>
                                    {date.getDate()}
                                  </span>
                                  <span style={{ fontSize: "0.58rem", fontWeight: 850, textTransform: "uppercase", opacity: isSelected ? 0.75 : 0.4 }}>
                                    {MONTH_NAMES[date.getMonth()]}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          <button
                            onClick={() => shiftWeek(1)}
                            style={{
                              background: "transparent",
                              border: `1px solid ${inputBorder}`,
                              borderRadius: "10px",
                              width: "36px",
                              height: "60px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              color: cardText,
                              transition: "all 0.2s",
                            }}
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Time Slots Grid */}
                      <div>
                        <label style={labelStyle}>
                          {selDate
                            ? `Available slots for ${selDate.toLocaleDateString("en-IN", { day: "numeric", month: "long" })}`
                            : "Select a date first to see available slots"}
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }} className="sm:grid-cols-5">
                          {TIME_SLOTS.map((t) => {
                            const isSel = selTime === t;
                            const disabled = !selDate;
                            return (
                              <button
                                key={t}
                                disabled={disabled}
                                onClick={() => setSelTime(t)}
                                style={{
                                  padding: "11px 8px",
                                  borderRadius: "12px",
                                  border: `1.5px solid ${isSel ? "transparent" : (isNight ? "rgba(255,255,255,0.06)" : "rgba(10,22,40,0.08)")}`,
                                  fontSize: "0.8rem",
                                  fontWeight: 700,
                                  cursor: disabled ? "not-allowed" : "pointer",
                                  background: isSel ? goldColor : "transparent",
                                  color: isSel ? goldBg : disabled ? cardText30 : cardText,
                                  transition: "all 0.2s ease",
                                  opacity: disabled ? 0.4 : 1,
                                }}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Navigation buttons */}
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
                        <button
                          onClick={() => selDate && selTime && setBookingStep(2)}
                          disabled={!selDate || !selTime}
                          style={primaryBtn(!!(selDate && selTime))}
                        >
                          Continue to Details →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: DETAILS & SUMMARY */}
                  {bookingStep === 2 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "28px", flex: 1 }} className="md:flex-row">
                      {/* Summary Sidebar Block */}
                      <div
                        style={{
                          flex: "0 0 35%",
                          background: isNight ? "rgba(255,255,255,0.02)" : "rgba(10,22,40,0.02)",
                          border: `1px solid ${cardBorder}`,
                          borderRadius: "20px",
                          padding: "20px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px",
                        }}
                      >
                        <h4 style={{ fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase", color: goldColor, margin: 0, letterSpacing: "0.05em" }}>
                          Booking Details
                        </h4>
                        
                        <div>
                          <div style={{ fontSize: "0.62rem", textTransform: "uppercase", color: cardText30, fontWeight: 700 }}>Project Category</div>
                          <div style={{ fontSize: "0.85rem", color: cardText, fontWeight: 700 }}>{activeCategory.label} Solar</div>
                        </div>

                        <div>
                          <div style={{ fontSize: "0.62rem", textTransform: "uppercase", color: cardText30, fontWeight: 700 }}>Inspection Schedule</div>
                          <div style={{ fontSize: "0.85rem", color: cardText, fontWeight: 700 }}>
                            {selDate?.toLocaleDateString("en-IN", { day: "numeric", month: "short", weekday: "short" })}, {selTime}
                          </div>
                        </div>
                      </div>

                      {/* Inputs Form Block */}
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                          <div>
                            <label style={labelStyle}>Full Name</label>
                            <input
                              placeholder="Rahul Sharma"
                              style={inputStyle}
                              value={bookData.name}
                              onChange={(e) => setBookData((d) => ({ ...d, name: e.target.value }))}
                            />
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                            <div>
                              <label style={labelStyle}>Phone Number</label>
                              <input
                                placeholder="+91 98765 43210"
                                style={inputStyle}
                                value={bookData.phone}
                                onChange={(e) => setBookData((d) => ({ ...d, phone: e.target.value }))}
                              />
                            </div>
                            <div>
                              <label style={labelStyle}>Email Address</label>
                              <input
                                placeholder="you@email.com"
                                style={inputStyle}
                                value={bookData.email}
                                onChange={(e) => setBookData((d) => ({ ...d, email: e.target.value }))}
                              />
                            </div>
                          </div>

                          <div>
                            <label style={labelStyle}>Site Address</label>
                            <input
                              placeholder="House No, Road, Locality, City"
                              style={inputStyle}
                              value={bookData.address}
                              onChange={(e) => setBookData((d) => ({ ...d, address: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "24px" }}>
                          <button onClick={() => setBookingStep(1)} style={backBtn}>← Date & Time</button>
                          <button
                            disabled={!bookData.name.trim() || !bookData.phone.trim() || !bookData.address.trim()}
                            onClick={() => setBookDone(true)}
                            style={primaryBtn(!!(bookData.name.trim() && bookData.phone.trim() && bookData.address.trim()))}
                          >
                            Confirm Free Inspection
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </motion.div>
              )}

              {/* ── SEND MESSAGE TAB ── */}
              {activeTab === "message" && !msgDone && (
                <motion.div key="message" {...stepCardMotion} style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1, justifyContent: "space-between" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={labelStyle}>Full Name</label>
                        <input
                          placeholder="Rahul Sharma"
                          style={inputStyle}
                          value={msgData.name}
                          onChange={(e) => setMsgData((d) => ({ ...d, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Email Address</label>
                        <input
                          placeholder="you@email.com"
                          style={inputStyle}
                          value={msgData.email}
                          onChange={(e) => setMsgData((d) => ({ ...d, email: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Phone Number</label>
                      <input
                        placeholder="+91 98765 43210"
                        style={inputStyle}
                        value={msgData.phone}
                        onChange={(e) => setMsgData((d) => ({ ...d, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Message</label>
                      <textarea
                        placeholder="Tell us about your project requirements, goals, or ask any general question..."
                        style={{ ...inputStyle, resize: "none", height: "120px" }}
                        value={msgData.message}
                        onChange={(e) => setMsgData((d) => ({ ...d, message: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
                    <button
                      disabled={!msgData.name.trim() || !msgData.message.trim()}
                      onClick={() => setMsgDone(true)}
                      style={primaryBtn(!!(msgData.name.trim() && msgData.message.trim()))}
                    >
                      Send Message
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── SUCCESS SCREENS ── */}
              {(bookDone || msgDone) && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      background: `${goldColor}18`,
                      border: `1.5px solid ${goldColor}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Check size={28} color={goldColor} strokeWidth={2.5} />
                  </div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 900, color: cardText, margin: 0, fontFamily: "var(--font-serif)", textTransform: "uppercase" }}>
                    {bookDone ? "Booking Requested!" : "Message Sent!"}
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: cardText55, margin: 0, lineHeight: 1.7, maxWidth: "400px" }}>
                    {bookDone
                      ? `Thank you, ${bookData.name}. We've requested your ${activeCategory.label} solar inspection slot for ${selDate?.toLocaleDateString("en-IN", { day: "numeric", month: "short", weekday: "short" })} at ${selTime}. Our team will call within 2 hours to confirm.`
                      : `Thank you for contacting SunNest Power. We've received your query and will reply within 24 hours.`}
                  </p>
                  <button
                    onClick={bookDone ? resetBook : resetMsg}
                    style={{
                      marginTop: "16px",
                      padding: "10px 24px",
                      borderRadius: "999px",
                      border: `1px solid ${goldColor}55`,
                      background: "transparent",
                      color: goldColor,
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      fontFamily: "var(--font-sans)",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Start over
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* ── Contact Info Cards Grid ── */}
        <div
          style={{
            marginTop: "60px",
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            gap: "20px",
          }}
          className="sm:grid-cols-3"
        >
          {/* Card 1: Direct Email */}
          <motion.a
            href="mailto:sales@sunnestpower.com"
            whileHover={{ y: -5, borderColor: goldColor, boxShadow: `0 12px 30px ${goldColor}15` }}
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: "20px",
              padding: "24px 20px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
              transition: "background 0.3s ease, border-color 0.3s ease",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: `${goldColor}12`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: goldColor,
              }}
            >
              <Mail size={20} />
            </div>
            <div>
              <div style={{ fontSize: "0.65rem", fontWeight: 800, color: cardText55, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
                Direct Email
              </div>
              <span style={{ fontSize: "0.95rem", color: cardText, fontWeight: 800 }}>
                sales@sunnestpower.com
              </span>
            </div>
          </motion.a>

          {/* Card 2: Toll-Free Phone */}
          <motion.a
            href="tel:+919109102662"
            whileHover={{ y: -5, borderColor: goldColor, boxShadow: `0 12px 30px ${goldColor}15` }}
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: "20px",
              padding: "24px 20px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
              transition: "background 0.3s ease, border-color 0.3s ease",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: `${goldColor}12`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: goldColor,
              }}
            >
              <Phone size={20} />
            </div>
            <div>
              <div style={{ fontSize: "0.65rem", fontWeight: 800, color: cardText55, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
                Toll-Free Phone
              </div>
              <span style={{ fontSize: "0.95rem", color: cardText, fontWeight: 800 }}>
                +91-9109102662
              </span>
            </div>
          </motion.a>

          {/* Card 3: Service Operations */}
          <motion.div
            whileHover={{ y: -5, borderColor: goldColor, boxShadow: `0 12px 30px ${goldColor}15` }}
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: "20px",
              padding: "24px 20px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              transition: "background 0.3s ease, border-color 0.3s ease",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: `${goldColor}12`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: goldColor,
              }}
            >
              <Globe size={20} />
            </div>
            <div>
              <div style={{ fontSize: "0.65rem", fontWeight: 800, color: cardText55, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
                Service Operations
              </div>
              <span style={{ fontSize: "0.95rem", color: cardText, fontWeight: 800 }}>
                Pan India Coverage
              </span>
            </div>
          </motion.div>
        </div>

        {/* ── Social Media Channels ── */}
        <div
          style={{
            marginTop: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <span style={{ fontSize: "0.65rem", fontWeight: 800, color: cardText55, textTransform: "uppercase", letterSpacing: "0.15em" }}>
            Connect With Our Channels
          </span>
          <div style={{ display: "flex", gap: "16px" }}>
            {[
              { id: "insta", icon: InstagramIcon, href: "https://www.instagram.com/sunnestpower?igsh=MWNkYmcxcDg0bnBhcw%3D%3D&utm_source=qr" },
              { id: "linkedin", icon: LinkedinIcon, href: "https://www.linkedin.com/company/sunnest-power/" },
              { id: "facebook", icon: FacebookIcon, href: "https://www.facebook.com/share/161aZ8ZhACb/?mibextid=wwXIfr" },
            ].map((soc) => {
              const IconComp = soc.icon;
              return (
                <motion.a
                  key={soc.id}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, color: goldColor, background: `${goldColor}12` }}
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    border: `1px solid ${cardBorder}`,
                    background: cardBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: cardText70,
                    transition: "color 0.2s ease, border-color 0.2s ease",
                  }}
                >
                  <IconComp size={18} />
                </motion.a>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
