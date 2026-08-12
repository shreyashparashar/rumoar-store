import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { ORIGIN } from "./data.js";

/* ===========================================================================
   §1  THE FRAME LOOP
   One requestAnimationFrame for the whole application. Every component that
   needs per-frame work subscribes to this instead of starting its own loop —
   twelve components each calling rAF is twelve separate callbacks the browser
   has to schedule, and they drift out of phase with each other.
   =========================================================================== */
const subs = new Set();
let looping = false, prev = 0;

function tick(now) {
  const dt = Math.min((now - prev) / 1000, 0.05);   // cap: a backgrounded tab
  prev = now;                                       // must not resume with a
  for (const fn of subs) fn(dt);                    // multi-second delta
  if (subs.size) requestAnimationFrame(tick);
  else looping = false;
}

export function useFrame(cb) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    const f = (dt) => ref.current(dt);
    subs.add(f);
    if (!looping) { looping = true; prev = performance.now(); requestAnimationFrame(tick); }
    return () => { subs.delete(f); };
  }, []);
}

/* ===========================================================================
   §2  MATH & ENVIRONMENT
   =========================================================================== */
export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

/** Frame-rate-independent easing. A plain `cur += (target-cur) * 0.1` moves
    twice as fast on a 120Hz screen as on a 60Hz one; this does not. */
export const damp = (cur, target, lambda, dt) =>
  cur + (target - cur) * (1 - Math.exp(-lambda * dt));

export const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const money = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

/* ===========================================================================
   §3  PERSISTENCE

   Every localStorage touch in this codebase goes through here. Private
   browsing, a full quota and hand-edited storage all have to be survivable —
   a store that throws on boot because a member's card is malformed is worse
   than a store with no member's card.
   =========================================================================== */
export const store = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
  },
  drop(key) {
    try { localStorage.removeItem(key); } catch { /* nothing to do */ }
  },
};

/** State that survives a refresh. Same signature as useState. */
export function useLocal(key, initial) {
  const [v, setV] = useState(() => store.get(key, initial));
  const set = useCallback((next) => {
    setV((cur) => {
      const val = typeof next === "function" ? next(cur) : next;
      store.set(key, val);
      return val;
    });
  }, [key]);
  return [v, set];
}

/* ===========================================================================
   §4  ANALYTICS

   Consent-gated by design. Nothing loads and nothing is sent until the
   visitor has said yes, because a store that drops a Google Analytics tag on
   an Indian or EU visitor before consent is collecting personal data without
   a lawful basis under the DPDP Act and the GDPR alike.

   `track()` is safe to call from anywhere at any time: before consent it is a
   no-op, after consent it forwards to gtag. Nothing else in the codebase has
   to know whether analytics exists.
   =========================================================================== */
export const GA_ID = "G-XXXXXXXXXX";      // ← replace with the real measurement ID
const CONSENT_KEY = "rumoar.consent.v1";

let gaLoaded = false;

export function loadAnalytics() {
  if (gaLoaded || typeof window === "undefined") return;
  if (!GA_ID || GA_ID.includes("XXXX")) return;   // not configured yet — stay quiet
  gaLoaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  /* Manual page_view: this is a hash-routed SPA, so the automatic one would
     only ever fire once, on the first load, and every other view would go
     unrecorded. */
  window.gtag("config", GA_ID, { send_page_view: false, anonymize_ip: true });
}

export const consent = {
  read: () => store.get(CONSENT_KEY, null),          // null = never asked
  grant() { store.set(CONSENT_KEY, "granted"); loadAnalytics(); },
  deny() { store.set(CONSENT_KEY, "denied"); },
};

export function track(event, params = {}) {
  if (typeof window === "undefined") return;
  if (consent.read() !== "granted") return;
  loadAnalytics();
  window.gtag?.("event", event, params);
}

export function pageView(path, title) {
  if (consent.read() !== "granted") return;
  loadAnalytics();
  window.gtag?.("event", "page_view", {
    page_title: title,
    page_location: `${ORIGIN}/#${path}`,
    page_path: `/#${path}`,
  });
}

/* ===========================================================================
   §5  THE HEAD

   A title tag, a description, a canonical and an OG set per view — written
   into the live document rather than shipped as static markup, because this
   is a hash-routed SPA and every view shares one index.html.

   The one thing to be honest about: crawlers that don't execute JavaScript
   will only ever see index.html's defaults. Googlebot renders and will pick
   these up; a plain curl will not. For a store this size that is the right
   trade, and the note in the README says so rather than pretending otherwise.
   =========================================================================== */
