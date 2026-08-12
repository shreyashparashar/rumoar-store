/* ===========================================================================
   RUMOAR — the stylesheet

   Injected once at runtime from a template string rather than imported as a
   .css file. Same reason the research site did it: the tokens and the
   components that consume them stay in one codebase with no build-order
   question, and there is exactly one place to look for a colour.

   Scoped under `.ru` throughout, so nothing here can leak into an embed.

   ───────────────────────────────────────────────────────────────────────────
   THE DESIGN ARGUMENT

   The brand's ownable device is a playing card. So the card is not an intro
   animation that gets thrown away at the first scroll — it is the structural
   unit of the whole store:

     · every product is a card, with a real index and suit
     · the hero is a HAND of six, fanned on a dark table
     · the empty-photography state is the card face, not a grey box
     · the member's space is called The Hand and shows what you hold
     · the signature feature deals you one of fifty-two

   That is where the boldness is spent. Everything around it — type, spacing,
   controls, forms — is kept quiet and disciplined on purpose.
   ═══════════════════════════════════════════════════════════════════════ */
/** Injects the stylesheet.

    Called from main.jsx BEFORE createRoot().render(), never from an effect.

    BUG WAS HERE: this used to be injected in a useEffect inside <App>, which
    runs AFTER the first paint. For one frame the app rendered with no CSS at
    all — and the three elements that are held off-screen purely by a
    transform (the mobile menu sheet, the cart panel and the skip link) have
    no transform until the stylesheet lands, so all three painted OPEN across
    the page. Worse, once the CSS did arrive it also brought
    `transition:transform`, so they did not snap shut, they SLID shut over
    380ms — a visible flash of an open cart drawer and a full-screen menu on
    every cold load. Injecting synchronously before the first render means the
    closed state is the first state, and there is nothing to transition from. */
export function injectCSS() {
  if (typeof document === "undefined") return;
  if (document.querySelector("style[data-rumoar]")) return;
  const tag = document.createElement("style");
  tag.setAttribute("data-rumoar", "");
  tag.textContent = CSS;
  document.head.appendChild(tag);
}

