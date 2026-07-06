"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

const STEPS = [
  {
    step: "01",
    title: "Site Assessment & Energy Analysis",
    description:
      "We visit your site, study your energy consumption, and analyse rooftop feasibility.",
    imageSrc: "/images/process-1.png",
  },
  {
    step: "02",
    title: "Customized System Design",
    description:
      "Our engineers design a solar system tailored to your specific load and space.",
    imageSrc: "/images/process-2.png",
  },
  {
    step: "03",
    title: "Documentation & Approval Support",
    description:
      "We handle DCR certifications, net metering applications, and all statutory approvals.",
    imageSrc: "/images/process-3.png",
  },
  {
    step: "04",
    title: "Installation & Commissioning",
    description:
      "Our in-house team installs, wires, and commissions your solar plant within the agreed timeline.",
    imageSrc: "/images/process-4.png",
  },
  {
    step: "05",
    title: "Monitoring & After-Sales Service",
    description:
      "We provide performance monitoring and responsive support throughout the plant's lifetime.",
    imageSrc: "/images/process-5.png",
  },
];

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function desktopTransform(cp: number) {
  if (cp < -1.3 || cp > 1.3) {
    return { y: 0, rotateX: 0, rotateY: 0, opacity: 0, scale: 1, zIndex: 0 };
  }
  const t = clamp(cp, -1, 1);
  let y: number, rotateX: number, rotateY: number, opacity: number, scale: number;
  if (t <= 0) {
    const enter = -t;
    y = lerp(0, 180, enter);
    rotateX = lerp(0, 28, enter);
    rotateY = lerp(0, 8, enter);
    opacity = lerp(1, 0.30, enter);
    scale = lerp(1, 0.86, enter);
  } else {
    y = lerp(0, -140, t);
    rotateX = lerp(0, -22, t);
    rotateY = lerp(0, -6, t);
    opacity = lerp(1, 0.35, t);
    scale = lerp(1, 0.90, t);
  }
  if (Math.abs(cp) > 1) {
    const fade = 1 - (Math.abs(cp) - 1) / 0.3;
    opacity *= clamp(fade, 0, 1);
  }
  return { y, rotateX, rotateY, opacity, scale, zIndex: Math.round(10 - Math.abs(cp) * 5) };
}

function mobileTransform(cp: number) {
  if (cp < -1.3 || cp > 1.3) {
    return { y: 0, rotateX: 0, opacity: 0, scale: 1, zIndex: 0 };
  }
  const t = clamp(cp, -1, 1);
  let y: number, rotateX: number, opacity: number, scale: number;
  if (t <= 0) {
    const enter = -t;
    y = lerp(0, 100, enter);
    rotateX = lerp(0, 22, enter);
    opacity = lerp(1, 0.25, enter);
    scale = lerp(1, 0.88, enter);
  } else {
    y = lerp(0, -80, t);
    rotateX = lerp(0, -18, t);
    opacity = lerp(1, 0.30, t);
    scale = lerp(1, 0.92, t);
  }
  if (Math.abs(cp) > 1) {
    const fade = 1 - (Math.abs(cp) - 1) / 0.3;
    opacity *= clamp(fade, 0, 1);
  }
  return { y, rotateX, opacity, scale, zIndex: Math.round(10 - Math.abs(cp) * 5) };
}