function meta(attr, key, content) {
  if (content == null) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function link(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useHead({ title, desc, path = "/", image, noindex = false, schema }) {
  useEffect(() => {
    const full = title ? `${title} — RUMOAR` : "RUMOAR — Nine pieces. One hand.";
    document.title = full;

    const url = `${ORIGIN}/#${path}`;
    const og = image || `${ORIGIN}/og.png`;

    meta("name", "description", desc);
    meta("name", "robots", noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large");
    link("canonical", url);

    meta("property", "og:title", full);
    meta("property", "og:description", desc);
    meta("property", "og:url", url);
    meta("property", "og:image", og);
    meta("property", "og:image:alt", "RUMOAR — nine pieces, one hand");
    meta("property", "og:type", "website");
    meta("property", "og:site_name", "RUMOAR");
    meta("property", "og:locale", "en_IN");

    meta("name", "twitter:card", "summary_large_image");
    meta("name", "twitter:title", full);
    meta("name", "twitter:description", desc);
    meta("name", "twitter:image", og);

    pageView(path, full);
  }, [title, desc, path, image, noindex]);

  /* Structured data is mounted and removed with the view, so a stale Product
     schema can never outlive the product page it described. */
  useEffect(() => {
    if (!schema) return;
    const list = Array.isArray(schema) ? schema : [schema];
    const tags = list.map((obj) => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.textContent = JSON.stringify(obj);
      document.head.appendChild(s);
      return s;
    });
    return () => tags.forEach((t) => t.remove());
  }, [schema]);
}

/* ===========================================================================
   §6  SCROLL
   =========================================================================== */
/** Measures on resize only — never per frame, which would thrash layout —
    then drives `apply(p)` with a damped 0→1 progress every frame. */
export function useScene(ref, apply, lambda = 7) {
  const box = useRef({ top: 0, h: 0 });
  const v = useRef(0);
  const fn = useRef(apply);
  fn.current = apply;

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      box.current = { top: r.top + window.scrollY, h: r.height };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);
    if (ref.current) ro.observe(ref.current);
    window.addEventListener("load", measure);
    return () => { ro.disconnect(); window.removeEventListener("load", measure); };
  }, [ref]);

  useFrame((dt) => {
    const { top, h } = box.current;
    if (!h) return;
    const vh = window.innerHeight, y = window.scrollY;
    const target = clamp((y + vh - top) / (h + vh));
    v.current = reduced() ? target : damp(v.current, target, lambda, dt);
    fn.current(v.current, dt);
  });
}

export const scrollToTop = () =>
  window.scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" });

/* ===========================================================================
   §7  REVEAL PRIMITIVES

   IMPORTANT: every reveal here starts from a *visible* default and is only
   transformed once observed. Gating visibility on a class that a transition
   must add is the classic way to ship a blank page — transitions do not run
   in background tabs or headless renderers, so the content never appears.
   `.rv` therefore sets nothing, `.rv.armed` hides, and `.rv.armed.in` clears;
   if the observer never fires, a `@media (prefers-reduced-motion)` rule and
   the no-JS fallback both leave the content on screen.
   =========================================================================== */
