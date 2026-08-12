import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import {
  asset, SUIT_PATH, isRed, ERAS, PLATE_LAYOUT, eraPlate,
  REVIEWS_VERIFIED, ORIGIN,
} from "./data.js";
import { Reveal, reduced, go, money } from "./lib.jsx";

/* ===========================================================================
   §1  ICONS
   Twelve lines of SVG rather than a 40kB icon package. Everything here is on
   a 24 grid, inherits currentColor, and is aria-hidden by default because it
   always sits next to a label that already says the thing.
   =========================================================================== */
const I = (d, o = {}) => (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={o.w || 1.8}
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>{d}</svg>
);

export const Icon = {
  truck: I(<><path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z" /><circle cx="6.5" cy="18.5" r="1.8" /><circle cx="16.5" cy="18.5" r="1.8" /></>),
  moon: I(<path d="M20 14.5A8.2 8.2 0 0 1 9.5 4 8.3 8.3 0 1 0 20 14.5Z" />),
  wrench: I(<path d="M15.5 3.5a5 5 0 0 0-4.6 6.9L3.6 17.7a2 2 0 1 0 2.8 2.8l7.3-7.3a5 5 0 0 0 6.1-6.5l-3 3-2.4-2.4 3-3a5 5 0 0 0-1.9-.8Z" />),
  clock: I(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.2 2" /></>),
  pin: I(<><path d="M12 21s7-5.8 7-11a7 7 0 1 0-14 0c0 5.2 7 11 7 11Z" /><circle cx="12" cy="10" r="2.6" /></>),
  arrow: I(<path d="M4 12h15m-6-6 6 6-6 6" />),
  check: I(<path d="M4.5 12.5 9.5 17.5 19.5 6.5" />),
  star: (p) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path fill="currentColor" d="m12 2.6 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9Z" />
    </svg>
  ),
};

/* ===========================================================================
   §2  THE PLAYING CARD

   One component for every card on the site: the deck in the intro, the fanned
   hand in the hero, the empty-photography plate, the Court result, the
   member's holdings, the 404 joker.

   Everything inside is sized in `cqw` — percentages of the card's own width —
   so a 38px thumbnail and a 340px hero card are the same drawing at different
   scales, with no size prop and no breakpoints.
   =========================================================================== */
function Suit({ suit, className, style }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path d={SUIT_PATH[suit] || SUIT_PATH.spade} />
    </svg>
  );
}

export function Card({
  index = "A", suit = "spade", n, name, material, back = false, note,
  className = "", style, glyph = true,
}) {
  if (back) {
    return (
      <div className={`pc back ${className}`} style={style} aria-hidden="true">
        <span className="pc-rule" />
        <span className="pc-bk">R</span>
        {note ? <span className="pc-nt">{note}</span> : null}
      </div>
    );
  }
  const red = isRed(suit);
  return (
    <div className={`pc ${red ? "red" : "black"} ${className}`} style={style}>
      <span className="pc-rule" />
      {glyph ? <Suit suit={suit} className="pc-suit" /> : null}

      <span className="pc-ix tl" aria-hidden="true">
        <b>{index}</b><Suit suit={suit} />
      </span>
      <span className="pc-ix br" aria-hidden="true">
        <b>{index}</b><Suit suit={suit} />
      </span>

      <div className="pc-in">
        <div className="pc-face">
          {n ? <div className="pc-n">{n}</div> : null}
          {name ? <div className="pc-nm">{name}</div> : null}
          {material ? <div className="pc-mt">{material}</div> : null}
        </div>
      </div>
    </div>
  );
}

/** The card for a specific product — the shape used everywhere a piece has to
    stand in for itself without photography. */
export const PieceCard = ({ p, className = "", style }) => (
  <Card index={p.card.index} suit={p.card.suit} n={p.n} name={p.name}
    material={p.material} className={className} style={style} />
);

/* ===========================================================================
   §3  THE PLATE

   Renders the photograph when the manifest has one and the piece's own
   playing card when it does not. The empty state is deliberately designed —
   it is a card, not a grey box with "image" in it — because a store with no
   photography still has to be presentable to a client.
   =========================================================================== */
export function Plate({ p, className = "", eager = false }) {
  const src = asset(p.img);
  return (
    <div className={`plate ${className}`}>
      {src ? (
        <img src={src} alt={p.alt || p.name} loading={eager ? "eager" : "lazy"}
          decoding="async" fetchPriority={eager ? "high" : undefined} />
      ) : (
        <div className="plate-card"><PieceCard p={p} /></div>
      )}
    </div>
  );
}

