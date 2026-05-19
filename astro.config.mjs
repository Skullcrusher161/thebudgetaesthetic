import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  output: "server",
  adapter: vercel({
    imageService: false,
  }),
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
  vite: {
    ssr: {
      external: ["sharp", "sanity"],
    },
    build: {
      rollupOptions: {
        external: ["sharp", "sanity"],
      },
    },
  },
});
