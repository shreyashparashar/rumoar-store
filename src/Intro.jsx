import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { reduced } from "./lib.jsx";
import { WHISPER } from "./data.js";
import { Card } from "./parts.jsx";

/* ===========================================================================
   THE ACE OF HEARTS

   The card the deck turns over.

   WHAT CHANGED AND WHY. This was a King of Hearts — a mirrored half-figure
   with a face: eyes, nose, a mouth, a crown, a sceptre. Figurative drawing at
   250×350 is a trap. Every real court card is engraved from a few hundred
   hand-cut lines, and flat vector geometry standing in for that reads as clip
   art no matter how carefully the proportions are set. A face is the hardest
   possible object to fake and the first thing the eye judges.

   So the figure is gone and the card is an ACE instead — which is the right
   card anyway. An ace is a single ornamental device on an open field, which
   is exactly the kind of drawing that *does* survive being vector: symmetry,
   weight and negative space carry it, not likeness. It is also the more
   accurate brand statement. RUMOAR's own hand is the Ace of Hearts: the piece
   that arrives before you do.

   Four things do the work:
     1. ENGRAVED FIELD — a fine cross-hatched guilloche behind everything, so
        the paper is never a flat white rectangle.
     2. THE PIP — one large heart, drawn as a single confident curve, holding
        the R. Anything inside a shape reads as intentional; anything floating
        next to one reads as an accident.
     3. THE FLOURISH — mirrored scrollwork either side, drawn once and flipped
        about the centre line. This is what real aces do and it is the cheapest
        possible way to buy "engraved".
     4. THE INDEX — A over a heart in opposite corners, rotationally
        symmetrical, so the card reads the same whichever way it is dealt.
   =========================================================================== */
const RED = "#C4121F";
const INK = "#1A1A20";
const PAPER = "#FCFBF9";

/* One half of the scrollwork. Drawn to the left of the centre line and
   mirrored, which is what makes it read as engraved rather than sketched. */
const Flourish = () => (
  <g fill="none" stroke={RED} strokeWidth="1.5" strokeLinecap="round">
    <path d="M104 132 C86 116 58 120 50 141 C44 157 57 172 71 167" />
    <path d="M71 167 C60 162 57 149 65 141 C75 131 92 136 101 146" opacity=".72" />
    <path d="M101 214 C84 227 58 224 52 205 C48 191 61 180 73 186" />
    <path d="M73 186 C62 191 60 202 69 208 C79 214 92 210 99 202" opacity=".72" />
    <path d="M92 173 C78 173 66 173 55 173" strokeWidth="1" opacity=".5" />
    <circle cx="46" cy="146" r="2.4" fill={RED} stroke="none" />
    <circle cx="47" cy="200" r="2.4" fill={RED} stroke="none" />
    <circle cx="51" cy="173" r="1.6" fill={RED} stroke="none" />
  </g>
);

