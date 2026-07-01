"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Headphones,
  Cpu,
  TrendingUp,
  Zap,
  Activity,
  Leaf,
  FileText,
  Coins,
  Award,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const SQRT_5000 = Math.sqrt(5000);

const CORE_BENEFITS = [
  {
    tempId: 0,
    title: "Reliable Supply",
    description: "Uncompromised sourcing of Tier-1 solar modules and premium components directly from top-tier global manufacturers.",
    icon: ShieldCheck,
  },
  {
    tempId: 1,
    title: "Proper Support",
    description: "Proactive 24/7 system monitoring and a dedicated, rapid-response service team to keep your solar array performing perfectly.",
    icon: Headphones,
  },
  {
    tempId: 2,
    title: "Smart Solar Solutions",
    description: "Next-gen solar installations with real-time IoT tracking app, optimized electrical design, and fast net metering integration.",
    icon: Cpu,
  },
  {
    tempId: 3,
    title: "Long Term Growth",
    description: "Shield your capital from rising grid electricity tariffs and generate compounding financial savings for 25+ years.",
    icon: TrendingUp,
  },
  {
    tempId: 4,
    title: "Stronger Performance",
    description: "Precision EPC engineering and optimal tilt design matching Maharashtrian geography, boosting energy yields by up to 15%.",
    icon: Zap,
  },
  {
    tempId: 5,
    title: "Business Continuity",
    description: "Bespoke captive power backup designed for seamless integration with diesel generators and heavy industrial machinery.",
    icon: Activity,
  },
  {
    tempId: 6,
    title: "Sustainable Impact",
    description: "Substantially reduce carbon emissions, meet ESG corporate mandates, and establish a green branding footprint.",
    icon: Leaf,
  },
  {
    tempId: 7,
    title: "DCR & Subsidy Mastery",
    description: "End-to-end management of residential subsidies, local utility documentation, grid approvals, and net metering liaisoning.",
    icon: FileText,
  },
  {
    tempId: 8,
    title: "Zero-Capital Financing",
    description: "Explore flexible solar OPEX models, customized leasing options, and zero-deposit structures for rapid ROI.",
    icon: Coins,
  },
  {
    tempId: 9,
    title: "Tata Power Heritage",
    description: "Engineered and supervised by leadership with hands-on Tata Power Solar experience, maintaining elite execution standards.",
    icon: Award,
  },
];

interface TestimonialCardProps {
  position: number;
  benefit: (typeof CORE_BENEFITS)[0];
  handleMove: (steps: number) => void;
  cardSize: number;
  isNight: boolean;
  goldColor: string;
  pageBg: string;
  pageText: string;
}

function TestimonialCard({
  position,
  benefit,
  handleMove,
  cardSize,
  isNight,
  goldColor,
  pageBg,
  pageText,
}: TestimonialCardProps) {
  const isCenter = position === 0;

  const cardBg     = isCenter ? "#0A1628" : (isNight ? "#111115" : "#ffffff");
  const cardText   = isCenter ? "#f2f5ea" : pageText;
  const cardBorder = isCenter ? goldColor : (isNight ? "rgba(255,255,255,0.10)" : "rgba(10,22,40,0.13)");
  const mutedText  = isCenter ? "rgba(242,245,234,0.55)" : (isNight ? "rgba(242,245,234,0.42)" : "rgba(10,22,40,0.48)");
  const diagColor  = isNight ? "rgba(255,255,255,0.10)" : "rgba(10,22,40,0.10)";
  const Icon       = benefit.icon;

  return (
    <div
      onClick={() => handleMove(position)}
      style={{
        position:   "absolute",
        left:       "50%",
        top:        "50%",
        width:      cardSize,
        height:     cardSize,
        background: cardBg,
        border:     `2px solid ${cardBorder}`,
        padding:    "28px",
        cursor:     isCenter ? "default" : "pointer",
        boxSizing:  "border-box",
        display:    "flex",
        flexDirection: "column",
        transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
        boxShadow:  isCenter ? "0px 8px 0px 4px rgba(0,0,0,0.18)" : "none",
        clipPath:   "polygon(44px 0%, calc(100% - 44px) 0%, 100% 44px, 100% 100%, calc(100% - 44px) 100%, 44px 100%, 0 100%, 0 0)",
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        zIndex: isCenter ? 10 : 0,
      }}
    >
      {/* Diagonal cut accent line */}
      <span
        style={{
          position:        "absolute",
          right:           -2,
          top:             42,
          width:           SQRT_5000,
          height:          2,
          background:      isCenter ? `${goldColor}60` : diagColor,
          transformOrigin: "top right",
          transform:       "rotate(45deg)",
          display:         "block",
        }}
      />

      {/* Icon Badge */}
      <div
        style={{
          marginBottom: "20px",
          height:       "48px",
          width:        "48px",
          borderRadius: "12px",
          display:      "flex",
          alignItems:   "center",
          justifyContent: "center",
          background:   isCenter ? `${goldColor}20` : (isNight ? "rgba(255,255,255,0.06)" : "rgba(10,22,40,0.05)"),
          border:       `1px solid ${isCenter ? goldColor : (isNight ? "rgba(255,255,255,0.15)" : "rgba(10,22,40,0.15)")}`,
          color:        isCenter ? goldColor : (isNight ? "#ffffff" : "#0A1628"),
          flexShrink:   0,
        }}
      >
        <Icon size={22} />
      </div>

      {/* Benefit Title */}
      <h3
        style={{
          fontSize:   "clamp(1rem, 1.2vw, 1.25rem)",
          fontWeight: 800,
          color:      isCenter ? "#ffffff" : cardText,
          margin:     "0 0 10px 0",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          flexShrink: 0,
        }}
      >
        {benefit.title}
      </h3>

      {/* Benefit Description */}
      <p
        style={{
          fontSize:   "clamp(0.78rem, 0.9vw, 0.85rem)",
          fontWeight: 400,
          lineHeight: 1.6,
          color:      isCenter ? "rgba(255,255,255,0.7)" : mutedText,
          margin:     0,
          flex:       1,
        }}
      >
        {benefit.description}
      </p>
    </div>
  );
}