export default function ProcessSection() {
  const { theme } = useTheme();
  const isNight = theme === "night";

  const goldColor = isNight ? "#60A5FA" : "#D4A017";

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  const sectionRef      = useRef<HTMLElement>(null);
  const desktopStageRef = useRef<HTMLDivElement>(null);
  const mobileStageRef  = useRef<HTMLDivElement>(null);
  const desktopCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileCardRefs  = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let st: any = null;
    let stMobile: any = null;
    let isMounted = true;

    async function init() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!isMounted) return;

      st?.kill();
      stMobile?.kill();
      st = null;
      stMobile = null;

      const section      = sectionRef.current;
      const desktopStage = desktopStageRef.current;
      const mobileStage  = mobileStageRef.current;
      const dCards       = desktopCardRefs.current.filter(Boolean) as HTMLDivElement[];
      const mCards       = mobileCardRefs.current.filter(Boolean) as HTMLDivElement[];

      if (!section) return;

      const isMobile = window.innerWidth < 1000;

      if (!isMobile && desktopStage && dCards.length === STEPS.length) {
        dCards.forEach((card, i) => {
          const tr = desktopTransform(-i);
          gsap.set(card, { y: tr.y, rotateX: tr.rotateX, rotateY: tr.rotateY, opacity: tr.opacity, scale: tr.scale, zIndex: tr.zIndex, transformOrigin: "center center" });
        });

        st = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=${window.innerHeight * 4}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self: any) {
            const p = self.progress;
            dCards.forEach((card, i) => {
              const tr = desktopTransform(p * 4 - i);
              gsap.set(card, { y: tr.y, rotateX: tr.rotateX, rotateY: tr.rotateY, opacity: tr.opacity, scale: tr.scale, zIndex: tr.zIndex });
            });
            const idx = Math.min(4, Math.max(0, Math.round(p * 4)));
            if (idx !== activeIndexRef.current) {
              activeIndexRef.current = idx;
              setActiveIndex(idx);
            }
          },
        });
      }

      if (isMobile && mobileStage && mCards.length === STEPS.length) {
        mCards.forEach((card, i) => {
          const tr = mobileTransform(-i);
          gsap.set(card, { y: tr.y, rotateX: tr.rotateX, opacity: tr.opacity, scale: tr.scale, zIndex: tr.zIndex, transformOrigin: "center center" });
        });

        stMobile = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=${window.innerHeight * 4}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self: any) {
            const p = self.progress;
            mCards.forEach((card, i) => {
              const tr = mobileTransform(p * 4 - i);
              gsap.set(card, { y: tr.y, rotateX: tr.rotateX, opacity: tr.opacity, scale: tr.scale, zIndex: tr.zIndex });
            });
            const idx = Math.min(4, Math.max(0, Math.round(p * 4)));
            if (idx !== activeIndexRef.current) {
              activeIndexRef.current = idx;
              setActiveIndex(idx);
            }
          },
        });
      }
    }

    init();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(init, 250);
    };
    window.addEventListener("resize", onResize);

    return () => {
      isMounted = false;
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      st?.kill();
      stMobile?.kill();
    };
  }, []);

  return (
    // Nav-anchor lives on this outer, non-pinned wrapper rather than the
    // GSAP-pinned <section> itself — scrollIntoView() on a pinned element
    // (GSAP wraps it in a pin-spacer and repositions it) lands at the wrong
    // scroll offset, which is why "Process" in the navbar used to undershoot
    // into whatever section came before it.
    <div id="process">
    <section
      ref={sectionRef}
      style={{
        background:     "#06080D",
        minHeight:      "100vh",
        display:        "flex",
        flexDirection:  "column",
        overflow:       "hidden",
        boxSizing:      "border-box",
      }}
    >
      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <div
        style={{
          padding:    "var(--section-padding-top) clamp(28px, 6vw, 80px) 28px",
          flexShrink: 0,
          display:    "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap:        "16px",
          width:      "100%",
          maxWidth:   "1000px",
          margin:     "0 auto",
        }}
      >
        <div>
          <span
            style={{
              display:       "block",
              fontSize:      "0.65rem",
              fontWeight:    700,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color:         `${goldColor}99`,
              marginBottom:  "10px",
              transition:    "color 0.4s ease",
            }}
          >
            How It Works
          </span>
          <h2
            style={{
              fontSize:   "clamp(3.5rem, 7vw, 6rem)",
              fontWeight: 900,
              textTransform: "uppercase",
              lineHeight: 0.85,
              color:      "#ffffff",
              margin:     0,
            }}
          >
            Our Process
          </h2>
        </div>
        <p
          style={{
            fontSize:  "0.92rem",
            color:     "rgba(242,245,234,0.58)",
            maxWidth:  "480px",
            lineHeight: 1.65,
            margin:    0,
          }}
        >
          Five straightforward steps — from first contact to lifelong clean energy.
        </p>
      </div>

      {/* ── DESKTOP stage (≥ 1000 px) ─────────────────────────────────────────── */}
      <div
        ref={desktopStageRef}
        className="hidden md:block"
        style={{
          position:          "relative",
          flex:              1,
          minHeight:         0,
          margin:            "0 clamp(28px, 6vw, 80px) 40px",
          perspective:       "1400px",
          perspectiveOrigin: "50% 50%",
          overflow:          "hidden",
          borderRadius:      "28px",
        }}
      >
        {STEPS.map((s, i) => {
          const imageLeft = i % 2 === 0;
          return (
            <div
              key={s.step}
              ref={(el) => { desktopCardRefs.current[i] = el; }}
              style={{
                position:       "absolute",
                inset:          0,
                display:        "flex",
                flexDirection:  imageLeft ? "row" : "row-reverse",
                borderRadius:   "28px",
                overflow:       "hidden",
                background:     "#0D1117",
                border:         "1px solid rgba(255,255,255,0.08)",
                boxShadow:      "0 40px 100px rgba(0,0,0,0.6)",
                willChange:     "transform, opacity",
              }}
            >
              {/* Image half */}
              <div style={{ position: "relative", width: "45%", flexShrink: 0 }}>
                <Image
                  src={s.imageSrc}
                  alt={s.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 1200px) 45vw, 540px"
                />
                <div
                  style={{
                    position: "absolute",
                    inset:    0,
                    background: imageLeft
                      ? "linear-gradient(to right, transparent 55%, rgba(13,17,23,0.8))"
                      : "linear-gradient(to left,  transparent 55%, rgba(13,17,23,0.8))",
                  }}
                />
                {/* Step badge on image */}
                <div
                  style={{
                    position:       "absolute",
                    top:            "20px",
                    ...(imageLeft ? { left: "20px" } : { right: "20px" }),
                    display:        "flex",
                    alignItems:     "center",
                    gap:            "8px",
                    background:     "rgba(0,0,0,0.52)",
                    backdropFilter: "blur(8px)",
                    padding:        "6px 14px",
                    borderRadius:   "999px",
                    border:         `1px solid ${goldColor}40`,
                  }}
                >
                  <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: goldColor, transition: "color 0.4s ease" }}>
                    Step {s.step}
                  </span>
                </div>
              </div>

              {/* Text half */}
              <div
                style={{
                  flex:           1,
                  display:        "flex",
                  flexDirection:  "column",
                  justifyContent: "center",
                  padding:        "clamp(32px, 4vw, 60px) clamp(32px, 4vw, 60px)",
                  position:       "relative",
                  overflow:       "hidden",
                }}
              >
                {/* Decorative step number watermark */}
                <span
                  style={{
                    position:      "absolute",
                    bottom:        "-24px",
                    right:         "24px",
                    fontSize:      "clamp(7rem, 12vw, 13rem)",
                    fontWeight:    900,
                    color:         "rgba(255,255,255,0.04)",
                    lineHeight:    1,
                    userSelect:    "none",
                    pointerEvents: "none",
                  }}
                >
                  {s.step}
                </span>

                {/* Gold accent bar */}
                <div
                  style={{
                    width:        "40px",
                    height:       "3px",
                    background:   goldColor,
                    borderRadius: "3px",
                    marginBottom: "24px",
                    transition:   "background 0.4s ease",
                  }}
                />

                {/* Title */}
                <h3
                  style={{
                    fontSize:   "clamp(1.6rem, 2.4vw, 2.4rem)",
                    fontWeight: 800,
                    lineHeight: 1.15,
                    color:      "#f2f5ea",
                    margin:     "0 0 20px",
                  }}
                >
                  {s.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize:   "clamp(0.9rem, 1.1vw, 1.05rem)",
                    lineHeight: 1.75,
                    color:      "rgba(242,245,234,0.65)",
                    margin:     0,
                    maxWidth:   "420px",
                  }}
                >
                  {s.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MOBILE stage (< 1000 px) ──────────────────────────────────────────── */}
      <div
        ref={mobileStageRef}
        className="block md:hidden"
        style={{
          position:          "relative",
          flex:              1,
          minHeight:         "360px",
          margin:            "0 16px 32px",
          perspective:       "1000px",
          perspectiveOrigin: "50% 50%",
          overflow:          "hidden",
          borderRadius:      "20px",
        }}
      >
        {STEPS.map((s, i) => (
          <div
            key={s.step}
            ref={(el) => { mobileCardRefs.current[i] = el; }}
            style={{
              position:    "absolute",
              inset:       0,
              display:     "flex",
              flexDirection: "column",
              borderRadius: "20px",
              overflow:    "hidden",
              background:  "#0D1117",
              border:      "1px solid rgba(255,255,255,0.08)",
              boxShadow:   "0 24px 60px rgba(0,0,0,0.55)",
              willChange:  "transform, opacity",
            }}
          >
            {/* Image top */}
            <div style={{ position: "relative", height: "200px", flexShrink: 0 }}>
              <Image
                src={s.imageSrc}
                alt={s.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="100vw"
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(13,17,23,0.85))" }} />
              <div
                style={{
                  position:       "absolute",
                  top:            "14px",
                  left:           "14px",
                  background:     "rgba(0,0,0,0.52)",
                  backdropFilter: "blur(8px)",
                  padding:        "5px 12px",
                  borderRadius:   "999px",
                  border:         `1px solid ${goldColor}40`,
                }}
              >
                <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: goldColor, transition: "color 0.4s ease" }}>
                  Step {s.step}
                </span>
              </div>
            </div>

            {/* Text bottom */}
            <div
              style={{
                flex:           1,
                display:        "flex",
                flexDirection:  "column",
                justifyContent: "center",
                padding:        "24px 24px 28px",
                position:       "relative",
                overflow:       "hidden",
              }}
            >
              <span
                style={{
                  position:      "absolute",
                  bottom:        "-12px",
                  right:         "14px",
                  fontSize:      "6rem",
                  fontWeight:    900,
                  color:         "rgba(255,255,255,0.04)",
                  lineHeight:    1,
                  userSelect:    "none",
                  pointerEvents: "none",
                }}
              >
                {s.step}
              </span>

              <div style={{ width: "32px", height: "2px", background: goldColor, borderRadius: "2px", marginBottom: "14px", transition: "background 0.4s ease" }} />

              <h3
                style={{
                  fontSize:   "1.2rem",
                  fontWeight: 800,
                  lineHeight: 1.2,
                  color:      "#f2f5ea",
                  margin:     "0 0 10px",
                }}
              >
                {s.title}
              </h3>
              <p style={{ fontSize: "0.85rem", lineHeight: 1.65, color: "rgba(242,245,234,0.65)", margin: 0 }}>
                {s.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Step dots */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", paddingBottom: "32px", flexShrink: 0 }}>
        {STEPS.map((s, i) => {
          const isActive = activeIndex === i;
          return (
            <div
              key={s.step}
              style={{
                width: isActive ? "24px" : "6px",
                height: "6px",
                borderRadius: "999px",
                background: isActive ? goldColor : "rgba(242,245,234,0.2)",
                transition: "all 0.3s ease",
              }}
            />
          );
        })}
      </div>
    </section>
    </div>
  );
}
