/* ===========================================================================
   RUMOAR — THE CATALOGUE

   §1  Media manifest        the only block you edit when photography arrives
   §2  The pieces            six of nine, each dealt a card
   §3  The eras              carried over from the research site
   §4  Proof                 reviews + case studies. FLAGGED — see §4.
   §5  Workshops             the three named houses
   §6  FAQ
   §7  Copy & SEO
   =========================================================================== */

/* ===========================================================================
   §1  MEDIA MANIFEST

   Every product has an `img` field. It is `null` today, and while it is null
   the product renders its playing card instead of a broken <img>: index,
   suit, piece number, material. That is a deliberate state, not a placeholder
   apology — the store is presentable to a client with no photography at all.

   To drop real photography in, put the files in `public/assets/products/` and
   change one line per product:

       img: null                    →    img: "products/wallet.jpg"

   Nothing else changes. <Plate> detects the file and swaps itself out.
   Shoot 4:5 portrait, 1600px on the long edge, on a light ground.

   import.meta.env.BASE_URL is whatever `base` resolved to in vite.config.js,
   with a trailing slash. Using it rather than a literal "/assets/" is what
   lets the same build work at a domain root and inside a GitHub Pages
   subpath — a hardcoded absolute path would 404 on Pages.
   =========================================================================== */
export const MEDIA_BASE = `${import.meta.env.BASE_URL}assets/`;
export const asset = (p) => (p ? `${MEDIA_BASE}${p}` : null);

/* ===========================================================================
   §2  THE PIECES

   Six of the nine. The wardrobe system the research argued for: objects a man
   is read by before he speaks, priced where the research found the gap —
   above the ₹1,500 mass floor, below the ₹15,000 import ceiling, which is the
   band nobody in India currently builds a coherent system inside.

   `card` is new and it is the spine of the whole site. Every piece is a card
   in one hand: an index (A, K, Q, J, 10) and a suit. It is not decoration —
   it is how the catalogue is ordered, how the empty plates are composed, how
   a member's hand is displayed, and what the deal in /court draws from.

       ♠ spades    — carried in a pocket
       ♥ hearts    — worn against the skin
       ♦ diamonds  — carried in the hand
       ♣ clubs     — worn on the face

   `thread` is the sentence that connects the piece back to the system. It is
   the reason this is a wardrobe and not a catalogue, so every piece has one.
   =========================================================================== */
