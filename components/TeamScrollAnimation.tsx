"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Home, Building2, Landmark, Factory, Check } from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────
const SOLUTIONS = [
  {
    initial:      "R",
    icon:         Home,
    image:        "/images/residential.png",
    tagline:      "For homeowners",
    title:        "Residential\nSolar",
    description:  "Transform your rooftop into a source of clean energy and long-term savings. Reduce electricity bills while increasing the value of your home.",
    points:       ["70–90% bill reduction", "Rooftop & ground-mount options", "25-year performance warranty", "Zero-paperwork installation"],
    from:         "#D4A017",
    to:           "#FF9100",
  },
  {
    initial:      "C",
    icon:         Building2,
    image:        "/images/commercial.png",
    tagline:      "For businesses",
    title:        "Commercial\nSolar",
    description:  "Help your business lower operational expenses, improve profitability, and reduce dependence on rising electricity tariffs with scalable solar systems.",
    points:       ["Reduce operational costs", "Improve profit margins", "Scale as you grow", "Fast ROI (3–5 years)"],
    from:         "#2563EB",
    to:           "#60A5FA",
  },
  {
    initial:      "I",
    icon:         Landmark,
    image:        "/images/institutional.png",
    tagline:      "Schools · Hospitals · Govt",
    title:        "Institutional\nSolar",
    description:  "Reliable solar solutions for institutions looking to reduce energy costs, meet sustainability goals, and access government subsidies.",
    points:       ["Schools & colleges", "Hospitals & clinics", "Government buildings", "DCR & subsidy support"],
    from:         "#7C3AED",
    to:           "#A78BFA",
  },
  {
    initial:      "N",
    icon:         Factory,
    image:        "/images/industrial.png",
    tagline:      "Factories & plants",
    title:        "Industrial\nSolar",
    description:  "Captive power generation at industrial scale — cut peak demand charges, meet green mandates, and shield your plant from grid volatility.",
    points:       ["High-load energy offset", "Captive power generation", "Government incentives", "Custom EPC delivery"],
    from:         "#059669",
    to:           "#34D399",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function TeamScrollAnimation() {
  const { theme } = useTheme();
  const isNight   = theme === "night";

  const pageBg = isNight ? "#0c0f1a" : "#FBF8F0";

  const sectionRef     = useRef<HTMLElement>(null);
  const membersRef     = useRef<(HTMLDivElement | null)[]>([]);
  const initialsRef    = useRef<(HTMLSpanElement | null)[]>([]);
  const cardsRef       = useRef<(HTMLDivElement | null)[]>([]);
  const mobileCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let st1: any     = null;
    let st2: any     = null;
    let stMob: any[] = [];

    async function init() {
      const { gsap }          = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      st1?.kill();
      st2?.kill();
      stMob.forEach((s) => s?.kill());
      st1   = null;
      st2   = null;
      stMob = [];

      // ════════════════════════════════════════════════════════════════════════
      // DESKTOP (≥ 1000 px)
      // ════════════════════════════════════════════════════════════════════════
      if (window.innerWidth >= 1000) {
        const section  = sectionRef.current;
        const members  = membersRef.current.filter(Boolean)  as HTMLDivElement[];
        const initials = initialsRef.current.filter(Boolean) as HTMLSpanElement[];
        const cards    = cardsRef.current.filter(Boolean)    as HTMLDivElement[];

        if (!section || members.length === 0) return;

        members.forEach((m)   => gsap.set(m,  { yPercent: 125 }));
        initials.forEach((el) => gsap.set(el, { scale: 0 }));

        cards.forEach((card, i) => {
          gsap.set(card, {
            x:        window.innerWidth + (3 - i) * 80,
            scale:    0.75,
            rotation: i % 2 === 0 ? 20 : -20,
          });
        });

        st1 = ScrollTrigger.create({
          trigger: section,
          start:   "top bottom",
          end:     "top top",
          scrub:   true,
          onUpdate(self: any) {
            const p = self.progress;
            members.forEach((member, i) => {
              const start  = i * 0.10;
              const end    = start + 0.70;
              const letter = initials[i];
              if (p < start) {
                gsap.set(member, { yPercent: 125 });
                gsap.set(letter,  { scale: 0 });
              } else if (p <= end) {
                const mp = (p - start) / 0.70;
                gsap.set(member, { yPercent: 125 * (1 - mp) });
                gsap.set(letter,  { scale: Math.max(0, (mp - 0.4) / 0.6) });
              } else {
                gsap.set(member, { yPercent: 0 });
                gsap.set(letter,  { scale: 1 });
              }
            });
          },
        });

        st2 = ScrollTrigger.create({
          trigger: section,
          start:   "top top",
          end:     `+=${window.innerHeight * 4}`,
          scrub:   1,
          pin:     true,
          onUpdate(self: any) {
            const p = self.progress;
            cards.forEach((card, i) => {
              const startX  = window.innerWidth + (3 - i) * 80;
              const initRot = i % 2 === 0 ? 20 : -20;

              const slideStart = i * 0.06;
              const slideEnd   = slideStart + 0.40;
              if (p < slideStart) {
                gsap.set(card, { x: startX, rotation: initRot });
              } else if (p <= slideEnd) {
                const cp = (p - slideStart) / 0.40;
                gsap.set(card, { x: startX * (1 - cp), rotation: initRot * (1 - cp) });
              } else {
                gsap.set(card, { x: 0, rotation: 0 });
              }

              const scaleStart = 0.35 + i * 0.10;
              if (p < scaleStart) {
                gsap.set(card, { scale: 0.75 });
              } else if (p <= 1) {
                const sp = (p - scaleStart) / (1 - scaleStart);
                gsap.set(card, { scale: 0.75 + sp * 0.25 });
              } else {
                gsap.set(card, { scale: 1 });
              }
            });
          },
        });

        return;
      }

      // ════════════════════════════════════════════════════════════════════════
      // MOBILE (< 1000 px)
      // ════════════════════════════════════════════════════════════════════════
      const mobileCards = mobileCardsRef.current.filter(Boolean) as HTMLDivElement[];
      if (mobileCards.length === 0) return;

      mobileCards.forEach((card, i) => {
        gsap.set(card, { x: window.innerWidth, rotation: 8 - i * 2 });

        const st = ScrollTrigger.create({
          trigger: card,
          start:   "top 90%",
          end:     "top 30%",
          scrub:   1.2,
          onUpdate(self: any) {
            const p = self.progress;
            gsap.set(card, {
              x:        window.innerWidth * (1 - p),
              rotation: (8 - i * 2) * (1 - p),
            });
          },
        });
        stMob.push(st);
      });
    }

    init();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(init, 250);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      st1?.kill();
      st2?.kill();
      stMob.forEach((s) => s?.kill());
    };
  }, []);

  const pageText   = isNight ? "#f2f5ea"               : "#0A1628";
  const pageText45 = isNight ? "rgba(242,245,234,0.45)" : "rgba(10,22,40,0.50)";
  const goldColor  = isNight ? "#60A5FA"               : "#D4A017";

  return (
    <div id="solutions" style={{ background: pageBg, transition: "background 0.4s ease" }}>

      {/* ── Section header ──────────────────────────────────────────────────── */}
      <section
        className="relative w-full flex flex-col items-center justify-center text-center px-6 overflow-hidden"
        style={{ minHeight: "0vh", paddingTop: "var(--section-padding-top)", paddingBottom: "16px" }}
      >
        <p className="text-[0.65rem] uppercase tracking-[0.35em] font-semibold text-[#fc694c]/60 mb-5">
          What We Offer
        </p>
        <h1
          className="font-black uppercase leading-[0.85]"
          style={{ fontSize: "clamp(3.5rem, 11vw, 11rem)", color: pageText, transition: "color 0.4s ease" }}
        >
          Our{" "}
          <span style={{ color: goldColor, transition: "color 0.4s ease" }}>
            Solutions
          </span>
        </h1>
        <p
          className="mt-7 max-w-lg text-sm md:text-base leading-relaxed"
          style={{ color: pageText45, transition: "color 0.4s ease" }}
        >
          Customized solar installations engineered to maximise yield, lower
          costs, and secure long-term energy independence.
        </p>
        <a
          href="#"
          className="mt-8 inline-flex items-center gap-1 font-semibold text-xs uppercase tracking-[0.2em] hover:opacity-70 transition-opacity"
          style={{ color: "#D4A017" }}
        >
          Explore Pricing Plans →
        </a>
      </section>

      {/* ── Desktop animation (≥ 1000 px) ──────────────────────────────────── */}
      <div className="hidden lg:block overflow-hidden">
        <section
          ref={sectionRef}
          className="relative w-full h-screen flex gap-3 px-4 pb-4 pt-20"
          style={{ background: pageBg, transition: "background 0.4s ease" }}
        >
          {SOLUTIONS.map((sol, i) => {
            const Icon = sol.icon;
            return (
              <div
                key={sol.initial}
                ref={(el) => { membersRef.current[i] = el; }}
                className="relative flex-1 h-full rounded-2xl border border-dashed will-change-transform"
                style={{ borderColor: `${sol.from}30` }}
              >
                {/* Placeholder: large initial */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                  <span
                    ref={(el) => { initialsRef.current[i] = el; }}
                    className="font-black uppercase leading-none select-none will-change-transform"
                    style={{ fontSize: "clamp(7rem, 16vw, 18rem)", color: sol.from, opacity: 0.15 }}
                  >
                    {sol.initial}
                  </span>
                </div>

                {/* Full card */}
                <div
                  ref={(el) => { cardsRef.current[i] = el; }}
                  className="absolute inset-0 rounded-2xl flex flex-col overflow-hidden will-change-transform group/card"
                  style={{
                    background: "radial-gradient(circle at top left, rgba(255,255,255,0.02), transparent), #0C1018",
                    border: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: `0 20px 40px -15px rgba(0,0,0,0.7), 0 0 30px -10px ${sol.from}12`,
                  }}
                >
                  {/* Gradient stripe */}
                  <div style={{ height: "3px", background: `linear-gradient(90deg, ${sol.from}, ${sol.to})`, flexShrink: 0 }} />

                  {/* Image portion */}
                  <div className="relative w-full h-[38%] overflow-hidden shrink-0">
                    <img
                      src={sol.image}
                      alt={sol.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                    />
                    {/* Shadow gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C1018] via-[#0C1018]/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0C1018]/40 via-transparent to-transparent" />

                    {/* Floated Tagline + Icon on top of the image */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                      <span
                        className="font-mono text-[9px] xl:text-[10px] tracking-[0.25em] uppercase font-bold px-3 py-1 rounded-full backdrop-blur-md bg-[#0C1018]/65 border border-white/5"
                        style={{ color: sol.from }}
                      >
                        {sol.tagline}
                      </span>
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 backdrop-blur-md bg-[#0C1018]/65 border"
                        style={{ borderColor: `${sol.from}40` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: sol.from }} />
                      </div>
                    </div>
                  </div>

                  {/* Content portion */}
                  <div className="flex-1 flex flex-col p-5 xl:p-6 min-h-0 justify-between bg-[#0C1018]">
                    {/* Title & Description */}
                    <div className="space-y-3.5">
                      <h2
                        className="font-black uppercase leading-[0.9] whitespace-pre-line tracking-tight"
                        style={{ fontSize: "clamp(1.3rem, 1.8vw, 2.4rem)", color: "#ffffff" }}
                      >
                        {sol.title}
                      </h2>
                      <div className="h-[1px] w-full" style={{ background: `linear-gradient(90deg, ${sol.from}40, transparent)` }} />
                      <p
                        className="leading-relaxed"
                        style={{ fontSize: "clamp(0.72rem, 0.85vw, 0.85rem)", color: "rgba(255,255,255,0.55)" }}
                      >
                        {sol.description}
                      </p>
                    </div>

                    {/* Bullet points with checkmarks */}
                    <div className="mt-4">
                      <ul className="space-y-2.5">
                        {sol.points.map((pt) => (
                          <li key={pt} className="flex items-start gap-2.5">
                            <div
                              className="w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                              style={{ background: `${sol.from}15`, border: `1px solid ${sol.from}35` }}
                            >
                              <Check className="w-2.5 h-2.5" style={{ color: sol.from }} />
                            </div>
                            <span
                              className="font-medium leading-snug"
                              style={{ fontSize: "clamp(0.7rem, 0.82vw, 0.82rem)", color: "rgba(255,255,255,0.75)" }}
                            >
                              {pt}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>

      {/* ── Mobile layout (< 1000 px) ───────────────────────────────────────── */}
      <div className="lg:hidden overflow-x-hidden px-4 pt-6 pb-4">
        <div className="flex flex-col gap-4">
          {SOLUTIONS.map((sol, i) => {
            const Icon = sol.icon;
            return (
              <div
                key={sol.initial}
                ref={(el) => { mobileCardsRef.current[i] = el; }}
                className="relative rounded-2xl overflow-hidden will-change-transform flex flex-col"
                style={{
                  background: "radial-gradient(circle at top left, rgba(255,255,255,0.02), transparent), #0C1018",
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow: `0 15px 30px -10px rgba(0,0,0,0.6), 0 0 20px -8px ${sol.from}10`,
                }}
              >
                {/* Gradient stripe */}
                <div style={{ height: "3px", background: `linear-gradient(90deg, ${sol.from}, ${sol.to})` }} />

                {/* Image portion */}
                <div className="relative w-full h-44 overflow-hidden shrink-0">
                  <img
                    src={sol.image}
                    alt={sol.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Shadow gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C1018] via-[#0C1018]/30 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0C1018]/40 via-transparent to-transparent" />

                  {/* Floated Tagline + Icon on top of the image */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span
                      className="font-mono text-[9px] tracking-[0.25em] uppercase font-bold px-2.5 py-1 rounded-full backdrop-blur-md bg-[#0C1018]/65 border border-white/5"
                      style={{ color: sol.from }}
                    >
                      {sol.tagline}
                    </span>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 backdrop-blur-md bg-[#0C1018]/65 border"
                      style={{ borderColor: `${sol.from}40` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: sol.from }} />
                    </div>
                  </div>
                </div>

                {/* Content portion */}
                <div className="relative z-10 p-5 bg-[#0C1018]">
                  {/* Faint watermark initial in background of content */}
                  <span
                    className="absolute bottom-0 right-3 font-black uppercase leading-none select-none pointer-events-none z-0"
                    style={{ fontSize: "7rem", color: sol.from, opacity: 0.04 }}
                  >
                    {sol.initial}
                  </span>

                  <div className="relative z-10">
                    {/* Title */}
                    <h2
                      className="font-black uppercase leading-[0.9] whitespace-pre-line text-white mb-3"
                      style={{ fontSize: "clamp(1.5rem, 6vw, 2rem)" }}
                    >
                      {sol.title}
                    </h2>

                    {/* Divider */}
                    <div
                      className="mb-4"
                      style={{ height: "1px", background: `linear-gradient(90deg, ${sol.from}40, transparent)` }}
                    />

                    {/* Description */}
                    <p className="text-sm text-white/55 leading-relaxed mb-4">
                      {sol.description}
                    </p>

                    {/* Bullet points with checkmarks */}
                    <ul className="space-y-2.5">
                      {sol.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-2.5 text-sm text-white/75">
                          <div
                            className="w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: `${sol.from}15`, border: `1px solid ${sol.from}35` }}
                          >
                            <Check className="w-2.5 h-2.5" style={{ color: sol.from }} />
                          </div>
                          <span className="font-medium leading-snug">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
