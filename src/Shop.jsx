import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  useFrame, reduced, go, useHashRoute, Grain, Lamp, useFocusTrap, useBodyLock,
  money, scrollToTop, consent, useOrgSchema, track, useHead, clamp,
} from "./lib.jsx";
import { LINES, CONTACT_EMAIL, ORIGIN } from "./data.js";
import { CartProvider, useCart } from "./cart.jsx";
import { Toast, Qty, PieceCard, Icon } from "./parts.jsx";
import Intro from "./Intro.jsx";
import { Home, Shop as ShopView, Product } from "./views.jsx";
import { Story, Court, Members, Visit, Faq, Privacy, NotFound } from "./pages.jsx";
import { Checkout, Done } from "./checkout.jsx";

/* ===========================================================================
   §1  NAV
   Hides on the way down and returns on the way up. The threshold is 8px of
   travel, not 1 — without it a trackpad's sub-pixel jitter flickers the bar
   on and off while the page is standing still.

   Over the dark hero the bar is transparent and inverted; the moment the page
   moves it becomes solid paper. That is `onDark`, and it is why the hero can
   run full-bleed to the top of the viewport without a white strip across it.
   =========================================================================== */
const NAVLINKS = [
  ["/shop", "Shop", "shop"],
  ["/story", "The story", "story"],
  ["/court", "The Court", "court"],
  ["/members", "The Hand", "members"],
  ["/visit", "Visit", "visit"],
  ["/faq", "Questions", "faq"],
];

function Nav({ onCart, count, route, onDark }) {
  const [stuck, setStuck] = useState(false);
  const [hide, setHide] = useState(false);
  const [menu, setMenu] = useState(false);
  const [bump, setBump] = useState(false);
  const lastY = useRef(0);
  const seen = useRef(count);

  useFrame(() => {
    const y = window.scrollY;
    setStuck((s) => (s === y > 12 ? s : y > 12));
    const dy = y - lastY.current;
    if (Math.abs(dy) > 8) {
      const next = dy > 0 && y > 220 && !menu;
      setHide((h) => (h === next ? h : next));
      lastY.current = y;
    }
  });

  /* the bag reacts when something lands in it */
  useEffect(() => {
    if (count > seen.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 480);
      seen.current = count;
      return () => clearTimeout(t);
    }
    seen.current = count;
  }, [count]);

  useBodyLock(menu);

  const nav = (to) => { setMenu(false); go(to); };

  return (
    <>
      <nav className={`nav ${stuck ? "stuck" : ""} ${hide ? "hide" : ""} ${onDark ? "onDark" : ""}`}
        aria-label="Primary">
        <div className="navin">
          <button className="wordmark" onClick={() => { go("/"); scrollToTop(); }}
            aria-label="RUMOAR — home">RUMOA<b>R</b></button>

          <div className="navlinks">
            {NAVLINKS.map(([to, label, view]) => (
              <button key={to} className={`navlink ${route.view === view ? "on" : ""}`}
                onClick={() => nav(to)}>{label}</button>
            ))}
          </div>

          <button className={`cartbtn ${bump ? "bump" : ""}`} onClick={onCart}
            aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}>
            Bag {count > 0 ? <span className="cnt num">{count}</span> : null}
          </button>

          <button className="menubtn" onClick={() => setMenu(true)} aria-label="Open menu"><i /></button>
        </div>
      </nav>

      <div className={`msheet ${menu ? "open" : ""}`} aria-hidden={!menu}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <span className="wordmark">RUMOA<b>R</b></span>
          <button className="x" onClick={() => setMenu(false)} aria-label="Close menu">✕</button>
        </div>
        <button className="ms" onClick={() => nav("/")} tabIndex={menu ? 0 : -1}>Home</button>
        {NAVLINKS.map(([to, label]) => (
          <button key={to} className="ms" onClick={() => nav(to)} tabIndex={menu ? 0 : -1}>
            {label}{to === "/court" ? <i>Deal me in</i> : null}
          </button>
        ))}
        <button className="ms" onClick={() => { setMenu(false); onCart(); }} tabIndex={menu ? 0 : -1}>
          Bag {count > 0 ? `(${count})` : ""}
        </button>
      </div>
    </>
  );
}