export const PRODUCTS = [
  {
    id: "signal-wallet",
    n: "01",
    card: { index: "A", suit: "spade", name: "Ace of Spades" },
    name: "The Signal Wallet",
    line: "Carry",
    price: 3200,
    was: null,
    img: null,
    blurb: "Six cards, folded notes, nothing else. Sized to disappear in a trouser pocket and to be read correctly when it comes out.",
    thread: "The first object most men buy with their own money. It should not be the last one they think about.",
    material: "Full-grain vegetable-tanned leather",
    alt: "The Signal Wallet — a slim bifold in full-grain vegetable-tanned leather, shown closed on a light ground",
    spec: [
      ["Material", "Full-grain vegetable-tanned calf"],
      ["Lining", "Unlined, skived edge"],
      ["Capacity", "6 cards · folded notes"],
      ["Dimensions", "108 × 88 mm closed"],
      ["Hardware", "None"],
      ["Made in", "Chennai, India"],
    ],
    colours: [
      { id: "ink", name: "Ink", hex: "#15151A" },
      { id: "oxblood", name: "Oxblood", hex: "#5C1A1E" },
      { id: "tan", name: "Raw Tan", hex: "#B07C4F" },
    ],
    care: "It will darken where you hold it. That is the point — a year in, no two are the same. Keep it dry; condition it twice a year with a neutral cream.",
    stock: 24,
    tags: ["Everyday", "Leather"],
    workshop: "chennai",
    goes: ["courier", "ember-01"],
  },
  {
    id: "quiet-hours",
    n: "02",
    card: { index: "K", suit: "spade", name: "King of Spades" },
    name: "Quiet Hours",
    line: "Time",
    price: 12900,
    was: 14500,
    img: null,
    blurb: "A 38mm field watch with the numerals taken off. What is left is a dial that tells you the time and tells the room nothing else.",
    thread: "A glance at the time is a glance at the plan. The watch is the only object here that is read while it is being used.",
    material: "Brushed 316L steel, sapphire crystal",
    alt: "Quiet Hours — a 38mm brushed steel field watch with an unmarked slate dial, shown at three-quarter angle",
    spec: [
      ["Case", "38 mm brushed 316L steel"],
      ["Crystal", "Flat sapphire, AR-coated"],
      ["Movement", "Miyota 9039 automatic"],
      ["Reserve", "42 hours"],
      ["Water", "10 ATM"],
      ["Strap", "20 mm, quick-release"],
    ],
    colours: [
      { id: "slate", name: "Slate", hex: "#2B2F36" },
      { id: "bone", name: "Bone", hex: "#E8E4DC" },
      { id: "ember", name: "Ember", hex: "#8E1B22" },
    ],
    care: "Automatic — it runs on the way you move. Left still for two days it stops; a dozen turns of the crown wakes it. Service at five years.",
    stock: 8,
    tags: ["Automatic", "Steel"],
    workshop: "kolkata",
    goes: ["signal-wallet", "rumour-chain"],
  },
  {
    id: "rumour-chain",
    n: "03",
    card: { index: "Q", suit: "heart", name: "Queen of Hearts" },
    name: "The Rumour Chain",
    line: "Wear",
    price: 4600,
    was: null,
    img: null,
    blurb: "A 2.4mm curb chain, weighted to sit rather than swing. Wedding-season fluent, Tuesday-appropriate.",
    thread: "The piece that does the most work at the fewest occasions — and the one Indian menswear has priced worst.",
    material: "Rhodium-finished sterling silver",
    alt: "The Rumour Chain — a 2.4mm rhodium-finished sterling silver curb chain coiled on a light ground",
    spec: [
      ["Material", "925 sterling silver"],
      ["Finish", "Rhodium, brushed"],
      ["Gauge", "2.4 mm curb"],
      ["Length", "500 mm · 550 mm"],
      ["Clasp", "Push-lock, signed"],
      ["Weight", "18 g"],
    ],
    colours: [
      { id: "silver", name: "Rhodium", hex: "#C6C8CC" },
      { id: "onyx", name: "Black Rhodium", hex: "#26262B" },
    ],
    care: "Silver tarnishes; that is chemistry, not a defect. The cloth in the box brings it back in about a minute.",
    stock: 41,
    tags: ["Sterling", "Everyday"],
    workshop: "jaipur",
    goes: ["quiet-hours", "eclipse"],
  },
  {
    id: "eclipse",
    n: "04",
    card: { index: "J", suit: "club", name: "Jack of Clubs" },
    name: "Eclipse",
    line: "See",
    price: 5400,
    was: null,
    img: null,
    blurb: "A flat-top acetate frame cut narrow enough for an Indian face and dark enough to end a conversation.",
    thread: "Confidence at arm's length. The only piece in the system that changes how much of you the room gets.",
    material: "Italian acetate, CR-39 lenses",
    alt: "Eclipse — a flat-top black acetate sunglass frame with dark lenses, shown front-on",
    spec: [
      ["Frame", "Mazzucchelli acetate, 6 mm"],
      ["Lens", "CR-39, category 3"],
      ["UV", "400 nm, full block"],
      ["Width", "142 mm temple to temple"],
      ["Bridge", "Raised, Asian fit"],
      ["Hinge", "Five-barrel, riveted"],
    ],
    colours: [
      { id: "black", name: "Ink", hex: "#141418" },
      { id: "tortoise", name: "Tortoise", hex: "#6B4526" },
      { id: "smoke", name: "Smoke", hex: "#4A4A52" },
    ],
    care: "Two hands off, never one — single-handed removal is what loosens a hinge. The pouch is not optional.",
    stock: 17,
    tags: ["Acetate", "Asian fit"],
    workshop: "chennai",
    goes: ["rumour-chain", "courier"],
  },
  {
    id: "courier",
    n: "05",
    card: { index: "10", suit: "diamond", name: "Ten of Diamonds" },
    name: "The Courier",
    line: "Carry",
    price: 6800,
    was: null,
    img: null,
    blurb: "A sling built around an 11-inch tablet, a charger and a paperback. The young man's briefcase, without the apology.",
    thread: "The bag men actually carry, finally built like it matters instead of being sold as a gym afterthought.",
    material: "Waxed 14oz cotton canvas, leather trim",
    alt: "The Courier — a waxed cotton canvas sling bag with leather trim and brass hardware, shown from the front",
    spec: [
      ["Shell", "14 oz waxed cotton canvas"],
      ["Trim", "Vegetable-tanned leather"],
      ["Capacity", "4.5 L"],
      ["Fits", "Up to 11-inch tablet"],
      ["Strap", "Webbing, 700–1250 mm"],
      ["Hardware", "Solid brass, YKK Excella"],
    ],
    colours: [
      { id: "field", name: "Field Olive", hex: "#3F4436" },
      { id: "ink", name: "Ink", hex: "#1A1A1F" },
      { id: "sand", name: "Sand", hex: "#A8977E" },
    ],
    care: "The wax will crease and lighten along the folds. Re-wax when it stops beading, roughly once a year.",
    stock: 12,
    tags: ["Waxed canvas", "Brass"],
    workshop: "chennai",
    goes: ["signal-wallet", "eclipse"],
  },
  {
    id: "ember-01",
    n: "06",
    card: { index: "A", suit: "heart", name: "Ace of Hearts" },
    name: "Ember 01",
    line: "Trace",
    price: 4200,
    was: null,
    img: null,
    blurb: "Cardamom over cedar and a long smoke finish. Built to be noticed at conversational distance and nowhere further.",
    thread: "Invisible detail, visible status. The only piece in the system that arrives before you do.",
    material: "Eau de parfum, 18% concentration",
    alt: "Ember 01 — a 50ml eau de parfum in a smoked glass flacon with a deep red label",
    spec: [
      ["Concentration", "Eau de parfum, 18%"],
      ["Top", "Green cardamom, pink pepper"],
      ["Heart", "Atlas cedar, orris"],
      ["Base", "Birch tar, tonka, vetiver"],
      ["Volume", "50 ml"],
      ["Longevity", "6–8 hours"],
    ],
    colours: [{ id: "50ml", name: "50 ml", hex: "#8E1B22" }],
    care: "Heat and sunlight are what kill a fragrance. Keep the box; it is not packaging, it is the shade.",
    stock: 30,
    tags: ["18% EDP", "50 ml"],
    workshop: "jaipur",
    goes: ["rumour-chain", "quiet-hours"],
  },
];