/* ===========================================================================
   §4  THE PRODUCT CARD
   =========================================================================== */
export function ProductCard({ p, onAdd, delay = 0, eager = false }) {
  const soldOut = p.stock <= 0;
  return (
    <Reveal delay={delay}>
      <article className="pcard">
        {/* the quick-add lives inside .pshot with the plate, so it lands over
            the photograph rather than over the blurb below it */}
        <div className="pshot">
          <a href={`#/piece/${p.id}`} aria-label={`${p.name} — ${money(p.price)}`}>
            <Plate p={p} eager={eager} />
          </a>
          <div className="quick">
            <button onClick={() => (soldOut ? go(`/piece/${p.id}`) : onAdd(p))}>
              {soldOut ? "Sold out — see details" : `Add — ${money(p.price)}`}
            </button>
          </div>
        </div>
        <div>
          <p className="pline">
            <Suit suit={p.card.suit} style={{ color: isRed(p.card.suit) ? "var(--mark)" : "currentColor" }} />
            {p.line} · {p.card.name}
          </p>
          <div className="phead" style={{ marginTop: 6 }}>
            <a href={`#/piece/${p.id}`}><h3 className="pname">{p.name}</h3></a>
            <p className="pprice num">
              {p.was ? <span className="pwas">{money(p.was)}</span> : null}
              {money(p.price)}
            </p>
          </div>
          <p className="pblurb" style={{ marginTop: 8 }}>{p.blurb}</p>
        </div>
      </article>
    </Reveal>
  );
}

/* ===========================================================================
   §5  THE THREAD
   Nine pieces, one line that visits every one of them. Carried over from the
   research site, where it was the single ornament worth keeping: it is the
   difference between a catalogue and a wardrobe, stated without a sentence.
   =========================================================================== */
const NODES = [
  [26, 74], [62, 42], [104, 78], [146, 40], [188, 76],
  [228, 44], [266, 80], [306, 46], [344, 72],
];

/** Catmull-Rom through the nodes, converted to cubic béziers. A polyline
    through nine points reads as a chart; a smooth curve reads as a thread. */
