import React, { useState, useRef, useEffect } from "react";
import { SEO, CONTACT_EMAIL, byId, PRODUCTS } from "./data.js";
import { Reveal, Lines, LB, Magnetic, go, money, useHead, store, track } from "./lib.jsx";
import { Qty, Crumb, PieceCard, Card, Thread, Icon, ProductCard } from "./parts.jsx";
import { useCart } from "./cart.jsx";

/* ===========================================================================
   §1  CHECKOUT

   Validated on submit, not on every keystroke — telling somebody their email
   is invalid while they are still on the third character of it is hostile.
   Once a field has failed once, it re-validates live so the error clears as
   soon as they fix it.
   =========================================================================== */
const REQUIRED = [
  ["email", "Email", "email", "you@example.com"],
  ["name", "Full name", "text", "Arjun Mehta"],
  ["phone", "Phone", "tel", "98765 43210"],
];

function validate(v) {
  const e = {};
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v.email || "")) e.email = "Enter a valid email address.";
  if (!(v.name || "").trim()) e.name = "We need a name for the parcel.";
  /* Indian mobile numbers are ten digits and never start below 6. Spaces,
     dashes and a +91 prefix are all normal ways to type one, so strip them
     before testing rather than rejecting the format. */
  if (!/^[6-9]\d{9}$/.test((v.phone || "").replace(/[\s\-+]/g, "").replace(/^91/, ""))) {
    e.phone = "Enter a 10-digit Indian mobile number.";
  }
  if (!(v.addr || "").trim()) e.addr = "Street address is required.";
  if (!(v.city || "").trim()) e.city = "City is required.";
  if (!/^\d{6}$/.test((v.pin || "").trim())) e.pin = "A PIN code is six digits.";
  return e;
}

const AUTOCOMPLETE = {
  email: "email", name: "name", phone: "tel",
  addr: "street-address", city: "address-level2", pin: "postal-code",
};

/* Defined at module scope on purpose.
   BUG WAS HERE: this used to be declared inside Checkout. A component
   declared inside another component is a NEW function identity on every
   render, so React cannot reconcile it with the previous tree — it unmounts
   the old <input> and mounts a fresh one. The visible symptom was that typing
   into any checkout field kept only the first character and then dropped
   focus, because every keystroke destroyed the element receiving it. */
function Field({ k, label, type, ph, half, value, err, onChange }) {
  return (
    <div className={`field ${err ? "bad" : ""}`} style={half ? undefined : { gridColumn: "1/-1" }}>
      <label htmlFor={`f-${k}`}>{label}</label>
      <input id={`f-${k}`} name={k} type={type} placeholder={ph}
        value={value || ""} onChange={onChange}
        aria-invalid={!!err} aria-describedby={err ? `e-${k}` : undefined}
        autoComplete={AUTOCOMPLETE[k]} />
      {err ? <span className="err" id={`e-${k}`}>{err}</span> : null}
    </div>
  );
}

