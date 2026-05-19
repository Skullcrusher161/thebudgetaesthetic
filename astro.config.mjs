import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import react from "@astrojs/react";

export default defineConfig({
  output: "server",
  adapter: vercel({
    imageService: false,
  }),
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
  ],
  vite: {
    ssr: {
      external: ["sharp"],
      noExternal: ["sanity", "@sanity/client", "@sanity/image-url", "@sanity/vision", "styled-components"],
    },
    build: {
      rollupOptions: {
        external: ["sharp"],
      },
    },
  },
});
