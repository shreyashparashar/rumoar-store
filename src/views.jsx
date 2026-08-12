import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  PRODUCTS, UNDEALT, byId, byWorkshop, LINES, CREED, PROMISES, CASES,
  REVIEWS, REVIEWS_VERIFIED, ratingSummary, FAQS, SEO, pieceSeo, ORIGIN, asset,
} from "./data.js";
import {
  Reveal, Lines, LB, Magnetic, go, useScene, clamp, money, useHead,
  useCountUp, useSeen, reduced, track,
} from "./lib.jsx";
import {
  Plate, PieceCard, Card, ProductCard, Thread, Stock, Qty, Crumb, Icon,
  ReviewCard, ReviewNotice, Stars, StickyCTA, FaqList, faqSchema,
} from "./parts.jsx";
import { useCart } from "./cart.jsx";

/* ===========================================================================
   §1  HOME
   =========================================================================== */

/* ---------------------------------------------------------------------------
   THE HAND

   Six product cards fanned on a dark table. This is the hero, and it is the
   whole argument in one object: the pieces are a hand, not a grid.

   The fan is computed rather than hand-placed, because six cards at six
   hard-coded angles breaks the moment a seventh piece goes live. Each card
   rotates about a pivot well below the card faces (transform-origin 50% 165%)
   which is what makes it read as HELD — a fan pivoted at the card's own
   centre looks like a spread deck lying on a table instead.

   Hovering lifts one card and pushes its neighbours apart, so the fan behaves
   like a hand being read rather than a carousel.
   --------------------------------------------------------------------------- */
function Hand() {
  const [hover, setHover] = useState(-1);
  const n = PRODUCTS.length;
  const SPREAD = 7.2;                       // degrees between cards
  const LIFT = 16;                          // px a hovered card rises

  return (
    <div className="hand" role="list" aria-label="The six live pieces">
      {PRODUCTS.map((p, i) => {
        const mid = (n - 1) / 2;
        let deg = (i - mid) * SPREAD;
        let x = (i - mid) * 26;
        let y = Math.abs(i - mid) * 5;
        /* neighbours of the hovered card step aside rather than staying put —
           this is the detail that reads as a hand of cards being fanned open */
        if (hover >= 0 && i !== hover) {
          const push = i < hover ? -1 : 1;
          deg += push * 2.6;
          x += push * 16;
        }
        const up = hover === i;
        return (
          <a key={p.id} role="listitem" className="hand-c" href={`#/piece/${p.id}`}
            aria-label={`${p.name}, ${p.card.name}, ${money(p.price)}`}
            onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(-1)}
            onFocus={() => setHover(i)} onBlur={() => setHover(-1)}
            style={{
              zIndex: up ? 30 : 10 + i,
              transform: `translate(${x}px, ${y - (up ? LIFT : 0)}px) rotate(${deg}deg) scale(${up ? 1.06 : 1})`,
            }}>
            <PieceCard p={p} />
            <span className="hand-tip">{p.name} · <b>{money(p.price)}</b></span>
          </a>
        );
      })}
    </div>
  );
}

function Hero() {
  const ref = useRef(null);
  const seen = useSeen(ref, 0.05);
  const pieces = useCountUp(9, seen);

  return (
    <header className="wrap hero dark" ref={ref} id="top">
      <div className="hero-g">
        <div>
          <Reveal>
            <span className="hero-eyebrow"><i />Six of nine live · shipping across India</span>
          </Reveal>

          <Lines as="h1" className="mega" lines={[
            "You are read",
            "before you",
            { t: "speak.", mark: true },
          ]} />

          <Reveal delay={300}>
            <p className="lede">
              {pieces} objects decide it — the wallet, the watch, the chain, the frames,
              the bag, the scent. Indian menswear never built them as a system.
              We did. Six are live.
            </p>
          </Reveal>

          {/* CTA above the fold, and the primary one is the thing nobody else
              has: the deal. "Shop" is the safe second. */}
          <Reveal delay={380} className="hero-cta">
            <Magnetic className="btn btn-solid btn-lg"
              onClick={() => { track("cta_click", { cta: "hero_court" }); go("/court"); }}>
              Get dealt your card
            </Magnetic>
            <Magnetic className="btn btn-line btn-lg" onClick={() => go("/shop")}>
              Shop the six
            </Magnetic>
          </Reveal>

          <Reveal delay={460}>
            <div className="hero-trust">
              <span><Icon.truck />Free shipping over ₹2,000</span>
              <span><Icon.moon />Thirty-night trial</span>
              <span><Icon.wrench />Repaired, not replaced</span>
              <span><Icon.pin />Made in Chennai · Kolkata · Jaipur</span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={220}><Hand /></Reveal>
      </div>
    </header>
  );
}