/* The three that aren't live yet. They are shown face-down in the hand — a
   gap that is stated builds appetite; a gap that is hidden just looks like a
   small shop. */
export const UNDEALT = [
  { n: "07", line: "Wear", card: { index: "K", suit: "heart" }, name: "In fitting", note: "Knitwear · winter 26" },
  { n: "08", line: "Carry", card: { index: "Q", suit: "spade" }, name: "In fitting", note: "Travel fold · winter 26" },
  { n: "09", line: "Time", card: { index: "J", suit: "diamond" }, name: "In fitting", note: "Second movement · spring 27" },
];

export const byId = (id) => PRODUCTS.find((p) => p.id === id) || null;

export const SUIT_PATH = {
  heart: "M12 21.2S3.4 15.6 3.4 9.9A5.3 5.3 0 0 1 12 6.7a5.3 5.3 0 0 1 8.6 3.2c0 5.7-8.6 11.3-8.6 11.3Z",
  spade: "M12 2.6S3.5 9 3.5 14.1a4.3 4.3 0 0 0 7.1 3.3c-.2 1.9-.9 3.2-1.9 4.1h6.6c-1-.9-1.7-2.2-1.9-4.1a4.3 4.3 0 0 0 7.1-3.3C20.5 9 12 2.6 12 2.6Z",
  diamond: "M12 2.2 21 12l-9 9.8L3 12l9-9.8Z",
  club: "M12 2.4a4.1 4.1 0 0 0-3 6.9 4.1 4.1 0 1 0-2 7.7 4.1 4.1 0 0 0 4-2.2c-.1 2.2-.8 3.9-2 5.2h6c-1.2-1.3-1.9-3-2-5.2a4.1 4.1 0 0 0 4 2.2 4.1 4.1 0 1 0-2-7.7 4.1 4.1 0 0 0-3-6.9Z",
};
export const isRed = (suit) => suit === "heart" || suit === "diamond";

