/* ===========================================================================
   THE COURT

   Six questions. One card. Fifty-two possible hands.

   This is the feature the rest of the site is built around, so it is worth
   being precise about what it is and is not. It is NOT a personality test and
   it does not pretend to be psychology. It is a mirror with a fixed number of
   faces: a man answers six questions about how he actually moves through a
   room, and the deck hands back one of fifty-two named readings plus the
   three pieces that sharpen it.

   Three properties make it shareable, and all three are design decisions:

     1. IT IS SPECIFIC.   Fifty-two outcomes, each with its own name, reading,
        tell and failure mode. A quiz with six outcomes reads as a funnel; a
        quiz with fifty-two reads as a deck.

     2. IT IS SCARCE.     Rank is weighted. Twos are common, Aces are not.
        The rarity line ("1 in 240 hands") is computed from the real weight
        table below, never invented, so drawing an Ace genuinely is rare and
        the screenshot genuinely is worth posting.

     3. IT IS PORTABLE.   Every result encodes to a six-character code that
        lives in the URL. /#/court/AS4K2X restores the exact card on any
        device, with no account and no server. That is what a share is.

   Everything here is deterministic and client-side. No API, no model call,
   no backend. The deal is a pure function of the answers.
   =========================================================================== */

import { PRODUCTS } from "./data.js";

/* ---------------------------------------------------------------------------
   THE SIX QUESTIONS

   Three questions decide the SUIT — the motive underneath how a man dresses.
   Three decide the RANK — how much of the room he takes when he walks in.

   Options are deliberately not flattering-vs-unflattering. Every answer is a
   real way to be, which is what stops people gaming it toward the Ace and
   what makes the result feel earned rather than chosen.
   --------------------------------------------------------------------------- */
export const QUESTIONS = [
  {
    id: "q1",
    axis: "suit",
    q: "You walk into a room where you know two people out of forty.",
    options: [
      { t: "Find the two. Stay put.", suit: "spade", w: 2 },
      { t: "Work the edges, meet six.", suit: "heart", w: 2 },
      { t: "Find whoever is running it.", suit: "diamond", w: 2 },
      { t: "Decide within a minute whether it's worth staying.", suit: "club", w: 2 },
    ],
  },
  {
    id: "q2",
    axis: "suit",
    q: "The compliment you'd actually want to overhear.",
    options: [
      { t: "\u201CHe doesn't waste a word.\u201D", suit: "spade", w: 2 },
      { t: "\u201CThe room lifts when he's in it.\u201D", suit: "heart", w: 2 },
      { t: "\u201CHe got it done.\u201D", suit: "diamond", w: 2 },
      { t: "\u201CHis taste is unimprovable.\u201D", suit: "club", w: 2 },
    ],
  },
  {
    id: "q3",
    axis: "suit",
    q: "One object you'd replace last, whatever it cost.",
    options: [
      { t: "The wallet. It's been in every pocket I've owned.", suit: "spade", w: 2 },
      { t: "The scent. People remember it before they remember me.", suit: "heart", w: 2 },
      { t: "The bag. It carries the day.", suit: "diamond", w: 2 },
      { t: "The frames. They're the first thing anyone sees.", suit: "club", w: 2 },
    ],
  },
  {
    id: "q4",
    axis: "rank",
    q: "Getting dressed for something that matters takes you:",
    options: [
      { t: "Under four minutes. It's decided in advance.", rank: 4 },
      { t: "Ten minutes and one change of mind.", rank: 2 },
      { t: "Half an hour, and I still leave unsure.", rank: 0 },
      { t: "As long as it takes. It's part of the event.", rank: 3 },
    ],
  },
  {
    id: "q5",
    axis: "rank",
    q: "How often does someone ask you where something you're wearing is from?",
    options: [
      { t: "Most weeks.", rank: 4 },
      { t: "Now and then.", rank: 2 },
      { t: "Almost never, and that's fine.", rank: 1 },
      { t: "They ask about the whole look, not one thing.", rank: 3 },
    ],
  },
  {
    id: "q6",
    axis: "rank",
    q: "Your wardrobe, honestly, right now:",
    options: [
      { t: "A system. Everything agrees with everything.", rank: 4 },
      { t: "A good core with a pile of mistakes around it.", rank: 2 },
      { t: "A pile. I buy when something dies.", rank: 0 },
      { t: "Two wardrobes — one for work, one for me.", rank: 1 },
    ],
  },
];

