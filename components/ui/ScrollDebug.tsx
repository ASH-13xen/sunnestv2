"use client";

import { useEffect, useState } from "react";
import { loadGsap } from "@/lib/gsap";

// On-screen scroll diagnostics for debugging on real phones, where there's no
// devtools. Renders nothing unless the URL contains `?debug=scroll`, e.g.
// https://www.sunnestpower.com/?debug=scroll — then record the screen.
const MAX_LINES = 12;
const JUMP_PX = 150; // a scroll change this big within one frame is logged

export default function ScrollDebug() {
  const [enabled, setEnabled] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [live, setLive] = useState("");

  useEffect(() => {
    setEnabled(new URLSearchParams(window.location.search).get("debug") === "scroll");
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const t0 = performance.now();
    const log = (msg: string) =>
      setLines((prev) =>
        [`${((performance.now() - t0) / 1000).toFixed(1)}s ${msg}`, ...prev].slice(0, MAX_LINES),
      );

    log(`start ${window.innerWidth}x${window.innerHeight} ready=${document.readyState}`);

    const onLoad = () => log("window load");
    const onResize = () => log(`resize ${window.innerWidth}x${window.innerHeight}`);
    const onUnlock = () => log("hero unlocked");
    window.addEventListener("load", onLoad);
    window.addEventListener("resize", onResize);
    window.addEventListener("sunnest:hero-unlocked", onUnlock);

    let stRemove = () => {};
    loadGsap().then(({ ScrollTrigger }) => {
      const onInit = () => log(`ST refresh start @y=${Math.round(window.scrollY)}`);
      const onDone = () => log(`ST refresh done @y=${Math.round(window.scrollY)}`);
      ScrollTrigger.addEventListener("refreshInit", onInit);
      ScrollTrigger.addEventListener("refresh", onDone);
      stRemove = () => {
        ScrollTrigger.removeEventListener("refreshInit", onInit);
        ScrollTrigger.removeEventListener("refresh", onDone);
      };
    });

    let lastY = window.scrollY;
    let raf = 0;
    const tick = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) > JUMP_PX) log(`JUMP ${Math.round(lastY)} -> ${Math.round(y)}`);
      lastY = y;
      const vv = window.visualViewport;
      setLive(
        `y=${Math.round(y)} vh=${window.innerHeight}${vv ? ` vv=${Math.round(vv.height)}` : ""} ` +
          `ta=${document.querySelector("canvas")?.parentElement?.style.touchAction || "-"} ` +
          `ov=${document.documentElement.style.overflow || "-"}`,
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      stRemove();
      window.removeEventListener("load", onLoad);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("sunnest:hero-unlocked", onUnlock);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 4,
        right: 4,
        bottom: 4,
        zIndex: 9999,
        pointerEvents: "none",
        background: "rgba(0,0,0,0.78)",
        color: "#7CFC7C",
        font: "10px/1.35 monospace",
        padding: "6px 8px",
        borderRadius: 6,
        whiteSpace: "pre-wrap",
      }}
    >
      <div style={{ color: "#fff" }}>{live}</div>
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  );
}
