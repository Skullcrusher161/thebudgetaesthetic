import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  output: "server",
  adapter: vercel({
    edgeMiddleware: true,
    webAnalytics: { enabled: true },
  }),
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
  vite: {
    optimizeDeps: {
      exclude: ["@sanity/client", "sharp"],
    },
    ssr: {
      external: ["sharp"],
    },
    build: {
      rollupOptions: {
        external: ["sharp"],
      },
    },
  },
});