function AceFace() {
  return (
    <svg viewBox="0 0 250 350" role="img"
      aria-label="The Ace of Hearts, indexed R for RUMOAR">
      {/* the stock */}
      <rect width="250" height="350" rx="14" fill={PAPER} />

      {/* the engraved field — two fine hatches crossing at 58°, which is what
          stops the card reading as flat vector white */}
      <defs>
        <pattern id="guilloche" width="10" height="10" patternUnits="userSpaceOnUse"
          patternTransform="rotate(32)">
          <path d="M0 0 V10" stroke={INK} strokeWidth=".4" opacity=".1" />
          <path d="M0 0 H10" stroke={INK} strokeWidth=".4" opacity=".07" />
        </pattern>
        <radialGradient id="vig" cx="50%" cy="46%" r="62%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor={INK} stopOpacity=".07" />
        </radialGradient>
      </defs>
      <rect x="1" y="1" width="248" height="348" rx="13" fill="url(#guilloche)" />
      <rect x="1" y="1" width="248" height="348" rx="13" fill="url(#vig)" />

      {/* the double rule — a thick line and a hair, which is how a real card
          border is printed */}
      <rect x="8" y="8" width="234" height="334" rx="9" fill="none" stroke={RED}
        strokeWidth="1.6" opacity=".55" />
      <rect x="13" y="13" width="224" height="324" rx="6" fill="none" stroke={RED}
        strokeWidth=".6" opacity=".38" />

      {/* the flourish, drawn once and mirrored about the centre line */}
      <Flourish />
      <g transform="translate(250,0) scale(-1,1)"><Flourish /></g>

      {/* THE PIP — one heart, drawn as a single curve, carrying the R.
          The shoulders are deliberately wide and the tip long: a heart with
          equal shoulders and a short tip reads as an emoji. */}
      <path
        d="M125 236 C125 236 61 197 61 153 C61 130 79 115 99 115 C112 115 121 122 125 131
           C129 122 138 115 151 115 C171 115 189 130 189 153 C189 197 125 236 125 236 Z"
        fill={RED} />
      <path
        d="M125 236 C125 236 61 197 61 153 C61 130 79 115 99 115 C112 115 121 122 125 131
           C129 122 138 115 151 115 C171 115 189 130 189 153 C189 197 125 236 125 236 Z"
        fill="none" stroke={INK} strokeWidth="1.1" opacity=".35" />
      {/* the highlight — one soft crescent, so the pip has a light source */}
      <path d="M78 137 C86 124 104 120 114 127" fill="none" stroke="#fff"
        strokeWidth="3" opacity=".26" strokeLinecap="round" />

      <text x="125" y="190" textAnchor="middle" fill={PAPER}
        fontFamily="Bodoni Moda, Didot, Georgia, serif" fontSize="72" fontWeight="700"
        fontStyle="italic">R</text>

      {/* the house line, set small under the pip */}
      <text x="125" y="266" textAnchor="middle" fill={INK} opacity=".62"
        fontFamily="Archivo, Inter, system-ui, sans-serif" fontSize="8.5"
        fontWeight="700" letterSpacing="3.4">R U M O A R</text>
      <path d="M92 275 H158" stroke={RED} strokeWidth=".7" opacity=".5" />
      <text x="125" y="288" textAnchor="middle" fill={INK} opacity=".42"
        fontFamily="Archivo, Inter, system-ui, sans-serif" fontSize="6.4"
        fontWeight="700" letterSpacing="2.2">NINE PIECES · ONE HAND</text>

      {/* the index, in opposite corners, so the card reads either way up */}
      <g>
        <text x="30" y="56" textAnchor="middle" fill={RED}
          fontFamily="Bodoni Moda, Didot, Georgia, serif" fontSize="40" fontWeight="700">A</text>
        <path d="M30 64 C30 60.6 24.6 58.6 24.6 64 C24.6 68.6 30 72 30 72 C30 72 35.4 68.6 35.4 64 C35.4 58.6 30 60.6 30 64 Z"
          fill={RED} />
      </g>
      <g transform="rotate(180 125 175)">
        <text x="30" y="56" textAnchor="middle" fill={RED}
          fontFamily="Bodoni Moda, Didot, Georgia, serif" fontSize="40" fontWeight="700">A</text>
        <path d="M30 64 C30 60.6 24.6 58.6 24.6 64 C24.6 68.6 30 72 30 72 C30 72 35.4 68.6 35.4 64 C35.4 58.6 30 60.6 30 64 Z"
          fill={RED} />
      </g>
    </svg>
  );
}

/* ===========================================================================
   THE INTRO

   A deck is riffled three times, fanned, squared, and the top card is turned
   over. The whisper types underneath from the first frame — the two run
   simultaneously, not in sequence, so the copy is finished by the time the
   card lands rather than making the visitor wait through it.

   Skippable from 240ms by click, key or the button. Shown once per browser
   session: a returning visitor who is three clicks from checkout should not
   have to watch a card trick again.
   =========================================================================== */
const CARDS = 24;