/* ===========================================================================
   §3  THE ERAS

   Lifted from the research site, because it is the single best thing the
   pitch owned and it is what turns a shop into a position. The Story page is
   the argument compressed: six eras, four plates each, and one line saying
   what clothing meant at the time.

   Photography lives in public/assets/timeline/<year>-<a|b|c|d>.jpg.
   =========================================================================== */
export const ERAS = [
  {
    year: 1900, tag: "Necessity", era: "Colonial India",
    style: "Handwoven cotton. Dhoti, kurta, angarkha. Tailoring for the few.",
    read: "Clothing is survival infrastructure",
    needs: ["ROTI", "KAPDA", "MAKAAN"],
    note: "Clothing sits third in a list of three. Bought to last, not to say anything.",
    drivers: ["Affordability", "Durability", "Occupation", "Climate"],
    eq: ["Clothing", "Conformity"],
    identity: "Dress is assigned, not chosen. Caste, region, trade and faith are legible on the body before a man speaks. Deviation is risk, not expression.",
    signals: ["Region", "Trade", "Community", "Means"],
    plates: [
      { cx: 62, cy: 34, note: "Handwoven — no two the same" },
      { cx: 38, cy: 58, note: "Drape, not tailoring" },
      { cx: 55, cy: 26, note: "Turban states region" },
      { cx: 46, cy: 62, note: "Jewellery is the ledger" },
    ],
  },
  {
    year: 1970, tag: "Provision", era: "Licence-era India",
    style: "Terrycot bush shirts. Safari suits. One good set, kept for occasions.",
    read: "One wardrobe, many years",
    needs: ["WORK", "FAMILY", "RESPECT"],
    note: "The wardrobe is small and permanent. An everyday self and a formal self. Nothing between them.",
    drivers: ["Employment", "Marriage", "Thrift", "Repair"],
    eq: ["Clothing", "Standing"],
    identity: "Clothing begins to signal arrival — a government job, a first salary, a stitched suit. Identity is still collective, but the individual starts to show through it.",
    signals: ["Occupation", "Income", "Seniority", "Household"],
    plates: [
      { cx: 52, cy: 40, note: "One good set" },
      { cx: 44, cy: 30, note: "Terrycot — built to survive" },
      { cx: 58, cy: 52, note: "Safari cut, office to wedding" },
      { cx: 48, cy: 60, note: "Repaired, not replaced" },
    ],
  },
  {
    year: 2000, tag: "Access", era: "Post-liberalisation",
    style: "Branded formals. The first pair of denim that cost something.",
    read: "The brand arrives",
    needs: ["CAREER", "STATUS", "OCCASION"],
    note: "Malls, brands and EMI arrive together. For the first time a man can buy his way into a category.",
    drivers: ["Dress codes", "Brand access", "Aspiration", "Comparison"],
    eq: ["Clothing", "Status"],
    identity: "The logo does the talking. Men do not choose a style, they choose a tier. Wardrobes are organised by price, not by person.",
    signals: ["Brand", "Price", "Category", "Grade"],
    plates: [
      { cx: 46, cy: 36, note: "The brand becomes visible" },
      { cx: 56, cy: 44, note: "Denim arrives" },
      { cx: 40, cy: 28, note: "Logo as shorthand" },
      { cx: 52, cy: 58, note: "Mall lighting, mall taste" },
    ],
  },
  {
    year: 2010, tag: "Supply", era: "E-commerce",
    style: "Slim fit everything. Chinos. The decade of the checked shirt.",
    read: "Infinite catalogue, single silhouette",
    needs: ["CHOICE", "SPEED", "PRICE"],
    note: "Supply explodes. A man can buy anything — which is not the same as knowing what to buy.",
    drivers: ["Discounting", "Delivery", "Trend cycles", "Feeds"],
    eq: ["Clothing", "Personality"],
    identity: "Style becomes a stated trait. I'm a casual guy. I'm a sneaker guy. But it is claimed, not constructed. The wardrobe is a pile, not a system.",
    signals: ["Trend", "Fit", "Subculture", "Feed"],
    plates: [
      { cx: 50, cy: 32, note: "Infinite catalogue" },
      { cx: 44, cy: 54, note: "Slim fit, borrowed wholesale" },
      { cx: 58, cy: 38, note: "Accessories as afterthought" },
      { cx: 46, cy: 62, note: "Everything available, nothing chosen" },
    ],
  },
  {
    year: 2020, tag: "Fragmentation", era: "Hybrid life",
    style: "The collapse of smart-casual. Office, flight and dinner blur into one.",
    read: "One man, several selves, one closet",
    needs: ["VERSATILITY", "COMFORT", "SELF"],
    note: "Occasions stop being separate. The same man works, travels, celebrates and rests inside one week.",
    drivers: ["Remote work", "Travel", "Social feeds", "Comfort"],
    eq: ["Clothing", "Identity"],
    identity: "Men begin to dress as a version of themselves rather than a member of a category. The vocabulary exists. The method does not.",
    signals: ["Context", "Mood", "Self-image", "Audience"],
    plates: [
      { cx: 54, cy: 42, note: "Occasions collapse" },
      { cx: 42, cy: 30, note: "Home and office, same shirt" },
      { cx: 56, cy: 50, note: "Camera-up, waist-down" },
      { cx: 48, cy: 60, note: "The closet stops adapting" },
    ],
  },
  {
    year: 2026, tag: "System", era: "Now",
    style: "Forty garments and no point of view. The pile has outgrown the man carrying it.",
    read: "Identity needs an operating system",
    needs: ["COHERENCE", "RANGE", "INTENT"],
    note: "The problem is no longer access. It is coherence — making forty garments behave like one point of view.",
    drivers: ["Decision fatigue", "Multiple roles", "Repeat wear", "Longevity"],
    eq: ["Clothing", "Identity system"],
    identity: "The next wardrobe is not a set of purchases. It is a set of rules a man carries between rooms, seasons and versions of himself.",
    signals: ["Rules", "Range", "Continuity", "Evolution"],
    plates: [
      { cx: 48, cy: 34, note: "Six selves, one week" },
      { cx: 56, cy: 46, note: "Objects do the talking" },
      { cx: 40, cy: 30, note: "Heritage, quoted not worn" },
      { cx: 52, cy: 58, note: "Still no system to hold it" },
    ],
  },
];

