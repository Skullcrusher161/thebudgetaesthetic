import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from '@astrojs/vercel';
import react from "@astrojs/react";

export default defineConfig({
  output: "server",
  adapter: vercel({
    imageService: false,
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