# RUMOAR — store

A complete storefront for the RUMOAR wardrobe system: six pieces, a bag, a
checkout, a member's space, an editorial timeline, and a 52-card identity quiz.
React + Vite, no backend.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview
```

Deploys as a static site anywhere. Routing is hash-based, so it needs no
rewrite rules — `dist/index.html` works opened straight off disk.

---

## The idea

The playing card is the structural unit of the whole store, not a loading
animation that plays once and disappears. Every product is a real card: the
wallet is the Ace of Spades (carried in the pocket), the watch the King of
Spades, the chain the Queen of Hearts, and so on — spades and clubs for what's
worn on the body, hearts and diamonds for what's carried. A piece with no
photography renders as its own card face rather than a grey box, so the store
is presentable to a client before a single shot is taken.

Four places the card does real work:

- **The hero** is a fanned hand of the six live pieces on a dark table.
- **The Court** (`/#/court`) deals you one of 52 named archetypes from six
  questions and prescribes three pieces. It is fully client-side, encodes to a
  shareable 4-character code, and is the intended word-of-mouth engine.
- **The Hand** (`/#/members`) is the member's space: your card, what you hold,
  your orders, and tiers that unlock by pieces owned.
- **The intro** riffles a deck and turns over the Ace of Hearts.

---

## What is where

| File | Holds |
|---|---|
| `src/data.js` | **The catalogue.** Products, cards, prices, specs, copy, the timeline eras, reviews, workshops, FAQs, per-view SEO. |
| `src/court.js` | The 52-card deal engine — questions, archetypes, weighting, share codes. Pure, deterministic, no network. |
| `src/styles.js` | **The design system.** Tokens, type scale, every component's CSS. |
| `src/lib.jsx` | Frame loop, scroll, reveals, magnetic controls, focus trap, router, lamp, analytics, `useHead`. |
| `src/cart.jsx` | Cart reducer + `localStorage`. |
| `src/parts.jsx` | The card, plates, product cards, the thread mark, era rail + collage, toast, reviews, breadcrumbs. |
| `src/views.jsx` | Home, Shop, Product. |
| `src/pages.jsx` | Story, Court, Members, Visit, FAQ, Privacy, 404. |
| `src/checkout.jsx` | Checkout + the thank-you page. |
| `src/Intro.jsx` | The deck, the shuffle, and the Ace of Hearts. |
| `src/Shop.jsx` | App shell — nav, bag panel, footer, consent, routing. |

Two places cover most edits: **`data.js` to change what is sold**, **`styles.js`
to change how it looks.** Neither requires touching a component.

---

## Three things to set before going live

These are deliberately gated behind flags rather than faked, because inventing
review stars or a business address is how a store gets its rich results pulled
by Google — and it is also just lying to customers.

**1. Reviews** — `data.js`, `REVIEWS_VERIFIED = false`. While false, the sample
reviews render with a visible "sample" notice and **no** `AggregateRating` or
`Review` schema is emitted. Flip to `true` only once the reviews in `REVIEWS`
are real and you can stand behind them.

**2. Workshop addresses** — `data.js`, `LOCATIONS_VERIFIED = false`. While
false, the Visit page shows the workshops with bracketed placeholder addresses
and a notice, and **no** `LocalBusiness` schema is emitted. Put real addresses
and geo-coordinates in `WORKSHOPS`, then flip to `true`.

**3. Analytics** — `lib.jsx`, `GA_ID = "G-XXXXXXXXXX"`. Replace with your real
Measurement ID. Nothing loads until the visitor answers the consent bar, and
"No thanks" means no script is ever injected — so the ID sitting there does
nothing until both conditions are met.

---

## Adding photography

Every product has an `img` field, `null` today. While it is null the product
renders its own card face. To drop real photos in, put files in
`public/assets/products/` and change one line per product in `data.js`:

```js
img: null            →    img: "products/wallet.jpg"
```

Nothing else changes. Shoot **4:5 portrait, 1600px on the long edge**, on a
light ground. The card face stays as the fallback for anything still `null`.

---

## The one SEO trade-off

This store uses a **hash router** (`#/shop`) so a deep link works on any static
host with no server rewrite rules — GitHub Pages, a bare CDN, even
`dist/index.html` off a disk. The cost is that search engines treat everything
after the `#` as the same URL, so the per-view titles, descriptions and
JSON-LD (all injected at runtime by `useHead`) help social sharing and
crawlers that execute JS, but the six product pages are not separately indexed
the way `/piece/signal-wallet` would be.

If organic search becomes a primary channel, switch to history routing:

1. In `lib.jsx`, `useHashRoute` → read `window.location.pathname` instead of
   `.hash`, and `go()` → `history.pushState`.
2. Add a catch-all rewrite to `index.html` on the host (`vercel.json` →
   `"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]`).
3. Drop the `#/` from `sitemap.xml`.

It is about twenty lines and one rewrite rule. Everything else — the schema,
the titles, the canonical tags — is already in place and will start working per
URL the moment the router changes.

---

## The intro

A deck riffles three times, fans, squares up, and the top card turns over into
the Ace of Hearts — an engraved guilloche face rather than a drawn figure,
because flat vector standing in for a hand-engraved court card reads as clip
art. The whisper types underneath from the first frame, running *alongside* the
shuffle rather than after it, so both finish together.

- Skippable from ~240ms by click, key, or the Skip button.
- Shows **once per browser session** (`sessionStorage`). Clear it with
  `sessionStorage.removeItem('rumoar.intro')` to see it again.
- **Never** shows on a shared Court link (`#/court/XXXX`) — that visitor came
  for one specific card and a card trick in front of it is friction.
- `prefers-reduced-motion` skips it entirely.

---

## Cart & checkout

Reducer + `localStorage` under `rumoar.cart.v1`. Line identity is `id:colour`,
so the same wallet in Ink and Oxblood are two lines. A persisted cart is
validated against the catalogue on read, so a line pointing at a deleted
product can't crash the store on the next visit.

Free shipping over ₹2,000, otherwise ₹149 flat. Both in `cart.jsx`.

Checkout validates on submit, not per keystroke, then re-validates live once a
field has failed. Payment is a stub — swap the `setTimeout` in `checkout.jsx`
for the gateway SDK; the shape it needs is `{ lines, total, pay, address }`.
Orders are written to `rumoar.orders.v1` so the member's space and the
thank-you page have something real to show.

---

## Local storage keys

Everything the store keeps lives in the browser. There is no server.

| Key | Holds |
|---|---|
| `rumoar.cart.v1` | The current bag. |
| `rumoar.orders.v1` | Placed orders (for the member's space + thank-you page). |
| `rumoar.card.v1` | The Court archetype you were last dealt. |
| `rumoar.intro` (session) | Whether the intro has played this session. |
| `rumoar.consent` | Analytics choice: `granted` / `denied`. |

The Privacy page (`/#/privacy`) lists these for the visitor in plain English.

---

## Known stubs

Deliberately not built, because they need a backend:

- Payment and server-side order persistence — the confirmation reference is
  generated client-side.
- Newsletter signup validates and confirms, but posts nowhere.
- Reviews and workshop addresses are gated (see above).
- Stock counts are static; nothing decrements on purchase.