function CreedBar() {
  const run = [...CREED, ...CREED, ...CREED, ...CREED, ...CREED, ...CREED];
  return (
    <div className="creedbar" aria-hidden="true">
      <div className="creedtrack">
        {run.map((w, i) => <span key={i}>{w}</span>)}
      </div>
    </div>
  );
}

/** The band that sends people into the Court. It sits after the products,
    where somebody who liked the objects but doesn't know which one is theirs
    now has a reason to keep going instead of leaving. */
function CourtBand() {
  return (
    <section className="wrap dark sec" style={{ borderRadius: "var(--rad)" }}>
      <div style={{ display: "grid", gap: "clamp(26px,4vw,60px)", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,.8fr)", alignItems: "center" }}>
        <div>
          <Reveal><LB style={{ color: "var(--mark)" }}>The Court · six questions</LB></Reveal>
          <Lines as="h2" className="big" delay={80} style={{ marginTop: 14 }} lines={[
            "Fifty-two men",
            { t: "walk into a room.", serif: true, it: true },
          ]} />
          <Reveal delay={220}>
            <p className="body" style={{ marginTop: 20, color: "var(--bone-2)" }}>
              Answer six questions about how you actually move through one, and the deck
              hands back the card the room already reads you as — plus the three pieces
              that sharpen it. No email, no account, ninety seconds.
            </p>
          </Reveal>
          <Reveal delay={300} style={{ marginTop: 30 }}>
            <Magnetic className="btn btn-mark btn-lg" onClick={() => go("/court")}>
              Deal me in
            </Magnetic>
          </Reveal>
        </div>
        <Reveal delay={200}>
          <div style={{ display: "flex", justifyContent: "center", gap: -20 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: "clamp(84px,11vw,132px)", marginLeft: i ? "-14%" : 0,
                transform: `rotate(${(i - 1) * 8}deg) translateY(${Math.abs(i - 1) * 10}px)`,
              }}>
                {i === 1 ? <Card index="A" suit="heart" n="?" name="Your hand" material="Six questions" />
                  : <Card back />}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Home({ onAdd }) {
  const { avg, count } = ratingSummary();
  useHead({
    ...SEO.home, path: "/",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "RUMOAR",
      url: ORIGIN,
      potentialAction: {
        "@type": "SearchAction",
        target: `${ORIGIN}/#/shop?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  });

  return (
    <>
      <Hero />
      <CreedBar />

      {/* ——— the six ——— */}
      <section className="wrap sec" id="pieces">
        <div className="opener">
          <div>
            <Reveal><LB>The hand · six live</LB></Reveal>
            <Reveal delay={90}>
              <h2 className="big" style={{ marginTop: 14 }}>
                Start anywhere.<br />They already agree.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={180}>
            <a className="link" href="#/shop">See all six →</a>
          </Reveal>
        </div>

        <div className="grid">
          {PRODUCTS.slice(0, 3).map((p, i) => (
            <ProductCard key={p.id} p={p} onAdd={onAdd} delay={i * 90} eager={i === 0} />
          ))}
        </div>
      </section>

      {/* ——— the three decisions ——— */}
      <section className="wrap sec-tight">
        <div className="opener">
          <div>
            <Reveal><LB>What we decided</LB></Reveal>
            <Reveal delay={80}>
              <h2 className="big" style={{ marginTop: 14 }}>Three claims you can check.</h2>
            </Reveal>
          </div>
        </div>
        <div className="cases">
          {CASES.map((c, i) => (
            <Reveal key={c.id} delay={i * 90} className="case">
              <p className="cs-k">{c.kicker}</p>
              <p className="cs-s num">{c.stat}</p>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
              <p className="cs-p">
                {c.proof}<br />
                <a className="link" href={`#${c.to}`} style={{ color: "var(--mark)", marginTop: 8 }}>
                  {c.cta} →
                </a>
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— the thread ——— */}
      <section className="wrap quote">
        <Reveal>
          <p>Nine pieces. Twenty-eight coherent outfits. One recognisable man.</p>
        </Reveal>
        <Reveal delay={220} style={{ marginTop: "clamp(34px,6vh,64px)", display: "grid", placeItems: "center" }}>
          <Thread />
        </Reveal>
        <Reveal delay={300} style={{ marginTop: 28 }}>
          <a className="link" href="#/story">Read the 126-year argument →</a>
        </Reveal>
      </section>

      <CourtBand />

      {/* ——— what people said ——— */}
      <section className="wrap sec">
        <div className="opener">
          <div>
            <Reveal><LB>In the pocket · on the wrist</LB></Reveal>
            <Reveal delay={80}>
              <h2 className="big" style={{ marginTop: 14 }}>Written after thirty nights.</h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <div style={{ textAlign: "right" }}>
              <Stars n={Math.round(avg)} label={`${avg} out of 5`} />
              <p className="lb" style={{ marginTop: 8 }}>{avg} average · {count} reviews</p>
            </div>
          </Reveal>
        </div>
        <div className="revs">
          {REVIEWS.slice(0, 3).map((r) => <ReviewCard key={r.id} r={r} />)}
        </div>
        <ReviewNotice />
      </section>

      {/* ——— the promises ——— */}
      <section className="wrap sec-tight">
        <div className="promises">
          {PROMISES.map(([h, b], i) => {
            const Ico = [Icon.pin, Icon.moon, Icon.wrench, Icon.clock][i];
            return (
              <Reveal key={h} delay={i * 80} className="promise">
                <h3><Ico />{h}</h3>
                <p>{b}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ——— the questions ——— */}
      <section className="wrap sec-tight">
        <div className="opener">
          <div>
            <Reveal><LB>Before you buy</LB></Reveal>
            <Reveal delay={80}>
              <h2 className="big" style={{ marginTop: 14 }}>The five things people ask.</h2>
            </Reveal>
          </div>
          <Reveal delay={160}><a className="link" href="#/faq">All questions →</a></Reveal>
        </div>
        <FaqList items={FAQS.slice(0, 5)} />
      </section>
    </>
  );
}

/* ===========================================================================
   §2  SHOP
   =========================================================================== */
export function Shop({ onAdd }) {
  const [line, setLine] = useState("All");
  const [sort, setSort] = useState("featured");

  useHead({
    ...SEO.shop, path: "/shop",
    schema: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "The RUMOAR system — six live pieces",
      numberOfItems: PRODUCTS.length,
      itemListElement: PRODUCTS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${ORIGIN}/#/piece/${p.id}`,
        name: p.name,
      })),
    },
  });

  const list = useMemo(() => {
    let l = line === "All" ? [...PRODUCTS] : PRODUCTS.filter((p) => p.line === line);
    if (sort === "low") l.sort((a, b) => a.price - b.price);
    if (sort === "high") l.sort((a, b) => b.price - a.price);
    return l;
  }, [line, sort]);

  return (
    <section className="wrap top" style={{ paddingBottom: "clamp(64px,10vw,140px)" }}>
      <Crumb trail={[{ label: "Home", to: "/" }, { label: "Shop" }]} />
      <Lines as="h1" className="big" lines={["Six of the nine."]} />
      <p className="body" style={{ marginTop: 16 }}>
        The remaining three are in fitting. Everything here ships from a named
        workshop within two working days — <a className="link" href="#/visit">you can visit all three</a>.
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap", alignItems: "center", margin: "clamp(28px,5vw,50px) 0 clamp(22px,3vw,38px)" }}>
        <div className="filters" role="group" aria-label="Filter by line">
          {LINES.map((l) => (
            <button key={l} className={`fbtn ${line === l ? "on" : ""}`}
              aria-pressed={line === l}
              onClick={() => { setLine(l); track("filter", { line: l }); }}>{l}</button>
          ))}
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="lb">Sort</span>
          <select className="sel" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="low">Price — low to high</option>
            <option value="high">Price — high to low</option>
          </select>
        </label>
      </div>

      <p className="sr" aria-live="polite">{list.length} pieces shown</p>

      {list.length ? (
        <div className="grid feature">
          {list.map((p, i) => (
            <ProductCard key={p.id} p={p} onAdd={onAdd} delay={i * 70} eager={i < 2} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <p className="mid">Nothing in that line yet.</p>
          <button className="btn btn-line btn-sm" onClick={() => setLine("All")}>Show all six</button>
        </div>
      )}

      {/* the three that aren't dealt yet — stated, not hidden */}
      <div className="sec-tight">
        <Reveal><LB>Face down · three in fitting</LB></Reveal>
        <div className="grid" style={{ marginTop: 22 }}>
          {UNDEALT.map((u, i) => (
            <Reveal key={u.n} delay={i * 80}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ width: 84, flex: "0 0 auto" }}>
                  <Card back note={u.n} />
                </div>
                <div>
                  <p className="pline">{u.line}</p>
                  <p className="pname" style={{ marginTop: 5 }}>{u.name}</p>
                  <p className="pblurb" style={{ marginTop: 5 }}>{u.note}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={260} style={{ marginTop: 26 }}>
          <p className="body">
            Members get first refusal on all three.{" "}
            <a className="link" href="#/members">See what membership is →</a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ===========================================================================
   §3  PRODUCT DETAIL
   =========================================================================== */
export function Product({ id, onAdd }) {
  const p = byId(id);
  const [colour, setColour] = useState(() => p?.colours[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const buyRef = useRef(null);
  const [pastBuy, setPastBuy] = useState(false);
  const cart = useCart();

  /* The sticky bar appears once the real add-to-bag button has scrolled off,
     and never before — a duplicate CTA sitting under the one it duplicates is
     just clutter. */
  useEffect(() => {
    const el = buyRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setPastBuy(!e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [id]);

  useEffect(() => {
    if (!p) return;
    setColour(p.colours[0]?.id ?? "");
    setQty(1);
    track("view_item", { item_id: p.id, item_name: p.name, price: p.price, currency: "INR" });
  }, [id, p]);

  const seo = p ? pieceSeo(p) : SEO.notfound;
  const reviews = p ? REVIEWS.filter((r) => r.product === p.id) : [];

  useHead({
    title: seo.title, desc: seo.desc, path: p ? `/piece/${p.id}` : "/shop",
    noindex: !p,
    image: p?.img ? `${ORIGIN}${asset(p.img)}` : undefined,
    schema: p ? {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: p.blurb,
      sku: p.id,
      brand: { "@type": "Brand", name: "RUMOAR" },
      material: p.material,
      color: p.colours.map((c) => c.name).join(", "),
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: p.price,
        availability: p.stock > 0
          ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        url: `${ORIGIN}/#/piece/${p.id}`,
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingRate: { "@type": "MonetaryAmount", value: p.price >= 2000 ? 0 : 149, currency: "INR" },
          shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
        },
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          applicableCountry: "IN",
          returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
          merchantReturnDays: 30,
          returnMethod: "https://schema.org/ReturnByMail",
          returnFees: "https://schema.org/FreeReturn",
        },
      },
      /* Ratings are only published once REVIEWS_VERIFIED is true. Emitting an
         AggregateRating built from sample copy is the fastest way to get rich
         results pulled — and it would be a lie. */
      ...(REVIEWS_VERIFIED && reviews.length ? {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1),
          reviewCount: reviews.length,
        },
      } : {}),
    } : null,
  });

  if (!p) {
    return (
      <section className="wrap top" style={{ paddingBottom: "18vh" }}>
        <Crumb trail={[{ label: "Home", to: "/" }, { label: "Shop", to: "/shop" }, { label: "Not found" }]} />
        <div className="empty">
          <p className="mid">That piece isn&rsquo;t in the deck.</p>
          <p className="body" style={{ textAlign: "center" }}>
            It may have been renamed, or the link may be mistyped.
          </p>
          <button className="btn btn-solid btn-sm" onClick={() => go("/shop")}>Back to the six</button>
        </div>
      </section>
    );
  }

  const shop = byWorkshop(p.workshop);
  const others = p.goes.map(byId).filter(Boolean);
  const soldOut = p.stock <= 0;
  const inBag = cart.has(p.id, colour);

  return (
    <>
      <section className="wrap top">
        <Crumb trail={[
          { label: "Home", to: "/" },
          { label: "Shop", to: "/shop" },
          { label: p.line, to: "/shop" },
          { label: p.name },
        ]} />

        <div className="g">
          <div className="pdp-media">
            <Plate p={p} eager />
            <Reveal delay={120}>
              <p className="body" style={{ marginTop: 26, fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.06rem", color: "var(--ink-2)" }}>
                {p.thread}
              </p>
            </Reveal>

            {/* the named house — the case study made concrete on the page
                where somebody is deciding */}
            {shop ? (
              <Reveal delay={180}>
                <div className="maker">
                  <span className="mk-i">{shop.city[0]}</span>
                  <div>
                    <p className="h3">{shop.name}</p>
                    <p className="body" style={{ fontSize: ".85rem", marginTop: 6 }}>{shop.note}</p>
                    <a className="link" href="#/visit" style={{ fontSize: ".8rem", marginTop: 10, color: "var(--mark)" }}>
                      Visit {shop.city} →
                    </a>
                  </div>
                </div>
              </Reveal>
            ) : null}
          </div>

          <div className="pdp-info">
            <p className="pline">{p.line} · {p.card.name}</p>
            <h1 className="big" style={{ marginTop: 10, fontSize: "clamp(1.7rem,3vw,2.5rem)" }}>{p.name}</h1>

            <div className="pdp-price">
              {p.was ? <span className="pwas num" style={{ fontSize: "1rem" }}>{money(p.was)}</span> : null}
              <b className="num">{money(p.price)}</b>
              <Stock n={p.stock} />
            </div>

            <p className="body" style={{ marginTop: 18 }}>{p.blurb}</p>

            <div style={{ marginTop: 28 }}>
              <p className="lb" style={{ marginBottom: 12 }}>
                Finish — {p.colours.find((c) => c.id === colour)?.name}
              </p>
              <div className="swatches" role="radiogroup" aria-label="Finish">
                {p.colours.map((c) => (
                  <button key={c.id} role="radio" aria-checked={colour === c.id}
                    aria-label={c.name} title={c.name}
                    className={`sw ${colour === c.id ? "on" : ""}`}
                    style={{ background: c.hex }}
                    onClick={() => setColour(c.id)} />
                ))}
              </div>
            </div>

            <div ref={buyRef} style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 26, flexWrap: "wrap" }}>
              <Qty value={qty} onChange={(v) => setQty(Math.max(1, v))} max={Math.max(1, p.stock)} />
              <button className="btn btn-solid" style={{ flex: 1, minWidth: 190 }}
                disabled={soldOut}
                onClick={() => onAdd(p, colour, qty)}>
                {soldOut ? "Sold out" : `Add to bag — ${money(p.price * qty)}`}
              </button>
            </div>

            {inBag ? (
              <p className="body" style={{ fontSize: ".8rem", marginTop: 10, color: "var(--ok)", fontWeight: 700 }}>
                Already in your bag in this finish.
              </p>
            ) : null}

            <p className="body" style={{ fontSize: ".8rem", marginTop: 14 }}>
              Free shipping over ₹2,000 · <a className="link" href="#/faq">Thirty-night trial</a> ·
              Repaired, not replaced
            </p>

            <div style={{ marginTop: 34 }}>
              <details className="acc" open>
                <summary>Specification<i /></summary>
                <div className="acc-body">
                  <table className="spec">
                    <tbody>
                      {p.spec.map(([k, v]) => (
                        <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
              <details className="acc">
                <summary>Living with it<i /></summary>
                <div className="acc-body"><p className="body">{p.care}</p></div>
              </details>
              <details className="acc">
                <summary>Shipping &amp; returns<i /></summary>
                <div className="acc-body">
                  <p className="body">
                    Dispatched within two working days from the workshop that made it.
                    Two to four days across India, tracked. Thirty nights to decide:
                    carry it properly, and if it hasn&rsquo;t earned its place, send it
                    back for a full refund at our cost.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {reviews.length ? (
        <section className="wrap sec-tight">
          <Reveal><LB>What owners said</LB></Reveal>
          <div className="revs" style={{ marginTop: 22 }}>
            {reviews.map((r) => <ReviewCard key={r.id} r={r} />)}
          </div>
          <ReviewNotice />
        </section>
      ) : null}

      <section className="wrap sec-tight">
        <div className="opener">
          <div>
            <Reveal><LB>Goes with</LB></Reveal>
            <Reveal delay={80}>
              <h2 className="big" style={{ marginTop: 12, fontSize: "clamp(1.5rem,2.6vw,2.2rem)" }}>
                Drawn against these two.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={140}><a className="link" href="#/shop">All six →</a></Reveal>
        </div>
        <div className="grid">
          {others.map((o, i) => (
            <ProductCard key={o.id} p={o} onAdd={(pp) => onAdd(pp)} delay={i * 80} />
          ))}
        </div>
      </section>

      <StickyCTA
        show={pastBuy && !soldOut}
        label={p.name}
        sub={money(p.price * qty)}
        cta="Add to bag"
        onClick={() => onAdd(p, colour, qty)}
      />
    </>
  );
}
