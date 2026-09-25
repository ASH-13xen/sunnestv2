// Single place that loads GSAP + ScrollTrigger for every section.
//
// Every section used to `await import("gsap")` and register the plugin on its
// own, and nothing ever re-measured trigger positions once images and web
// fonts finished loading — so start/end offsets (and pin spacing) were
// computed against a half-loaded page. Here the plugin is registered once and
// a refresh runs once web fonts are ready (ScrollTrigger handles `load`).
//
// Awaiting the same promise also resolves callers in the order they asked,
// which is document order for sibling sections — ScrollTrigger needs pins
// created top-to-bottom so each one accounts for the spacing of those above.

type GsapModules = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

let modulesPromise: Promise<GsapModules> | null = null;

export function loadGsap(): Promise<GsapModules> {
  if (modulesPromise) return modulesPromise;

  modulesPromise = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
    ([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);

      // Mobile address-bar show/hide changes innerHeight on nearly every
      // scroll. Re-measuring on those makes pinned sections jump mid-scroll.
      ScrollTrigger.config({ ignoreMobileResize: true });

      let queued = false;
      const refreshSoon = () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          ScrollTrigger.refresh();
        });
      };

      // ScrollTrigger already re-measures on window `load` by itself; web
      // fonts are the one late layout change it doesn't know about. (Each
      // extra refresh is another chance for the brief jump-to-top a refresh
      // does on iOS, so don't add more than needed.)
      if (document.readyState === "complete") refreshSoon();
      document.fonts?.ready.then(refreshSoon).catch(() => {});

      return { gsap, ScrollTrigger };
    },
  );

  return modulesPromise;
}

// Mobile/desktop split used by the sections that build different animations
// per layout. Sections only rebuild when this flips — never on height-only
// resizes, which is what the mobile browser toolbar produces while scrolling.
export const DESKTOP_MIN_WIDTH = 1000;

export function isDesktopWidth() {
  return window.innerWidth >= DESKTOP_MIN_WIDTH;
}

/**
 * Calls `onChange` only when the viewport crosses DESKTOP_MIN_WIDTH.
 * Returns an unsubscribe function.
 */
export function onLayoutChange(onChange: () => void) {
  const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