/* ===========================================================================
   §2  THE BAG
   =========================================================================== */
function CartPanel({ open, onClose }) {
  const { lines, subtotal, shipping, total, setQty, remove, freeOver } = useCart();
  const ref = useRef(null);
  useFocusTrap(open, ref, onClose);
  useBodyLock(open);

  const away = Math.max(0, freeOver - subtotal);
  const pct = clamp(subtotal / freeOver) * 100;

  return (
    <>
      <div className={`scrim ${open ? "open" : ""}`} onClick={onClose}
        style={{ pointerEvents: open ? "auto" : "none" }} aria-hidden="true" />
      <aside ref={ref} className={`panel ${open ? "open" : ""}`}
        role="dialog" aria-modal="true" aria-label="Your bag" aria-hidden={!open}>
        <div className="panel-h">
          <div>
            <h2 className="h3">Your bag</h2>
            <p className="li-m">{lines.length ? `${lines.length} line${lines.length === 1 ? "" : "s"}` : "Empty"}</p>
          </div>
          <button className="x" onClick={onClose} aria-label="Close bag" tabIndex={open ? 0 : -1}>✕</button>
        </div>

        <div className="panel-b">
          {lines.length === 0 ? (
            <div className="empty">
              <p className="mid" style={{ color: "var(--ink)" }}>Nothing yet.</p>
              <p className="body" style={{ textAlign: "center", fontSize: ".88rem" }}>
                Six pieces, and they all agree with each other.
              </p>
              <button className="btn btn-solid btn-sm" tabIndex={open ? 0 : -1}
                onClick={() => { onClose(); go("/shop"); }}>Shop the six</button>
              <button className="link" style={{ fontSize: ".78rem", color: "var(--ink-3)" }}
                tabIndex={open ? 0 : -1}
                onClick={() => { onClose(); go("/court"); }}>Not sure where to start? Get dealt a card</button>
            </div>
          ) : (
            <>
              <div className="ship">
                {away > 0 ? (
                  <p className="li-m">
                    <b style={{ color: "var(--mark)" }}>{money(away)}</b> more for free shipping.
                  </p>
                ) : (
                  <p className="li-m" style={{ color: "var(--ok)", fontWeight: 700 }}>
                    Free shipping unlocked.
                  </p>
                )}
                <span className="bar"><i style={{ width: `${pct}%` }} /></span>
              </div>

              {lines.map((l) => (
                <div className="li" key={`${l.id}:${l.colour}`}>
                  <div className="li-p"><PieceCard p={l.product} /></div>
                  <div>
                    <p className="li-n">{l.product.name}</p>
                    <p className="li-m">{l.colourName}</p>
                    <div className="li-r">
                      <Qty value={l.qty} max={l.product.stock}
                        onChange={(q) => setQty(l.id, l.colour, q)} />
                      <span className="num" style={{ fontWeight: 700, fontSize: ".88rem" }}>{money(l.sub)}</span>
                    </div>
                    <button className="li-x" style={{ marginTop: 9 }}
                      tabIndex={open ? 0 : -1}
                      onClick={() => remove(l.id, l.colour)}>Remove</button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {lines.length > 0 ? (
          <div className="panel-f">
            <p className="tot"><span>Subtotal</span><span className="num">{money(subtotal)}</span></p>
            <p className="tot"><span>Shipping</span>
              <span className="num">{shipping === 0 ? "Free" : money(shipping)}</span></p>
            <p className="tot grand"><span>Total</span><span className="num">{money(total)}</span></p>
            <button className="btn btn-mark btn-full" tabIndex={open ? 0 : -1}
              onClick={() => { onClose(); go("/checkout"); }}>Checkout</button>
            <button className="link" style={{ fontSize: ".78rem", color: "var(--ink-3)" }}
              tabIndex={open ? 0 : -1} onClick={onClose}>Keep looking</button>
          </div>
        ) : null}
      </aside>
    </>
  );
}

/* ===========================================================================
   §3  FOOTER
   Every internal route is reachable from here, which is the cheapest and most
   reliable internal-linking structure a small site can have: no page is more
   than two clicks from any other.
   =========================================================================== */
function Footer({ onConsent }) {
  const [mail, setMail] = useState("");
  const [sent, setSent] = useState(false);
  const [bad, setBad] = useState(false);

  const sub = (e) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(mail)) { setBad(true); return; }
    setBad(false);
    setSent(true);
    setMail("");
    track("newsletter_signup");
  };

  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-g">
          <div>
            <p className="wordmark" style={{ fontSize: "1.3rem" }}>RUMOA<b>R</b></p>
            <p className="body" style={{ fontSize: ".86rem", marginTop: 14, maxWidth: "34ch" }}>
              Nine pieces for the wardrobe Indian menswear never got round to
              building. Six of them are live.
            </p>
            <p className="body" style={{ fontSize: ".86rem", marginTop: 14 }}>
              <a className="link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a><br />
              <span className="dim">Replies within one working day.</span>
            </p>
          </div>

          <div>
            <h4>Shop</h4>
            <ul>
              <li><a href="#/shop">All six pieces</a></li>
              {LINES.filter((l) => l !== "All").map((l) => (
                <li key={l}><a href="#/shop">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>House</h4>
            <ul>
              <li><a href="#/story">The story</a></li>
              <li><a href="#/court">The Court</a></li>
              <li><a href="#/members">The Hand</a></li>
              <li><a href="#/visit">Visit the workshops</a></li>
              <li><a href="#/faq">Questions</a></li>
              <li><a href="#/privacy">Privacy</a></li>
            </ul>
          </div>

          <div>
            <h4>The rumour</h4>
            <p className="body" style={{ fontSize: ".86rem" }}>
              One letter a month. The next three pieces, before anyone else.
            </p>
            <form className="sub" onSubmit={sub}>
              <input type="email" value={mail} onChange={(e) => setMail(e.target.value)}
                placeholder="you@example.com" aria-label="Email address"
                aria-invalid={bad} required />
              <button className="btn btn-solid btn-sm" type="submit">Join</button>
            </form>
            <p className="body" aria-live="polite"
              style={{ fontSize: ".78rem", marginTop: 10, color: sent ? "var(--ok)" : bad ? "var(--mark)" : "var(--ink-3)" }}>
              {sent ? "You're on the list." : bad ? "That address doesn't look right." : "No noise. Unsubscribe in one click."}
            </p>
          </div>
        </div>

        <div className="foot-b">
          <span>© {new Date().getFullYear()} RUMOAR · Made in India</span>
          <nav aria-label="Legal">
            <a href="#/privacy">Privacy</a>
            <button onClick={onConsent}>Cookie choices</button>
            <a href="#/faq">Shipping &amp; returns</a>
          </nav>
          <span>A demonstration store. No payment is processed.</span>
        </div>
      </div>
    </footer>
  );
}

/* ===========================================================================
   §4  CONSENT
   Nothing analytics-related loads until this is answered. Both buttons are
   the same size and neither is styled to be the obvious one, because a
   "reject" button hidden in grey text is not consent.
   =========================================================================== */
function Consent({ onDone }) {
  return (
    <div className="consent" role="dialog" aria-label="Cookie choices">
      <p>
        We&rsquo;d like to count pages with Google Analytics to see where people give up.
        Nothing loads until you choose, and the site works the same either way.{" "}
        <a className="link" href="#/privacy" style={{ color: "inherit" }}>What we keep</a>.
      </p>
      <button className="cbtn yes" onClick={() => { consent.grant(); onDone(); }}>Allow</button>
      <button className="cbtn no" onClick={() => { consent.deny(); onDone(); }}>No thanks</button>
    </div>
  );
}

/* ===========================================================================
   §5  THE APP
   =========================================================================== */
function App() {
  const route = useHashRoute();
  const cart = useCart();
  const org = useOrgSchema();

  /* The intro runs once per browser session. Somebody three clicks from
     checkout should not have to sit through a card trick to get back. */
  const [intro, setIntro] = useState(() => {
    if (typeof window === "undefined") return false;
    if (reduced()) return false;
    /* and never on a shared Court link — that visitor came for one specific
       card and a card trick in front of it is friction, not atmosphere */
    if ((window.location.hash || "").startsWith("#/court/")) return false;
    try { return sessionStorage.getItem("rumoar.intro") !== "seen"; } catch { return true; }
  });

  const [night, setNight] = useState(false);
  const [bag, setBag] = useState(false);
  const [toast, setToast] = useState("");
  const [order, setOrder] = useState(null);
  const [askConsent, setAskConsent] = useState(false);

  /* the org schema is about the site, not the page, so it is mounted once
     here rather than by every view */
  useEffect(() => {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(org);
    document.head.appendChild(s);
    return () => s.remove();
  }, [org]);

  /* Ask about analytics once the intro is out of the way and the visitor has
     actually seen something. A consent bar over a loading screen gets
     dismissed reflexively, which is not a decision. */
  useEffect(() => {
    if (intro) return;
    if (consent.read() !== null) { consent.read() === "granted" && consent.grant(); return; }
    const t = setTimeout(() => setAskConsent(true), 2600);
    return () => clearTimeout(t);
  }, [intro]);

  /* the scroll lock belongs to the intro, and is released by JS — never left
     to a CSS class alone, or a failed boot leaves the page frozen */
  useEffect(() => {
    document.body.classList.toggle("intro-lock", intro);
    return () => document.body.classList.remove("intro-lock");
  }, [intro]);

  const introDone = useCallback(() => {
    setIntro(false);
    try { sessionStorage.setItem("rumoar.intro", "seen"); } catch { /* private mode */ }
  }, []);

  const add = useCallback((p, colour, qty = 1) => {
    const c = colour || p.colours[0].id;
    cart.add(p.id, c, qty);
    setToast(`${p.name} added`);
  }, [cart]);

  const view = () => {
    switch (route.view) {
      case "shop": return <ShopView onAdd={add} />;
      case "piece": return <Product id={route.param} onAdd={add} />;
      case "story": return <Story />;
      case "court": return <Court code={route.param} onAdd={add} />;
      case "members": return <Members />;
      case "visit": return <Visit />;
      case "faq": return <Faq />;
      case "privacy": return <Privacy />;
      case "checkout":
        return <Checkout onPlaced={(o) => { setOrder(o); cart.clear(); go("/done"); }} />;
      case "done": return <Done order={order} />;
      case "404": return <NotFound />;
      default: return <Home onAdd={add} />;
    }
  };

  /* the home hero is dark and runs to the top of the viewport, so the nav
     starts transparent there and nowhere else */
  const onDark = route.view === "home" || route.view === "court";

  return (
    <div className={`ru ${night ? "night" : ""} ${askConsent ? "asking" : ""}`}>
      <a className="skip" href="#main">Skip to content</a>
      <Grain />

      {intro ? <Intro onDone={introDone} /> : null}

      <Nav onCart={() => setBag(true)} count={cart.count} route={route} onDark={onDark} />
      <Lamp night={night} onPull={() => setNight((n) => !n)} />

      <main id="main">{view()}</main>

      <Footer onConsent={() => setAskConsent(true)} />
      <CartPanel open={bag} onClose={() => setBag(false)} />
      <Toast msg={toast} onView={() => { setToast(""); setBag(true); }} />
      {askConsent ? <Consent onDone={() => setAskConsent(false)} /> : null}
    </div>
  );
}

export default function Root() {
  return <CartProvider><App /></CartProvider>;
}
