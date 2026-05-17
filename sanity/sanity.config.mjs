// ─────────────────────────────────────────────────────────────────────────────
// sanity/sanity.config.js — Embedded Sanity Studio configuration
// Accessed at /studio route in the Astro app (via @astrojs/sanity)
// ─────────────────────────────────────────────────────────────────────────────
import { defineConfig } from "sanity";
import { structureTool }from "sanity/structure";
import { visionTool }   from "@sanity/vision";
import { postSchema, categorySchema } from "./schemas/index.js";

export default defineConfig({
  name:    "thebudgetaesthetic-studio",
  title:   "TheBudgetAesthetic CMS",
  projectId: "ukujp5z5",
  dataset:   "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("TheBudgetAesthetic")
          .items([
            S.listItem().title("✍️  Blog Posts")
              .child(S.documentTypeList("post").title("All Posts")),
            S.divider(),
            S.listItem().title("🏷️  Categories")
              .child(S.documentTypeList("category").title("Categories")),
          ]),
    }),
    visionTool(), // GROQ query playground
  ],

  schema: { types: [postSchema, categorySchema] },

});