export default function Intro({ onDone }) {
  const root = useRef(null);
  const deck = useRef(null);
  const flip = useRef(null);
  const sheen = useRef(null);
  const tl = useRef(null);
  const done = useRef(false);

  const [line, setLine] = useState("");
  const [gone, setGone] = useState(false);
  const [skippable, setSkippable] = useState(false);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    tl.current?.kill();
    setGone(true);
    /* the unlock has to outlast the fade, or the page scrolls up behind a
       still-visible overlay */
    setTimeout(() => onDone?.(), 900);
  }, [onDone]);

  /* ——— the shuffle ——— */
  useEffect(() => {
    if (reduced()) { finish(); return; }
    const el = deck.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".card-back-n", el);
      const hero = flip.current;

      /* a real deck is never perfectly square */
      gsap.set(cards, {
        x: () => gsap.utils.random(-1.5, 1.5),
        y: (i) => -i * 0.35,
        rotate: () => gsap.utils.random(-1.4, 1.4),
        transformOrigin: "50% 50%",
      });
      gsap.set(hero, { autoAlpha: 0, rotateY: 0, scale: 1 });

      const t = gsap.timeline({ onComplete: finish });

      /* ——— 1. three riffles ———
         Each riffle splits the deck, throws the halves apart, and interleaves
         them back. The stagger is what makes it read as cards rather than as
         two blocks: they arrive one after another, fast, from alternating
         sides. */
      for (let r = 0; r < 3; r++) {
        const spread = 78 - r * 16;                 // tighter every pass
        t.to(cards, {
          x: (i) => (i % 2 ? -spread : spread),
          y: (i) => -i * 0.35 + (i % 2 ? -7 : 7),
          rotate: (i) => (i % 2 ? -9 : 9),
          duration: 0.17,
          ease: "power2.out",
          stagger: { each: 0.004, from: "center" },
        })
          .to(cards, {
            x: () => gsap.utils.random(-2, 2),
            y: (i) => -i * 0.35,
            rotate: () => gsap.utils.random(-2, 2),
            duration: 0.21,
            ease: "power3.inOut",
            stagger: { each: 0.007, from: "random" },
          }, ">-0.02");
      }

      /* ——— 2. the fan ———
         One arc across the table, held for a beat, then squared up. This is
         the moment the deck stops being a blur and reads as many cards. */
      t.to(cards, {
        x: (i) => (i - CARDS / 2) * 9,
        y: (i) => Math.abs(i - CARDS / 2) * 2.4 - 10,
        rotate: (i) => (i - CARDS / 2) * 2.6,
        duration: 0.5,
        ease: "power3.out",
        stagger: { each: 0.008, from: "start" },
      }, ">0.02")
        .to(cards, {
          x: 0, y: (i) => -i * 0.35, rotate: () => gsap.utils.random(-1, 1),
          duration: 0.42,
          ease: "power3.inOut",
          stagger: { each: 0.006, from: "end" },
        }, ">0.16");

      /* ——— 3. the turn ———
         The deck drops away downward while the top card lifts, turns over and
         settles. Nothing crossfades: the card is genuinely rotated, so the
         back leaves as the face arrives. */
      t.to(cards, {
        y: 240, autoAlpha: 0, rotate: () => gsap.utils.random(-16, 16),
        duration: 0.6, ease: "power2.in", stagger: { each: 0.012, from: "start" },
      }, ">0.05")
        .set(hero, { autoAlpha: 1 }, "<")
        .fromTo(hero,
          { rotateY: 0, scale: 1, y: 0 },
          { rotateY: 180, scale: 1.06, y: -14, duration: 0.95, ease: "power3.inOut" }, "<0.1")
        .to(hero, { scale: 1, y: 0, duration: 0.5, ease: "power2.out" }, ">-0.12");

      /* the sheen travels the face once, as it settles */
      t.fromTo(sheen.current,
        { opacity: 0, xPercent: -120 },
        { opacity: 1, xPercent: 120, duration: 0.85, ease: "power2.inOut" }, ">-0.45")
        .set(sheen.current, { opacity: 0 });

      t.to({}, { duration: 0.62 });          // hold on the card
      tl.current = t;
    }, root);

    return () => ctx.revert();
  }, [finish]);

  /* ——— the whisper, running alongside from the first frame ——— */
  useEffect(() => {
    if (reduced()) return;
    let dead = false;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    const type = async (s, sp) => {
      for (let i = 1; i <= s.length; i++) {
        if (dead || done.current) return;
        setLine(s.slice(0, i));
        await wait(sp);
      }
    };
    const erase = async (s, sp) => {
      for (let i = s.length; i >= 0; i--) {
        if (dead || done.current) return;
        setLine(s.slice(0, i));
        await wait(sp);
      }
    };

    (async () => {
      await wait(240);
      if (dead || done.current) return;
      setSkippable(true);
      await type(WHISPER[0], 26);
      await wait(620);
      await erase(WHISPER[0], 10);
      await wait(170);
      await type(WHISPER[1], 26);
    })();

    return () => { dead = true; };
  }, []);

  /* skip on any click or key, once the copy has had a moment to appear */
  useEffect(() => {
    if (!skippable) return;
    const key = (e) => {
      if (e.key === "Tab") return;             // tabbing away is not skipping
      finish();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [skippable, finish]);

  if (reduced()) return null;

  return (
    <div ref={root} className={`intro ${gone ? "gone" : ""} ${skippable ? "can-skip" : ""}`}
      onClick={finish} role="presentation">
      <div className="deck" ref={deck}>
        {Array.from({ length: CARDS }, (_, i) => (
          <Card key={i} back className="card-back-n" />
        ))}

        {/* the hero card: two faces on one turning plane */}
        <div className="flip" ref={flip}>
          <Card back />
          <div className="pc pc-front" style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <AceFace />
            <span className="sheen" ref={sheen} />
          </div>
        </div>
      </div>

      <div className="whisper">
        <p aria-live="polite">{line}<i /></p>
      </div>

      <button className="intro-skip" onClick={finish}>Skip</button>
    </div>
  );
}