/* One layout, reused for every era. Heights are percentages of the collage
   box rather than an aspect ratio, so the board can never overflow the
   clipped container it sits in — whatever the viewport does. */
export const PLATE_LAYOUT = [
  { left: "0%", top: "5%", w: "43%", h: "56%", r: -3.0 },
  { left: "26%", top: "0%", w: "40%", h: "52%", r: 2.6 },
  { left: "55%", top: "11%", w: "40%", h: "55%", r: -1.8 },
  { left: "31%", top: "42%", w: "38%", h: "52%", r: 3.2 },
];

export const eraPlate = (year, k) => asset(`timeline/${year}-${"abcd"[k]}.jpg`);

/* ===========================================================================
   §4  PROOF

   REVIEWS_VERIFIED is false and must stay false until these are replaced with
   real, collected, attributable reviews. While it is false the page still
   shows them, clearly marked as sample copy, but the AggregateRating and
   Review structured data is NOT emitted. Publishing invented ratings as
   schema is how a store gets its rich results pulled and its domain flagged —
   and it is also just lying. One flag, one honest failure mode.
   =========================================================================== */
export const REVIEWS_VERIFIED = false;

export const REVIEWS = [
  {
    id: "r1", product: "signal-wallet", rating: 5, name: "Aditya R.", city: "Bengaluru",
    date: "2026-05-14", days: 96,
    title: "It has gone the colour of strong tea",
    body: "Three months in the back pocket and the Ink has warmed into something browner at the corners. I have carried a wallet since I was nineteen and this is the first one that looks better than the day it arrived.",
  },
  {
    id: "r2", product: "quiet-hours", rating: 5, name: "Farhan S.", city: "Hyderabad",
    date: "2026-04-02", days: 138,
    title: "Nobody has asked me what brand it is",
    body: "That is the review. Two people have asked where I got it, which is a different question and the better one. The 38mm sits correctly on a 6.5-inch wrist, which almost nothing at this price does.",
  },
  {
    id: "r3", product: "rumour-chain", rating: 4, name: "Karthik M.", city: "Chennai",
    date: "2026-06-21", days: 52,
    title: "Wore it through an entire wedding season",
    body: "It sits instead of swinging, exactly as described. Docked a star because the 500mm was tight on me and I only worked out that 550 existed after ordering. Say it louder on the page.",
  },
  {
    id: "r4", product: "courier", rating: 5, name: "Dev P.", city: "Pune",
    date: "2026-03-11", days: 154,
    title: "Replaced a backpack I had been apologising for",
    body: "Tablet, charger, book, and it still reads as something I chose rather than something I was handed at a conference. The wax has creased along the fold and I have decided I like it.",
  },
  {
    id: "r5", product: "ember-01", rating: 5, name: "Nikhil B.", city: "Delhi",
    date: "2026-05-30", days: 74,
    title: "The cardamom is doing a lot of work",
    body: "Six hours on skin in Delhi heat, which I did not expect. It stays close — my wife noticed at dinner and nobody noticed on the metro. Correct behaviour for a scent.",
  },
  {
    id: "r6", product: "eclipse", rating: 4, name: "Raghav I.", city: "Mumbai",
    date: "2026-07-08", days: 35,
    title: "Finally a frame that does not slide",
    body: "The raised bridge is the whole thing. Every acetate frame I have owned walks down my nose by noon. This one does not. I do wish the pouch were a hard case.",
  },
];

