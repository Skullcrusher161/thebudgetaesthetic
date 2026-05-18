import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import sanity from "@sanity/astro";

export default defineConfig({
  output: "server",
  adapter: vercel({
    edgeMiddleware: true,   // Enables Edge Middleware for geo-routing
    webAnalytics: { enabled: true },
  }),
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sanity({
      projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.PUBLIC_SANITY_DATASET || "production",
      useCdn: import.meta.env.PROD,
      apiVersion: "2024-01-01",
      studioBasePath: "/studio",  // Embedded Sanity Studio at /studio
    }),
  ],
  image: {
    domains: ["cdn.sanity.io"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  vite: {
    optimizeDeps: {
      exclude: ["@sanity/client"],
    },
  },
});