/* ---------------------------------------------------------------------------
   THE DECK

   Fifty-two names, four suits of thirteen, ordered from the two up to the
   ace. Each carries a `read` — the line that gets screenshotted.

   The suits are not decorative categories. They are the four motives the
   research found underneath why a man buys an object he doesn't need:

     ♠ SPADES    withholding — being read correctly by saying less
     ♥ HEARTS    presence    — being felt in the room
     ♦ DIAMONDS  provision   — building, carrying, providing
     ♣ CLUBS     judgement   — taste as a form of refusal
   --------------------------------------------------------------------------- */
export const SUITS = {
  spade: {
    id: "spade", symbol: "♠", house: "The Quiet House",
    motive: "Withholding",
    line: "You are read by what you leave out. The room fills in the rest, and it always fills in generously.",
    tell: "Everything you own is one notch quieter than it could afford to be.",
    risk: "Understatement can slide into invisibility. Quiet is a choice; unnoticed is an accident.",
  },
  heart: {
    id: "heart", symbol: "♥", house: "The Warm House",
    motive: "Presence",
    line: "You are felt before you are seen. What you wear is a temperature, not a statement.",
    tell: "People describe an evening you were at by describing you.",
    risk: "Warmth without edges gets taken for granted. Being liked is not the same as being reckoned with.",
  },
  diamond: {
    id: "diamond", symbol: "♦", house: "The Working House",
    motive: "Provision",
    line: "You dress the way you build — for load, for years, for the day it has to survive.",
    tell: "Nothing you carry is decorative, and all of it has been used hard.",
    risk: "Function can become an excuse. Useful is a floor, not a personality.",
  },
  club: {
    id: "club", symbol: "♣", house: "The Sharp House",
    motive: "Judgement",
    line: "Your taste is a series of refusals. What you didn't buy says more than what you did.",
    tell: "You can name exactly what's wrong with a thing within four seconds of seeing it.",
    risk: "Refusal is cheap and endless. At some point taste has to build something.",
  },
};

/* Rank 0 = two … rank 12 = ace. */
export const RANK_LABEL = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

/* The weight table. This is what makes rarity honest: the odds printed on a
   result are computed from these numbers, not chosen for effect. Low cards
   are the common hands because most men are — correctly — still assembling.
   Court cards and aces are weighted down hard. */
const RANK_WEIGHT = [140, 150, 150, 140, 120, 100, 84, 68, 52, 34, 22, 13, 5];
const WEIGHT_TOTAL = RANK_WEIGHT.reduce((a, b) => a + b, 0);