export const ratingSummary = () => {
  const n = REVIEWS.length;
  const avg = REVIEWS.reduce((a, r) => a + r.rating, 0) / n;
  return { count: n, avg: Math.round(avg * 10) / 10 };
};

/* The case studies. Not testimonials — three decisions the brand made that a
   customer can go and check. Each is a claim with a mechanism attached. */
export const CASES = [
  {
    id: "gap",
    kicker: "Case 01 · The price band",
    title: "Why nothing here costs ₹1,499",
    stat: "₹3,200 — ₹12,900",
    body: "Eighteen months of shelf-walking found the same shape in every category: a mass floor around ₹1,500 where the material is the compromise, and an import ceiling above ₹15,000 where the logo is the product. Between them, almost nothing that behaves like a system. Every piece here is priced inside that band on purpose — the band is the position, not an accident of costing.",
    proof: "Six categories audited across seven Indian retailers, 2024–2026.",
    to: "/story",
    cta: "Read the argument",
  },
  {
    id: "workshop",
    kicker: "Case 02 · The named workshop",
    title: "Three houses, printed on the label",
    stat: "3 workshops · 0 agents",
    body: "Most Indian brands in this band buy through an agent and describe the result as 'crafted in India'. Every piece here names the workshop that made it, on the product page and on the box. A named house can be visited, audited and held to a standard. A sourcing story cannot.",
    proof: "Chennai · Kolkata · Jaipur. Addresses and hours on the Visit page.",
    to: "/visit",
    cta: "Visit the workshops",
  },
  {
    id: "repair",
    kicker: "Case 03 · Built to be opened",
    title: "Repaired, not replaced",
    stat: "Lifetime · in-house",
    body: "Every piece is constructed so it can be taken apart: skived edges rather than bonded ones, a quick-release strap, a five-barrel riveted hinge, a serviceable movement. That decision costs more per unit and it is the only reason the repair promise is not a marketing line.",
    proof: "Send it back at our cost. Turnaround quoted in writing before work starts.",
    to: "/faq",
    cta: "How repairs work",
  },
];

/* ===========================================================================
   §5  WORKSHOPS

   ADDRESSES ARE PLACEHOLDERS. Replace the bracketed fields with the real
   registered addresses before launch, then flip LOCATIONS_VERIFIED to true —
   that is what emits LocalBusiness structured data and switches the map link
   from an area search to a pinned coordinate. Emitting LocalBusiness schema
   for an address that does not exist is the fastest way to lose a Google
   Business listing, so it is gated rather than guessed.
   =========================================================================== */
export const LOCATIONS_VERIFIED = false;