export function StaggerTestimonials() {
  const { theme } = useTheme();
  const isNight = theme === "night";

  const pageBg    = isNight ? "#0c0f1a" : "#FBF8F0";
  const pageText  = isNight ? "#f2f5ea" : "#0A1628";
  const goldColor = isNight ? "#60A5FA" : "#D4A017";

  const [cardSize, setCardSize] = useState(340);
  const [list, setList]         = useState(CORE_BENEFITS);

  const handleMove = (steps: number) => {
    const next = [...list];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = next.shift();
        if (!item) return;
        next.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = next.pop();
        if (!item) return;
        next.unshift({ ...item, tempId: Math.random() });
      }
    }
    setList(next);
  };

  useEffect(() => {
    const update = () => {
      setCardSize(window.matchMedia("(min-width: 640px)").matches ? 340 : 270);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const btnStyle: React.CSSProperties = {
    width:          "50px",
    height:         "50px",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    background:     isNight ? "#111115" : "#ffffff",
    border:         `2px solid ${isNight ? "rgba(255,255,255,0.10)" : "rgba(10,22,40,0.13)"}`,
    color:          isNight ? "rgba(242,245,234,0.55)" : "rgba(10,22,40,0.55)",
    cursor:         "pointer",
    transition:     "background 0.2s ease, border-color 0.2s ease, color 0.2s ease",
    borderRadius:   "6px",
  };

  const onEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    el.style.background   = goldColor;
    el.style.borderColor  = goldColor;
    el.style.color        = "#0A1628";
  };
  const onLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    el.style.background   = btnStyle.background as string;
    el.style.borderColor  = isNight ? "rgba(255,255,255,0.10)" : "rgba(10,22,40,0.13)";
    el.style.color        = btnStyle.color as string;
  };

  return (
    <div
      style={{
        width:      "100%",
        overflow:   "hidden",
        background: pageBg,
        position:   "relative",
        height:     560,
        transition: "background 0.4s ease",
      }}
    >
      {list.map((benefit, index) => {
        const position =
          list.length % 2
            ? index - (list.length + 1) / 2
            : index - list.length / 2;
        return (
          <TestimonialCard
            key={benefit.tempId}
            benefit={benefit}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
            isNight={isNight}
            goldColor={goldColor}
            pageBg={pageBg}
            pageText={pageText}
          />
        );
      })}

      {/* Navigation */}
      <div
        style={{
          position:  "absolute",
          bottom:    "20px",
          left:      "50%",
          transform: "translateX(-50%)",
          display:   "flex",
          gap:       "8px",
        }}
      >
        <button onClick={() => handleMove(-1)} style={btnStyle} onMouseEnter={onEnter} onMouseLeave={onLeave} aria-label="Previous">
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => handleMove(1)} style={btnStyle} onMouseEnter={onEnter} onMouseLeave={onLeave} aria-label="Next">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