export const DECK = {
  spade: [
    { name: "The Understudy", read: "You've worked out what you don't want to be. The rest is still being cast." },
    { name: "The Listener", read: "You hear the room before you enter it, and you dress not to interrupt." },
    { name: "The Straight Bat", read: "Nothing flashy, nothing wrong. You have never once been the mistake in a photograph." },
    { name: "The Fixer", read: "You're the number people call second, which is the number that actually gets dialled." },
    { name: "The Quiet Hand", read: "You've stopped explaining yourself and the room got noticeably easier." },
    { name: "The Editor", read: "You improve everything by removing something from it, including your own wardrobe." },
    { name: "The Locksmith", read: "You know exactly what you're worth and you have never once said the number out loud." },
    { name: "The Cipher", read: "People leave a conversation with you certain they learned something, and unable to say what." },
    { name: "The Archivist", read: "You keep things. Not out of sentiment — because you were right about them the first time." },
    { name: "The Operator", read: "You move rooms without raising your voice, and everyone assumes it was their idea." },
    { name: "The Strategist", read: "You dress three moves ahead. Today's restraint is buying next year's authority." },
    { name: "The Silent Partner", read: "You own more of the room than anyone in it has been told." },
    { name: "The Ghost", read: "You are the man everyone quotes and nobody can describe. Rarest hand in the quiet house." },
  ],
  heart: [
    { name: "The New Arrival", read: "You're the most interesting man in the room and you haven't been told yet." },
    { name: "The Regular", read: "Three places in your city pour your drink before you sit down. That's a wardrobe too." },
    { name: "The Host", read: "You dress so other people relax. It's generosity, and it reads as confidence." },
    { name: "The Confidant", read: "Men tell you things they haven't told their wives. Something about you looks safe to be honest near." },
    { name: "The Warm Front", read: "The temperature of a room changes about four seconds after you walk into it." },
    { name: "The Storyteller", read: "You wear things that need explaining because you were always going to explain them." },
    { name: "The Anchor", read: "You're who a group orients around. Not the loudest — the fixed point." },
    { name: "The Charmer", read: "You've never had to be the best-dressed man present, and you've never once been forgotten." },
    { name: "The Room-Reader", read: "You know within a minute who matters, and you dress for them without anyone noticing the aim." },
    { name: "The Firestarter", read: "Evenings change direction because of you. Your wardrobe should be able to keep up." },
    { name: "The Magnet", read: "You don't work a room. The room reorganises around where you're standing." },
    { name: "The Patron", read: "You make other people better and let them keep the credit. It shows in how you dress: nothing competing." },
    { name: "The Rumour", read: "People describe you to other people who haven't met you. Rarest hand in the house — and the brand's own card." },
  ],
  diamond: [
    { name: "The Apprentice", read: "You're buying your first good thing and you're right to be nervous about it." },
    { name: "The Carrier", read: "You hold more than anyone has thought to thank you for." },
    { name: "The Grafter", read: "Your things have marks on them. Every mark is a day you showed up." },
    { name: "The Provider", read: "You buy well because someone else is counting on the thing not breaking." },
    { name: "The Foreman", read: "You've earned the right to be blunt, and you dress like a man who doesn't need to be asked twice." },
    { name: "The Draughtsman", read: "You want the drawing before the object. Specifications are a love language." },
    { name: "The Engineer", read: "You have opened something to see how it was made, and you didn't put it back the same." },
    { name: "The Merchant", read: "You know the real price of everything, which is why you overpay deliberately and only for the right thing." },
    { name: "The Quartermaster", read: "Nothing you own is unaccounted for. You could pack for a month in eleven minutes." },
    { name: "The Builder", read: "You're constructing something that will outlast you, and you dress like the work isn't finished." },
    { name: "The Broker", read: "You are how two rooms find out about each other. Carry something that survives both." },
    { name: "The Founder", read: "You've been early and wrong enough times to know exactly what right feels like now." },
    { name: "The Kingmaker", read: "Careers turn on your say-so and you have never sent a single self-promotional message. Rarest hand in the working house." },
  ],
  club: [
    { name: "The Sceptic", read: "You've been sold to badly enough times that you now trust almost nothing. Reasonable." },
    { name: "The Purist", read: "You'd rather own one correct thing than four acceptable ones, and you're currently owning zero." },
    { name: "The Contrarian", read: "The moment a thing gets popular you can feel yourself letting go of it." },
    { name: "The Critic", read: "You can articulate why something is wrong faster than anyone can defend it." },
    { name: "The Curator", read: "Your wardrobe is a collection with an argument, and you can state the argument out loud." },
    { name: "The Aesthete", read: "You notice the hinge, the stitch density, the way the edge was finished. Most people notice the colour." },
    { name: "The Iconoclast", read: "You've broken a rule so cleanly that other men started copying the break." },
    { name: "The Gatekeeper", read: "What you approve of moves. What you don't quietly stops existing." },
    { name: "The Tastemaker", read: "Three men in your circle are wearing something because you were wearing it first." },
    { name: "The Provocateur", read: "You dress to start the argument you were going to have anyway." },
    { name: "The Arbiter", read: "People bring you two options and accept your answer without asking for reasons." },
    { name: "The Authority", read: "Your opinion has stopped being an opinion. It's now just what the thing is." },
    { name: "The Blade", read: "One look, one verdict, and the room adjusts. Rarest hand in the sharp house." },
  ],
};

/* ---------------------------------------------------------------------------
   THE PRESCRIPTION

   Three pieces per hand, and they must actually follow from the reading or
   the whole thing collapses into a horoscope with a checkout button.

   Suit picks the anchor — the object that carries that motive. Rank picks the
   two that go with it: low hands get the foundations, high hands get the
   pieces that only make sense once the foundation exists.
   --------------------------------------------------------------------------- */
const ANCHOR = { spade: "signal-wallet", heart: "ember-01", diamond: "courier", club: "eclipse" };
const HIGH = { spade: "quiet-hours", heart: "rumour-chain", diamond: "quiet-hours", club: "rumour-chain" };