export const WORKSHOPS = [
  {
    id: "chennai",
    name: "RUMOAR — Leather House",
    city: "Chennai",
    trades: "Wallets · bags · frames",
    street: "[STREET ADDRESS]",
    area: "Guindy Industrial Estate",
    region: "Tamil Nadu",
    pin: "[600032]",
    phone: "+91 [XXXXX XXXXX]",
    hours: "Mon–Sat · 10:00–18:00",
    geo: { lat: 13.0067, lng: 80.2206 },
    note: "Cutting, skiving and closing. The wallet and the sling are made in the same room, which is why their edge finish matches.",
  },
  {
    id: "kolkata",
    name: "RUMOAR — Movement Bench",
    city: "Kolkata",
    trades: "Watch assembly · service",
    street: "[STREET ADDRESS]",
    area: "Salt Lake Sector V",
    region: "West Bengal",
    pin: "[700091]",
    phone: "+91 [XXXXX XXXXX]",
    hours: "Mon–Fri · 10:00–18:00",
    geo: { lat: 22.5726, lng: 88.4339 },
    note: "Casing, regulation and every service that comes back. Two benches, four hands, no ultrasonic shortcuts.",
  },
  {
    id: "jaipur",
    name: "RUMOAR — Silver & Trace",
    city: "Jaipur",
    trades: "Silver · fragrance",
    street: "[STREET ADDRESS]",
    area: "Malviya Nagar",
    region: "Rajasthan",
    pin: "[302017]",
    phone: "+91 [XXXXX XXXXX]",
    hours: "Mon–Sat · 09:30–17:30",
    geo: { lat: 26.8535, lng: 75.8064 },
    note: "Chain drawing, rhodium and the maceration tanks. The only room in the company that smells of anything.",
  },
];

export const byWorkshop = (id) => WORKSHOPS.find((w) => w.id === id) || null;

export const mapsLink = (w) =>
  LOCATIONS_VERIFIED
    ? `https://www.google.com/maps/search/?api=1&query=${w.geo.lat}%2C${w.geo.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${w.area}, ${w.city}, ${w.region}, India`)}`;

export const directionsLink = (w) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    LOCATIONS_VERIFIED ? `${w.geo.lat},${w.geo.lng}` : `${w.area}, ${w.city}, ${w.region}, India`
  )}`;

/* ===========================================================================
   §6  FAQ
   Answers are written to be the last thing somebody reads before they either
   buy or leave. No hedging, no "please note".
   =========================================================================== */
export const FAQS = [
  {
    q: "How long does delivery take, and what does it cost?",
    a: "Two to four working days across India, tracked from the workshop door. Free over ₹2,000, otherwise ₹149 flat. Orders placed before 2pm dispatch the same working day; anything later goes out the next morning.",
  },
  {
    q: "What is the thirty-night trial?",
    a: "Carry the piece properly for thirty nights — pocket, wrist, wedding, whatever it was built for. If it hasn't earned its place, send it back for a full refund and we pay the return shipping. Wear is expected and is never a reason for us to refuse a return.",
  },
  {
    q: "What happens if something breaks?",
    a: "We repair it. Every piece is constructed to be opened, so a loose hinge, a worn stitch or a stopped movement is a repair rather than a replacement. Send it in and we quote turnaround in writing before any work starts. Manufacturing faults are free for as long as you own the piece; accidental damage is charged at cost.",
  },
  {
    q: "How quickly will someone reply if I write in?",
    a: "Within one working day, from a named person, in the language you wrote in. A message that arrives on a Sunday is answered on Monday morning. There is no ticket number and no chatbot.",
  },
  {
    q: "Is the leather really full-grain, and where does it come from?",
    a: "Yes — vegetable-tanned full-grain calf, tanned in Tamil Nadu and cut in our Chennai house. Full-grain means the surface hasn't been sanded or corrected, which is why the hide shows its own marks and why it darkens where you hold it. Corrected-grain would be cheaper and would look identical for about four months.",
  },
  {
    q: "Do I need the whole system, or does one piece work on its own?",
    a: "One piece works on its own — it was drawn to. The system is what happens when you own three or four: one palette, one hardware finish, one set of proportions, so they behave like a point of view instead of a pile. Start with whatever you replace most often.",
  },
  {
    q: "Where can I see these in person?",
    a: "The three workshops take visits by appointment — Chennai, Kolkata and Jaipur, with addresses and hours on the Visit page. There is no retail floor. You'll be shown the bench your piece is made on, which is more useful than a mirror.",
  },
];

