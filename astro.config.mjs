import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from '@astrojs/vercel';
import react from "@astrojs/react";

export default defineConfig({
  output: "server",
  adapter: vercel({
    imageService: false,
    // edgeMiddleware removed — Vercel Edge Runtime cannot resolve
    // the astro:middleware virtual module at bundle time, causing:
    // "Edge Function middleware is referencing unsupported modules"
    // Middleware runs in the SSR serverless function instead;
    // x-vercel-ip-country geo headers are still available there.
  }),
  integrations: [
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "react/compiler-runtime": "react-compiler-runtime",
      },
    },
    ssr: {
      external: ["sharp"],
      noExternal: ["sanity", "@sanity/client", "@sanity/vision", "styled-components"],
    },
    build: {
      rollupOptions: {
        external: ["sharp"],
      },
    },
  },
});