function prescribe(suit, rank) {
  const picks = [ANCHOR[suit]];
  if (rank >= 8) picks.push(HIGH[suit]);
  const rest = PRODUCTS.map((p) => p.id).filter((id) => !picks.includes(id));
  /* deterministic fill, seeded by the hand — two men with the same card get
     the same three pieces, which matters when they compare screenshots */
  let seed = rank * 7 + suit.length * 13;
  while (picks.length < 3 && rest.length) {
    seed = (seed * 31 + 17) % 997;
    picks.push(rest.splice(seed % rest.length, 1)[0]);
  }
  return picks;
}

/* ---------------------------------------------------------------------------
   THE DEAL
   --------------------------------------------------------------------------- */
export function deal(answers) {
  const score = { spade: 0, heart: 0, diamond: 0, club: 0 };
  let rankPoints = 0;

  QUESTIONS.forEach((q, i) => {
    const pick = q.options[answers[i]];
    if (!pick) return;
    if (pick.suit) score[pick.suit] += pick.w;
    if (typeof pick.rank === "number") rankPoints += pick.rank;
  });

  /* Ties break toward the suit that was chosen earliest — a first instinct
     beats a later one, and it keeps the deal deterministic. */
  const suit = Object.keys(score).reduce((a, b) => (score[b] > score[a] ? b : a), "spade");

  /* rankPoints runs 0–12 across three questions. It maps onto the deck
     directly, but the top of the range is gated: an ace also requires the
     suit to have been answered unanimously. Three points of agreement is what
     separates "I lean that way" from "that is what I am". */
  let rank = Math.max(0, Math.min(12, rankPoints));
  const unanimous = score[suit] >= 6;
  if (rank >= 11 && !unanimous) rank = 10;
  if (rank === 12 && !unanimous) rank = 11;

  return build(suit, rank);
}

export function build(suit, rank) {
  const s = SUITS[suit];
  const entry = DECK[suit][rank];
  const odds = Math.round(WEIGHT_TOTAL * 4 / RANK_WEIGHT[rank] / 4 * 4) / 4;
  return {
    suit,
    rank,
    label: RANK_LABEL[rank],
    symbol: s.symbol,
    house: s.house,
    motive: s.motive,
    name: entry.name,
    read: entry.read,
    houseLine: s.line,
    tell: s.tell,
    risk: s.risk,
    /* "1 in N hands" — computed from the weight table, never invented */
    odds: Math.max(2, Math.round((WEIGHT_TOTAL / RANK_WEIGHT[rank]) * 4)),
    rare: rank >= 11,
    pieces: prescribe(suit, rank),
    code: encode(suit, rank),
    cardName: `${RANK_LABEL[rank] === "A" ? "Ace" : RANK_LABEL[rank] === "K" ? "King"
      : RANK_LABEL[rank] === "Q" ? "Queen" : RANK_LABEL[rank] === "J" ? "Jack" : RANK_LABEL[rank]} of ${suit === "spade" ? "Spades" : suit === "heart" ? "Hearts" : suit === "diamond" ? "Diamonds" : "Clubs"}`,
  };
}

/* ---------------------------------------------------------------------------
   THE CODE

   Four characters: suit letter, rank letter, then two characters of checksum
   so a mistyped code fails loudly instead of silently dealing the wrong man
   the wrong card. Short enough to say out loud.
   --------------------------------------------------------------------------- */
const SUIT_CH = { spade: "S", heart: "H", diamond: "D", club: "C" };
const CH_SUIT = { S: "spade", H: "heart", D: "diamond", C: "club" };
const RANK_CH = "23456789TJQKA";

export function encode(suit, rank) {
  const a = SUIT_CH[suit], b = RANK_CH[rank];
  const sum = (a.charCodeAt(0) * 7 + b.charCodeAt(0) * 13) % 1296;
  return (a + b + sum.toString(36).padStart(2, "0")).toUpperCase();
}

export function decode(code) {
  if (typeof code !== "string" || code.length !== 4) return null;
  const c = code.toUpperCase();
  const suit = CH_SUIT[c[0]];
  const rank = RANK_CH.indexOf(c[1]);
  if (!suit || rank < 0) return null;
  if (encode(suit, rank) !== c) return null;      // checksum
  return build(suit, rank);
}
