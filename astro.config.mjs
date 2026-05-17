import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  output: "server",
  adapter: vercel({
    edgeMiddleware: true,
    webAnalytics: { enabled: true },
    isr: false,
  }),
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
  image: {
    service: { entrypoint: 'astro/assets/services/noop' },
    domains: ["cdn.sanity.io"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  vite: {
    ssr: {
      external: ["sharp"],
      noExternal: [],
    },
    optimizeDeps: {
      exclude: ["@sanity/client", "sharp"],
    },
  },
});