/* ===========================================================================
   §7  COPY, NAV & SEO
   =========================================================================== */
export const WHISPER = [
  "Every story starts with a whisper.",
  "Every great brand starts as a rumour.",
];

export const LINES = ["All", "Carry", "Time", "Wear", "See", "Trace"];

/* The four words the research site ran down its right-hand edge. They are the
   argument compressed to four nouns, so they stay. */
export const CREED = ["Identity", "Status", "Belonging", "Confidence"];

export const PROMISES = [
  ["Made in India", "Chennai, Kolkata and Jaipur. Named workshops, not a sourcing story."],
  ["Thirty nights", "Carry it properly. If it hasn't earned its place, send it back."],
  ["Repaired, not replaced", "Every piece is built to be opened. We fix ours for as long as you own them."],
  ["A reply in one working day", "From a named person, in the language you wrote in. No ticket number."],
];

/* The site's canonical origin. Used for canonical tags, og:url and the
   sitemap. Change this one line when the domain changes. */
export const ORIGIN = "https://YOUR-APP.vercel.app";
export const CONTACT_EMAIL = "hello@rumoar.com";

/* Unique title + description per view. `title` is written to fit inside
   Google's ~60-character pixel budget once the brand suffix is added; `desc`
   inside ~155. Nothing here is templated off the H1 — a title tag and a
   headline have different jobs. */
export const SEO = {
  home: {
    title: "Nine pieces for the wardrobe India skipped",
    desc: "Six objects a man is read by before he speaks — leather, steel, silver and scent, made in three named Indian workshops. Free shipping over ₹2,000, thirty-night trial.",
  },
  shop: {
    title: "Shop all six pieces — wallet, watch, chain, frames",
    desc: "The six live pieces of the RUMOAR system, ₹3,200 to ₹12,900. Filter by line, sort by price, and see live stock from each workshop.",
  },
  story: {
    title: "The Story — 126 years of Indian menswear",
    desc: "1900 to 2026, era by era: how clothing moved from necessity to status to fragmentation, and why the next wardrobe needs a system rather than a bigger pile.",
  },
  court: {
    title: "The Court — get dealt your card",
    desc: "Six questions, one card, fifty-two hands. Find the archetype the room already reads you as, and the three RUMOAR pieces that sharpen it.",
  },
  members: {
    title: "The Hand — your members' space",
    desc: "Your card, your pieces, your repair record and first refusal on the three undealt pieces. Membership opens the moment you're dealt in.",
  },
  visit: {
    title: "Visit the workshops — Chennai, Kolkata, Jaipur",
    desc: "Addresses, hours and directions for the three houses that make RUMOAR. Visits by appointment; you'll be shown the bench your piece is made on.",
  },
  faq: {
    title: "Questions — shipping, trial, repairs, materials",
    desc: "Delivery times, the thirty-night trial, the repair promise, and what full-grain actually means. Answered plainly, with a one-working-day reply.",
  },
  checkout: { title: "Checkout", desc: "Complete your RUMOAR order. Free shipping over ₹2,000 and thirty nights to decide.", noindex: true },
  done: { title: "Order placed — thank you", desc: "Your RUMOAR order is confirmed and on its way from the workshop that made it.", noindex: true },
  privacy: {
    title: "Privacy — what we keep, and what we don't",
    desc: "The data RUMOAR collects, why we collect it, how long we keep it and how to have it deleted. Written in plain English rather than boilerplate.",
  },
  notfound: { title: "Off the map", desc: "That page doesn't exist. Here's the way back to the six pieces.", noindex: true },
};

export const pieceSeo = (p) => ({
  title: `${p.name} — ${p.line} · ₹${p.price.toLocaleString("en-IN")}`,
  desc: `${p.blurb} ${p.material}. Thirty-night trial, repaired not replaced, free shipping over ₹2,000.`.slice(0, 158),
});
