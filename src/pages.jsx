import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  ERAS, PRODUCTS, UNDEALT, byId, WORKSHOPS, LOCATIONS_VERIFIED, mapsLink,
  directionsLink, FAQS, SEO, ORIGIN, CONTACT_EMAIL,
} from "./data.js";
import {
  Reveal, Lines, LB, Magnetic, go, useScene, money, useHead, reduced,
  useLocal, track, useCopy, store,
} from "./lib.jsx";
import {
  EraRail, EraCollage, Thread, Card, PieceCard, Crumb, Icon,
  FaqList, faqSchema, ProductCard,
} from "./parts.jsx";
import { QUESTIONS, deal, decode } from "./court.js";

/* ===========================================================================
   §1  THE STORY

   The research site's timeline, brought across whole and tightened. It is the
   only editorial page the store keeps, and it earns its place: it is the
   reason the objects are priced where they are.

   The rail is sticky. It is not navigation — it is the scrubber for the
   argument, and it stays on screen while each era reads underneath it.
   =========================================================================== */
export function Story() {
  const [i, setI] = useState(0);
  const [out, setOut] = useState(false);
  const pending = useRef(0);
  const sec = useRef(null);
  const figure = useRef(null);

  useHead({
    ...SEO.story, path: "/story",
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "126 years of what Indian menswear meant",
      description: SEO.story.desc,
      author: { "@type": "Organization", name: "RUMOAR" },
      publisher: { "@type": "Organization", name: "RUMOAR" },
      mainEntityOfPage: `${ORIGIN}/#/story`,
    },
  });

  const select = useCallback((n) => {
    if (n === pending.current) return;
    pending.current = n;
    setOut(true);
    track("era_select", { era: ERAS[n].year });
    setTimeout(() => { setI(pending.current); setOut(false); }, reduced() ? 60 : 400);
  }, []);

  /* slow drift on the era board — reads as a held camera, not a parallax trick */
  useScene(sec, (p) => {
    if (figure.current) {
      figure.current.style.transform =
        `scale(${1.05 - p * 0.05}) translate3d(0,${(p - 0.5) * 24}px,0)`;
    }
  }, 6);

  const d = ERAS[i];

  return (
    <>
      <section className="wrap top">
        <Crumb trail={[{ label: "Home", to: "/" }, { label: "The story" }]} />
        <div className="g" style={{ alignItems: "end" }}>
          <div style={{ gridColumn: "1/9" }}>
            <Lines as="h1" className="mega" lines={[
              "A wardrobe is not",
              { t: "a pile of things.", dim: true },
            ]} />
          </div>
          <div style={{ gridColumn: "9/13" }}>
            <Reveal delay={200}>
              <p className="lede">
                Indian menswear spent a hundred and twenty-six years getting very good
                at selling garments and never once built a system. Here is how it
                happened, decade by decade — and what is still missing.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section ref={sec} style={{ paddingBottom: "clamp(50px,9vh,120px)", marginTop: "clamp(30px,5vh,60px)" }}>
        <EraRail i={i} onSelect={select} />

        <div className={`wrap g era ${out ? "out" : ""}`}
          style={{ alignItems: "start", marginTop: "clamp(24px,4vh,56px)" }}>

          <div className="zl" style={{ transitionDelay: out ? "0ms" : "90ms" }}>
            <LB>What he needed</LB>
            <div style={{ marginTop: 20 }}>
              {d.needs.map((w, k) => (
                <p key={w} className="need serif" style={{ opacity: 1 - k * 0.2 }}>{w}</p>
              ))}
            </div>
            <p className="body" style={{ marginTop: 24, maxWidth: "34ch" }}>{d.note}</p>
            <div style={{ marginTop: 28 }}>
              {d.drivers.map((x) => (
                <span key={x} className="lb"
                  style={{ display: "inline-block", marginRight: 16, marginBottom: 8, color: "var(--ink-2)" }}>
                  {x}
                </span>
              ))}
            </div>
          </div>

          <div className="zc" style={{ transitionDelay: out ? "0ms" : "220ms", marginTop: "clamp(-40px,-3vh,0px)" }}>
            <div style={{ overflow: "hidden", height: "clamp(420px,66svh,760px)" }}>
              <div ref={figure} style={{ height: "100%", willChange: "transform" }}>
                <EraCollage era={d} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "clamp(18px,3vw,54px)", marginTop: 18, flexWrap: "wrap" }}>
              <div><LB>Era</LB><p className="body" style={{ marginTop: 6 }}>{d.era}</p></div>
              <div style={{ flex: 1, minWidth: 200 }}><LB>Style</LB><p className="body" style={{ marginTop: 6 }}>{d.style}</p></div>
              <div><LB>Reading</LB><p className="body" style={{ marginTop: 6 }}>{d.read}</p></div>
            </div>
          </div>

          <div className="zr" style={{ transitionDelay: out ? "0ms" : "340ms" }}>
            <LB>How it read</LB>
            <p className="mid" style={{ marginTop: 18 }}>
              {d.eq[0]}<br /><span className="dim">→ {d.eq[1]}</span>
            </p>
            <p className="body" style={{ marginTop: 20 }}>{d.identity}</p>
            <div style={{ marginTop: 28 }}>
              {d.signals.map((s) => (
                <div className="kv" key={s}><span>{s}</span><span className="dim num">{d.year}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* the argument, stated once, after the reader has walked the timeline */}
      <section className="wrap dark sec" style={{ borderRadius: "var(--rad)" }}>
        <div className="g">
          <div style={{ gridColumn: "1/8" }}>
            <Reveal><LB style={{ color: "var(--mark)" }}>Which brings us here</LB></Reveal>
            <Lines as="h2" className="big" delay={80} style={{ marginTop: 16 }} lines={[
              "The problem stopped",
              "being access in 2010.",
            ]} />
            <Reveal delay={240}>
              <p className="body" style={{ marginTop: 22, color: "var(--bone-2)" }}>
                You can buy a good shirt in nine hundred places. You cannot buy nine
                things that agree with each other. Every piece here is designed against
                the other eight: one palette, one hardware finish, one set of
                proportions. Buy one and it works. Buy four and they compound — not
                because they match, but because they were drawn by someone who knew
                what the other three were going to be.
              </p>
            </Reveal>
            <Reveal delay={320} style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Magnetic className="btn btn-mark" onClick={() => go("/shop")}>Shop the six</Magnetic>
              <Magnetic className="btn btn-line" onClick={() => go("/court")}>Get dealt your card</Magnetic>
            </Reveal>
          </div>
          <div style={{ gridColumn: "9/13", alignSelf: "center" }}>
            <Reveal delay={280}><Thread /></Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

/* ===========================================================================
   §2  THE COURT

   Six questions, one card, fifty-two hands. The full argument for why this
   exists is at the top of court.js; this file is only the interface.

   Three states: asking, dealing, dealt. The dealing state is 1.4 seconds of
   deliberate theatre — a result that appears instantly reads as a lookup
   table, and a result that is dealt reads as a verdict.
   =========================================================================== */
function DealtCard({ hand }) {
  return (
    <div className={hand.rare ? "rare-glow" : ""}>
      <Card index={hand.label} suit={hand.suit} n={hand.symbol}
        name={hand.name} material={hand.house} />
    </div>
  );
}

export function Court({ code, onAdd }) {
  const [answers, setAnswers] = useState([]);
  const [phase, setPhase] = useState("ask");     // ask · dealing · dealt
  const [hand, setHand] = useState(null);
  const [, setSaved] = useLocal("rumoar.card.v1", null);
  const [copied, copy] = useCopy();

  useHead({ ...SEO.court, path: code ? `/court/${code}` : "/court" });

  /* A shared link restores the exact card with no quiz and no account. This
     is the entire distribution mechanism, so it runs before anything else. */
  useEffect(() => {
    if (!code) return;
    const h = decode(code);
    if (h) { setHand(h); setPhase("dealt"); track("court_shared_open", { code }); }
  }, [code]);

  const answer = (qi, oi) => {
    const next = [...answers];
    next[qi] = oi;
    setAnswers(next);
    if (next.filter((x) => x != null).length === QUESTIONS.length) {
      setPhase("dealing");
      const h = deal(next);
      track("court_dealt", { card: h.cardName, code: h.code });
      setTimeout(() => {
        setHand(h);
        setSaved({ code: h.code, at: Date.now() });
        setPhase("dealt");
        go(`/court/${h.code}`);
      }, reduced() ? 200 : 1500);
    }
  };

  const restart = () => {
    setAnswers([]); setHand(null); setPhase("ask"); go("/court");
  };

  const step = answers.filter((x) => x != null).length;

  /* ——— asking ——— */
  if (phase === "ask") {
    const q = QUESTIONS[step];
    return (
      <section className="wrap dark court">
        <div className="qwrap">
          <div className="qprog" aria-hidden="true">
            {QUESTIONS.map((_, i) => <i key={i} className={i <= step ? "on" : ""} />)}
          </div>
          <p className="qn">Question {step + 1} of {QUESTIONS.length} · {q.axis === "suit" ? "the suit" : "the rank"}</p>
          <h1 className="qq">{q.q}</h1>
          <div className="qopts">
            {q.options.map((o, oi) => (
              <button key={oi} className="qopt" onClick={() => answer(step, oi)}>
                <i>{"ABCD"[oi]}</i>{o.t}
              </button>
            ))}
          </div>
          {step > 0 ? (
            <button className="link" style={{ marginTop: 26, color: "var(--bone-3)", fontSize: ".78rem" }}
              onClick={() => setAnswers(answers.slice(0, -1))}>← Take that one back</button>
          ) : (
            <p className="body" style={{ marginTop: 26, color: "var(--bone-3)", fontSize: ".8rem" }}>
              Ninety seconds. No email, no account, nothing stored anywhere but your own browser.
            </p>
          )}
        </div>
      </section>
    );
  }

  /* ——— dealing ——— */
  if (phase === "dealing") {
    return (
      <section className="wrap dark court">
        <div className="dealing">
          <div className="deck" style={{ position: "relative", aspectRatio: "5/7" }}>
            {[0, 1, 2, 3, 4].map((k) => (
              <div key={k} style={{
                position: "absolute", inset: 0,
                transform: `translateY(${-k * 3}px) rotate(${(k - 2) * 1.6}deg)`,
              }}>
                <Card back />
              </div>
            ))}
          </div>
          <p>Shuffling fifty-two…</p>
        </div>
      </section>
    );
  }

  /* ——— dealt ——— */
  const pieces = hand.pieces.map(byId).filter(Boolean);
  const shareUrl = `${ORIGIN}/#/court/${hand.code}`;
  const shareText = `I got dealt the ${hand.cardName} — ${hand.name}. "${hand.read}" What's your card?`;

  return (
    <>
      <section className="wrap dark court">
        <div className="result">
          <div className="result-card"><DealtCard hand={hand} /></div>

          <div>
            <p className="r-house">{hand.house} · {hand.motive}</p>
            <h1>{hand.name}</h1>
            <p className="r-read">{hand.read}</p>
            <p className="r-odds">
              {hand.cardName} · <b>1 in {hand.odds}</b> hands
              {hand.rare ? " · rare" : ""}
            </p>

            <div className="rgrid">
              <div>
                <h4>The tell</h4>
                <p>{hand.tell}</p>
              </div>
              <div>
                <h4>The risk</h4>
                <p>{hand.risk}</p>
              </div>
            </div>

            <div className="r-acts">
              <button className="btn btn-mark"
                onClick={() => {
                  track("court_share", { code: hand.code });
                  if (navigator.share) {
                    navigator.share({ title: "RUMOAR — The Court", text: shareText, url: shareUrl })
                      .catch(() => copy(`${shareText} ${shareUrl}`));
                  } else copy(`${shareText} ${shareUrl}`);
                }}>
                {copied ? "Copied" : "Share your card"}
              </button>
              <button className="btn btn-line" onClick={restart}>Deal again</button>
            </div>

            <p className="body" style={{ marginTop: 18, fontSize: ".78rem", color: "var(--bone-3)" }}>
              Your card lives at <code>{shareUrl}</code> — no account needed.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap sec">
        <div className="opener">
          <div>
            <Reveal><LB>Dealt to you</LB></Reveal>
            <Reveal delay={80}>
              <h2 className="big" style={{ marginTop: 14 }}>
                Three pieces for {hand.name.replace(/^The /, "the ")}.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={140}><a className="link" href="#/shop">See all six →</a></Reveal>
        </div>
        <div className="grid">
          {pieces.map((p, i) => (
            <ProductCard key={p.id} p={p} delay={i * 80} onAdd={onAdd} />
          ))}
        </div>
        <Reveal delay={280} style={{ marginTop: 34 }}>
          <p className="body">
            Your card is kept in this browser and shows up in{" "}
            <a className="link" href="#/members">The Hand</a> alongside anything you own.
          </p>
        </Reveal>
      </section>
    </>
  );
}

/* ===========================================================================
   §3  THE HAND — the members' space

   There is no server, so this is honest about what it is: everything lives in
   this browser. That is stated plainly on the page rather than dressed up as
   an account, because a fake login screen that accepts any password is worse
   than no login at all.

   When a backend arrives, the shape it needs is already here: a card code, a
   list of owned piece ids, and an order history.
   =========================================================================== */
const TIERS = [
  { n: "01", name: "Dealt in", at: 1, perks: ["Your card, kept and shareable", "Thirty-night trial on everything", "Repairs handled in-house, for life"] },
  { n: "02", name: "A working hand", at: 3, perks: ["First refusal on the three undealt pieces", "Free re-waxing and re-rhodiuming, annually", "Named contact at the workshop that made yours"] },
  { n: "03", name: "The full deck", at: 6, perks: ["Your initials struck into every piece", "One workshop visit, at our cost", "The ninth piece before it is announced"] },
];

export function Members() {
  const [card] = useLocal("rumoar.card.v1", null);
  const orders = store.get("rumoar.orders.v1", []) || [];

  useHead({ ...SEO.members, path: "/members" });

  const owned = useMemo(() => {
    const s = new Set();
    orders.forEach((o) => (o.lines || []).forEach((l) => s.add(l.id)));
    return s;
  }, [orders]);

  const hand = card?.code ? decode(card.code) : null;
  const tier = TIERS.filter((t) => owned.size >= t.at).pop() || null;
  const spent = orders.reduce((a, o) => a + (o.total || 0), 0);

  return (
    <section className="wrap top" style={{ paddingBottom: "clamp(64px,10vw,140px)" }}>
      <Crumb trail={[{ label: "Home", to: "/" }, { label: "The Hand" }]} />

      <div className="g" style={{ alignItems: "end" }}>
        <div style={{ gridColumn: "1/8" }}>
          <Lines as="h1" className="mega" lines={["The Hand."]} />
          <Reveal delay={180}>
            <p className="lede" style={{ marginTop: 20 }}>
              Everything you hold, in one place: your card, your pieces, your repairs,
              and what opens next. Membership isn&rsquo;t bought — it starts the moment
              you&rsquo;re dealt in.
            </p>
          </Reveal>
        </div>
        <div style={{ gridColumn: "9/13" }}>
          <Reveal delay={260}>
            <p className="body" style={{ fontSize: ".82rem" }}>
              <b style={{ color: "var(--ink)" }}>Where this lives.</b> There is no account
              and no password, because there is no server yet. Your card and your orders
              are kept in this browser only. Clear your site data and they go with it.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ——— your card ——— */}
      <div className="sec-tight">
        <Reveal><LB>Your card</LB></Reveal>
        {hand ? (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,180px) minmax(0,1fr)", gap: "clamp(20px,3vw,44px)", alignItems: "center", marginTop: 22 }}>
            <div><Card index={hand.label} suit={hand.suit} n={hand.symbol} name={hand.name} material={hand.house} /></div>
            <div>
              <p className="lb" style={{ color: "var(--mark)" }}>{hand.house}</p>
              <h2 className="big" style={{ marginTop: 10, fontSize: "clamp(1.6rem,3vw,2.4rem)" }}>{hand.name}</h2>
              <p className="body" style={{ marginTop: 14, fontFamily: "var(--font-display)", fontSize: "1.06rem" }}>
                {hand.read}
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
                <a className="btn btn-line btn-sm" href={`#/court/${hand.code}`}>Open your card</a>
                <a className="btn btn-line btn-sm" href="#/court">Deal again</a>
              </div>
            </div>
          </div>
        ) : (
          <div className="mcard" style={{ marginTop: 20, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ width: 110, flex: "0 0 auto" }}><Card back note="?" /></div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <p className="h3">You haven&rsquo;t been dealt in yet.</p>
              <p className="body" style={{ marginTop: 8, fontSize: ".9rem" }}>
                Six questions, ninety seconds, no email. It decides which of the
                fifty-two you hold and which three pieces sharpen it.
              </p>
              <button className="btn btn-mark btn-sm" style={{ marginTop: 16 }}
                onClick={() => go("/court")}>Deal me in</button>
            </div>
          </div>
        )}
      </div>

      {/* ——— what you hold ——— */}
      <div className="sec-tight">
        <div className="opener" style={{ marginBottom: 22 }}>
          <div><Reveal><LB>What you hold · {owned.size} of 9</LB></Reveal></div>
          <Reveal delay={80}><a className="link" href="#/shop">Fill the hand →</a></Reveal>
        </div>
        <div className="holding">
          {PRODUCTS.map((p) => (
            <div key={p.id} className={`hd ${owned.has(p.id) ? "" : "off"}`}>
              <a href={`#/piece/${p.id}`} aria-label={p.name}><PieceCard p={p} /></a>
              <p>{owned.has(p.id) ? "Held" : "Not yet"}</p>
            </div>
          ))}
          {UNDEALT.map((u) => (
            <div key={u.n} className="hd">
              <Card back note={u.n} />
              <p>In fitting</p>
            </div>
          ))}
        </div>
      </div>

      {/* ——— the record ——— */}
      <div className="sec-tight">
        <Reveal><LB>Your record</LB></Reveal>
        <div className="mgrid" style={{ marginTop: 20 }}>
          <div className="mcard mstat"><b className="num">{orders.length}</b><span>Orders placed</span></div>
          <div className="mcard mstat"><b className="num">{owned.size}</b><span>Pieces held</span></div>
          <div className="mcard mstat"><b className="num">{spent ? money(spent) : "—"}</b><span>Lifetime</span></div>
          <div className="mcard mstat"><b>{tier ? tier.name : "Unopened"}</b><span>Standing</span></div>
        </div>

        {orders.length ? (
          <div className="mcard" style={{ marginTop: "var(--gut)" }}>
            <p className="h3" style={{ marginBottom: 14 }}>Order history</p>
            {orders.slice().reverse().map((o) => (
              <div key={o.ref} className="li" style={{ gridTemplateColumns: "1fr auto" }}>
                <div>
                  <p className="li-n">RMR-{o.ref}</p>
                  <p className="li-m">
                    {new Date(o.at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    {" · "}
                    {(o.lines || []).map((l) => byId(l.id)?.name).filter(Boolean).join(", ")}
                  </p>
                </div>
                <span className="num" style={{ fontWeight: 700 }}>{money(o.total || 0)}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* ——— what opens ——— */}
      <div className="sec-tight">
        <Reveal><LB>What opens, and when</LB></Reveal>
        <div className="tiers" style={{ marginTop: 20 }}>
          {TIERS.map((t) => (
            <div key={t.n} className={`tier ${owned.size >= t.at ? "on" : ""}`}>
              <span className="tn">{t.n}</span>
              <h3>{t.name}</h3>
              <p className="lb">{t.at} piece{t.at === 1 ? "" : "s"} held</p>
              <ul>{t.perks.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* a tiny helper so the members grid keeps the same rhythm as everything else */

/* ===========================================================================
   §4  VISIT — the three houses

   The maps are Google's no-key embed endpoint, which means no API key to
   leak, no billing account, and no map that silently turns into a
   "for development purposes only" watermark six months after launch.

   LocalBusiness schema is gated on LOCATIONS_VERIFIED for the reason set out
   in data.js: publishing structured data for a bracketed address is how a
   Business Profile gets suspended.
   =========================================================================== */
export function Visit() {
  useHead({
    ...SEO.visit, path: "/visit",
    schema: LOCATIONS_VERIFIED ? WORKSHOPS.map((w) => ({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: w.name,
      description: w.note,
      telephone: w.phone,
      openingHours: w.hours,
      address: {
        "@type": "PostalAddress",
        streetAddress: w.street,
        addressLocality: w.city,
        addressRegion: w.region,
        postalCode: w.pin,
        addressCountry: "IN",
      },
      geo: { "@type": "GeoCoordinates", latitude: w.geo.lat, longitude: w.geo.lng },
      url: `${ORIGIN}/#/visit`,
    })) : null,
  });

  return (
    <section className="wrap top" style={{ paddingBottom: "clamp(64px,10vw,140px)" }}>
      <Crumb trail={[{ label: "Home", to: "/" }, { label: "Visit" }]} />
      <div className="g" style={{ alignItems: "end" }}>
        <div style={{ gridColumn: "1/8" }}>
          <Lines as="h1" className="mega" lines={["Three houses.", { t: "No shop floor.", dim: true }]} />
        </div>
        <div style={{ gridColumn: "9/13" }}>
          <Reveal delay={200}>
            <p className="lede">
              Every piece names the workshop that made it. All three take visits by
              appointment — you&rsquo;ll be shown the bench your piece is made on, which
              is more useful than a mirror.
            </p>
          </Reveal>
        </div>
      </div>

      {!LOCATIONS_VERIFIED ? (
        <Reveal delay={120} style={{ marginTop: 30 }}>
          <span className="placeholder-flag">Addresses pending verification</span>
          <p className="body" style={{ marginTop: 12, fontSize: ".86rem" }}>
            Bracketed fields are placeholders held in <code>data.js</code>. Fill them in and
            set <code>LOCATIONS_VERIFIED = true</code>; that one change publishes the
            LocalBusiness structured data and pins each map to its exact coordinate.
          </p>
        </Reveal>
      ) : null}

      <div className="shops" style={{ marginTop: "clamp(30px,5vw,54px)" }}>
        {WORKSHOPS.map((w, i) => (
          <Reveal key={w.id} delay={i * 90}>
            <article className="shop">
              <div className="map">
                <iframe
                  title={`Map — ${w.name}, ${w.city}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(`${w.area}, ${w.city}, ${w.region}, India`)}&z=13&output=embed`}
                />
              </div>
              <div className="sb">
                <p className="lb" style={{ color: "var(--mark)" }}>{w.trades}</p>
                <h2 className="h3" style={{ fontSize: "1.1rem" }}>{w.name}</h2>
                <address>
                  {w.street}<br />
                  {w.area}, {w.city}<br />
                  {w.region} {w.pin}<br />
                  <span className="dim">{w.hours}</span>
                </address>
                <p className="body" style={{ fontSize: ".85rem" }}>{w.note}</p>
                <div className="sacts">
                  <a className="btn btn-line btn-sm" href={directionsLink(w)}
                    target="_blank" rel="noopener noreferrer"
                    onClick={() => track("directions", { workshop: w.id })}>Directions</a>
                  <a className="btn btn-line btn-sm" href={mapsLink(w)}
                    target="_blank" rel="noopener noreferrer">Open in Maps</a>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={200} style={{ marginTop: "clamp(34px,5vw,60px)" }}>
        <div className="promise-bar">
          <span className="pb-i"><Icon.clock /></span>
          <div>
            <b>Ask for an appointment and you&rsquo;ll hear back within one working day.</b>
            <span> Write to {CONTACT_EMAIL} with the city and two dates that suit you.</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ===========================================================================
   §5  QUESTIONS
   =========================================================================== */
export function Faq() {
  useHead({ ...SEO.faq, path: "/faq", schema: faqSchema(FAQS) });

  return (
    <section className="wrap top" style={{ paddingBottom: "clamp(64px,10vw,140px)" }}>
      <Crumb trail={[{ label: "Home", to: "/" }, { label: "Questions" }]} />
      <div className="g" style={{ alignItems: "end" }}>
        <div style={{ gridColumn: "1/8" }}>
          <Lines as="h1" className="mega" lines={["Questions,", { t: "answered plainly.", dim: true }]} />
        </div>
        <div style={{ gridColumn: "9/13" }}>
          <Reveal delay={200}>
            <p className="lede">
              If the answer isn&rsquo;t here, write to us. Everything else on this page is
              what we tell people who ask in person.
            </p>
          </Reveal>
        </div>
      </div>

      <Reveal delay={140} style={{ marginTop: "clamp(30px,5vw,52px)", maxWidth: "78ch" }}>
        <div className="promise-bar">
          <span className="pb-i"><Icon.clock /></span>
          <div>
            <b>One working day.</b>
            <span> That&rsquo;s the reply time, from a named person, in the language you
              wrote in. Sunday messages are answered Monday morning. No ticket number,
              no chatbot.</span>
          </div>
        </div>
      </Reveal>

      <div style={{ marginTop: "clamp(30px,4vw,50px)" }}>
        <FaqList items={FAQS} openFirst />
      </div>

      <Reveal delay={160} style={{ marginTop: "clamp(34px,5vw,60px)" }}>
        <p className="body">
          Still stuck? <a className="link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> —
          or come and see us at <a className="link" href="#/visit">one of the three workshops</a>.
        </p>
      </Reveal>
    </section>
  );
}

/* ===========================================================================
   §6  PRIVACY
   Written to be read. A privacy page nobody can read is a privacy page that
   protects nobody, and under India's DPDP Act it also isn't valid notice.
   =========================================================================== */
export function Privacy() {
  useHead({ ...SEO.privacy, path: "/privacy" });

  const S = ({ h, children }) => (
    <div style={{ marginTop: "clamp(28px,4vw,46px)", maxWidth: "72ch" }}>
      <h2 className="h3" style={{ fontSize: "1.1rem", marginBottom: 12 }}>{h}</h2>
      {children}
    </div>
  );

  return (
    <section className="wrap top" style={{ paddingBottom: "clamp(64px,10vw,140px)" }}>
      <Crumb trail={[{ label: "Home", to: "/" }, { label: "Privacy" }]} />
      <Lines as="h1" className="mega" lines={["What we keep.", { t: "What we don't.", dim: true }]} />
      <p className="lede" style={{ marginTop: 22 }}>
        Last updated 12 August 2026. This is the whole policy. If something here is
        unclear, that is a fault in the writing — tell us and we will fix it.
      </p>

      <S h="What this site stores on your device">
        <p className="body">
          Three things, all in your own browser&rsquo;s local storage, none of it sent
          anywhere: your bag (<code>rumoar.cart.v1</code>), your Court card
          (<code>rumoar.card.v1</code>), and your order history
          (<code>rumoar.orders.v1</code>). Clearing site data in your browser deletes all
          three permanently. We cannot read them and we cannot restore them.
        </p>
      </S>

      <S h="What we collect when you order">
        <p className="body">
          Name, email, phone, delivery address and PIN code — the minimum needed to make
          a parcel arrive. Payment is handled by the gateway; card numbers never touch
          this site and are never stored by us. Order records are kept for seven years
          because Indian tax law requires it, then deleted.
        </p>
      </S>

      <S h="Analytics, and why you get asked first">
        <p className="body">
          We use Google Analytics to count pages and see where people give up. It does
          not load, and no identifier is created, until you choose &ldquo;Allow&rdquo; on
          the banner. Choose &ldquo;No thanks&rdquo; and nothing is ever sent — the site
          works identically either way. IP addresses are anonymised. You can change your
          mind at any time from the link in the footer.
        </p>
      </S>

      <S h="What we never do">
        <p className="body">
          We do not sell, rent or share your details with data brokers, advertisers or
          anyone else for their own purposes. We do not run advertising pixels. We do not
          email you unless you asked us to, and one click ends it.
        </p>
      </S>

      <S h="Your rights">
        <p className="body">
          Under India&rsquo;s Digital Personal Data Protection Act — and the GDPR if you
          are writing from the EU — you can ask for a copy of everything we hold on you,
          ask for it to be corrected, or ask for it to be erased. Write to{" "}
          <a className="link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We
          reply within one working day and complete the request within thirty days.
        </p>
      </S>

      <S h="Who to contact">
        <p className="body">
          RUMOAR, care of the Chennai workshop — full address on the{" "}
          <a className="link" href="#/visit">Visit page</a>.{" "}
          <a className="link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </S>
    </section>
  );
}

/* ===========================================================================
   §7  THE 404

   A card that isn't in the deck. The joke has to land in under a second, so
   the drawing is a joker and the headline is four words — and every route out
   of here is one tap away, which is the only job a 404 actually has.
   =========================================================================== */
export function NotFound() {
  useHead({ ...SEO.notfound, path: "/404" });
  useEffect(() => { track("not_found", { hash: window.location.hash }); }, []);

  return (
    <section className="wrap lost">
      <div>
        <div className="lost-card">
          <Card index="?" suit="heart" n="?" name="The Joker" material="Not in this deck" />
        </div>
        <h1 className="big" style={{ marginTop: 34 }}>You drew a card we don&rsquo;t hold.</h1>
        <p className="body" style={{ marginTop: 16, marginInline: "auto", textAlign: "center" }}>
          That page doesn&rsquo;t exist — the link may be mistyped, or something moved.
          Everything the store has is one tap away.
        </p>
        <div className="lost-links">
          <a className="btn btn-solid btn-sm" href="#/shop">Shop the six</a>
          <a className="btn btn-line btn-sm" href="#/court">Get dealt your card</a>
          <a className="btn btn-line btn-sm" href="#/story">The story</a>
          <a className="btn btn-line btn-sm" href="#/faq">Questions</a>
          <a className="btn btn-line btn-sm" href="#/visit">Visit</a>
        </div>
      </div>
    </section>
  );
}
