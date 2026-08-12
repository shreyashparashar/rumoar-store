import React from "react";
import { createRoot } from "react-dom/client";
import { injectCSS } from "./styles.js";
import Root from "./Shop.jsx";

/* Styles first, render second — and the order matters.

   Three elements in this app are held off-screen by a transform alone: the
   mobile menu sheet, the cart panel, and the keyboard skip link. If the
   stylesheet arrives after the first paint, all three paint OPEN for a frame
   and then slide shut, because the same stylesheet that hides them also gives
   them a transition. Injecting here means the closed state is the first
   state. */
injectCSS();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