export function Reveal({ children, delay = 0, className = "", style, as: T = "div" }) {
  const ref = useRef(null);
  const [seen, set] = useState(false);
  /* `armed` is what turns the hidden state on, and it is only ever set from
     inside a browser that has an IntersectionObserver to turn it off again. */
  const [armed, arm] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced() || typeof IntersectionObserver === "undefined") { set(true); return; }
    arm(true);
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (set(true), io.disconnect()),
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
    );
    io.observe(el);
    /* Failsafe. Some renderers resize to full height to capture a page and
       never dispatch the callback; printing does the same. Anything still
       unrevealed after this simply appears — worse animation, never a blank
       section. */
    const bail = setTimeout(() => set(true), 4000);
    return () => { io.disconnect(); clearTimeout(bail); };
  }, []);

  return (
    <T ref={ref} className={`rv ${armed ? "armed" : ""} ${seen ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </T>
  );
}

/** A headline that rises out of its own baseline, line by line. Each line
    lives in a mask with room underneath for descenders — without that padding
    the tails of g, y and p are sliced off by the overflow. */
export function Lines({ lines, className = "big", delay = 0, stagger = 90, style, as: T = "h2" }) {
  const ref = useRef(null);
  const [seen, set] = useState(false);
  const [armed, arm] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced() || typeof IntersectionObserver === "undefined") { set(true); return; }
    arm(true);
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (set(true), io.disconnect()), { threshold: 0.15 });
    io.observe(el);
    const bail = setTimeout(() => set(true), 4000);
    return () => { io.disconnect(); clearTimeout(bail); };
  }, []);
  return (
    <T ref={ref} className={`${className} lines ${armed ? "armed" : ""} ${seen ? "in" : ""}`} style={style}>
      {lines.map((l, i) => (
        <span className="lm" key={i}>
          <span style={{
            transitionDelay: `${delay + i * stagger}ms`,
            color: l.dim ? "var(--ink-3)" : l.mark ? "var(--mark)" : undefined,
            fontStyle: l.it ? "italic" : undefined,
            fontFamily: l.serif ? "var(--font-display)" : undefined,
            fontWeight: l.serif ? 400 : undefined,
          }}>{l.t ?? l}</span>
        </span>
      ))}
    </T>
  );
}

/** A control that leans toward the cursor before you reach it. The label
    moves less than the shell, which is what reads as the surface having
    thickness. Desktop pointer only, and off entirely under reduced motion. */
export function Magnetic({ as: T = "button", strength = 0.3, className = "", children, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || window.matchMedia("(pointer:coarse)").matches) return;
    const label = el.querySelector(".mag-l");
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      const reach = Math.max(r.width, r.height) * 1.5;
      if (dist > reach) return;
      const f = 1 - dist / reach;
      /* Hard cap. Whatever strength is passed, the control never leaves its
         own neighbourhood — a magnetic button that outruns the cursor is a
         bug, not a flourish. */
      const CAP = 22;
      const mx = gsap.utils.clamp(-CAP, CAP, dx * strength * f);
      const my = gsap.utils.clamp(-CAP, CAP, dy * strength * f);
      gsap.to(el, { x: mx, y: my, duration: 0.5, ease: "power3.out", overwrite: "auto" });
      if (label) gsap.to(label, { x: mx * 0.4, y: my * 0.4, duration: 0.5, ease: "power3.out", overwrite: "auto" });
    };
    const out = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "power3.out" });
      if (label) gsap.to(label, { x: 0, y: 0, duration: 0.7, ease: "power3.out" });
    };
    window.addEventListener("mousemove", move, { passive: true });
    el.addEventListener("mouseleave", out);
    return () => { window.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", out); };
  }, [strength]);
  return <T ref={ref} className={`mag ${className}`} {...rest}><span className="mag-l">{children}</span></T>;
}

/* ===========================================================================
   §8  FOCUS MANAGEMENT
   Any panel that covers the page has to take the keyboard with it. Without
   this, tabbing out of an open cart walks invisibly through the page behind
   it — the single most common accessibility failure in commerce UI.
   =========================================================================== */
export function useFocusTrap(active, ref, onClose) {
  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    const opener = document.activeElement;

    const focusables = () => el.querySelectorAll(
      'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])'
    );
    const first = focusables()[0];
    /* defer: the panel is mid-transition on the frame it mounts, and Safari
       refuses to focus an element it still considers invisible */
    const t = setTimeout(() => first?.focus(), 60);

    const key = (e) => {
      if (e.key === "Escape") { e.preventDefault(); onClose?.(); return; }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) return;
      const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener("keydown", key);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", key);
      /* return the keyboard to whatever opened the panel, not to <body> */
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [active, ref, onClose]);
}

/** Locks the page behind an overlay without the layout shifting.
    Setting overflow:hidden removes the scrollbar, which widens the page by
    its width and makes everything jump left. Padding the gap back on is the
    fix. */
export function useBodyLock(active) {
  useEffect(() => {
    if (!active) return;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [active]);
}

/* ===========================================================================
   §9  ROUTING
   A hash router in thirty lines. This site has eleven views and no server, so
   pulling in a routing library would be more configuration than code.
   Hash rather than history means it also works on a static host with no
   rewrite rules — open dist/index.html from a file:// path and it still runs,
   and a deep link to a product never 404s on a CDN that has no such file.
   =========================================================================== */
const KNOWN = new Set([
  "home", "shop", "piece", "story", "court", "members",
  "visit", "faq", "checkout", "done", "privacy",
]);

export function useHashRoute() {
  const read = () => {
    const raw = (window.location.hash || "#/").replace(/^#/, "");
    const [path, q] = raw.split("?");
    const parts = path.split("/").filter(Boolean);
    const view = parts[0] || "home";
    return {
      view: KNOWN.has(view) ? view : "404",
      param: parts[1] || null,
      path: "/" + parts.join("/"),
      query: new URLSearchParams(q || ""),
    };
  };
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => {
      setRoute(read());
      /* A new view starts at the top. Without this the reader lands
         mid-page, because the browser keeps the previous scroll offset when
         only the hash changed. */
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

export const go = (to) => { window.location.hash = to; };

/* ===========================================================================
   §10  SMALL SHARED PIECES
   =========================================================================== */
export const LB = ({ children, style, className = "" }) =>
  <p className={`lb ${className}`} style={style}>{children}</p>;

/** The grain. A single tiling noise texture over the whole page, generated
    once at runtime rather than shipped as a PNG. It is what stops large flat
    fields of white and red reading as flat vector colour. */
export function Grain() {
  const [uri, setUri] = useState(null);
  useEffect(() => {
    if (reduced()) return;
    /* Every step here is optional decoration, and every step here can fail:
       privacy extensions return a null 2D context, and a tainted or disabled
       canvas throws on toDataURL. A texture is not worth a blank site, so the
       whole thing is wrapped and simply doesn't render if anything objects. */
    try {
      const S = 128;
      const c = document.createElement("canvas");
      c.width = c.height = S;
      const ctx = c.getContext && c.getContext("2d");
      if (!ctx || !ctx.createImageData) return;
      const img = ctx.createImageData(S, S);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = 120 + Math.random() * 135;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      setUri(c.toDataURL("image/png"));
    } catch { /* no grain. The page is otherwise identical. */ }
  }, []);
  if (!uri) return null;
  return <div className="grain" aria-hidden="true" style={{ backgroundImage: `url(${uri})` }} />;
}

/** The lamp. Night mode as an object you pull rather than a switch you flip —
    carried over from the research site, because it is the one piece of
    furniture the brand already owns. */
export function Lamp({ night, onPull }) {
  const fix = useRef(null);
  const pull = useCallback(() => {
    if (!reduced() && fix.current) {
      /* the fixture takes the tug and settles: the weight is the detail that
         makes it read as an object rather than a button */
      gsap.fromTo(fix.current, { rotate: -4.5 },
        { rotate: 0, duration: 1.4, ease: "elastic.out(1,.28)" });
    }
    onPull();
  }, [onPull]);

  return (
    <div className="lamp">
      <i className="cord" />
      <div className="fix" ref={fix}>
        <svg viewBox="24 2 92 92" aria-hidden="true">
          <path d="M70,6 L70,18" stroke="currentColor" strokeWidth="4" />
          <path d="M34,58 Q34,22 70,20 Q106,22 106,58 Z" fill="currentColor" />
          <rect x="30" y="56" width="80" height="7" rx="3.5" fill="currentColor" />
          <circle className="bulb" cx="70" cy="76" r="13" />
        </svg>
        <i className="beam" />
      </div>
      <button className="pull" onClick={pull} aria-pressed={!night}
        aria-label={night ? "Turn the lamp on — daylight" : "Turn the lamp off — night"}>
        <i /><b />
      </button>
    </div>
  );
}

/** Counts a number up when it first comes into view. Used once, on the hero,
    where the number is a fact rather than decoration. */
export function useCountUp(target, active) {
  const [n, setN] = useState(reduced() ? target : 0);
  const t0 = useRef(0);
  const done = useRef(reduced());
  useFrame(() => {
    if (!active || done.current) return;
    if (!t0.current) t0.current = performance.now();
    const p = clamp((performance.now() - t0.current) / 1400);
    setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
    if (p >= 1) done.current = true;
  });
  return n;
}

/** Whether an element has ever been on screen. */
export function useSeen(ref, threshold = 0.2) {
  const [seen, set] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { set(true); return; }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (set(true), io.disconnect()), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return seen;
}

/** Copies text and reports back, so a button can say "Copied" for a second
    without every caller writing the same three lines. */
export function useCopy(ms = 1600) {
  const [done, setDone] = useState(false);
  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard API is https-only and refuses inside some in-app browsers,
         so fall back to the old selection trick rather than failing silently */
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch { /* give up quietly */ }
      ta.remove();
    }
    setDone(true);
    setTimeout(() => setDone(false), ms);
  }, [ms]);
  return [done, copy];
}

/** The organisation schema, emitted once on every page. Kept here rather than
    in a view because it describes the site, not the page. */
export function useOrgSchema() {
  return useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RUMOAR",
    url: ORIGIN,
    logo: `${ORIGIN}/og.png`,
    description: "A nine-piece wardrobe system for Indian men — leather, steel, silver and scent, made in three named workshops.",
    address: { "@type": "PostalAddress", addressCountry: "IN" },
    sameAs: [],
  }), []);
}