export const CSS = `
/* ═══════════════════════════════════════════════════════════════════════════
   §1  TOKENS
   The red is the brand; it is not up for redesign. Light is the default —
   the store is looked at in daylight, on a phone, usually one-handed — and
   night is a deliberate act performed with a physical lamp rather than a
   system preference.
   ═══════════════════════════════════════════════════════════════════════════ */
.ru{
  /* TYPE — two families on a contrast axis, not two neighbouring sans faces.
     Archivo carries every piece of interface; Bodoni carries the moments
     where the brand speaks in its own voice. */
  --font-body:'Archivo','Inter',-apple-system,system-ui,sans-serif;
  --font-display:'Bodoni Moda',Didot,Georgia,serif;

  --paper:#FFFFFF; --paper-2:#F8F8F7; --paper-3:#EFEFF1;
  --ink:#0B0B0D;                       /* 19.6:1 on paper                  */
  --ink-2:#44444D;                     /* 9.4:1  — body copy               */
  --ink-3:#6E6E79;                     /* 4.9:1  — the floor, still passes */
  --line:#E6E6EB; --line-2:#D3D3DA;
  --mark:#D8232F; --mark-deep:#A5121C; --mark-soft:#F6DEE0;
  --ok:#0A7D5A;

  /* THE TABLE — the dark ground the cards are dealt onto. Used by the hero,
     the Court and the intro. Not pure black: a table has a colour. */
  --table:#0C0C10; --table-2:#141419; --felt:#12100F;
  --bone:#F4F3F1; --bone-2:#B9B7BE; --bone-3:#807E88;

  /* z-index, named. Never a bare 9999 anywhere in this file. */
  --z-grain:1; --z-sticky:36; --z-lamp:40; --z-nav:60; --z-scrim:80;
  --z-panel:90; --z-toast:100; --z-intro:120;

  --micro:170ms; --ui:380ms; --content:760ms; --cine:1300ms;
  --ez:cubic-bezier(.22,.68,.16,1);
  --ez-out:cubic-bezier(.16,1,.3,1);   /* quint-out — no bounce, no elastic */

  --gut:clamp(14px,1.8vw,26px);
  --marg:clamp(20px,5vw,84px);
  --rad:12px;                          /* cards top out here. Never 24+.    */
  --card-rad:clamp(9px,1vw,16px);

  color-scheme:light;
  font-family:var(--font-body);
  color:var(--ink);background:var(--paper);
  transition:background 700ms var(--ez),color 700ms var(--ez);
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;
  scrollbar-gutter:stable;
  position:relative;overflow-x:clip;
}

/* NIGHT — the lamp is off. Not a system toggle: an act. */
.ru.night{
  --paper:#0A0A0E; --paper-2:#101015; --paper-3:#17171E;
  --ink:#F4F3F1;                       /* 17.8:1 on the night ground       */
  --ink-2:#B8B7BE;                     /* 9.1:1                            */
  --ink-3:#8A8A95;                     /* 5.0:1 — still passes at night    */
  --line:#22222A; --line-2:#31313B;
  --mark:#FF3B47; --mark-deep:#FF6B74; --mark-soft:#3A1216;
  --ok:#35C79A;
  --table:#050508; --table-2:#0E0E13;
  color-scheme:dark;
}

.ru *,.ru *::before,.ru *::after{box-sizing:border-box}
.ru p{margin:0}
.ru h1,.ru h2,.ru h3,.ru h4{margin:0;font-weight:700;line-height:1.02}
.ru button{font-family:inherit;border:0;background:none;color:inherit;cursor:pointer;padding:0}
.ru a{color:inherit;text-decoration:none}
.ru img,.ru video,.ru canvas,.ru svg{display:block}
.ru input,.ru select,.ru textarea{font-family:inherit;font-size:1rem;color:inherit}
.ru :focus-visible{outline:2px solid var(--mark);outline-offset:3px;border-radius:3px}

/* Selection has to invert against whatever sits under it. Hard-coding white
   text here is the bug that makes every selected word vanish at night. */
.ru ::selection{background:var(--ink);color:var(--paper)}
.ru ::-moz-selection{background:var(--ink);color:var(--paper)}
/* the dark grounds are dark in BOTH light levels, so they take night rules */
.ru .dark ::selection,.ru .intro ::selection{background:#F4F3F1;color:#0A0A0E}

.ru .grain{position:fixed;inset:0;z-index:var(--z-grain);pointer-events:none;
  opacity:.028;mix-blend-mode:multiply;background-size:128px 128px}
.ru.night .grain{opacity:.05;mix-blend-mode:screen}

/* A dark section, on a page that is otherwise paper. Everything inside
   re-points the ink/paper ramp so components don't need dark variants. */
.ru .dark{background:var(--table);color:var(--bone);
  --paper:var(--table);--paper-2:var(--table-2);--paper-3:#1B1B22;
  --ink:var(--bone);--ink-2:var(--bone-2);--ink-3:var(--bone-3);
  --line:rgba(244,243,241,.12);--line-2:rgba(244,243,241,.2);
  --mark:#FF3B47;--mark-deep:#FF6B74;--mark-soft:#3A1216;
  position:relative;overflow:clip}

/* ═══════════════════════════════════════════════════════════════════════════
   §2  TYPE SCALE
   Display tracking bottoms out at -.03em. Tighter than that and the letters
   touch, which reads as cramped rather than designed.
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .mega{font-size:clamp(2.7rem,8vw,7.2rem);line-height:.9;letter-spacing:-.035em;
  font-weight:700;text-wrap:balance;overflow-wrap:break-word}
.ru .big{font-size:clamp(1.9rem,4.4vw,3.7rem);line-height:1;letter-spacing:-.028em;
  font-weight:700;text-wrap:balance;overflow-wrap:break-word}
.ru .mid{font-size:clamp(1.25rem,2.1vw,1.9rem);line-height:1.14;letter-spacing:-.022em;
  font-weight:700;text-wrap:balance}
.ru .h3{font-size:clamp(1rem,1.2vw,1.16rem);font-weight:700;letter-spacing:-.015em;line-height:1.3}
.ru .body{font-size:clamp(.95rem,1vw,1.04rem);line-height:1.62;color:var(--ink-2);
  font-weight:500;max-width:68ch;text-wrap:pretty}
.ru .lede{font-size:clamp(1.04rem,1.3vw,1.26rem);line-height:1.52;color:var(--ink-2);
  font-weight:500;max-width:52ch;text-wrap:pretty}
.ru .serif{font-family:var(--font-display);font-weight:400;letter-spacing:0}
.ru .it{font-style:italic}
.ru .mk{color:var(--mark)}
.ru .dim{color:var(--ink-3)}
.ru .num{font-variant-numeric:tabular-nums lining-nums}

/* The label. One deliberate system mark, used on section openers only —
   never stacked above every heading on the page. */
.ru .lb{font-family:var(--font-body);font-size:.7rem;letter-spacing:.18em;
  text-transform:uppercase;color:var(--ink-3);font-weight:700}

/* ═══════════════════════════════════════════════════════════════════════════
   §3  LAYOUT
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .wrap{width:100%;padding-inline:var(--marg);margin-inline:auto;max-width:1680px}
.ru .g{display:grid;grid-template-columns:repeat(12,1fr);gap:var(--gut)}
@media(max-width:900px){.ru .g{grid-template-columns:repeat(6,1fr)}}
@media(max-width:560px){.ru .g{grid-template-columns:repeat(2,1fr)}}
.ru .sec{padding-block:clamp(60px,9vw,142px)}
.ru .sec-tight{padding-block:clamp(42px,6vw,88px)}
.ru .rule{height:1px;background:var(--line);border:0;margin:0}
.ru .top{padding-top:clamp(88px,12vh,132px)}

/* section opener: label, headline, and a link on the right that always sits
   on the baseline of the headline rather than floating above it */
.ru .opener{display:flex;justify-content:space-between;align-items:flex-end;
  gap:22px;flex-wrap:wrap;margin-bottom:clamp(26px,4vw,52px)}

/* REVEAL.
   The hidden state lives on .rv.armed, not on .rv. JavaScript adds the
   'armed' class on mount, so the hidden state only ever exists in a browser
   that is actually running the observer that will later clear it. Without JS
   — a crawler, reader mode, a renderer that never fires IntersectionObserver
   — the element is simply visible, which is the whole point: a reveal is an
   enhancement on top of readable content, never the thing that makes content
   readable. */
.ru .rv{transition:opacity var(--content) var(--ez-out),transform var(--content) var(--ez-out)}
.ru .rv.armed{opacity:0;transform:translateY(20px)}
.ru .rv.armed.in{opacity:1;transform:none}

.ru .lines .lm{display:block;overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em}
.ru .lines .lm>span{display:block;transition:transform var(--cine) var(--ez-out)}
.ru .lines.armed .lm>span{transform:translateY(105%)}
.ru .lines.armed.in .lm>span{transform:none}

/* ═══════════════════════════════════════════════════════════════════════════
   §4  CONTROLS
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;
  font-size:.76rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  padding:16px 30px;border-radius:100px;white-space:nowrap;
  transition:background var(--ui) var(--ez),color var(--ui) var(--ez),
             border-color var(--ui) var(--ez),opacity var(--ui) var(--ez)}
.ru .btn-solid{background:var(--ink);color:var(--paper)}
.ru .btn-solid:hover{background:var(--mark);color:#fff}
.ru .btn-mark{background:var(--mark);color:#fff}
.ru .btn-mark:hover{background:var(--mark-deep)}
.ru .btn-line{border:1px solid var(--line-2);color:var(--ink)}
.ru .btn-line:hover{border-color:var(--ink);background:var(--ink);color:var(--paper)}
.ru .btn[disabled]{opacity:.4;cursor:not-allowed}
.ru .btn-sm{padding:11px 20px;font-size:.68rem}
.ru .btn-lg{padding:19px 36px;font-size:.8rem}
.ru .btn-full{width:100%}
.ru .mag{display:inline-flex;will-change:transform}
.ru .mag-l{display:inline-flex;align-items:center;gap:10px;will-change:transform}

.ru .link{position:relative;font-weight:600;padding-bottom:2px;display:inline-block}
.ru .link::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;
  background:currentColor;transform:scaleX(0);transform-origin:right;
  transition:transform var(--ui) var(--ez)}
.ru .link:hover::after{transform:scaleX(1);transform-origin:left}

.ru .tag{display:inline-flex;align-items:center;padding:6px 11px;border-radius:100px;
  background:var(--paper-3);color:var(--ink-2);font-size:.65rem;font-weight:700;
  letter-spacing:.1em;text-transform:uppercase}

/* ═══════════════════════════════════════════════════════════════════════════
   §5  THE PLAYING CARD
   One component, used at five sizes, across the intro, the hero hand, the
   product grid, the Court and the member's space. Sizing comes from the
   container; everything inside scales off --cw, the card's own width, so a
   38px thumbnail and a 340px hero card are the same drawing.
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .pc{position:relative;aspect-ratio:5/7;border-radius:var(--card-rad);
  background:#FCFBF9;color:#101014;overflow:hidden;
  border:1px solid rgba(0,0,0,.14);
  container-type:inline-size;
  box-shadow:0 1px 2px rgba(0,0,0,.1),0 14px 34px -18px rgba(0,0,0,.42)}
.ru .pc-in{position:absolute;inset:0;padding:7%;display:flex;flex-direction:column}
/* the guilloche: a fine engraved field that stops the face reading as flat
   vector white. Two rotated repeating gradients, no image, no request. */
.ru .pc::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.5;
  background:
    repeating-linear-gradient(58deg,rgba(16,16,20,.05) 0 .5px,transparent .5px 7px),
    repeating-linear-gradient(-58deg,rgba(16,16,20,.05) 0 .5px,transparent .5px 7px)}
.ru .pc-rule{position:absolute;inset:4.5%;border:1px solid currentColor;opacity:.22;
  border-radius:calc(var(--card-rad) * .6);pointer-events:none}
.ru .pc.red{color:#C4121F}
.ru .pc.black{color:#15151A}

/* the corner index — set large, because the index IS the brand mark here */
.ru .pc-ix{position:absolute;display:flex;flex-direction:column;align-items:center;
  line-height:.86;font-family:var(--font-display);font-weight:700}
.ru .pc-ix.tl{top:6%;left:7%}
.ru .pc-ix.br{bottom:6%;right:7%;transform:rotate(180deg)}
.ru .pc-ix b{font-size:22cqw;letter-spacing:-.04em}
.ru .pc-ix svg{width:13cqw;height:13cqw;margin-top:.06em}
.ru .pc-ix svg path{fill:currentColor}

/* the centre: piece number, name, material — the "face" of a product card */
.ru .pc-face{margin:auto;text-align:center;padding-inline:19%;position:relative;z-index:2}
.ru .pc-n{font-family:var(--font-display);font-size:30cqw;line-height:.78;font-weight:700;
  letter-spacing:-.04em;opacity:.13;color:#101014;
  transition:opacity var(--ui) var(--ez),color var(--ui) var(--ez)}
.ru .pc-nm{font-size:6.2cqw;font-weight:700;letter-spacing:-.01em;margin-top:4cqw;
  line-height:1.16;color:#101014}
.ru .pc-mt{font-size:3.5cqw;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
  color:#6E6E79;margin-top:2.6cqw;line-height:1.5}
.ru .pc-suit{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  width:52cqw;height:52cqw;opacity:.07;z-index:1}
.ru .pc-suit path{fill:currentColor}

/* face-down: the undealt pieces, and the deck in the intro */
.ru .pc.back{background:
  repeating-linear-gradient(45deg,rgba(255,255,255,.055) 0 6px,transparent 6px 12px),
  linear-gradient(160deg,#A5121C,#7C0C14 62%,#5E070E);
  border:1px solid rgba(255,255,255,.17);color:#fff}
.ru .pc.back .pc-rule{opacity:.3}
.ru .pc.back .pc-bk{position:absolute;inset:0;display:grid;place-items:center;
  font-family:var(--font-display);font-size:26cqw;font-weight:700;font-style:italic;
  color:rgba(255,255,255,.22)}
.ru .pc.back .pc-nt{position:absolute;left:0;right:0;bottom:9%;text-align:center;
  font-size:3.4cqw;font-weight:700;letter-spacing:.2em;text-transform:uppercase;
  color:rgba(255,255,255,.62)}

/* ═══════════════════════════════════════════════════════════════════════════
   §6  THE INTRO — the deck
   Dark in both light levels. The deck shuffles; the whisper types underneath
   at the same time; the hand fans and the top card turns over.
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .intro{position:fixed;inset:0;z-index:var(--z-intro);background:#08080C;
  display:grid;grid-template-rows:1fr auto;place-items:center;overflow:hidden;
  transition:opacity 900ms var(--ez),visibility 900ms}
.ru .intro.gone{opacity:0;visibility:hidden;pointer-events:none}

/* the felt: a single soft pool of light on a dark table, nothing more */
.ru .intro::before{content:"";position:absolute;inset:0;
  background:radial-gradient(ellipse 62% 52% at 50% 42%,rgba(216,35,47,.16),transparent 70%)}
.ru .intro::after{content:"";position:absolute;inset:0;
  background:radial-gradient(ellipse 40% 34% at 50% 40%,rgba(255,255,255,.07),transparent 72%)}

.ru .deck{position:relative;z-index:2;width:min(62vw,272px);aspect-ratio:5/7;
  perspective:1500px;transform:translateY(-2vh)}
.ru .deck .pc{position:absolute;inset:0;backface-visibility:hidden;
  transform-style:preserve-3d;will-change:transform,opacity;
  box-shadow:0 18px 40px rgba(0,0,0,.5)}

/* the hero card: two faces on one turning plane. The container rotates; each
   face hides its own back, so at 180° the back is gone and the face is
   present without anything crossfading. */
.ru .flip{position:absolute;inset:0;transform-style:preserve-3d;will-change:transform}
.ru .flip .pc-front{transform:rotateY(180deg);border-radius:var(--card-rad);
  background:#FCFBF9;border:1px solid rgba(0,0,0,.14)}
/* the ace fills its card rather than sitting in the middle of it */
.ru .pc-front svg{width:100%;height:100%;display:block}

/* the sheen that travels the face once it lands */
.ru .sheen{position:absolute;inset:0;border-radius:var(--card-rad);pointer-events:none;z-index:5;
  background:linear-gradient(105deg,transparent 38%,rgba(255,255,255,.6) 50%,transparent 62%);
  opacity:0;mix-blend-mode:overlay}

/* the whisper, running underneath the whole time */
.ru .whisper{position:relative;z-index:3;text-align:center;padding:0 6vw
  calc(env(safe-area-inset-bottom,0px) + clamp(52px,9vh,96px));
  min-height:5.2em;display:flex;flex-direction:column;justify-content:flex-end;gap:14px}
.ru .whisper p{font-family:var(--font-display);color:#F4F3F1;font-weight:400;
  font-size:clamp(1.02rem,2.7vw,1.72rem);line-height:1.45;letter-spacing:.004em;
  min-height:1.45em;text-wrap:balance}
.ru .whisper i{display:inline-block;width:2px;height:.92em;background:#FF3B47;
  margin-left:5px;vertical-align:-.1em;animation:blink 1s steps(2) infinite}
@keyframes blink{50%{opacity:0}}

.ru .intro-skip{position:absolute;z-index:4;bottom:calc(env(safe-area-inset-bottom,0px) + 18px);
  left:50%;transform:translateX(-50%);font-size:.62rem;font-weight:700;letter-spacing:.2em;
  text-transform:uppercase;color:rgba(244,243,241,.5);padding:10px 16px;
  opacity:0;transition:opacity 600ms var(--ez)}
.ru .intro.can-skip .intro-skip{opacity:1}
.ru .intro-skip:hover{color:#F4F3F1}

/* ═══════════════════════════════════════════════════════════════════════════
   §7  NAV
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .nav{position:fixed;top:0;left:0;right:0;z-index:var(--z-nav);
  background:var(--paper);border-bottom:1px solid transparent;
  transition:border-color var(--ui) var(--ez),background var(--ui) var(--ez),
             transform var(--ui) var(--ez),color var(--ui) var(--ez)}
.ru .nav.stuck{border-bottom-color:var(--line)}
.ru .nav.hide{transform:translateY(-100%)}
/* over a dark hero the bar is transparent and inverted until the page moves */
.ru .nav.onDark:not(.stuck){background:transparent;color:var(--bone);
  --ink:var(--bone);--ink-2:var(--bone-2);--ink-3:var(--bone-3);--line-2:rgba(244,243,241,.3)}
.ru .navin{display:flex;align-items:center;gap:clamp(12px,2.2vw,32px);
  height:clamp(60px,7vh,74px);padding-inline:var(--marg)}
.ru .wordmark{font-family:var(--font-body);font-weight:700;font-size:1.06rem;
  letter-spacing:.16em;margin-right:auto;white-space:nowrap}
.ru .wordmark b{color:var(--mark);font-weight:700}
.ru .navlinks{display:flex;gap:clamp(11px,1.6vw,24px);align-items:center}
.ru .navlink{font-size:.73rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
  color:var(--ink-2);transition:color var(--micro) var(--ez);white-space:nowrap}
.ru .navlink:hover{color:var(--ink)}
.ru .navlink.on{color:var(--mark)}
@media(max-width:980px){.ru .navlinks{display:none}}

.ru .cartbtn{position:relative;display:flex;align-items:center;gap:9px;
  padding:10px 17px;border-radius:100px;border:1px solid var(--line-2);
  font-size:.7rem;font-weight:700;letter-spacing:.11em;text-transform:uppercase;
  transition:border-color var(--micro) var(--ez),background var(--micro) var(--ez)}
.ru .cartbtn:hover{border-color:var(--ink)}
.ru .cartbtn .cnt{display:grid;place-items:center;min-width:20px;height:20px;padding:0 6px;
  border-radius:100px;background:var(--mark);color:#fff;font-size:.66rem;line-height:1}
.ru .cartbtn.bump{animation:bump 460ms var(--ez-out)}
@keyframes bump{0%{transform:none}32%{transform:scale(1.13)}100%{transform:none}}

.ru .menubtn{display:none;width:40px;height:40px;place-items:center;border-radius:100px;
  border:1px solid var(--line-2)}
@media(max-width:980px){.ru .menubtn{display:grid}}
.ru .menubtn i{display:block;width:16px;height:1.5px;background:currentColor;position:relative}
.ru .menubtn i::before,.ru .menubtn i::after{content:"";position:absolute;left:0;
  width:16px;height:1.5px;background:currentColor}
.ru .menubtn i::before{top:-5px}.ru .menubtn i::after{top:5px}

/* mobile sheet */
.ru .msheet{position:fixed;inset:0;z-index:var(--z-panel);background:var(--paper);
  display:flex;flex-direction:column;padding:var(--marg);gap:2px;overflow-y:auto;
  transform:translateY(-100%);transition:transform var(--ui) var(--ez-out)}
.ru .msheet.open{transform:none}
.ru .msheet a,.ru .msheet button.ms{text-align:left;padding:15px 0;font-size:1.42rem;
  font-weight:700;letter-spacing:-.02em;border-bottom:1px solid var(--line);
  display:flex;justify-content:space-between;align-items:center;gap:12px}
.ru .msheet .ms i{font-family:var(--font-display);font-style:italic;color:var(--mark);
  font-size:1.1rem;opacity:.8}

/* the sticky mobile bar — one action, always reachable, thumb height.
   It is NOT shown on checkout (nothing to add) or when a panel is open. */
.ru .stickybar{position:fixed;left:0;right:0;bottom:0;z-index:var(--z-sticky);display:none;
  padding:10px var(--marg) calc(10px + env(safe-area-inset-bottom,0px));
  background:color-mix(in srgb,var(--paper) 88%,transparent);
  backdrop-filter:blur(18px) saturate(1.6);-webkit-backdrop-filter:blur(18px) saturate(1.6);
  border-top:1px solid var(--line);
  transform:translateY(110%);transition:transform var(--ui) var(--ez-out)}
.ru .stickybar.up{transform:none}
.ru .stickybar .sbin{display:flex;align-items:center;gap:12px}
.ru .stickybar .sbl{flex:0 0 auto;min-width:0}
.ru .stickybar .sbl b{display:block;font-size:.86rem;font-weight:700;white-space:nowrap;
  overflow:hidden;text-overflow:ellipsis;max-width:34vw}
.ru .stickybar .sbl span{display:block;font-size:.7rem;color:var(--ink-3);font-weight:700}
.ru .stickybar .btn{flex:1}
@media(max-width:820px){.ru .stickybar{display:block}}

/* ═══════════════════════════════════════════════════════════════════════════
   §8  THE HERO — the table
   A hand of six, dealt onto a dark table. This is the thesis of the whole
   store in one screen: the products ARE the deck, and the deck is the brand.
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .hero{position:relative;min-height:clamp(620px,94svh,1000px);display:flex;
  flex-direction:column;justify-content:center;
  padding-top:clamp(92px,13vh,140px);padding-bottom:clamp(30px,6vh,60px)}
/* the pool of light. Two ellipses, one warm one red, so the table has a
   centre without a visible gradient edge anywhere. */
.ru .hero::before{content:"";position:absolute;inset:0;pointer-events:none;
  background:
    radial-gradient(ellipse 74% 58% at 62% 46%,rgba(216,35,47,.19),transparent 68%),
    radial-gradient(ellipse 46% 40% at 58% 40%,rgba(255,255,255,.09),transparent 72%)}
.ru .hero>*{position:relative;z-index:2}
.ru .hero-g{display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(24px,4vw,72px);
  align-items:center;width:100%}
@media(max-width:1000px){.ru .hero-g{grid-template-columns:1fr;gap:clamp(30px,6vh,52px)}}

.ru .hero-eyebrow{display:inline-flex;align-items:center;gap:10px;
  font-size:.68rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;
  color:var(--bone-2);border:1px solid rgba(244,243,241,.2);
  padding:8px 15px;border-radius:100px;margin-bottom:clamp(18px,3vh,30px)}
.ru .hero-eyebrow i{width:6px;height:6px;border-radius:100px;background:var(--mark);
  animation:pulse 2.6s var(--ez) infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}

.ru .hero .mega{color:var(--bone)}
.ru .hero .lede{color:var(--bone-2);margin-top:clamp(18px,3vh,28px);max-width:44ch}
.ru .hero-cta{display:flex;gap:12px;flex-wrap:wrap;margin-top:clamp(24px,4vh,40px)}
.ru .hero-cta .btn-solid{background:var(--bone);color:#0B0B0D}
.ru .hero-cta .btn-solid:hover{background:var(--mark);color:#fff}
.ru .hero-cta .btn-line{border-color:rgba(244,243,241,.34);color:var(--bone)}
.ru .hero-cta .btn-line:hover{background:var(--bone);color:#0B0B0D;border-color:var(--bone)}

/* the trust row, immediately under the CTA — the four things a first-time
   visitor needs before they will click anything */
.ru .hero-trust{display:flex;flex-wrap:wrap;gap:8px 22px;margin-top:clamp(22px,3.4vh,34px)}
.ru .hero-trust span{display:inline-flex;align-items:center;gap:7px;font-size:.74rem;
  font-weight:600;color:var(--bone-2)}
.ru .hero-trust svg{width:13px;height:13px;flex:0 0 auto;color:var(--mark)}

/* THE HAND. Six cards fanned about a pivot well below the card faces, which
   is what makes it read as held rather than laid out. Hovering lifts one and
   pushes its neighbours aside. */
.ru .hand{position:relative;height:clamp(330px,52vh,520px);display:flex;
  align-items:center;justify-content:center;perspective:1600px}
.ru .hand-c{position:absolute;width:clamp(126px,15vw,206px);
  transform-origin:50% 165%;will-change:transform;
  transition:transform var(--ui) var(--ez-out),filter var(--ui) var(--ez)}
.ru .hand-c .pc{box-shadow:0 3px 8px rgba(0,0,0,.34),0 30px 60px -28px rgba(0,0,0,.8)}
.ru .hand-c:hover,.ru .hand-c:focus-visible{z-index:20}
.ru .hand-c .hand-tip{position:absolute;left:50%;bottom:-34px;transform:translateX(-50%);
  white-space:nowrap;font-size:.64rem;font-weight:700;letter-spacing:.14em;
  text-transform:uppercase;color:var(--bone);opacity:0;pointer-events:none;
  transition:opacity var(--micro) var(--ez)}
.ru .hand-c:hover .hand-tip,.ru .hand-c:focus-visible .hand-tip{opacity:1}
.ru .hand-c .hand-tip b{color:var(--mark)}
@media(max-width:1000px){.ru .hand{height:clamp(280px,40vh,380px)}}
@media(max-width:560px){.ru .hand-c{width:clamp(104px,30vw,150px)}}

/* the four words, running the width of the page under the hero */
.ru .creedbar{border-block:1px solid var(--line);overflow:hidden;padding-block:15px}
.ru .creedtrack{display:flex;gap:0;width:max-content;
  animation:slide 44s linear infinite;will-change:transform}
.ru .creedtrack span{font-family:var(--font-display);font-size:clamp(.95rem,1.5vw,1.3rem);
  font-style:italic;color:var(--ink-3);padding-inline:clamp(18px,2.4vw,38px);white-space:nowrap}
.ru .creedtrack span::after{content:"·";margin-left:clamp(18px,2.4vw,38px);color:var(--mark)}
@keyframes slide{to{transform:translateX(-50%)}}
.ru .creedbar:hover .creedtrack{animation-play-state:paused}

/* ═══════════════════════════════════════════════════════════════════════════
   §9  PRODUCT PLATE & GRID
   The grid is deliberately not six identical tiles: the first piece on the
   shop index runs double-width, which is what makes it read as a considered
   window rather than a search result page.
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(252px,1fr));
  gap:clamp(20px,2.6vw,40px) var(--gut)}
.ru .grid.feature>*:first-child{grid-column:span 2}
@media(max-width:700px){.ru .grid.feature>*:first-child{grid-column:span 1}}

.ru .pcard{position:relative;display:flex;flex-direction:column;gap:14px;text-align:left}
.ru .plate{position:relative;width:100%;aspect-ratio:4/5;border-radius:var(--rad);
  overflow:hidden;background:var(--paper-3);
  transition:background var(--ui) var(--ez)}
.ru .grid.feature>*:first-child .plate{aspect-ratio:8/5}
@media(max-width:700px){.ru .grid.feature>*:first-child .plate{aspect-ratio:4/5}}
.ru .plate img{width:100%;height:100%;object-fit:cover;
  transition:transform var(--cine) var(--ez-out)}
.ru .pcard:hover .plate img{transform:scale(1.035)}

/* the designed empty state: the piece's own playing card, centred on a
   tinted field. Not a grey box with "image" in it. */
.ru .plate-card{position:absolute;inset:0;display:grid;place-items:center;
  padding:clamp(14px,2vw,26px);background:var(--paper-3);
  transition:background var(--ui) var(--ez)}
.ru .plate-card .pc{height:100%;width:auto;max-width:100%;
  transition:transform var(--cine) var(--ez-out),box-shadow var(--ui) var(--ez)}
.ru .pcard:hover .plate-card{background:var(--mark-soft)}
.ru .pcard:hover .plate-card .pc{transform:translateY(-6px) rotate(-1.4deg)}
.ru .pcard:hover .plate-card .pc-n{opacity:.2;color:var(--mark)}

.ru .phead{display:flex;justify-content:space-between;align-items:baseline;gap:14px}
.ru .pname{font-size:1.04rem;font-weight:700;letter-spacing:-.015em}
.ru .pprice{font-size:.95rem;font-weight:700;white-space:nowrap}
.ru .pwas{font-size:.8rem;color:var(--ink-3);text-decoration:line-through;margin-right:7px;
  font-weight:600}
.ru .pline{font-size:.72rem;font-weight:700;letter-spacing:.13em;text-transform:uppercase;
  color:var(--ink-3);display:flex;align-items:center;gap:8px}
.ru .pline svg{width:10px;height:10px}
.ru .pline svg path{fill:currentColor}
.ru .pblurb{font-size:.88rem;line-height:1.55;color:var(--ink-2);font-weight:500;max-width:44ch}

/* the quick-add, revealed on the plate. It is positioned against .pshot — a
   wrapper containing only the plate — so it can never land over the blurb. */
.ru .pshot{position:relative;display:block}
.ru .quick{position:absolute;left:12px;right:12px;bottom:12px;opacity:0;
  transform:translateY(9px);transition:opacity var(--ui) var(--ez),transform var(--ui) var(--ez-out)}
.ru .pcard:hover .quick,.ru .pcard:focus-within .quick{opacity:1;transform:none}
@media(pointer:coarse){.ru .quick{opacity:1;transform:none}}
.ru .quick button{width:100%;background:var(--ink);color:var(--paper);
  padding:13px;border-radius:100px;font-size:.68rem;font-weight:700;letter-spacing:.13em;
  text-transform:uppercase;transition:background var(--micro) var(--ez)}
.ru .quick button:hover{background:var(--mark);color:#fff}

/* ═══════════════════════════════════════════════════════════════════════════
   §10  FILTERS
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .filters{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.ru .fbtn{padding:10px 18px;border-radius:100px;border:1px solid var(--line);
  font-size:.7rem;font-weight:700;letter-spacing:.11em;text-transform:uppercase;
  color:var(--ink-2);transition:all var(--micro) var(--ez)}
.ru .fbtn:hover{border-color:var(--ink-3);color:var(--ink)}
.ru .fbtn.on{background:var(--ink);border-color:var(--ink);color:var(--paper)}
.ru .sel{padding:10px 14px;border-radius:100px;border:1px solid var(--line-2);
  background:var(--paper);font-size:.78rem;font-weight:700;color:var(--ink)}

/* ═══════════════════════════════════════════════════════════════════════════
   §11  PRODUCT DETAIL
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .pdp-media{grid-column:1/7}
.ru .pdp-info{grid-column:8/13;position:sticky;top:clamp(88px,12vh,116px);align-self:start}
@media(max-width:900px){
  .ru .pdp-media,.ru .pdp-info{grid-column:1/-1}
  .ru .pdp-info{position:static}
}
.ru .pdp-media .plate{aspect-ratio:4/5;border-radius:var(--rad)}
.ru .pdp-price{display:flex;align-items:baseline;gap:12px;margin-top:14px;flex-wrap:wrap}
.ru .pdp-price b{font-size:1.55rem;font-weight:700}
.ru .swatches{display:flex;gap:10px;flex-wrap:wrap}
.ru .sw{width:38px;height:38px;border-radius:100px;border:1px solid var(--line-2);
  position:relative;transition:transform var(--micro) var(--ez)}
.ru .sw::after{content:"";position:absolute;inset:-4px;border-radius:100px;
  border:1.5px solid transparent;transition:border-color var(--micro) var(--ez)}
.ru .sw:hover{transform:scale(1.06)}
.ru .sw.on::after{border-color:var(--ink)}
.ru .qty{display:inline-flex;align-items:center;border:1px solid var(--line-2);
  border-radius:100px;overflow:hidden}
.ru .qty button{width:42px;height:46px;font-size:1.05rem;font-weight:700;
  transition:background var(--micro) var(--ez)}
.ru .qty button:hover{background:var(--paper-3)}
.ru .qty span{min-width:34px;text-align:center;font-weight:700;font-size:.95rem}
.ru .stock{display:inline-flex;align-items:center;gap:7px;font-size:.76rem;
  font-weight:700;color:var(--ink-2)}
.ru .stock i{width:7px;height:7px;border-radius:100px;background:var(--ok);flex:0 0 auto}
.ru .stock.low i{background:var(--mark)}

/* the spec table — a table, because it is tabular data */
.ru .spec{width:100%;border-collapse:collapse;margin-top:6px}
.ru .spec th,.ru .spec td{text-align:left;padding:13px 0;border-bottom:1px solid var(--line);
  font-size:.87rem;vertical-align:top}
.ru .spec th{font-weight:700;color:var(--ink-3);width:42%;font-size:.72rem;
  letter-spacing:.11em;text-transform:uppercase;padding-right:16px}
.ru .spec td{font-weight:600;color:var(--ink)}

/* accordion */
.ru .acc{border-top:1px solid var(--line)}
.ru .acc:last-of-type{border-bottom:1px solid var(--line)}
.ru .acc summary{display:flex;justify-content:space-between;align-items:center;gap:16px;
  padding:19px 0;cursor:pointer;font-size:.88rem;font-weight:700;list-style:none}
.ru .acc summary::-webkit-details-marker{display:none}
.ru .acc summary i{position:relative;width:13px;height:13px;flex:0 0 auto}
.ru .acc summary i::before,.ru .acc summary i::after{content:"";position:absolute;
  background:currentColor;transition:transform var(--ui) var(--ez)}
.ru .acc summary i::before{left:0;top:6px;width:13px;height:1.5px}
.ru .acc summary i::after{left:6px;top:0;width:1.5px;height:13px}
.ru .acc[open] summary i::after{transform:scaleY(0)}
.ru .acc-body{padding-bottom:22px}

/* the workshop strip on a product page — the named house that made it */
.ru .maker{display:flex;gap:16px;align-items:flex-start;padding:18px;margin-top:26px;
  border:1px solid var(--line);border-radius:var(--rad);background:var(--paper-2)}
.ru .maker .mk-i{width:38px;height:38px;flex:0 0 auto;border-radius:100px;display:grid;
  place-items:center;background:var(--mark-soft);color:var(--mark);font-weight:700;
  font-family:var(--font-display);font-size:1.05rem}

/* ═══════════════════════════════════════════════════════════════════════════
   §12  CART & PANELS
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .scrim{position:fixed;inset:0;z-index:var(--z-scrim);background:rgba(6,6,10,.42);
  opacity:0;transition:opacity var(--ui) var(--ez);backdrop-filter:blur(2px)}
.ru .scrim.open{opacity:1}

.ru .panel{position:fixed;top:0;right:0;bottom:0;z-index:var(--z-panel);
  width:min(94vw,442px);background:var(--paper);display:flex;flex-direction:column;
  transform:translateX(100%);transition:transform var(--ui) var(--ez-out);
  box-shadow:-16px 0 44px rgba(0,0,0,.14)}
.ru .panel.open{transform:none}
.ru .panel-h{display:flex;align-items:center;justify-content:space-between;gap:16px;
  padding:22px var(--gut) 18px;border-bottom:1px solid var(--line)}
.ru .panel-b{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:var(--gut)}
.ru .panel-f{border-top:1px solid var(--line);padding:var(--gut);display:grid;gap:13px}
.ru .x{width:38px;height:38px;display:grid;place-items:center;border-radius:100px;
  border:1px solid var(--line);transition:background var(--micro) var(--ez)}
.ru .x:hover{background:var(--paper-3)}

.ru .li{display:grid;grid-template-columns:60px 1fr;gap:15px;padding-block:17px;
  border-bottom:1px solid var(--line)}
.ru .li:last-child{border-bottom:0}
.ru .li-p{border-radius:6px;overflow:hidden}
.ru .li-n{font-size:.9rem;font-weight:700;line-height:1.28}
.ru .li-m{font-size:.74rem;color:var(--ink-3);font-weight:600;margin-top:3px}
.ru .li-r{display:flex;justify-content:space-between;align-items:center;margin-top:11px;gap:12px}
.ru .li-x{font-size:.72rem;font-weight:700;color:var(--ink-3);letter-spacing:.06em}
.ru .li-x:hover{color:var(--mark)}

.ru .tot{display:flex;justify-content:space-between;font-size:.88rem;font-weight:600;
  color:var(--ink-2)}
.ru .tot.grand{font-size:1.12rem;font-weight:700;color:var(--ink);
  padding-top:13px;border-top:1px solid var(--line)}

/* free-shipping progress — a bar, because "₹800 more" without a bar is just
   a number and does not read as almost-there */
.ru .ship{margin-bottom:16px}
.ru .ship .bar{height:3px;background:var(--line);border-radius:3px;overflow:hidden;margin-top:9px}
.ru .ship .bar i{display:block;height:100%;background:var(--mark);
  transition:width var(--cine) var(--ez-out)}

.ru .empty{display:grid;place-items:center;gap:16px;text-align:center;
  padding:clamp(40px,9vh,80px) 10px;color:var(--ink-3)}

/* ═══════════════════════════════════════════════════════════════════════════
   §13  CHECKOUT
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .co-form{grid-column:1/8}
.ru .co-sum{grid-column:9/13;position:sticky;top:clamp(88px,12vh,116px);align-self:start;
  background:var(--paper-2);border:1px solid var(--line);border-radius:var(--rad);
  padding:clamp(18px,2.4vw,28px)}
@media(max-width:900px){
  .ru .co-form,.ru .co-sum{grid-column:1/-1}
  .ru .co-sum{position:static;margin-top:30px}
}
.ru .field{display:grid;gap:7px;margin-bottom:17px}
.ru .field label{font-size:.72rem;font-weight:700;letter-spacing:.11em;
  text-transform:uppercase;color:var(--ink-2)}
.ru .field input,.ru .field select,.ru .field textarea{width:100%;padding:14px 15px;
  border-radius:9px;border:1px solid var(--line-2);background:var(--paper);
  transition:border-color var(--micro) var(--ez)}
.ru .field input::placeholder{color:var(--ink-3)}
.ru .field input:focus,.ru .field textarea:focus{border-color:var(--ink);outline:none}
.ru .field.bad input,.ru .field.bad select{border-color:var(--mark)}
.ru .err{font-size:.75rem;font-weight:600;color:var(--mark)}
.ru .row2{display:grid;grid-template-columns:1fr 1fr;gap:var(--gut)}
@media(max-width:560px){.ru .row2{grid-template-columns:1fr}}

.ru .paybox{border:1px solid var(--line);border-radius:var(--rad);overflow:hidden}
.ru .payopt{display:flex;align-items:center;gap:13px;padding:16px 17px;cursor:pointer;
  border-bottom:1px solid var(--line);transition:background var(--micro) var(--ez)}
.ru .payopt:last-child{border-bottom:0}
.ru .payopt:hover{background:var(--paper-2)}
.ru .payopt input{accent-color:var(--mark);width:17px;height:17px;flex:0 0 auto}
.ru .payopt b{font-size:.88rem;font-weight:700}
.ru .payopt span{font-size:.76rem;color:var(--ink-3);font-weight:600;display:block;margin-top:2px}

/* the three steps across the top of checkout — where am I, what's left */
.ru .steps{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:clamp(24px,4vw,42px)}
.ru .steps b{display:inline-flex;align-items:center;gap:8px;font-size:.7rem;font-weight:700;
  letter-spacing:.13em;text-transform:uppercase;color:var(--ink-3)}
.ru .steps b.on{color:var(--ink)}
.ru .steps b i{width:19px;height:19px;border-radius:100px;display:grid;place-items:center;
  font-size:.62rem;background:var(--paper-3);color:var(--ink-3)}
.ru .steps b.on i{background:var(--mark);color:#fff}
.ru .steps s{width:22px;height:1px;background:var(--line-2);display:block}

/* ═══════════════════════════════════════════════════════════════════════════
   §14  EDITORIAL
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .quote{padding-block:clamp(60px,10vw,140px);text-align:center}
.ru .quote p{font-family:var(--font-display);font-weight:400;font-style:italic;
  font-size:clamp(1.55rem,4.4vw,3.1rem);line-height:1.24;letter-spacing:-.01em;
  max-width:20ch;margin-inline:auto;text-wrap:balance}

/* the thread — nine pieces, one line that visits every one of them */
.ru .thread{width:100%;max-width:420px}
.ru .thread path{fill:none;stroke-linecap:round;vector-effect:non-scaling-stroke}
.ru .th-core{stroke:var(--mark);stroke-width:2}
.ru .th-shade{stroke:var(--ink);stroke-width:2;opacity:.13}
.ru .th-node{fill:var(--paper);stroke:var(--ink);stroke-width:1.5}
.ru .threadcap{font-size:.68rem;font-weight:700;letter-spacing:.19em;text-transform:uppercase;
  color:var(--ink-3);margin-top:18px;text-align:center}

.ru .promises{display:grid;grid-template-columns:repeat(auto-fit,minmax(224px,1fr));
  gap:clamp(22px,3vw,44px)}
.ru .promise h3{font-size:.95rem;font-weight:700;margin-bottom:9px;display:flex;
  align-items:center;gap:9px}
.ru .promise h3 svg{width:15px;height:15px;color:var(--mark);flex:0 0 auto}
.ru .promise p{font-size:.84rem;line-height:1.55;color:var(--ink-2);font-weight:500}

/* CASE STUDIES — three decisions a customer can check, not testimonials */
.ru .cases{display:grid;gap:1px;background:var(--line);border:1px solid var(--line);
  border-radius:var(--rad);overflow:hidden}
@media(min-width:900px){.ru .cases{grid-template-columns:repeat(3,1fr)}}
.ru .case{background:var(--paper);padding:clamp(22px,2.6vw,34px);display:flex;
  flex-direction:column;gap:14px;transition:background var(--ui) var(--ez)}
.ru .case:hover{background:var(--paper-2)}
.ru .case .cs-k{font-size:.65rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  color:var(--mark)}
.ru .case .cs-s{font-family:var(--font-display);font-size:clamp(1.5rem,2.4vw,2.1rem);
  font-weight:700;letter-spacing:-.03em;line-height:1}
.ru .case h3{font-size:1.02rem;letter-spacing:-.015em}
.ru .case p{font-size:.86rem;line-height:1.58;color:var(--ink-2);font-weight:500}
.ru .case .cs-p{font-size:.74rem;color:var(--ink-3);font-weight:600;
  padding-top:12px;border-top:1px solid var(--line);margin-top:auto}

/* REVIEWS */
.ru .revs{display:grid;grid-template-columns:repeat(auto-fit,minmax(272px,1fr));
  gap:var(--gut)}
.ru .rev{border:1px solid var(--line);border-radius:var(--rad);padding:clamp(18px,2vw,26px);
  display:flex;flex-direction:column;gap:11px;background:var(--paper)}
.ru .rev h4{font-size:.95rem;letter-spacing:-.01em}
.ru .rev p{font-size:.86rem;line-height:1.58;color:var(--ink-2);font-weight:500}
.ru .rev .rv-f{display:flex;justify-content:space-between;gap:12px;align-items:center;
  font-size:.74rem;color:var(--ink-3);font-weight:600;margin-top:auto;padding-top:12px;
  border-top:1px solid var(--line)}
.ru .stars{display:inline-flex;gap:2px;color:var(--mark)}
.ru .stars svg{width:13px;height:13px}
.ru .stars .off{opacity:.22}
.ru .rev-note{font-size:.72rem;color:var(--ink-3);font-weight:600;
  border:1px dashed var(--line-2);border-radius:8px;padding:11px 14px;margin-top:18px}

/* FAQ */
.ru .faq{max-width:78ch}
.ru .faq .acc summary{font-size:1rem;padding:22px 0}
.ru .faq .acc-body p{font-size:.95rem;line-height:1.65;color:var(--ink-2);max-width:66ch}

/* the reply promise, stated where it is load-bearing */
.ru .promise-bar{display:flex;gap:14px;align-items:center;flex-wrap:wrap;
  border:1px solid var(--mark);border-radius:var(--rad);padding:16px 20px;
  background:var(--mark-soft)}
.ru .promise-bar b{font-size:.92rem;font-weight:700;color:var(--ink)}
.ru .promise-bar span{font-size:.84rem;color:var(--ink-2);font-weight:500}
.ru .promise-bar .pb-i{width:34px;height:34px;border-radius:100px;flex:0 0 auto;display:grid;
  place-items:center;background:var(--mark);color:#fff}
.ru .promise-bar .pb-i svg{width:16px;height:16px}

/* ═══════════════════════════════════════════════════════════════════════════
   §15  THE STORY — sticky era rail + collage
   Carried over from the research site. The rail stops being navigation and
   becomes the scrubber for the whole argument.
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .railwrap{position:sticky;top:clamp(58px,7.5vh,74px);z-index:36;
  padding-block:clamp(10px,1.8vh,20px);display:flex;justify-content:center;
  background:linear-gradient(180deg,var(--paper) 62%,transparent 100%)}
@media(max-width:720px){.ru .railwrap{top:clamp(52px,7vh,66px)}}
.ru .rail{position:relative;border-radius:100px;padding:8px clamp(10px,1.4vw,20px);
  display:flex;align-items:center;gap:clamp(3px,1.6vw,34px);overflow-x:auto;
  scrollbar-width:none;scroll-snap-type:x proximity;max-width:920px;
  background:color-mix(in srgb,var(--paper) 80%,transparent);
  border:1px solid var(--line);
  backdrop-filter:blur(22px) saturate(1.7);-webkit-backdrop-filter:blur(22px) saturate(1.7);
  box-shadow:0 18px 44px -34px rgba(0,0,0,.5)}
.ru .rail::-webkit-scrollbar{display:none}
.ru .knob{position:absolute;top:5px;bottom:5px;border-radius:100px;background:var(--paper-3);
  transition:left var(--content) var(--ez),width var(--content) var(--ez);pointer-events:none}
.ru .tick{position:relative;z-index:2;padding:8px clamp(8px,1.1vw,15px);border-radius:100px;
  display:flex;flex-direction:column;align-items:center;gap:2px;scroll-snap-align:center;
  transition:transform var(--content) var(--ez-out)}
.ru .tick .y{font-size:clamp(.9rem,1.3vw,1.14rem);font-weight:600;letter-spacing:-.02em;
  color:var(--ink-3);transition:color var(--ui) var(--ez)}
.ru .tick .t{font-family:var(--font-body);font-size:.52rem;letter-spacing:.2em;
  text-transform:uppercase;color:var(--ink-3);opacity:0;font-weight:700;
  transition:opacity var(--ui) var(--ez)}
.ru .tick:hover .y{color:var(--ink-2)}
.ru .tick.on{transform:scale(1.14)}
.ru .tick.on .y{color:var(--ink);font-weight:700}
.ru .tick.on .t{opacity:1}
.ru .conn{flex:1;height:1px;background:var(--line-2);min-width:8px}
@media(max-width:640px){.ru .rail{gap:2px;padding:7px 9px}.ru .conn{display:none}}

.ru .era{transition:opacity var(--content) var(--ez),transform var(--content) var(--ez-out),
  filter var(--content) var(--ez)}
.ru .era.out{opacity:0}
.ru .era.out .zl{transform:translateX(-18px)}
.ru .era.out .zr{transform:translateX(18px)}
.ru .era.out .zc{transform:scale(1.04);filter:blur(16px)}
.ru .zl{grid-column:1/4}
.ru .zc{grid-column:4/10}
.ru .zr{grid-column:10/13}
.ru .need{font-size:clamp(1.55rem,3vw,3.1rem);line-height:1.02;letter-spacing:-.055em;
  font-weight:400}
.ru .kv{display:flex;justify-content:space-between;gap:18px;padding:11px 0;
  border-top:1px solid var(--line);font-size:.86rem;font-weight:500;color:var(--ink-2)}

/* THE ERA COLLAGE — a research board assembling itself */
.ru .collage{position:relative;width:100%;height:100%;min-height:clamp(280px,42vh,460px);
  overflow:visible}
.ru .pl{position:absolute;margin:0;will-change:transform,opacity;overflow:visible}
.ru .pl-img{position:relative;height:100%;overflow:hidden;background:var(--paper-2);
  border:1px solid var(--line);box-shadow:0 8px 26px -18px rgba(0,0,0,.5)}
.ru .pl-img img{width:100%;height:100%;object-fit:cover;object-position:50% 30%}
.ru .pl-call{position:absolute;display:flex;align-items:center;pointer-events:none;
  transform:translate(0,-50%);z-index:30}
.ru .pl-dot{width:6px;height:6px;border-radius:50%;background:var(--mark);flex:0 0 auto;
  box-shadow:0 0 0 3px color-mix(in srgb,var(--mark) 22%,transparent)}
.ru .pl-line{height:1px;width:clamp(16px,2.2vw,34px);background:var(--mark);
  transform-origin:left center;flex:0 0 auto}
.ru .pl-txt{font-family:var(--font-body);font-size:.52rem;letter-spacing:.13em;
  text-transform:uppercase;color:var(--ink);background:var(--paper);
  padding:4px 7px;border:1px solid var(--line);white-space:nowrap;font-weight:700;
  margin-left:-1px}
@media(max-width:720px){
  .ru .collage{min-height:300px}
  .ru .pl-txt{font-size:.44rem;letter-spacing:.08em;padding:3px 5px}
  .ru .pl-line{width:12px}
}
@media(max-width:900px){
  /* the era restacks in narrative order: needs → the board → identity */
  .ru .zl{grid-column:1/-1;order:1}
  .ru .zc{grid-column:1/-1;order:2;margin-block:clamp(26px,5vh,44px)!important}
  .ru .zr{grid-column:1/-1;order:3}
  .ru .zc>div:first-child{height:clamp(360px,58svh,520px)!important}
  .ru .era.out .zl,.ru .era.out .zr{transform:translateY(14px)}
}

/* ═══════════════════════════════════════════════════════════════════════════
   §16  THE COURT — the deal
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .court{min-height:100svh;padding-block:clamp(96px,14vh,150px) clamp(60px,9vh,110px)}
.ru .court::before{content:"";position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse 64% 52% at 50% 38%,rgba(216,35,47,.17),transparent 68%)}
.ru .court>*{position:relative;z-index:2}
.ru .court .mega,.ru .court .big{color:var(--bone)}

.ru .qwrap{max-width:760px;margin-inline:auto}
.ru .qprog{display:flex;gap:5px;margin-bottom:clamp(28px,5vh,48px)}
.ru .qprog i{flex:1;height:2px;background:rgba(244,243,241,.16);border-radius:2px;
  transition:background var(--ui) var(--ez)}
.ru .qprog i.on{background:var(--mark)}
.ru .qn{font-size:.68rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;
  color:var(--bone-3);margin-bottom:14px}
.ru .qq{font-family:var(--font-display);font-weight:400;color:var(--bone);
  font-size:clamp(1.4rem,3.4vw,2.5rem);line-height:1.2;letter-spacing:-.015em;
  text-wrap:balance;margin-bottom:clamp(26px,4vh,42px)}
.ru .qopts{display:grid;gap:10px}
.ru .qopt{text-align:left;padding:18px 22px;border-radius:14px;
  border:1px solid rgba(244,243,241,.16);color:var(--bone);font-size:.98rem;
  font-weight:500;line-height:1.4;display:flex;gap:14px;align-items:center;
  transition:border-color var(--micro) var(--ez),background var(--micro) var(--ez),
             transform var(--micro) var(--ez-out)}
.ru .qopt i{width:24px;height:24px;flex:0 0 auto;border-radius:100px;display:grid;
  place-items:center;border:1px solid rgba(244,243,241,.26);font-size:.66rem;
  font-weight:700;font-family:var(--font-display);color:var(--bone-2)}
.ru .qopt:hover{border-color:var(--mark);background:rgba(216,35,47,.1);transform:translateX(4px)}
.ru .qopt:hover i{border-color:var(--mark);color:var(--mark)}

/* the dealing table — the moment between the last answer and the reveal */
.ru .dealing{display:grid;place-items:center;gap:26px;min-height:52vh}
.ru .dealing .deck{transform:none;width:min(46vw,190px)}
.ru .dealing p{color:var(--bone-2);font-family:var(--font-display);font-style:italic;
  font-size:clamp(1rem,2vw,1.3rem)}

/* the result */
.ru .result{display:grid;grid-template-columns:minmax(0,320px) minmax(0,1fr);
  gap:clamp(28px,4vw,64px);align-items:start;max-width:1080px;margin-inline:auto}
@media(max-width:840px){.ru .result{grid-template-columns:1fr;justify-items:center;text-align:center}}
.ru .result-card{width:100%;max-width:320px;perspective:1400px}
.ru .result-card .pc{box-shadow:0 4px 12px rgba(0,0,0,.4),0 40px 80px -32px rgba(0,0,0,.9)}
.ru .rare-glow{position:relative}
.ru .rare-glow::after{content:"";position:absolute;inset:-14%;border-radius:50%;z-index:-1;
  background:radial-gradient(circle,rgba(216,35,47,.42),transparent 66%);
  animation:halo 4.4s var(--ez) infinite}
@keyframes halo{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}

.ru .result h1{color:var(--bone);font-size:clamp(2.1rem,5.2vw,4rem);line-height:.98;
  letter-spacing:-.035em}
.ru .result .r-house{font-size:.7rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;
  color:var(--mark);margin-bottom:14px}
.ru .result .r-read{font-family:var(--font-display);color:var(--bone);font-weight:400;
  font-size:clamp(1.1rem,2.2vw,1.55rem);line-height:1.4;margin-top:20px;max-width:34ch}
.ru .result .r-odds{display:inline-flex;align-items:center;gap:9px;margin-top:20px;
  padding:8px 15px;border-radius:100px;border:1px solid rgba(244,243,241,.2);
  font-size:.7rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
  color:var(--bone-2)}
.ru .result .r-odds b{color:var(--mark)}
.ru .rgrid{display:grid;gap:1px;background:rgba(244,243,241,.13);margin-top:clamp(26px,4vh,40px);
  border:1px solid rgba(244,243,241,.13);border-radius:var(--rad);overflow:hidden}
@media(min-width:640px){.ru .rgrid{grid-template-columns:1fr 1fr}}
.ru .rgrid div{background:var(--table);padding:18px 20px}
.ru .rgrid h4{font-size:.64rem;font-weight:700;letter-spacing:.19em;text-transform:uppercase;
  color:var(--mark);margin-bottom:9px}
.ru .rgrid p{font-size:.88rem;line-height:1.55;color:var(--bone-2);font-weight:500}
.ru .r-acts{display:flex;gap:10px;flex-wrap:wrap;margin-top:clamp(24px,4vh,38px)}
@media(max-width:840px){.ru .r-acts,.ru .result .r-read{justify-content:center;margin-inline:auto}}

/* ═══════════════════════════════════════════════════════════════════════════
   §17  THE HAND — members
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .mcard{border:1px solid var(--line);border-radius:var(--rad);padding:clamp(20px,2.4vw,30px);
  background:var(--paper-2)}
.ru .mgrid{display:grid;gap:var(--gut);grid-template-columns:repeat(auto-fit,minmax(232px,1fr))}
.ru .mstat b{display:block;font-family:var(--font-display);font-size:clamp(1.7rem,3vw,2.5rem);
  font-weight:700;letter-spacing:-.03em;line-height:1}
.ru .mstat span{display:block;font-size:.66rem;font-weight:700;letter-spacing:.17em;
  text-transform:uppercase;color:var(--ink-3);margin-top:9px}
.ru .holding{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));
  gap:clamp(12px,1.6vw,20px)}
.ru .holding .hd{position:relative}
.ru .holding .hd.off{opacity:.34;filter:grayscale(1)}
.ru .holding .hd p{font-size:.66rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  color:var(--ink-3);margin-top:9px;text-align:center;line-height:1.4}
.ru .tiers{display:grid;gap:1px;background:var(--line);border:1px solid var(--line);
  border-radius:var(--rad);overflow:hidden}
@media(min-width:760px){.ru .tiers{grid-template-columns:repeat(3,1fr)}}
.ru .tier{background:var(--paper);padding:clamp(20px,2.4vw,30px);display:flex;
  flex-direction:column;gap:12px}
.ru .tier.on{background:var(--mark-soft)}
.ru .tier h3{font-size:1rem}
.ru .tier .tn{font-family:var(--font-display);font-size:1.9rem;font-weight:700;
  line-height:1;color:var(--mark)}
.ru .tier ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.ru .tier li{font-size:.85rem;color:var(--ink-2);font-weight:500;display:flex;gap:9px;
  line-height:1.5}
.ru .tier li::before{content:"";width:5px;height:5px;border-radius:100px;background:var(--mark);
  flex:0 0 auto;margin-top:.55em}

/* ═══════════════════════════════════════════════════════════════════════════
   §18  VISIT — the three houses
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .shops{display:grid;gap:var(--gut);grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
.ru .shop{border:1px solid var(--line);border-radius:var(--rad);overflow:hidden;
  display:flex;flex-direction:column;background:var(--paper)}
.ru .shop .map{aspect-ratio:16/10;background:var(--paper-3);position:relative;overflow:hidden;
  display:grid;place-items:center}
.ru .shop .map iframe{width:100%;height:100%;border:0;filter:grayscale(1) contrast(1.05)}
.ru.night .shop .map iframe{filter:grayscale(1) invert(.92) hue-rotate(180deg)}
.ru .shop .sb{padding:clamp(18px,2vw,26px);display:flex;flex-direction:column;gap:12px;flex:1}
.ru .shop address{font-style:normal;font-size:.88rem;line-height:1.6;color:var(--ink-2);
  font-weight:500}
.ru .shop .sacts{display:flex;gap:10px;flex-wrap:wrap;margin-top:auto;padding-top:8px}
.ru .placeholder-flag{font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  color:var(--mark);background:var(--mark-soft);padding:6px 11px;border-radius:100px;
  display:inline-block}

/* ═══════════════════════════════════════════════════════════════════════════
   §19  FOOTER
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .foot{border-top:1px solid var(--line);padding-block:clamp(46px,7vw,84px);
  padding-bottom:calc(clamp(46px,7vw,84px) + env(safe-area-inset-bottom,0px))}
@media(max-width:820px){.ru .foot{padding-bottom:calc(clamp(46px,7vw,84px) + 74px)}}
.ru .foot-g{display:grid;grid-template-columns:1.5fr 1fr 1fr 1.4fr;gap:clamp(24px,3vw,48px)}
@media(max-width:820px){.ru .foot-g{grid-template-columns:1fr 1fr}}
@media(max-width:480px){.ru .foot-g{grid-template-columns:1fr}}
.ru .foot h4{font-size:.7rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  color:var(--ink-3);margin-bottom:15px}
.ru .foot ul{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.ru .foot li a,.ru .foot li button{font-size:.86rem;font-weight:600;color:var(--ink-2);
  transition:color var(--micro) var(--ez);text-align:left}
.ru .foot li a:hover,.ru .foot li button:hover{color:var(--mark)}
.ru .sub{display:flex;gap:8px;margin-top:12px}
.ru .sub input{flex:1;min-width:0;padding:13px 15px;border-radius:100px;
  border:1px solid var(--line-2);background:var(--paper)}
.ru .sub input:focus{border-color:var(--ink);outline:none}
.ru .foot-b{display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;
  margin-top:clamp(34px,5vw,62px);padding-top:22px;border-top:1px solid var(--line);
  font-size:.74rem;color:var(--ink-3);font-weight:600}
.ru .foot-b nav{display:flex;gap:16px;flex-wrap:wrap}

/* ═══════════════════════════════════════════════════════════════════════════
   §20  THE LAMP
   ═══════════════════════════════════════════════════════════════════════════ */
.ru .lamp{position:fixed;top:0;right:clamp(16px,4vw,58px);z-index:var(--z-lamp);
  display:flex;flex-direction:column;align-items:center;pointer-events:none;color:var(--ink)}
.ru .lamp .cord{width:1px;height:clamp(28px,5vh,52px);background:var(--line-2)}
.ru .lamp .fix{position:relative;width:68px;color:var(--ink-3);opacity:.8;
  transition:opacity var(--ui) var(--ez)}
.ru.night .lamp .fix{opacity:.82}
.ru .lamp .fix svg{width:100%;height:auto}
.ru .lamp .bulb{fill:var(--line-2);transition:fill 700ms var(--ez)}
.ru.night .lamp .bulb{fill:#FFD9A0}
.ru .lamp .beam{position:absolute;top:64%;left:50%;width:190px;height:230px;
  transform:translateX(-50%);pointer-events:none;opacity:0;
  background:radial-gradient(ellipse 50% 60% at 50% 0%,rgba(255,200,130,.2),transparent 70%);
  transition:opacity 900ms var(--ez)}
.ru.night .lamp .beam{opacity:1}
.ru .lamp .pull{pointer-events:auto;display:grid;place-items:center;padding:8px 14px 16px}
.ru .lamp .pull i{display:block;width:1px;height:clamp(20px,3.4vh,34px);background:var(--line-2)}
.ru .lamp .pull b{display:block;width:9px;height:9px;border-radius:100px;background:var(--ink-3);
  margin-top:-1px;transition:transform var(--micro) var(--ez),background var(--micro) var(--ez)}
.ru .lamp .pull:hover b{transform:translateY(3px);background:var(--mark)}
@media(max-width:980px){.ru .lamp{display:none}}

/* ═══════════════════════════════════════════════════════════════════════════
   §21  TOAST · CONSENT · SKIP · 404
   ═══════════════════════════════════════════════════════════════════════════ */
/* The resting position is translateY(100% + 40px), not 120% — 120% of the
   toast's OWN height is about 48px, which left a small black pill parked over
   the bottom of every page. It also fades and is taken out of the
   accessibility tree and hit-testing when it has nothing to say. */
.ru .toast{position:fixed;left:50%;bottom:26px;z-index:var(--z-toast);
  transform:translate(-50%,calc(100% + 60px));opacity:0;visibility:hidden;
  background:var(--ink);color:var(--paper);
  padding:14px 24px;border-radius:100px;font-size:.8rem;font-weight:700;
  display:flex;align-items:center;gap:11px;white-space:nowrap;max-width:92vw;
  pointer-events:none;
  transition:transform var(--ui) var(--ez-out),opacity var(--ui) var(--ez),visibility var(--ui);
  box-shadow:0 12px 32px rgba(0,0,0,.22)}
.ru .toast.show{transform:translate(-50%,0);opacity:1;visibility:visible;pointer-events:auto}
@media(max-width:820px){.ru .toast{bottom:88px}}

.ru .consent{position:fixed;left:0;right:0;bottom:0;z-index:var(--z-toast);
  padding:16px var(--marg) calc(16px + env(safe-area-inset-bottom,0px));
  background:var(--ink);color:var(--paper);border-top:1px solid rgba(255,255,255,.14);
  display:flex;gap:16px;align-items:center;justify-content:center;flex-wrap:wrap;
  box-shadow:0 -18px 50px rgba(0,0,0,.28)}
/* the page gives the bar its own room rather than letting it sit on content */
.ru.asking{padding-bottom:110px}
@media(max-width:820px){.ru.asking{padding-bottom:190px}}
.ru .consent p{font-size:.8rem;line-height:1.5;flex:1;min-width:200px;font-weight:500;
  opacity:.86}
.ru .consent .cbtn{font-size:.68rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
  padding:11px 18px;border-radius:100px}
.ru .consent .yes{background:var(--paper);color:var(--ink)}
.ru .consent .no{border:1px solid rgba(255,255,255,.3)}

.ru .sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
  clip:rect(0,0,0,0);white-space:nowrap;border:0}

.ru .skip{position:fixed;top:9px;left:9px;z-index:var(--z-intro);padding:12px 19px;
  border-radius:100px;background:var(--ink);color:var(--paper);font-size:.68rem;
  font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  transform:translateY(-180%);transition:transform var(--ui) var(--ez)}
.ru .skip:focus-visible{transform:none}

/* THE 404 — a card that isn't in the deck. The joke has to be legible in
   under a second, so the card is the Joker and the copy is four words. */
.ru .lost{min-height:82svh;display:grid;place-items:center;text-align:center;
  padding-block:clamp(90px,14vh,150px)}
.ru .lost-card{width:clamp(150px,22vw,220px);margin-inline:auto;
  transform:rotate(-5deg);transition:transform var(--cine) var(--ez-out)}
.ru .lost:hover .lost-card{transform:rotate(3deg)}
.ru .lost-links{display:flex;gap:9px;flex-wrap:wrap;justify-content:center;margin-top:30px}

/* ═══════════════════════════════════════════════════════════════════════════
   §22  REDUCED MOTION
   Not a courtesy. Every animation above needs a resting state that is a
   crossfade or nothing at all — and every reveal has to end up visible even
   if its observer never fires.
   ═══════════════════════════════════════════════════════════════════════════ */
@media (prefers-reduced-motion:reduce){
  .ru *,.ru *::before,.ru *::after{
    animation-duration:1ms!important;animation-iteration-count:1!important;
    transition-duration:130ms!important;scroll-behavior:auto!important}
  .ru .rv.armed{opacity:1;transform:none}
  .ru .lines.armed .lm>span{transform:none}
  .ru .creedtrack{animation:none}
  .ru .quick{opacity:1;transform:none}
  .ru .lamp .fix{transform:none!important}
  .ru .rare-glow::after{animation:none}
}
`;
