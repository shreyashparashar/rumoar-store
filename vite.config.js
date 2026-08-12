import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* GitHub Pages serves a project site from a SUBPATH — username.github.io/repo/
   — not from the domain root. Vite's default `base` of "/" makes the built
   index.html ask for /assets/index.js, which on Pages is a 404 and a blank
   white page. This is the single most common reason a working Vite build
   appears broken once deployed.

   GITHUB_REPOSITORY is set automatically inside GitHub Actions and looks like
   "owner/repo", so the correct base is derived rather than hardcoded: the same
   config works locally (base "/"), on Pages (base "/repo/"), and on Vercel or
   Netlify (base "/"), with nothing to remember to change.

   Deploying somewhere that serves from the root and still want it explicit?
   Set base: "/" and delete the rest. */
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];

export default defineConfig({
  base: repo ? `/${repo}/` : "/",
  plugins: [react()],
  build: { outDir: "dist", assetsDir: "assets" },
});
