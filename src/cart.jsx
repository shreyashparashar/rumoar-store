import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from "react";
import { byId } from "./data.js";
import { track } from "./lib.jsx";

/* ===========================================================================
   THE CART

   A reducer plus localStorage. No state library: the entire shape is a list
   of {id, colour, qty} and four verbs, which is less code than configuring
   something to hold it.

   The line key is `id:colour`, not `id` — the same wallet in Ink and in
   Oxblood are two lines, and merging them on id alone is the classic bug
   where changing a colour silently overwrites the other one.
   =========================================================================== */

const KEY = "rumoar.cart.v1";
const CartCtx = createContext(null);

const lineKey = (id, colour) => `${id}:${colour}`;

/** Reads persisted state, discarding anything that no longer parses or no
    longer exists in the catalogue. A cart is long-lived; the catalogue is
    not, and a line pointing at a deleted product must not crash the store on
    the next visit. */
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((l) => l && typeof l.id === "string" && byId(l.id))
      .map((l) => ({
        id: l.id,
        colour: typeof l.colour === "string" ? l.colour : (byId(l.id).colours[0]?.id ?? ""),
        qty: Math.max(1, Math.min(99, Number(l.qty) || 1)),
      }));
  } catch {
    /* private browsing, a full quota, or hand-edited storage. An unreadable
       cart is an empty cart, never an exception on boot. */
    return [];
  }
}

function reducer(state, a) {
  switch (a.type) {
    case "add": {
      const k = lineKey(a.id, a.colour);
      const hit = state.find((l) => lineKey(l.id, l.colour) === k);
      const stock = byId(a.id)?.stock ?? 99;
      if (hit) {
        return state.map((l) => (lineKey(l.id, l.colour) === k
          ? { ...l, qty: Math.min(stock, l.qty + (a.qty || 1)) } : l));
      }
      return [...state, { id: a.id, colour: a.colour, qty: Math.min(stock, a.qty || 1) }];
    }
    case "qty": {
      const stock = byId(a.id)?.stock ?? 99;
      /* dropping to zero removes the line — a quantity stepper that bottoms
         out at 1 traps people who wanted it gone */
      if (a.qty <= 0) return state.filter((l) => lineKey(l.id, l.colour) !== lineKey(a.id, a.colour));
      return state.map((l) => (lineKey(l.id, l.colour) === lineKey(a.id, a.colour)
        ? { ...l, qty: Math.min(stock, a.qty) } : l));
    }
    case "remove":
      return state.filter((l) => lineKey(l.id, l.colour) !== lineKey(a.id, a.colour));
    case "clear":
      return [];
    default:
      return state;
  }
}

const SHIP_FREE_OVER = 2000;
const SHIP_FLAT = 149;

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, null, load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* quota — not fatal */ }
  }, [lines]);

  const detailed = useMemo(() => lines.map((l) => {
    const p = byId(l.id);
    const colour = p.colours.find((c) => c.id === l.colour) || p.colours[0];
    return { ...l, product: p, colourName: colour?.name ?? "", hex: colour?.hex ?? "#000", sub: p.price * l.qty };
  }), [lines]);

  const count = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines]);
  const subtotal = useMemo(() => detailed.reduce((n, l) => n + l.sub, 0), [detailed]);
  const shipping = subtotal === 0 || subtotal >= SHIP_FREE_OVER ? 0 : SHIP_FLAT;
  const total = subtotal + shipping;

  const add = useCallback((id, colour, qty = 1) => {
    dispatch({ type: "add", id, colour, qty });
    const p = byId(id);
    if (p) track("add_to_cart", { currency: "INR", value: p.price * qty, items: [{ item_id: id, item_name: p.name, price: p.price, quantity: qty }] });
  }, []);
  const setQty = useCallback((id, colour, qty) => dispatch({ type: "qty", id, colour, qty }), []);
  const remove = useCallback((id, colour) => {
    dispatch({ type: "remove", id, colour });
    track("remove_from_cart", { item_id: id });
  }, []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  /* Used by the product page to say "already in the bag" rather than letting
     somebody add a third identical wallet without noticing. */
  const has = useCallback((id, colour) =>
    lines.some((l) => lineKey(l.id, l.colour) === lineKey(id, colour)), [lines]);

  const value = useMemo(() => ({
    lines: detailed, count, subtotal, shipping, total,
    add, setQty, remove, clear, has, freeOver: SHIP_FREE_OVER, flat: SHIP_FLAT,
  }), [detailed, count, subtotal, shipping, total, add, setQty, remove, clear, has]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
}
