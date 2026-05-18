import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  output: "server",
  adapter: vercel({
    edgeMiddleware: true,
    webAnalytics: { enabled: true },
    imageService: false,
  }),
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
  image: {
    service: {
      entrypoint: "astro/assets/services/noop",
    },
  },
  vite: {
    ssr: {
      external: ["sharp"],
      noExternal: [],
    },
    build: {
      rollupOptions: {
        external: ["sharp"],
      },
    },
  },
});