export function Checkout({ onPlaced }) {
  const { lines, subtotal, shipping, total, setQty } = useCart();
  const [v, setV] = useState({});
  const [errs, setErrs] = useState({});
  const [touched, setTouched] = useState(false);
  const [pay, setPay] = useState("upi");
  const [busy, setBusy] = useState(false);

  useHead({ ...SEO.checkout, path: "/checkout" });

  useEffect(() => {
    if (lines.length) {
      track("begin_checkout", {
        currency: "INR", value: total,
        items: lines.map((l) => ({ item_id: l.id, item_name: l.product.name, price: l.product.price, quantity: l.qty })),
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k) => (e) => {
    const next = { ...v, [k]: e.target.value };
    setV(next);
    if (touched) setErrs(validate(next));   // only after a failed submit
  };

  const submit = (e) => {
    e.preventDefault();
    const found = validate(v);
    setErrs(found);
    setTouched(true);
    if (Object.keys(found).length) {
      /* send the keyboard to the first problem — scrolling somebody to an
         error they then have to find is only half the job */
      document.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }
    setBusy(true);
    /* Stands in for the payment call. Swap this for the gateway's SDK: the
       shape it needs is { lines, total, pay, address: v }. */
    setTimeout(() => {
      setBusy(false);
      const ref = Math.random().toString(36).slice(2, 8).toUpperCase();
      const order = {
        ref, at: Date.now(), total, pay,
        lines: lines.map((l) => ({ id: l.id, colour: l.colour, qty: l.qty })),
        ...v,
      };
      /* Written here rather than on the confirmation page, so a refresh of
         /done can never mint a second order record. */
      const all = store.get("rumoar.orders.v1", []) || [];
      store.set("rumoar.orders.v1", [...all, order]);
      track("purchase", { transaction_id: ref, currency: "INR", value: total, shipping });
      onPlaced(order);
    }, 900);
  };

  if (!lines.length) {
    return (
      <section className="wrap top" style={{ paddingBottom: "18vh" }}>
        <Crumb trail={[{ label: "Home", to: "/" }, { label: "Bag" }, { label: "Checkout" }]} />
        <div className="empty">
          <p className="mid">Your bag is empty.</p>
          <p className="body" style={{ textAlign: "center" }}>
            Nothing to check out yet. Six pieces, and they all agree with each other.
          </p>
          <button className="btn btn-solid btn-sm" onClick={() => go("/shop")}>Shop the six</button>
        </div>
      </section>
    );
  }

  return (
    <section className="wrap top" style={{ paddingBottom: "clamp(64px,10vw,130px)" }}>
      <Crumb trail={[{ label: "Home", to: "/" }, { label: "Shop", to: "/shop" }, { label: "Checkout" }]} />
      <h1 className="big" style={{ marginBottom: "clamp(20px,3vw,32px)" }}>Checkout</h1>

      <div className="steps" aria-hidden="true">
        <b className="on"><i>1</i>Bag</b><s />
        <b className="on"><i>2</i>Details</b><s />
        <b><i>3</i>Placed</b>
      </div>

      <form className="g" onSubmit={submit} noValidate>
        <div className="co-form">
          <h2 className="h3" style={{ marginBottom: 18 }}>Where it goes</h2>
          <div className="row2">
            {REQUIRED.map(([k, l, t, ph]) => (
              <Field key={k} k={k} label={l} type={t} ph={ph} half={k !== "email"}
                value={v[k]} err={errs[k]} onChange={set(k)} />
            ))}
          </div>
          <Field k="addr" label="Address" type="text" ph="Flat, street"
            value={v.addr} err={errs.addr} onChange={set("addr")} />
          <div className="row2">
            <Field k="city" label="City" type="text" ph="Bengaluru" half
              value={v.city} err={errs.city} onChange={set("city")} />
            <Field k="pin" label="PIN code" type="text" ph="560001" half
              value={v.pin} err={errs.pin} onChange={set("pin")} />
          </div>

          <h2 className="h3" style={{ margin: "34px 0 16px" }}>How you pay</h2>
          <div className="paybox">
            {[
              ["upi", "UPI", "Google Pay, PhonePe, Paytm and any BHIM app"],
              ["card", "Card", "Visa, Mastercard, RuPay and Amex"],
              ["cod", "Cash on delivery", "₹49 handling. Not available above ₹10,000"],
            ].map(([id, t, s]) => (
              <label key={id} className="payopt">
                <input type="radio" name="pay" value={id} checked={pay === id}
                  onChange={() => setPay(id)}
                  disabled={id === "cod" && total > 10000} />
                <span>
                  <b>{t}</b>
                  <span>{id === "cod" && total > 10000 ? "Unavailable on this order" : s}</span>
                </span>
              </label>
            ))}
          </div>

          <button type="submit" className="btn btn-mark btn-full" style={{ marginTop: 26 }} disabled={busy}>
            {busy ? "Placing…" : `Place order — ${money(total)}`}
          </button>
          <p className="body" style={{ fontSize: ".78rem", marginTop: 12 }}>
            This is a demonstration store. No payment is taken and no card details are
            collected. See <a className="link" href="#/privacy">what we keep</a>.
          </p>
        </div>

        <aside className="co-sum" aria-label="Order summary">
          <h2 className="h3" style={{ marginBottom: 16 }}>Your bag</h2>
          {lines.map((l) => (
            <div className="li" key={`${l.id}:${l.colour}`} style={{ gridTemplateColumns: "48px 1fr" }}>
              <div className="li-p"><PieceCard p={l.product} /></div>
              <div>
                <p className="li-n">{l.product.name}</p>
                <p className="li-m">{l.colourName}</p>
                <div className="li-r">
                  <Qty value={l.qty} max={l.product.stock}
                    onChange={(q) => setQty(l.id, l.colour, q)} />
                  <span className="num" style={{ fontWeight: 700, fontSize: ".88rem" }}>{money(l.sub)}</span>
                </div>
              </div>
            </div>
          ))}
          <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
            <p className="tot"><span>Subtotal</span><span className="num">{money(subtotal)}</span></p>
            <p className="tot">
              <span>Shipping</span>
              <span className="num">{shipping === 0 ? "Free" : money(shipping)}</span>
            </p>
            <p className="tot grand"><span>Total</span><span className="num">{money(total)}</span></p>
          </div>
          <p className="body" style={{ fontSize: ".76rem", marginTop: 16 }}>
            Thirty nights to decide. Returns are free and we pay the courier.
          </p>
        </aside>
      </form>
    </section>
  );
}

/* ===========================================================================
   §2  THE THANK YOU PAGE

   Not a receipt. A receipt is what the email is for. This page has exactly
   three jobs: confirm the thing happened, say precisely what happens next and
   when, and give the person somewhere to go that isn't the back button.
   =========================================================================== */
export function Done({ order }) {
  useHead({ ...SEO.done, path: "/done" });

  const ref = order?.ref || store.get("rumoar.orders.v1", []).slice(-1)[0]?.ref || "——————";
  const bought = new Set((order?.lines || []).map((l) => l.id));
  const next = PRODUCTS.filter((p) => !bought.has(p.id)).slice(0, 2);

  const eta = () => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  };

  const STEPS = [
    ["Now", "A confirmation is on its way to " + (order?.email || "your inbox") + ". If it hasn't landed in ten minutes, check spam — then write to us."],
    ["Within 2 working days", "Your piece is finished, checked and boxed at the workshop that made it. You get the tracking number the moment it leaves the door."],
    ["By " + eta(), "Delivered, tracked, signature not required. Then thirty nights to decide whether it earned its place."],
  ];

  return (
    <>
      <section className="wrap top" style={{ paddingBottom: "clamp(40px,6vw,70px)" }}>
        <div style={{ maxWidth: "62ch", marginInline: "auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ width: 118, margin: "0 auto 30px" }}>
              <Card index="A" suit="heart" n="✓" name="Dealt" material="Order placed" />
            </div>
            <p className="lb" style={{ color: "var(--mark)" }}>Order placed</p>
            <h1 className="big" style={{ marginTop: 16 }}>That&rsquo;s yours.</h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="body" style={{ marginTop: 18, marginInline: "auto" }}>
              Reference <b className="num" style={{ color: "var(--ink)" }}>RMR-{ref}</b>.
              Keep it — it&rsquo;s the fastest way for us to find your order if you write in.
            </p>
          </Reveal>
        </div>
      </section>

      {/* what happens next, with real dates rather than "soon" */}
      <section className="wrap sec-tight">
        <div style={{ maxWidth: "72ch", marginInline: "auto" }}>
          <Reveal><LB>What happens next</LB></Reveal>
          <div style={{ marginTop: 22 }}>
            {STEPS.map(([when, what], i) => (
              <Reveal key={when} delay={i * 90}>
                <div className="kv" style={{ alignItems: "flex-start", flexDirection: "column", gap: 8, paddingBlock: 18 }}>
                  <span className="lb" style={{ color: "var(--mark)" }}>{when}</span>
                  <span className="body" style={{ color: "var(--ink-2)" }}>{what}</span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={280} style={{ marginTop: 28 }}>
            <div className="promise-bar">
              <span className="pb-i"><Icon.clock /></span>
              <div>
                <b>Something wrong with the order?</b>
                <span> Write to <a className="link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with
                  RMR-{ref} in the subject. A named person replies within one working day.</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={340} style={{ marginTop: 30, display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <Magnetic className="btn btn-solid" onClick={() => go("/members")}>See it in your Hand</Magnetic>
            <Magnetic className="btn btn-line" onClick={() => go("/court")}>Get dealt your card</Magnetic>
          </Reveal>
        </div>
      </section>

      {next.length ? (
        <section className="wrap sec-tight">
          <div className="opener">
            <div>
              <Reveal><LB>Drawn against what you bought</LB></Reveal>
              <Reveal delay={80}>
                <h2 className="big" style={{ marginTop: 12, fontSize: "clamp(1.5rem,2.6vw,2.2rem)" }}>
                  These two agree with it.
                </h2>
              </Reveal>
            </div>
            <Reveal delay={140}><a className="link" href="#/shop">All six →</a></Reveal>
          </div>
          <div className="grid">
            {next.map((p, i) => (
              <ProductCard key={p.id} p={p} delay={i * 80} onAdd={() => go(`/piece/${p.id}`)} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="wrap sec-tight" style={{ display: "grid", placeItems: "center" }}>
        <Thread label="one of nine · the thread continues" />
      </section>
    </>
  );
}