function smooth(pts) {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6}` +
      ` ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6}` +
      ` ${p2[0]},${p2[1]}`;
  }
  return d;
}

export function Thread({ label = "nine pieces · one unbroken thread" }) {
  const root = useRef(null);
  const d = smooth(NODES);

  useEffect(() => {
    const el = root.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      const core = el.querySelector(".th-core");
      const shade = el.querySelector(".th-shade");
      const nodes = el.querySelectorAll(".th-node");
      /* getTotalLength is SVG geometry, and not every renderer implements it.
         Without a length there is no dash to animate, so the thread is simply
         drawn already — an undrawn line is a missing ornament, but a thrown
         error here would take the whole page down with it. */
      if (!core || typeof core.getTotalLength !== "function") return;
      const len = core.getTotalLength();

      gsap.set([core, shade], { strokeDasharray: len, strokeDashoffset: len });
      gsap.set(nodes, { scale: 0, transformOrigin: "center" });

      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        gsap.to([core, shade], { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut", stagger: 0.08 });
        gsap.to(nodes, { scale: 1, duration: 0.42, ease: "power3.out", stagger: 0.07, delay: 0.45 });
      }, { threshold: 0.3 });
      io.observe(el);
      return () => io.disconnect();
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <figure ref={root} style={{ margin: 0 }}>
      <svg className="thread" viewBox="0 0 370 120" aria-hidden="true">
        <path className="th-shade" d={d} transform="translate(3,5)" />
        <path className="th-core" d={d} />
        {NODES.map(([x, y], i) => (
          <circle key={i} className="th-node" cx={x} cy={y} r="4.5" />
        ))}
      </svg>
      <figcaption className="threadcap">{label}</figcaption>
    </figure>
  );
}

/* ===========================================================================
   §6  THE ERA RAIL & COLLAGE
   Carried over from the research site. The rail is not navigation — it is the
   scrubber for the whole argument, pinned while the era reads underneath it.
   =========================================================================== */
export function EraRail({ i, onSelect }) {
  const rail = useRef(null);
  const btns = useRef([]);
  const [knob, setKnob] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const move = () => {
      const b = btns.current[i], r = rail.current;
      if (!b || !r) return;
      setKnob({ left: b.offsetLeft - r.scrollLeft, width: b.offsetWidth });
    };
    move();
    /* scrollIntoView walks every scrollable ancestor, so centring a year
       inside the rail would also yank the page vertically. Scroll the rail
       itself and nothing above it moves. */
    const b = btns.current[i], r = rail.current;
    if (b && r && r.scrollWidth > r.clientWidth) {
      r.scrollTo({
        left: b.offsetLeft - (r.clientWidth - b.offsetWidth) / 2,
        behavior: reduced() ? "auto" : "smooth",
      });
    }
    r?.addEventListener("scroll", move, { passive: true });
    window.addEventListener("resize", move);
    return () => { r?.removeEventListener("scroll", move); window.removeEventListener("resize", move); };
  }, [i]);

  return (
    <div className="railwrap">
      <div className="rail" ref={rail} role="tablist" aria-label="Eras"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") onSelect(Math.min(ERAS.length - 1, i + 1));
          if (e.key === "ArrowLeft") onSelect(Math.max(0, i - 1));
        }}>
        <div className="knob" style={{ left: knob.left, width: knob.width }} />
        {ERAS.map((e, n) => (
          <React.Fragment key={e.year}>
            {n > 0 ? <span className="conn" /> : null}
            <button ref={(el) => (btns.current[n] = el)} role="tab" aria-selected={n === i}
              className={`tick ${n === i ? "on" : ""}`} onClick={() => onSelect(n)}>
              <span className="y num">{e.year}</span><span className="t">{e.tag}</span>
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   THE ERA COLLAGE
   A research board assembling itself. Plate one lands and an arrow calls out
   one detail. Plate two slides over it, covering part of the first, and calls
   out another. Four plates, four callouts, roughly two and a half seconds.

   The overlap is the point: each new plate half-hides the one before it, the
   way a real board is built by piling references, not by laying them out in a
   neat row. Changing the era tears the board down and builds the next one.

   Callout coordinates are percentages of their own plate, so they stay pinned
   to the right part of the image at any size.
   --------------------------------------------------------------------------- */
export function EraCollage({ era }) {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const cards = gsap.utils.toArray(".pl", el);
    if (reduced()) { gsap.set(cards, { autoAlpha: 1, scale: 1, y: 0 }); return; }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      cards.forEach((c, i) => {
        const at = i * 0.34;
        const callout = c.querySelector(".pl-call");
        const line = c.querySelector(".pl-line");
        const dot = c.querySelector(".pl-dot");
        const txt = c.querySelector(".pl-txt");

        /* the plate is dealt onto the board */
        tl.fromTo(c,
          { autoAlpha: 0, y: 34, scale: 0.93, rotate: PLATE_LAYOUT[i].r - 6 },
          { autoAlpha: 1, y: 0, scale: 1, rotate: PLATE_LAYOUT[i].r, duration: 0.52, ease: "back.out(1.5)" }, at);

        /* then the arrow finds its detail */
        tl.fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.22, ease: "back.out(3)" }, at + 0.26)
          .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.26, ease: "power3.out" }, at + 0.32)
          .fromTo(txt, { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.26 }, at + 0.42);
        if (callout) tl.set(callout, { zIndex: 40 }, at + 0.26);
      });
      /* the callouts fade back once the board is read, so the images breathe */
      tl.to(el.querySelectorAll(".pl-call"), { autoAlpha: 0.34, duration: 0.5, stagger: 0.05 }, "+=1.5");
    }, el);
    return () => ctx.revert();
  }, [era.year]);

  return (
    <div className="collage" ref={root} key={era.year}>
      {era.plates.map((p, i) => (
        <figure className="pl" key={i}
          style={{
            left: PLATE_LAYOUT[i].left, top: PLATE_LAYOUT[i].top,
            width: PLATE_LAYOUT[i].w, height: PLATE_LAYOUT[i].h, zIndex: 10 + i,
          }}>
          <div className="pl-img">
            <img src={eraPlate(era.year, i)} loading="lazy" decoding="async"
              alt={`${era.year}, ${era.era}: ${p.note.toLowerCase()}`} />
          </div>
          <span className="pl-call" style={{ left: `${p.cx}%`, top: `${p.cy}%` }}>
            <i className="pl-dot" />
            <i className="pl-line" />
            <b className="pl-txt">{p.note}</b>
          </span>
        </figure>
      ))}
    </div>
  );
}

/* ===========================================================================
   §7  THE TOAST
   Announced politely rather than assertively: adding to a cart is not an
   emergency, and an assertive live region interrupts a screen reader
   mid-sentence to say so.
   =========================================================================== */
export function Toast({ msg, onView }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!msg) { setShow(false); return; }
    setShow(true);
    const t = setTimeout(() => setShow(false), 3200);
    return () => clearTimeout(t);
  }, [msg]);

  /* The live region has to stay mounted for a screen reader to announce into
     it — mounting a region and filling it in the same tick is the classic way
     to get silence. The visible pill is what comes and goes. */
  return (
    <div className={`toast ${show && msg ? "show" : ""}`} role="status" aria-live="polite"
      aria-hidden={!msg}>
      <span>{msg}</span>
      {msg ? (
        <button className="link" style={{ color: "inherit", opacity: 0.75 }} onClick={onView}>
          View bag
        </button>
      ) : null}
    </div>
  );
}

/* ===========================================================================
   §8  SMALL SHARED BITS
   =========================================================================== */
export function Stock({ n }) {
  if (n <= 0) return <span className="stock low"><i />Sold out</span>;
  if (n <= 10) return <span className="stock low"><i />Only {n} left</span>;
  return <span className="stock"><i />In stock</span>;
}

export function Qty({ value, onChange, max = 99 }) {
  return (
    <div className="qty">
      <button onClick={() => onChange(value - 1)} aria-label="Decrease quantity">−</button>
      <span className="num" aria-live="polite">{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max} aria-label="Increase quantity">+</button>
    </div>
  );
}

/** Breadcrumbs, and the BreadcrumbList schema that goes with them. Emitting
    one without the other is the common mistake: Google wants the markup to
    describe a trail the visitor can actually see and click. */
export function Crumb({ trail }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.label,
      ...(t.to ? { item: `${ORIGIN}/#${t.to}` } : {}),
    })),
  };
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: 22 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ol style={{ display: "flex", gap: 9, listStyle: "none", margin: 0, padding: 0, flexWrap: "wrap" }}>
        {trail.map((t, i) => (
          <li key={i} style={{ display: "flex", gap: 9, alignItems: "center" }}>
            {t.to ? (
              <a className="lb" style={{ color: "var(--ink-3)" }} href={`#${t.to}`}>{t.label}</a>
            ) : <span className="lb" style={{ color: "var(--ink)" }} aria-current="page">{t.label}</span>}
            {i < trail.length - 1 ? <span className="lb" aria-hidden="true">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Stars({ n = 5, label }) {
  return (
    <span className="stars" aria-label={label || `${n} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => <Icon.star key={i} className={i <= n ? "" : "off"} />)}
    </span>
  );
}

export function ReviewCard({ r }) {
  return (
    <article className="rev">
      <Stars n={r.rating} label={`${r.rating} out of 5`} />
      <h4>{r.title}</h4>
      <p>{r.body}</p>
      <div className="rv-f">
        <span>{r.name} · {r.city}</span>
        <span>{r.days} days in</span>
      </div>
    </article>
  );
}

/** The honesty notice. Shown wherever reviews are, for exactly as long as
    REVIEWS_VERIFIED is false. It disappears on its own the moment real
    reviews replace the samples — no second edit to remember. */
export const ReviewNotice = () =>
  REVIEWS_VERIFIED ? null : (
    <p className="rev-note">
      Sample copy. These are written placeholders held in <code>data.js</code> until real
      verified reviews are collected — which is also why no rating schema is
      published to search engines yet.
    </p>
  );

/** The sticky mobile action bar. One job, thumb height, and it stays out of
    the way until the primary CTA has scrolled off. */
export function StickyCTA({ show, label, sub, cta, onClick, disabled }) {
  return (
    <div className={`stickybar ${show ? "up" : ""}`} aria-hidden={!show}>
      <div className="sbin">
        <div className="sbl">
          <b>{label}</b>
          {sub ? <span className="num">{sub}</span> : null}
        </div>
        <button className="btn btn-mark" onClick={onClick} disabled={disabled}
          tabIndex={show ? 0 : -1}>{cta}</button>
      </div>
    </div>
  );
}

/** FAQ list + the FAQPage schema. Details/summary rather than a JS accordion
    so it is open-able, findable with ctrl-F and printable with no script. */
export function FaqList({ items, openFirst = false }) {
  return (
    <div className="faq">
      {items.map((f, i) => (
        <details className="acc" key={f.q} open={openFirst && i === 0}>
          <summary>{f.q}<i /></summary>
          <div className="acc-body"><p>{f.a}</p></div>
        </details>
      ))}
    </div>
  );
}

export const faqSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});
